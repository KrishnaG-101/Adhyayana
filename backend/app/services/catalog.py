"""Puzzle catalog service and seed provider.

Provides structured, in-memory discovery data for registered puzzle engines,
progression levels, and pedagogical XP ladders.
"""

from app.schemas.puzzles import (
    DifficultyLevel,
    GameType,
    LearningObjective,
    PuzzleCatalogResponse,
    PuzzleLevelInfo,
    PuzzleMetadata,
)


class CatalogService:
    """Service providing puzzle catalog discovery, filtering, and progression data."""

    def __init__(self) -> None:
        self._catalog: list[PuzzleMetadata] = self._build_seed_catalog()

    def _build_seed_catalog(self) -> list[PuzzleMetadata]:
        return [
            PuzzleMetadata(
                id="word-blanks",
                slug="word-blanks",
                title="Word Blanks (Fill-in-the-Blanks)",
                short_description="Deduce masked letters from active recall clues and morphological syntax hints.",
                difficulty=DifficultyLevel.BEGINNER,
                game_type=GameType.FILL_IN_BLANKS,
                learning_objectives=[
                    LearningObjective.VOCABULARY,
                    LearningObjective.MORPHOLOGY,
                ],
                is_new=True,
                thumbnail_icon="BookOpen",
                available_levels=[
                    PuzzleLevelInfo(
                        level=1,
                        label="Level 1: 3-Letter Common Stems",
                        base_xp=50,
                        unlocked_by_default=True,
                    ),
                    PuzzleLevelInfo(
                        level=2,
                        label="Level 2: 4-Letter Affixed Lemmas",
                        base_xp=100,
                        unlocked_by_default=True,
                    ),
                    PuzzleLevelInfo(
                        level=3,
                        label="Level 3: 5-Letter Root Morphemes",
                        base_xp=150,
                        unlocked_by_default=False,
                    ),
                    PuzzleLevelInfo(
                        level=4,
                        label="Level 4: Bound Morphemic Clusters",
                        base_xp=200,
                        unlocked_by_default=False,
                    ),
                    PuzzleLevelInfo(
                        level=5,
                        label="Level 5: Polysyllabic Classical Lemmas",
                        base_xp=250,
                        unlocked_by_default=False,
                    ),
                ],
                total_levels=5,
                max_xp=750,
            ),
            PuzzleMetadata(
                id="contexto",
                slug="contexto",
                title="Contexto Semantic Proximity",
                short_description="Find the hidden word through numerical semantic embedding distance feedback.",
                difficulty=DifficultyLevel.INTERMEDIATE,
                game_type=GameType.SEMANTIC_SIMILARITY,
                learning_objectives=[
                    LearningObjective.VOCABULARY,
                    LearningObjective.INFERENCE,
                ],
                is_new=True,
                thumbnail_icon="Compass",
                available_levels=[
                    PuzzleLevelInfo(
                        level=1,
                        label="Level 1: Core Semantic Neighborhoods",
                        base_xp=100,
                        unlocked_by_default=True,
                    ),
                    PuzzleLevelInfo(
                        level=2,
                        label="Level 2: Abstract Conceptual Clusters",
                        base_xp=200,
                        unlocked_by_default=False,
                    ),
                    PuzzleLevelInfo(
                        level=3,
                        label="Level 3: Distant Polysemous Vectors",
                        base_xp=300,
                        unlocked_by_default=False,
                    ),
                ],
                total_levels=3,
                max_xp=600,
            ),
            PuzzleMetadata(
                id="crossword",
                slug="crossword",
                title="Syntactic Crossword",
                short_description="Intersecting lexical definition matrix balancing speed, syntax, and orthographic precision.",
                difficulty=DifficultyLevel.ADVANCED,
                game_type=GameType.CROSSWORD,
                learning_objectives=[
                    LearningObjective.SYNTAX,
                    LearningObjective.ETYMOLOGY,
                ],
                is_new=False,
                thumbnail_icon="Grid",
                available_levels=[
                    PuzzleLevelInfo(
                        level=1,
                        label="Level 1: 5x5 Mini Orthographic Matrix",
                        base_xp=150,
                        unlocked_by_default=True,
                    ),
                    PuzzleLevelInfo(
                        level=2,
                        label="Level 2: 7x7 Syntactic Intersection",
                        base_xp=250,
                        unlocked_by_default=False,
                    ),
                    PuzzleLevelInfo(
                        level=3,
                        label="Level 3: 9x9 Etymological Grid",
                        base_xp=350,
                        unlocked_by_default=False,
                    ),
                    PuzzleLevelInfo(
                        level=4,
                        label="Level 4: 11x11 Master Lexical Nexus",
                        base_xp=450,
                        unlocked_by_default=False,
                    ),
                ],
                total_levels=4,
                max_xp=1200,
            ),
        ]

    def get_catalog(self) -> PuzzleCatalogResponse:
        """Returns the full catalog of registered puzzles and total count."""
        return PuzzleCatalogResponse(
            puzzles=self._catalog,
            total_count=len(self._catalog),
        )

    def get_puzzle_by_id(self, puzzle_id: str) -> PuzzleMetadata | None:
        """Looks up a registered puzzle by its immutable identifier."""
        for puzzle in self._catalog:
            if puzzle.id == puzzle_id:
                return puzzle
        return None

    def get_puzzle_by_slug(self, slug: str) -> PuzzleMetadata | None:
        """Looks up a registered puzzle by its URL route slug."""
        for puzzle in self._catalog:
            if puzzle.slug == slug:
                return puzzle
        return None


# Global service instance for dependency injection
_catalog_service_instance = CatalogService()


def get_catalog_service() -> CatalogService:
    """FastAPI dependency provider returning the catalog service singleton."""
    return _catalog_service_instance
