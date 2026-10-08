"""Pytest test suite for Word Blanks engine levels and evaluation endpoints."""

import pytest
from httpx import AsyncClient
from app.engines.word_blanks import word_blanks_engine


@pytest.mark.asyncio
async def test_get_word_blanks_levels(async_client: AsyncClient) -> None:
    """Verifies that the /levels endpoint returns all 17 progressive tiers and 450+ puzzles."""
    response = await async_client.get("/api/v1/puzzles/word-blanks/levels")
    assert response.status_code == 200
    levels = response.json()
    assert len(levels) == 17

    total_puzzles = sum(len(lvl["puzzles"]) for lvl in levels)
    assert total_puzzles >= 450

    # Check Level 1 metadata (3-Letter Onsets)
    lvl1 = levels[0]
    assert lvl1["level"] == 1
    assert lvl1["difficulty"] == "beginner"
    assert lvl1["stem"] == "_ A T"
    assert lvl1["blank_count"] == 1
    assert lvl1["word_length"] == 3
    assert lvl1["xp_per_word"] == 20
    assert lvl1["min_words_to_unlock"] == 3
    assert len(lvl1["puzzles"]) == 30
    assert lvl1["puzzles"][0]["stem"] == "_ A T"
    assert lvl1["puzzles"][1]["stem"] == "_ I N"

    # Check Level 3 metadata (3-Letter Codas)
    lvl3 = levels[2]
    assert lvl3["level"] == 3
    assert lvl3["difficulty"] == "beginner"
    assert lvl3["stem"] == "C A _"
    assert len(lvl3["puzzles"]) == 30

    # Check Level 13 metadata (6-Letter Distributed Templates)
    lvl13 = levels[12]
    assert lvl13["level"] == 13
    assert lvl13["difficulty"] == "master"
    assert lvl13["stem"] == "_ R _ N _ H"
    assert lvl13["xp_per_word"] == 90

    # Check Level 17 metadata (Advanced Polysyllabic Morphemes)
    lvl17 = levels[16]
    assert lvl17["level"] == 17
    assert lvl17["difficulty"] == "master"
    assert lvl17["xp_per_word"] == 140


@pytest.mark.asyncio
async def test_evaluate_valid_word_stepper(async_client: AsyncClient) -> None:
    """Verifies that a valid word conforming to puzzle 1 and puzzle 2 awards XP."""
    # Puzzle 1: _ A T
    payload1 = {
        "level": 1,
        "puzzle_number": 1,
        "entered_word": "BAT",
        "session_discovered": [],
    }
    response1 = await async_client.post(
        "/api/v1/puzzles/word-blanks/evaluate",
        json=payload1,
    )
    assert response1.status_code == 200
    data1 = response1.json()
    assert data1["is_valid"] is True
    assert data1["matches_pattern"] is True
    assert data1["is_duplicate"] is False
    assert data1["xp_awarded"] == 20
    assert data1["discovered_word"] is not None
    assert data1["discovered_word"]["word"] == "BAT"

    # Puzzle 2: _ I N -> BIN
    payload2 = {
        "level": 1,
        "puzzle_number": 2,
        "entered_word": "BIN",
        "session_discovered": [],
    }
    response2 = await async_client.post(
        "/api/v1/puzzles/word-blanks/evaluate",
        json=payload2,
    )
    assert response2.status_code == 200
    data2 = response2.json()
    assert data2["is_valid"] is True
    assert data2["matches_pattern"] is True
    assert data2["discovered_word"]["word"] == "BIN"


@pytest.mark.asyncio
async def test_evaluate_coda_level_3(async_client: AsyncClient) -> None:
    """Verifies that 3-letter coda pattern (C A _) validates words like CAT and CAP."""
    payload = {
        "level": 3,
        "puzzle_number": 1,  # C A _
        "entered_word": "CAT",
        "session_discovered": [],
    }
    response = await async_client.post(
        "/api/v1/puzzles/word-blanks/evaluate",
        json=payload,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is True
    assert data["matches_pattern"] is True
    assert data["discovered_word"]["word"] == "CAT"


@pytest.mark.asyncio
async def test_evaluate_pattern_mismatch(async_client: AsyncClient) -> None:
    """Verifies that a word failing stem pattern match is rejected immediately."""
    payload = {
        "level": 1,
        "puzzle_number": 1,
        "entered_word": "BALL",  # 4 letters, does not match _ A T
        "session_discovered": [],
    }
    response = await async_client.post(
        "/api/v1/puzzles/word-blanks/evaluate",
        json=payload,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["matches_pattern"] is False
    assert data["is_valid"] is False
    assert data["xp_awarded"] == 0
    assert data["discovered_word"] is None


@pytest.mark.asyncio
async def test_evaluate_duplicate_word(async_client: AsyncClient) -> None:
    """Verifies that previously discovered words are flagged as duplicates with 0 XP."""
    payload = {
        "level": 1,
        "puzzle_number": 1,
        "entered_word": "CAT",
        "session_discovered": ["CAT", "BAT"],
    }
    response = await async_client.post(
        "/api/v1/puzzles/word-blanks/evaluate",
        json=payload,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["matches_pattern"] is True
    assert data["is_valid"] is True
    assert data["is_duplicate"] is True
    assert data["xp_awarded"] == 0
    assert data["discovered_word"] is None
    assert "already discovered" in data["feedback_message"].lower()


@pytest.mark.asyncio
async def test_evaluate_level_13_master_word(async_client: AsyncClient) -> None:
    """Verifies evaluation for Level 13 distributed template with 3 blanks."""
    payload = {
        "level": 13,
        "puzzle_number": 1,  # _ R _ N _ H
        "entered_word": "BRANCH",
        "session_discovered": [],
    }
    response = await async_client.post(
        "/api/v1/puzzles/word-blanks/evaluate",
        json=payload,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is True
    assert data["matches_pattern"] is True
    assert data["xp_awarded"] == 90
    assert data["discovered_word"] is not None
    assert data["discovered_word"]["word"] == "BRANCH"


@pytest.mark.asyncio
async def test_evaluate_invalid_level_index(async_client: AsyncClient) -> None:
    """Verifies that requests with invalid level numbers return 422 Unprocessable Entity."""
    payload = {
        "level": 99,
        "entered_word": "TEST",
        "session_discovered": [],
    }
    response = await async_client.post(
        "/api/v1/puzzles/word-blanks/evaluate",
        json=payload,
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_engine_get_puzzle_lookup() -> None:
    """Verifies engine.get_puzzle finds exact puzzle stages."""
    p1 = word_blanks_engine.get_puzzle(1, 2)
    assert p1 is not None
    assert p1.puzzle_number == 2
    assert p1.stem == "_ I N"

    p_none = word_blanks_engine.get_puzzle(99, 1)
    assert p_none is None

