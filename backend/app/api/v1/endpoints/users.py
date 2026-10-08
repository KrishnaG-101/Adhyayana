"""User Profile, Authentication, and Session Migration Endpoints.

Implements routes registered in docs/specs/api-contracts.json:
- GET /api/v1/auth/me: Retrieve current authenticated user profile.
- PATCH /api/v1/users/profile: Update user profile and UI preferences.
- POST /api/v1/users/migrate-guest-data: Merge guest localStorage state into Firestore profile.
"""

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.schemas.users import (
    GuestMigrationRequest,
    GuestMigrationResponse,
    UpdateProfileRequest,
    UserProfile,
)

router = APIRouter()


@router.get(
    "/auth/me",
    response_model=UserProfile,
    summary="Retrieve Current User Profile",
    description="Retrieves the authenticated user's profile, preferences, and aggregate stats from the verified Firebase Auth Bearer token.",
)
async def get_my_profile(
    current_user: UserProfile = Depends(get_current_user),
) -> UserProfile:
    """Returns the authenticated user's profile."""
    return current_user


@router.patch(
    "/users/profile",
    response_model=UserProfile,
    summary="Update Current User Profile",
    description="Updates the authenticated player's display name, avatar photo, and UI preferences.",
)
async def update_my_profile(
    payload: UpdateProfileRequest,
    current_user: UserProfile = Depends(get_current_user),
) -> UserProfile:
    """Updates user display name, photo URL, or preferences."""
    if payload.display_name is not None:
        trimmed = payload.display_name.strip()
        if len(trimmed) < 2 or len(trimmed) > 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error_code": "INVALID_DISPLAY_NAME",
                    "message": "Display name must be between 2 and 50 characters long.",
                },
            )
        current_user.display_name = trimmed

    if payload.photo_url is not None:
        current_user.photo_url = payload.photo_url.strip() if payload.photo_url else None

    if payload.preferences is not None:
        if payload.preferences.theme is not None:
            current_user.preferences.theme = payload.preferences.theme
        if payload.preferences.sound is not None:
            current_user.preferences.sound = payload.preferences.sound

    current_user.last_active_at = datetime.now(timezone.utc)
    return current_user


@router.post(
    "/users/migrate-guest-data",
    response_model=GuestMigrationResponse,
    summary="Migrate Guest Session to User Account",
    description="Transfers guest learning streaks, cumulative XP, and cleared puzzle stages into the authenticated player's Firestore profile.",
)
async def migrate_guest_session(
    payload: GuestMigrationRequest,
    current_user: UserProfile = Depends(get_current_user),
) -> GuestMigrationResponse:
    """Merges guest gameplay progress, XP, and streaks into the user profile."""
    # Accumulate XP
    current_user.stats.total_xp += payload.total_xp

    # Merge streaks (take higher streak)
    current_user.stats.current_streak = max(
        current_user.stats.current_streak, payload.current_streak
    )
    current_user.stats.max_streak = max(
        current_user.stats.max_streak, current_user.stats.current_streak
    )

    # Accumulate stage completion counts
    current_user.stats.word_blanks_cleared += payload.cleared_stages_count
    current_user.stats.games_won += payload.cleared_stages_count
    current_user.stats.games_played += payload.cleared_stages_count

    current_user.last_active_at = datetime.now(timezone.utc)

    return GuestMigrationResponse(
        success=True,
        migrated_xp=payload.total_xp,
        migrated_stages=payload.cleared_stages_count,
        message=(
            f"Successfully transferred {payload.total_xp} XP, streak of {payload.current_streak}, "
            f"and {payload.cleared_stages_count} cleared stages into your profile."
        ),
        updated_profile=current_user,
    )
