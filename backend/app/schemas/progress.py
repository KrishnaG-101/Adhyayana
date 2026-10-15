"""Pydantic v2 Models for Game Engine Progress and Cloud Synchronization.

Enforces strict schemas declared in docs/specs/api-contracts.json.
Guarantees absolute type parity with frontend/src/types/progress.ts.
"""

from datetime import datetime
from typing import Dict, List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.users import UserProfile


class DiscoveredWordRecord(BaseModel):
    """Granular record of an individually discovered word in a puzzle stage."""

    model_config = ConfigDict(extra="forbid")

    word: str = Field(..., description="The discovered word string in uppercase.")
    xp_awarded: int = Field(..., ge=0, description="XP awarded for discovering this word.")
    discovered_at: datetime = Field(..., description="UTC timestamp of word discovery.")


class WordBlanksProgressData(BaseModel):
    """Persistent document stored in Firestore users/{uid}/game_progress/word_blanks."""

    model_config = ConfigDict(extra="forbid")

    game_id: Literal["word_blanks"] = Field(
        default="word_blanks", description="Puzzle engine identifier."
    )
    unlocked_levels: List[int] = Field(
        ..., description="Array of unlocked level indices."
    )
    cleared_stages: List[str] = Field(
        ..., description="List of cleared stage keys (e.g. ['1:1', '1:2'])."
    )
    discovered_words: Dict[str, List[DiscoveredWordRecord]] = Field(
        ..., description="Map of stage keys to arrays of discovered word records."
    )
    total_words_count: int = Field(
        ..., ge=0, description="Total count of distinct words discovered."
    )
    total_xp_earned: int = Field(
        ..., ge=0, description="Cumulative XP earned within this engine."
    )
    last_played_at: datetime = Field(
        ..., description="Timestamp of most recent gameplay action."
    )


class SyncGameProgressRequest(BaseModel):
    """Payload sent by frontend puzzle engines to synchronize progress."""

    model_config = ConfigDict(extra="forbid")

    unlocked_levels: List[int] = Field(
        ..., description="Array of unlocked level indices."
    )
    cleared_stages: List[str] = Field(
        ..., description="Array of cleared stage identifiers in level:puzzle format."
    )
    discovered_words: Dict[str, List[DiscoveredWordRecord]] = Field(
        ..., description="Map of stage keys to discovered word records."
    )
    new_xp_delta: int = Field(
        default=0, ge=0, description="Incremental XP delta earned since last synchronization."
    )


class SyncGameProgressResponse(BaseModel):
    """Response envelope confirming cloud synchronization and updated player totals."""

    model_config = ConfigDict(extra="forbid")

    success: bool = Field(..., description="Whether sync succeeded.")
    game_id: str = Field(..., description="Puzzle engine identifier.")
    synced_stages_count: int = Field(..., ge=0, description="Total cumulative stages cleared.")
    synced_words_count: int = Field(..., ge=0, description="Total words discovered.")
    total_xp: int = Field(..., ge=0, description="Updated cumulative learner XP.")
    message: str = Field(..., description="Human-readable status summary.")
    updated_profile: UserProfile = Field(
        ..., description="Freshly synchronized player profile."
    )
