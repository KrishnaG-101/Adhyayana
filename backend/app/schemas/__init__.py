"""Pydantic v2 data transfer objects and schemas."""

from .health import HealthCheckResponse
from .puzzles import (
    DifficultyLevel,
    GameType,
    LearningObjective,
    PuzzleCatalogResponse,
    PuzzleLevelInfo,
    PuzzleMetadata,
)
from .word_blanks import (
    DiscoveredWord,
    WordBlanksEvaluationResponse,
    WordBlanksGuessRequest,
    WordBlanksLevel,
    WordBlanksPuzzle,
)
from .users import (
    GuestMigrationRequest,
    GuestMigrationResponse,
    UpdateProfileRequest,
    UserPreferences,
    UserProfile,
    UserStats,
)

__all__ = [
    "HealthCheckResponse",
    "DifficultyLevel",
    "GameType",
    "LearningObjective",
    "PuzzleCatalogResponse",
    "PuzzleLevelInfo",
    "PuzzleMetadata",
    "DiscoveredWord",
    "WordBlanksEvaluationResponse",
    "WordBlanksGuessRequest",
    "WordBlanksLevel",
    "WordBlanksPuzzle",
    "UserPreferences",
    "UserStats",
    "UserProfile",
    "UpdateProfileRequest",
    "GuestMigrationRequest",
    "GuestMigrationResponse",
]

