"""Endpoints for Word Blanks progressive levels and generative guess evaluation."""

from typing import List
from fastapi import APIRouter, HTTPException, status
from app.engines.word_blanks import word_blanks_engine
from app.schemas.word_blanks import (
    WordBlanksEvaluationResponse,
    WordBlanksGuessRequest,
    WordBlanksLevel,
)

router = APIRouter()


@router.get(
    "/levels",
    response_model=List[WordBlanksLevel],
    status_code=status.HTTP_200_OK,
    summary="Retrieve Word Blanks Progression Levels",
    description="Retrieves all 17 progressive Word Blanks levels with 450+ curated stems, word length, blanks count, XP per word, and unlock criteria.",
)
async def get_word_blanks_levels() -> List[WordBlanksLevel]:
    """Returns the complete sequence of Word Blanks level specifications."""
    return word_blanks_engine.get_levels()


@router.post(
    "/evaluate",
    response_model=WordBlanksEvaluationResponse,
    status_code=status.HTTP_200_OK,
    summary="Evaluate Word Blanks Guess",
    description="Validates an entered word against the level stem template, detects duplicates in current session, verifies against the dictionary, and awards XP with educational telemetry.",
)
async def evaluate_word_blanks_guess(
    request: WordBlanksGuessRequest,
) -> WordBlanksEvaluationResponse:
    """Evaluates a guess submission against the target level stem and dictionary."""
    lvl = word_blanks_engine.get_level(request.level)
    if not lvl:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid Word Blanks level tier: {request.level}",
        )
    return await word_blanks_engine.evaluate_guess(request)
