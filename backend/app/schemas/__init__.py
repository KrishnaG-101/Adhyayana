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

__all__ = [
    "HealthCheckResponse",
    "DifficultyLevel",
    "GameType",
    "LearningObjective",
    "PuzzleCatalogResponse",
    "PuzzleLevelInfo",
    "PuzzleMetadata",
]
