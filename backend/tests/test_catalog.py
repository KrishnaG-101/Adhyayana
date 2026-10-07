"""Tests for puzzle catalog discovery, level ladders, and metadata endpoints."""

import pytest
import httpx
from app.schemas.puzzles import PuzzleCatalogResponse, PuzzleMetadata


@pytest.mark.asyncio
async def test_get_puzzle_catalog_success(async_client: httpx.AsyncClient) -> None:
    """Verify GET /api/v1/puzzles returns HTTP 200 and conforms to PuzzleCatalogResponse."""
    response = await async_client.get("/api/v1/puzzles")
    assert response.status_code == 200

    payload = response.json()
    # Validate payload strictly parses into Pydantic model
    catalog = PuzzleCatalogResponse.model_validate(payload)

    assert catalog.total_count == 3
    assert len(catalog.puzzles) == 3

    # Map puzzles by id
    puzzles_by_id = {p.id: p for p in catalog.puzzles}
    assert "word-blanks" in puzzles_by_id
    assert "contexto" in puzzles_by_id
    assert "crossword" in puzzles_by_id

    # 1. Verify Word Blanks
    wb = puzzles_by_id["word-blanks"]
    assert wb.slug == "word-blanks"
    assert wb.difficulty.value == "beginner"
    assert wb.game_type.value == "fill-in-blanks"
    assert [obj.value for obj in wb.learning_objectives] == ["vocabulary", "morphology"]
    assert wb.total_levels == 5
    assert wb.max_xp == 750
    assert len(wb.available_levels) == 5

    # Check ascending base_xp
    xp_values = [lvl.base_xp for lvl in wb.available_levels]
    assert xp_values == [50, 100, 150, 200, 250]
    assert wb.available_levels[0].unlocked_by_default is True
    assert wb.available_levels[-1].unlocked_by_default is False

    # 2. Verify Contexto
    ctx = puzzles_by_id["contexto"]
    assert ctx.slug == "contexto"
    assert ctx.difficulty.value == "intermediate"
    assert ctx.game_type.value == "semantic-similarity"
    assert [obj.value for obj in ctx.learning_objectives] == ["vocabulary", "inference"]
    assert ctx.total_levels == 3
    assert ctx.max_xp == 600
    assert [lvl.base_xp for lvl in ctx.available_levels] == [100, 200, 300]

    # 3. Verify Syntactic Crossword
    cw = puzzles_by_id["crossword"]
    assert cw.slug == "crossword"
    assert cw.difficulty.value == "advanced"
    assert cw.game_type.value == "crossword"
    assert [obj.value for obj in cw.learning_objectives] == ["syntax", "etymology"]
    assert cw.total_levels == 4
    assert cw.max_xp == 1200
    assert [lvl.base_xp for lvl in cw.available_levels] == [150, 250, 350, 450]


@pytest.mark.asyncio
async def test_get_single_puzzle_by_id_and_slug(async_client: httpx.AsyncClient) -> None:
    """Verify GET /api/v1/puzzles/{puzzle_id} resolves by both ID and slug."""
    # Test by ID
    response = await async_client.get("/api/v1/puzzles/word-blanks")
    assert response.status_code == 200
    data = PuzzleMetadata.model_validate(response.json())
    assert data.id == "word-blanks"
    assert data.title == "Word Blanks (Fill-in-the-Blanks)"

    # Test Contexto by slug
    response_slug = await async_client.get("/api/v1/puzzles/contexto")
    assert response_slug.status_code == 200
    data_slug = PuzzleMetadata.model_validate(response_slug.json())
    assert data_slug.id == "contexto"


@pytest.mark.asyncio
async def test_get_puzzle_not_found(async_client: httpx.AsyncClient) -> None:
    """Verify requesting a non-existent puzzle ID returns HTTP 404."""
    response = await async_client.get("/api/v1/puzzles/non-existent-puzzle")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
