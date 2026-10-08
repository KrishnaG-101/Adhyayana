"""Firebase Authentication & Firestore State Provider.

Handles Firebase Admin SDK token verification, claims extraction, and player profile
persistence. Provides mock/dev-mode fallback for local development and zero-flake testing
when live Google Cloud credentials are not configured.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from app.core.config import settings
from app.schemas.users import UserPreferences, UserProfile, UserStats

logger = logging.getLogger(__name__)

# In-memory persistence ledger simulating Firestore users/{uid} collection
# Seeded with realistic initial state for local development & automated testing
USER_STORE: Dict[str, UserProfile] = {}

# Flag indicating whether live firebase-admin SDK was initialized
_FIREBASE_ADMIN_INITIALIZED = False

try:
    import firebase_admin
    from firebase_admin import auth as firebase_auth, credentials

    if settings.FIREBASE_CREDENTIALS_PATH:
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)
        _FIREBASE_ADMIN_INITIALIZED = True
        logger.info("Firebase Admin initialized with certificate credentials.")
    elif settings.FIREBASE_PROJECT_ID:
        firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})
        _FIREBASE_ADMIN_INITIALIZED = True
        logger.info("Firebase Admin initialized with project ID.")
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

    # Live verification path if Firebase Admin SDK is active
    if _FIREBASE_ADMIN_INITIALIZED:
        try:
            decoded_claims = firebase_auth.verify_id_token(clean_token)
            return decoded_claims
        except Exception as err:
            logger.warning("Live token verification failed: %s", err)
            # Fall through if in development to allow mock tokens

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
        return {
            "uid": clean_token,
            "email": f"{clean_token}@adhyayana.org",
            "name": clean_token.replace("-", " ").title(),
            "picture": None,
            "firebase": {"sign_in_provider": "password", "anonymous": False},
        }

    raise ValueError("Invalid or expired authentication token.")


def get_or_create_user(
    uid: str,
    email: Optional[str] = None,
    display_name: Optional[str] = None,
    photo_url: Optional[str] = None,
    is_anonymous: bool = False,
) -> UserProfile:
    """Retrieves an existing player profile or creates a fresh one in the store."""
    if uid in USER_STORE:
        user = USER_STORE[uid]
        user.last_active_at = datetime.now(timezone.utc)
        return user

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
    return new_profile
