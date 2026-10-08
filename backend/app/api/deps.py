"""FastAPI Authentication and Context Dependencies.

Provides security dependencies for extracting and verifying Firebase ID Bearer tokens,
returning validated UserProfile instances for authenticated routes.
"""

from typing import Optional
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.firebase import get_or_create_user, verify_firebase_token
from app.schemas.users import UserProfile

security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    auth_credentials: Optional[HTTPAuthorizationCredentials] = Security(security_scheme),
) -> UserProfile:
    """Dependency extracting the Bearer token and returning the validated UserProfile."""
    if not auth_credentials or not auth_credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "error_code": "AUTH_TOKEN_MISSING",
                "message": "Authorization Bearer token is required to access this resource.",
            },
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth_credentials.credentials
    try:
        claims = verify_firebase_token(token)
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "error_code": "AUTH_TOKEN_INVALID",
                "message": f"Invalid or expired authorization token: {str(err)}",
            },
            headers={"WWW-Authenticate": "Bearer"},
        )

    uid = claims.get("uid")
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "error_code": "AUTH_UID_MISSING",
                "message": "Decoded token claims do not contain a valid user identifier.",
            },
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = claims.get("email")
    display_name = claims.get("name")
    photo_url = claims.get("picture")
    is_anon = claims.get("firebase", {}).get("anonymous", False)

    return get_or_create_user(
        uid=uid,
        email=email,
        display_name=display_name,
        photo_url=photo_url,
        is_anonymous=is_anon,
    )
