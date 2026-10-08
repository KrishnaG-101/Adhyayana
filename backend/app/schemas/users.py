"""User Profile, Authentication, and Persistence Schemas.

Codifies data transfer objects and validation models for Firebase Auth user identities,
learning statistics, preferences, profile updates, and guest session state migration.
Enforces AGENTS.md Rule 1 (Contract-First) and Rule 2 (Absolute Type Parity).
"""

from datetime import datetime, timezone
from typing import List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field


class UserPreferences(BaseModel):
    """User profile visual and audio interaction preferences."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    theme: Literal["light", "dark", "system"] = Field(
        default="system",
        description="Selected UI theme mode.",
    )
    sound: bool = Field(
        default=True,
        description="Whether interactive audio feedback is enabled.",
    )


class UserStats(BaseModel):
    """Aggregate learning streaks, puzzle completion counters, and XP statistics."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    games_played: int = Field(
        default=0,
        ge=0,
        description="Total number of puzzles attempted across all engines.",
    )
    games_won: int = Field(
        default=0,
        ge=0,
        description="Total puzzles successfully solved or cleared.",
    )
    current_streak: int = Field(
        default=0,
        ge=0,
        description="Current consecutive daily puzzle completion streak.",
    )
    max_streak: int = Field(
        default=0,
        ge=0,
        description="Longest consecutive daily puzzle streak achieved.",
    )
    total_xp: int = Field(
        default=0,
        ge=0,
        description="Cumulative XP earned across all puzzle activities.",
    )
    word_blanks_cleared: int = Field(
        default=0,
        ge=0,
        description="Total Word Blanks stages cleared across all levels.",
    )


class UserProfile(BaseModel):
    """Authenticated player identity, profile metadata, preferences, and aggregate stats."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    uid: str = Field(
        ...,
        description="Unique Firebase Auth user identifier.",
    )
    display_name: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="User display name or alias.",
    )
    email: Optional[str] = Field(
        default=None,
        description="User email address or null for anonymous guests.",
    )
    photo_url: Optional[str] = Field(
        default=None,
        description="Avatar image URL or null.",
    )
    is_anonymous: bool = Field(
        default=False,
        description="True if user is signed in under an anonymous guest session.",
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="ISO 8601 UTC account creation timestamp.",
    )
    last_active_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="ISO 8601 UTC timestamp of most recent activity.",
    )
    stats: UserStats = Field(
        default_factory=UserStats,
        description="Aggregate learning statistics.",
    )
    preferences: UserPreferences = Field(
        default_factory=UserPreferences,
        description="Player preferences.",
    )


class UpdateProfileRequest(BaseModel):
    """Payload for updating player display name, photo, and preferences."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    display_name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=50,
        description="Updated display name.",
    )
    photo_url: Optional[str] = Field(
        default=None,
        description="Updated avatar image URL or null.",
    )
    preferences: Optional[UserPreferences] = Field(
        default=None,
        description="Updated player preferences.",
    )


class GuestMigrationRequest(BaseModel):
    """Payload migrating guest localStorage progress to the authenticated user's account."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    total_xp: int = Field(
        ...,
        ge=0,
        description="Cumulative XP accumulated during guest play.",
    )
    current_streak: int = Field(
        ...,
        ge=0,
        description="Consecutive streak accumulated during guest play.",
    )
    cleared_stages_count: int = Field(
        ...,
        ge=0,
        description="Count of Word Blanks stages cleared as guest.",
    )
    discovered_words_summary: Optional[List[str]] = Field(
        default=None,
        description="List of discovered words to merge into player history.",
    )


class GuestMigrationResponse(BaseModel):
    """Response confirming guest session migration into Firestore user profile."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    success: bool = Field(
        ...,
        description="Whether migration succeeded.",
    )
    migrated_xp: int = Field(
        ...,
        ge=0,
        description="Total XP merged into the user account.",
    )
    migrated_stages: int = Field(
        ...,
        ge=0,
        description="Total stages merged into player stats.",
    )
    message: str = Field(
        ...,
        description="Human-readable summary of migration.",
    )
    updated_profile: UserProfile = Field(
        ...,
        description="Updated user profile after migration.",
    )
