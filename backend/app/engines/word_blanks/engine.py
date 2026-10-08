"""Word Blanks modular linguistic puzzle engine evaluator.

Subclasses AbstractPuzzleEngine pursuant to AGENTS.md Rule 3 and Vicharanashala pattern.
Enforces dynamic stem regex compliance, session duplicate suppression, and lexical dictionary verification.
"""

from datetime import datetime, timezone
import re
from typing import Any, Dict, List, Optional
from app.engines.base import (
    AbstractPuzzleEngine,
    BaseGuessRequest,
    BaseGuessResponse,
    BasePuzzleInit,
)
from app.engines.word_blanks.puzzles_data import WORD_BLANKS_CURRICULUM
from app.schemas.word_blanks import (
    DiscoveredWord,
    WordBlanksEvaluationResponse,
    WordBlanksGuessRequest,
    WordBlanksLevel,
    WordBlanksPuzzle,
)
from app.services.dictionary import dictionary_service


class WordBlanksEngine(AbstractPuzzleEngine):
    """Modular engine handling generative stem pattern evaluation and 17-level progression."""

    def __init__(self, curriculum: Optional[List[WordBlanksLevel]] = None) -> None:
        levels = curriculum or WORD_BLANKS_CURRICULUM
        self._levels: Dict[int, WordBlanksLevel] = {lvl.level: lvl for lvl in levels}

    def get_levels(self) -> List[WordBlanksLevel]:
        """Returns ordered list of all Word Blanks progression levels."""
        return [self._levels[k] for k in sorted(self._levels.keys())]

    def get_level(self, level_num: int) -> Optional[WordBlanksLevel]:
        """Returns specific level configuration by level number (1-17)."""
        return self._levels.get(level_num)

    def get_puzzle(self, level_num: int, puzzle_number: int = 1) -> Optional[WordBlanksPuzzle]:
        """Returns specific puzzle stage configuration within a level."""
        lvl = self.get_level(level_num)
        if not lvl or not lvl.puzzles:
            return None
        for p in lvl.puzzles:
            if p.puzzle_number == puzzle_number:
                return p
        # Fallback to index if 1-based index is in range
        if 1 <= puzzle_number <= len(lvl.puzzles):
            return lvl.puzzles[puzzle_number - 1]
        return lvl.puzzles[0]

    def _build_stem_regex(self, stem: str) -> re.Pattern[str]:
        """Compiles regex pattern enforcing exact characters and wildcard blanks.

        Example:
            '_ A T' -> ^[A-Za-z]AT$
            'C A _' -> ^CA[A-Za-z]$
            '_ R _ N _ H' -> ^[A-Za-z]R[A-Za-z]N[A-Za-z]H$
        """
        tokens = [char for char in stem if char != " "]
        regex_parts = []
        for char in tokens:
            if char == "_":
                regex_parts.append("[A-Za-z]")
            else:
                regex_parts.append(re.escape(char))
        pattern_str = f"^{''.join(regex_parts)}$"
        return re.compile(pattern_str, re.IGNORECASE)

    async def evaluate_guess(
        self, request: WordBlanksGuessRequest
    ) -> WordBlanksEvaluationResponse:
        """Domain-specific evaluation handler for Word Blanks guess submissions.

        Performs:
        1. Level & specific puzzle resolution
        2. Stem pattern compliance check
        3. Session duplicate suppression
        4. External / seed dictionary lexical verification
        5. XP calculation and telemetry generation
        """
        lvl = self.get_level(request.level)
        if not lvl:
            return WordBlanksEvaluationResponse(
                is_valid=False,
                is_duplicate=False,
                matches_pattern=False,
                discovered_word=None,
                xp_awarded=0,
                feedback_message=f"Invalid Word Blanks level tier: {request.level}",
            )

        puzzle = self.get_puzzle(request.level, request.puzzle_number)
        active_stem = puzzle.stem if puzzle else (lvl.stem or "_ A T")

        entered = request.entered_word.strip().upper()
        if not entered:
            return WordBlanksEvaluationResponse(
                is_valid=False,
                is_duplicate=False,
                matches_pattern=False,
                discovered_word=None,
                xp_awarded=0,
                feedback_message="No word submitted.",
            )

        # 1. Stem pattern validation
        stem_pattern = self._build_stem_regex(active_stem)
        if not stem_pattern.match(entered):
            return WordBlanksEvaluationResponse(
                is_valid=False,
                is_duplicate=False,
                matches_pattern=False,
                discovered_word=None,
                xp_awarded=0,
                feedback_message=f"'{entered}' does not match the stem pattern '{active_stem}'.",
            )

        # 2. Duplicate detection against current session's discovered words
        normalized_discovered = {w.strip().upper() for w in request.session_discovered}
        if entered in normalized_discovered:
            return WordBlanksEvaluationResponse(
                is_valid=True,
                is_duplicate=True,
                matches_pattern=True,
                discovered_word=None,
                xp_awarded=0,
                feedback_message=f"'{entered}' was already discovered in this session!",
            )

        # 3. Dictionary lexical validity check
        lookup = await dictionary_service.lookup_word(entered)
        if not lookup["is_valid"]:
            return WordBlanksEvaluationResponse(
                is_valid=False,
                is_duplicate=False,
                matches_pattern=True,
                discovered_word=None,
                xp_awarded=0,
                feedback_message=f"'{entered}' is not recognized as a valid English word.",
            )

        # 4. Success: award level XP and build telemetry
        xp = lvl.xp_per_word
        discovered = DiscoveredWord(
            word=entered,
            part_of_speech=lookup["part_of_speech"],
            definition=lookup["definition"],
            xp_awarded=xp,
            discovered_at=datetime.now(timezone.utc).isoformat(),
        )

        return WordBlanksEvaluationResponse(
            is_valid=True,
            is_duplicate=False,
            matches_pattern=True,
            discovered_word=discovered,
            xp_awarded=xp,
            feedback_message=f"Brilliant! '{entered}' discovered (+{xp} XP).",
        )

    async def initialize(self, **kwargs: Any) -> BasePuzzleInit:
        """Initializes Word Blanks puzzle session conforming to AbstractPuzzleEngine."""
        level_idx = kwargs.get("level", 1)
        puzzle_idx = kwargs.get("puzzle_number", 1)
        lvl = self.get_level(level_idx) or self.get_levels()[0]
        puzzle = self.get_puzzle(level_idx, puzzle_idx) or lvl.puzzles[0]

        return BasePuzzleInit(
            puzzle_id="word-blanks",
            puzzle_type="fill-in-blanks",
            difficulty=lvl.difficulty.value.upper(),
            metadata={
                "level": lvl.level,
                "title": lvl.title,
                "puzzle_number": puzzle.puzzle_number,
                "stem": puzzle.stem,
                "blank_count": puzzle.blank_count,
                "word_length": puzzle.word_length,
                "xp_per_word": lvl.xp_per_word,
                "min_words_to_clear": puzzle.min_words_to_clear,
                "description": puzzle.pedagogical_note,
            },
        )

    async def evaluate(self, payload: BaseGuessRequest) -> BaseGuessResponse:
        """Conforms to generic AbstractPuzzleEngine evaluation envelope."""
        entered = getattr(payload, "entered_word", "")
        level_idx = getattr(payload, "level", 1)
        puzzle_idx = getattr(payload, "puzzle_number", 1)
        session_disc = getattr(payload, "session_discovered", [])

        req = WordBlanksGuessRequest(
            level=level_idx,
            puzzle_number=puzzle_idx,
            entered_word=str(entered),
            session_discovered=session_disc,
        )
        res = await self.evaluate_guess(req)

        status = "PLAYING"
        if res.is_valid and not res.is_duplicate:
            status = "PLAYING"

        return BaseGuessResponse(
            puzzle_id=payload.puzzle_id,
            status=status,
            feedback=res.feedback_message,
            is_correct=res.is_valid and not res.is_duplicate,
        )


# Global singleton instance
word_blanks_engine = WordBlanksEngine()
