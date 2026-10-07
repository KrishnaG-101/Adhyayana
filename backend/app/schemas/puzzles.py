"""Pydantic v2 schemas for puzzle catalog discovery, metadata, and progression tiers.

Strictly mirrors docs/specs/api-contracts.json pursuant to AGENTS.md Rule 1 & Rule 2.
"""

from enum import Enum
from pydantic import BaseModel, ConfigDict, Field


class DifficultyLevel(str, Enum):
    """Pedagogical difficulty tier classification for puzzle challenges."""

    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    MASTER = "master"


class GameType(str, Enum):
    """Mechanic and engine classification for linguistic puzzles."""

    FILL_IN_BLANKS = "fill-in-blanks"
    SEMANTIC_SIMILARITY = "semantic-similarity"
    CROSSWORD = "crossword"
    MORPHOLOGY_MATRIX = "morphology-matrix"


class LearningObjective(str, Enum):
    """Core pedagogical objective targeted by a puzzle challenge."""

    VOCABULARY = "vocabulary"
    MORPHOLOGY = "morphology"
    SYNTAX = "syntax"
    ETYMOLOGY = "etymology"
    INFERENCE = "inference"


class PuzzleLevelInfo(BaseModel):
    """Progressive level descriptor with XP reward bracket and unlock state."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    level: int = Field(..., ge=1, description="1-based incremental level tier")
    label: str = Field(..., min_length=1, description="Pedagogical stage description or subtitle")
    base_xp: int = Field(..., ge=0, description="XP rewarded upon first successful completion of this level")
    unlocked_by_default: bool = Field(
        default=False,
        description="Whether this level is accessible immediately to guest and novice players",
    )


class PuzzleMetadata(BaseModel):
    """Comprehensive catalog metadata describing a puzzle engine and its progression ladder."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    id: str = Field(..., min_length=1, description="Unique immutable puzzle identifier")
    slug: str = Field(..., min_length=1, description="URL-friendly kebab-case route slug")
    title: str = Field(..., min_length=1, description="Human-readable display title")
    short_description: str = Field(
        ..., min_length=1, description="Concise summary of gameplay mechanic and pedagogical purpose"
    )
    difficulty: DifficultyLevel = Field(..., description="Pedagogical difficulty tier")
    game_type: GameType = Field(..., description="Engine mechanic category")
    learning_objectives: list[LearningObjective] = Field(
        ..., min_length=1, description="List of core linguistic learning outcomes"
    )
    is_new: bool = Field(default=False, description="Flag highlighting newly introduced puzzle modes")
    thumbnail_icon: str = Field(..., min_length=1, description="Lucide icon identifier name")
    available_levels: list[PuzzleLevelInfo] = Field(
        ..., min_length=1, description="Progression ladder levels available for this puzzle"
    )
    total_levels: int = Field(..., ge=1, description="Total number of progression levels configured")
    max_xp: int = Field(..., ge=0, description="Cumulative total XP achievable across all levels in this puzzle")


class PuzzleCatalogResponse(BaseModel):
    """Catalog payload returning all registered puzzle engines and total count."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    puzzles: list[PuzzleMetadata] = Field(
        ..., description="Array of registered puzzle engines and progression metadata"
    )
    total_count: int = Field(..., ge=0, description="Total count of puzzles available in the catalog")
