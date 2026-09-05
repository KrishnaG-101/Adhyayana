"""
============================================================================
MODULAR PUZZLE ENGINE BASE CONTRACT & SPECIFICATION
============================================================================

1. ARCHITECTURAL OBJECTIVE:
   - Provides generic, decoupled foundation contracts for all future linguistic
     puzzle engines (e.g., Contexto, Crosswords, Morphological Matrix, Word Blanks).
   - Enforces uniform lifecycle management across initialization, state progression,
     and guess evaluation pursuant to `docs/specs/puzzle-framework.md`.

2. SUBCLASSING RULES FOR FUTURE ENGINES:
   - Every concrete puzzle engine must create its own isolated subpackage in
     `backend/app/engines/<puzzle-name>/`.
   - Engine evaluators must inherit from `AbstractPuzzleEngine` and implement
     both `initialize(**kwargs)` and `evaluate(payload)`.
   - Domain-specific payloads must inherit from `BaseGuessRequest` and
     `BaseGuessResponse`, registering extended fields without breaking the
     standard envelope.

3. CONCURRENCY & ASYNC PROTOCOL:
   - All evaluation handlers are fully asynchronous (`async def`) to support
     high-concurrency embedding similarity calculations and non-blocking I/O.
============================================================================
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict, Field


class BasePuzzleInit(BaseModel):
    """Generic initialization payload for a puzzle challenge session."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    puzzle_id: str = Field(..., description="Unique puzzle challenge identifier")
    puzzle_type: str = Field(..., description="Linguistic engine identifier (e.g. 'contexto')")
    difficulty: str = Field(..., description="Pedagogical tier (BEGINNER, INTERMEDIATE, ADVANCED)")
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Public configuration parameters, hints, or grid constraints",
    )


class BaseGuessRequest(BaseModel):
    """Generic guess submission payload submitted by the player."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    puzzle_id: str = Field(..., description="Target puzzle identifier")
    session_id: Optional[str] = Field(
        default=None,
        description="Active gameplay session UUID, or None if stateless",
    )


class BaseGuessResponse(BaseModel):
    """Generic evaluation envelope returned by the engine evaluator."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    puzzle_id: str = Field(..., description="Target puzzle identifier")
    status: str = Field(
        ...,
        description="Session state machine indicator (e.g. 'PLAYING', 'WON', 'FAILED')",
    )
    feedback: str = Field(
        ...,
        description="Analytical qualitative feedback or hint for the learner",
    )
    is_correct: bool = Field(
        ...,
        description="Boolean flag indicating if the submission resolved the puzzle",
    )


class AbstractPuzzleEngine(ABC):
    """Abstract Base Class defining the operational contract for all puzzle engines."""

    @abstractmethod
    async def initialize(self, **kwargs: Any) -> BasePuzzleInit:
        """Initializes or restores a puzzle instance state.

        Args:
            **kwargs: Engine-specific initialization parameters (e.g. date, seed).

        Returns:
            BasePuzzleInit or subclass containing public bootstrap configuration.
        """
        ...

    @abstractmethod
    async def evaluate(self, payload: BaseGuessRequest) -> BaseGuessResponse:
        """Evaluates a learner's guess against pedagogical criteria.

        Args:
            payload: BaseGuessRequest or engine-specific subclass payload.

        Returns:
            BaseGuessResponse or engine-specific subclass with analytical telemetry.
        """
        ...
