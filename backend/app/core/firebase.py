"""Firebase Authentication & Firestore State Provider.

Handles Firebase Admin SDK token verification, claims extraction, and player profile
persistence. Provides mock/dev-mode fallback for local development and zero-flake testing
when live Google Cloud credentials are not configured.
"""

import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

from app.core.config import settings
from app.schemas.users import UserPreferences, UserProfile, UserStats

logger = logging.getLogger(__name__)

# In-memory persistence ledger simulating Firestore users/{uid} collection
# Seeded with realistic initial state for local development & automated testing
USER_STORE: Dict[str, UserProfile] = {}
GAME_PROGRESS_STORE: Dict[str, Dict[str, Any]] = {}

# Flag indicating whether live firebase-admin SDK was initialized
_FIREBASE_ADMIN_INITIALIZED = False
_firestore_db = None

try:
    import firebase_admin
    from firebase_admin import auth as firebase_auth, credentials, firestore

    if settings.FIREBASE_CREDENTIALS_PATH:
        cred_path = Path(settings.FIREBASE_CREDENTIALS_PATH)
        if not cred_path.is_absolute():
            backend_dir = Path(__file__).resolve().parent.parent.parent
            resolved = backend_dir / cred_path
            if resolved.exists():
                cred_path = resolved

        if cred_path.exists():
            cred = credentials.Certificate(str(cred_path))
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred)
            _FIREBASE_ADMIN_INITIALIZED = True
            try:
                _firestore_db = firestore.client()
                logger.info("Firebase Admin & Firestore client initialized with certificate at %s", cred_path)
            except Exception as fe:
                logger.warning("Firestore client initialization failed: %s", fe)
        else:
            logger.warning("Firebase credentials certificate not found at: %s", cred_path)
    elif settings.FIREBASE_PROJECT_ID:
        if not firebase_admin._apps:
            firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})
        _FIREBASE_ADMIN_INITIALIZED = True
        try:
            _firestore_db = firestore.client()
            logger.info("Firebase Admin & Firestore initialized with project ID: %s", settings.FIREBASE_PROJECT_ID)
        except Exception as fe:
            logger.warning("Firestore client initialization failed: %s", fe)
except Exception as e:
    logger.info("Firebase Admin live initialization bypassed (dev/test mode): %s", e)


def verify_firebase_token(token: str) -> Dict[str, Any]:
    """Verifies a Firebase ID token and returns claims dictionary.

    Supports:
    1. Live Firebase Admin SDK verification if configured.
    2. Dev/Mock token verification (e.g. 'mock-token-<uid>', 'dev-token', etc.)
       for local development and integration tests without network dependency.
    """
    if not token or not token.strip():
        raise ValueError("Empty or missing authorization token.")

    clean_token = token.strip()

    # Live verification path for JWT tokens if Firebase Admin SDK is active
    if clean_token.count(".") == 2:
        if _FIREBASE_ADMIN_INITIALIZED:
            try:
                decoded_claims = firebase_auth.verify_id_token(clean_token)
                return decoded_claims
            except Exception as err:
                logger.warning("Live token verification failed: %s", err)
                raise ValueError(f"Invalid or expired Firebase ID token: {err}")
        else:
            raise ValueError("Firebase Admin SDK is not initialized; cannot verify live token.")

    # Development / Testing Mock token parser
    # Format: mock-token-<uid> or standard dev tokens
    if clean_token.startswith("mock-token-"):
        uid = clean_token.replace("mock-token-", "")
        return {
            "uid": uid,
            "email": f"{uid}@adhyayana.org",
            "name": uid.replace("-", " ").title(),
            "picture": None,
            "firebase": {"sign_in_provider": "password", "anonymous": False},
        }

    if clean_token == "mock-guest-token":
        return {
            "uid": "guest-learner-anon",
            "email": None,
            "name": "Guest Learner",
            "picture": None,
            "firebase": {"sign_in_provider": "anonymous", "anonymous": True},
        }

    # Generic dev token fallback for testing
    if settings.ENVIRONMENT in ("development", "test"):
        if len(clean_token) > 128:
            raise ValueError("Invalid authentication token: token length exceeds maximum allowed identifier length.")
        return {
            "uid": clean_token,
            "email": f"{clean_token}@adhyayana.org",
            "name": clean_token.replace("-", " ").title(),
            "picture": None,
            "firebase": {"sign_in_provider": "password", "anonymous": False},
        }

    raise ValueError("Invalid or expired authentication token.")


def is_live_cloud_user(uid: str) -> bool:
    """Returns True if the uid represents a real live user rather than mock/test fixture."""
    if settings.ENVIRONMENT == "test":
        return False
    if uid.startswith(("test-", "mock-", "migrator-", "profile-tester")):
        return False
    return True


def get_or_create_user(
    uid: str,
    email: Optional[str] = None,
    display_name: Optional[str] = None,
    photo_url: Optional[str] = None,
    is_anonymous: bool = False,
) -> UserProfile:
    """Retrieves an existing player profile or creates a fresh one in Firestore."""
    if uid in USER_STORE:
        user = USER_STORE[uid]
        user.last_active_at = datetime.now(timezone.utc)
        if _firestore_db and is_live_cloud_user(uid):
            try:
                _firestore_db.collection("users").document(uid).update({
                    "last_active_at": user.last_active_at.isoformat()
                })
            except Exception as e:
                logger.debug("Firestore update error: %s", e)
        return user

    if _firestore_db and is_live_cloud_user(uid):
        try:
            doc_ref = _firestore_db.collection("users").document(uid)
            doc = doc_ref.get()
            if doc.exists:
                data = doc.to_dict()
                user = UserProfile.model_validate(data)
                user.last_active_at = datetime.now(timezone.utc)
                doc_ref.update({"last_active_at": user.last_active_at.isoformat()})
                USER_STORE[uid] = user
                return user
        except Exception as e:
            logger.warning("Firestore get error for uid %s: %s", uid, e)

    new_profile = UserProfile(
        uid=uid,
        display_name=display_name or (f"Learner {uid[:6]}" if not is_anonymous else "Guest Learner"),
        email=email,
        photo_url=photo_url,
        is_anonymous=is_anonymous,
        created_at=datetime.now(timezone.utc),
        last_active_at=datetime.now(timezone.utc),
        stats=UserStats(
            games_played=0,
            games_won=0,
            current_streak=0,
            max_streak=0,
            total_xp=0,
            word_blanks_cleared=0,
        ),
        preferences=UserPreferences(
            theme="system",
            sound=True,
        ),
    )
    USER_STORE[uid] = new_profile

    if _firestore_db and is_live_cloud_user(uid):
        try:
            _firestore_db.collection("users").document(uid).set(new_profile.model_dump(mode="json"))
            logger.info("Persisted new user %s to Firestore", uid)
        except Exception as e:
            logger.warning("Firestore create error for uid %s: %s", uid, e)

    return new_profile


def save_user_profile(user: UserProfile) -> None:
    """Persists updated profile to in-memory cache and Cloud Firestore."""
    USER_STORE[user.uid] = user
    if _firestore_db and is_live_cloud_user(user.uid):
        try:
            _firestore_db.collection("users").document(user.uid).set(user.model_dump(mode="json"))
            logger.info("Saved user profile %s to Firestore", user.uid)
        except Exception as e:
            logger.warning("Firestore save error for uid %s: %s", user.uid, e)


def get_game_progress(uid: str, game_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves player's persistent progress document for the given game."""
    key = f"{uid}:{game_id}"
    if _firestore_db and is_live_cloud_user(uid):
        try:
            doc_ref = (
                _firestore_db.collection("users")
                .document(uid)
                .collection("game_progress")
                .document(game_id)
            )
            doc = doc_ref.get()
            if doc.exists:
                data = doc.to_dict()
                GAME_PROGRESS_STORE[key] = data
                return data
        except Exception as e:
            logger.warning("Firestore get_game_progress error for %s: %s", key, e)

    return GAME_PROGRESS_STORE.get(key)


def save_game_progress(uid: str, game_id: str, data: Dict[str, Any]) -> None:
    """Saves player's persistent progress document in Firestore subcollection."""
    key = f"{uid}:{game_id}"
    GAME_PROGRESS_STORE[key] = data
    if _firestore_db and is_live_cloud_user(uid):
        try:
            doc_ref = (
                _firestore_db.collection("users")
                .document(uid)
                .collection("game_progress")
                .document(game_id)
            )
            doc_ref.set(data)
            logger.info("Persisted game progress for %s to Firestore", key)
        except Exception as e:
            logger.warning("Firestore save_game_progress error for %s: %s", key, e)



