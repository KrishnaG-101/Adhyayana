"""Pydantic v2 schemas for the Word Blanks modular puzzle engine.

Strictly mirrors docs/specs/api-contracts.json pursuant to AGENTS.md Rule 1 & Rule 2.
"""

from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.puzzles import DifficultyLevel


class WordBlanksPuzzle(BaseModel):
    """Individual generative stem puzzle challenge within a Word Blanks level tier."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    id: str = Field(..., min_length=1, description="Unique identifier for the puzzle (e.g. 'wb-l1-p1')")
    puzzle_number: int = Field(..., ge=1, description="Sequential 1-based puzzle index within the level")
    stem: str = Field(..., min_length=1, description="Spaced stem representation with underscores indicating blanks")
    word_length: int = Field(..., ge=1, description="Total character length of the target words")
    blank_count: int = Field(..., ge=1, description="Number of input blanks in the stem")
    min_words_to_clear: int = Field(default=3, ge=1, description="Minimum count of unique valid words required to clear this puzzle")
    pedagogical_note: str = Field(..., min_length=1, description="Pedagogical prompt and explanation for this specific stem pattern")


class WordBlanksLevel(BaseModel):
    """Progressive difficulty tier specification for Word Blanks generative recall curriculum."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    level: int = Field(..., ge=1, le=17, description="Sequential level number (1 through 17)")
    difficulty: DifficultyLevel = Field(..., description="Pedagogical difficulty tier")
    title: str = Field(..., min_length=1, description="Pedagogical name of this progression level")
    description: str = Field(..., min_length=1, description="Pedagogical overview and explanation for this level's lexical patterns")
    xp_per_word: int = Field(..., ge=1, description="XP awarded per uniquely discovered valid English word in this level")
    min_puzzles_to_unlock_next: int = Field(default=5, ge=1, description="Minimum count of puzzles cleared in this level to unlock next level")
    puzzles: List[WordBlanksPuzzle] = Field(default_factory=list, description="Array of curated generative stem puzzles in this level")

    # Optional backward compatibility fields
    stem: Optional[str] = Field(default=None, description="Default active stem representation for backward compatibility")
    word_length: Optional[int] = Field(default=None, description="Default target word length")
    blank_count: Optional[int] = Field(default=None, description="Default input blank count")
    min_words_to_unlock: Optional[int] = Field(default=None, description="Legacy threshold for level unlock")


class DiscoveredWord(BaseModel):
    """Pedagogical telemetry record for a successfully discovered valid word."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    word: str = Field(..., min_length=1, description="Uppercase discovered word")
    part_of_speech: Optional[str] = Field(default=None, description="Primary grammatical part of speech if resolved")
    definition: Optional[str] = Field(default=None, description="First concise Wiktionary definition returned by dictionary lookup")
    xp_awarded: int = Field(..., ge=0, description="Amount of XP awarded for discovering this word")
    discovered_at: str = Field(..., description="ISO 8601 timestamp of when the word was validated")


class WordBlanksGuessRequest(BaseModel):
    """Player guess submission payload for Word Blanks level evaluation."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    level: int = Field(..., ge=1, le=17, description="Active level number being played")
    puzzle_number: int = Field(default=1, ge=1, description="1-based index of the specific puzzle stage within the level")
    entered_word: str = Field(..., min_length=1, description="The complete word formed by the player filling blanks")
    session_discovered: List[str] = Field(
        default_factory=list,
        description="List of uppercase words already discovered during this session for duplicate tracking",
    )


class WordBlanksEvaluationResponse(BaseModel):
    """Comprehensive evaluation and telemetry payload returned for a Word Blanks guess."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    is_valid: bool = Field(..., description="Whether the entered word is a recognized dictionary word")
    is_duplicate: bool = Field(..., description="Whether the word was already discovered during this session")
    matches_pattern: bool = Field(..., description="Whether the entered word satisfies the fixed stem letter constraints")
    discovered_word: Optional[DiscoveredWord] = Field(default=None, description="Discovered word telemetry entry if valid and new, else None")
    xp_awarded: int = Field(..., ge=0, description="XP gained from this submission (0 if duplicate or invalid)")
    feedback_message: str = Field(..., description="Analytical feedback message explaining evaluation result")
