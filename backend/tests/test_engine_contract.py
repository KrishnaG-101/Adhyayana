"""Tests for AbstractPuzzleEngine lifecycle contracts and generic DTOs."""

from typing import Any
import pytest
from app.engines.base import (
    AbstractPuzzleEngine,
    BaseGuessRequest,
    BaseGuessResponse,
    BasePuzzleInit,
)


def test_incomplete_engine_subclass_raises_type_error() -> None:
    """Verify that a subclass lacking abstract methods cannot be instantiated."""

    class IncompleteEngine(AbstractPuzzleEngine):
        pass

    with pytest.raises(TypeError) as excinfo:
        IncompleteEngine()  # type: ignore[abstract]

    assert "Can't instantiate abstract class IncompleteEngine" in str(excinfo.value)


def test_missing_evaluate_raises_type_error() -> None:
    """Verify subclass implementing only initialize raises TypeError."""

    class MissingEvaluateEngine(AbstractPuzzleEngine):
        async def initialize(self, **kwargs: Any) -> BasePuzzleInit:
            return BasePuzzleInit(
                puzzle_id="test_1",
                puzzle_type="test",
                difficulty="BEGINNER",
            )

    with pytest.raises(TypeError) as excinfo:
        MissingEvaluateEngine()  # type: ignore[abstract]

    assert "evaluate" in str(excinfo.value)


@pytest.mark.asyncio
async def test_compliant_engine_subclass_execution() -> None:
    """Verify a complete subclass adheres to the AbstractPuzzleEngine protocol."""

    class DummyEngine(AbstractPuzzleEngine):
        async def initialize(self, **kwargs: Any) -> BasePuzzleInit:
            return BasePuzzleInit(
                puzzle_id="dummy_01",
                puzzle_type="dummy",
                difficulty="INTERMEDIATE",
                metadata={"grid_size": 5},
            )

        async def evaluate(self, payload: BaseGuessRequest) -> BaseGuessResponse:
            is_correct = payload.puzzle_id == "dummy_01"
            return BaseGuessResponse(
                puzzle_id=payload.puzzle_id,
                status="WON" if is_correct else "PLAYING",
                feedback="Correct!" if is_correct else "Try again.",
                is_correct=is_correct,
            )

    engine = DummyEngine()
    init_data = await engine.initialize()
    assert init_data.puzzle_id == "dummy_01"
    assert init_data.puzzle_type == "dummy"
    assert init_data.difficulty == "INTERMEDIATE"
    assert init_data.metadata == {"grid_size": 5}

    request = BaseGuessRequest(puzzle_id="dummy_01", session_id="session-123")
    response = await engine.evaluate(request)
    assert response.puzzle_id == "dummy_01"
    assert response.status == "WON"
    assert response.feedback == "Correct!"
    assert response.is_correct is True
