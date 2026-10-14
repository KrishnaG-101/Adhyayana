"""Test Suite for Game Progress Persistence and Cross-Device Synchronization."""

from datetime import datetime, timezone
import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import settings
from app.core.firebase import GAME_PROGRESS_STORE, USER_STORE
from app.main import app


@pytest.fixture(autouse=True)
def reset_progress_stores(monkeypatch):
    """Resets memory stores and sets test environment to isolate each test."""
    monkeypatch.setattr(settings, "ENVIRONMENT", "test")
    USER_STORE.clear()
    GAME_PROGRESS_STORE.clear()
    yield
    USER_STORE.clear()
    GAME_PROGRESS_STORE.clear()


@pytest.mark.asyncio
async def test_get_progress_unauthorized():
    """Unauthenticated requests to progress endpoint must return 401."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/v1/games/word_blanks/progress")
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_get_progress_initial_baseline():
    """Fresh user requests receive default level 1 unlocked baseline."""
    headers = {"Authorization": "Bearer mock-token-progress-newbie"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/v1/games/word_blanks/progress", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["game_id"] == "word_blanks"
    assert data["unlocked_levels"] == [1]
    assert data["cleared_stages"] == []
    assert data["total_words_count"] == 0
    assert data["total_xp_earned"] == 0


@pytest.mark.asyncio
async def test_sync_progress_merges_and_persists():
    """Syncing discovered words and stages updates Firestore progress and player profile."""
    headers = {"Authorization": "Bearer mock-token-progress-sync-tester"}
    now_iso = datetime.now(timezone.utc).isoformat()

    payload = {
        "unlocked_levels": [1, 2],
        "cleared_stages": ["1:1", "1:2"],
        "discovered_words": {
            "1:1": [
                {"word": "BAT", "xp_awarded": 20, "discovered_at": now_iso},
                {"word": "CAT", "xp_awarded": 20, "discovered_at": now_iso},
                {"word": "HAT", "xp_awarded": 20, "discovered_at": now_iso},
            ],
            "1:2": [
                {"word": "PIN", "xp_awarded": 20, "discovered_at": now_iso},
                {"word": "BIN", "xp_awarded": 20, "discovered_at": now_iso},
                {"word": "TIN", "xp_awarded": 20, "discovered_at": now_iso},
            ],
        },
        "new_xp_delta": 120,
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post(
            "/api/v1/games/word_blanks/progress",
            headers=headers,
            json=payload,
        )
    assert res.status_code == 200
    res_data = res.json()
    assert res_data["success"] is True
    assert res_data["synced_stages_count"] == 2
    assert res_data["synced_words_count"] == 6
    assert res_data["total_xp"] == 120
    assert res_data["updated_profile"]["stats"]["total_xp"] == 120
    assert res_data["updated_profile"]["stats"]["word_blanks_cleared"] == 2

    # Verify subsequent GET returns the persisted data
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        get_res = await ac.get("/api/v1/games/word_blanks/progress", headers=headers)
    assert get_res.status_code == 200
    get_data = get_res.json()
    assert get_data["unlocked_levels"] == [1, 2]
    assert get_data["cleared_stages"] == ["1:1", "1:2"]
    assert get_data["total_words_count"] == 6
    assert len(get_data["discovered_words"]["1:1"]) == 3


@pytest.mark.asyncio
async def test_get_progress_unknown_game():
    """Requesting an unregistered game engine yields 404."""
    headers = {"Authorization": "Bearer mock-token-tester"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/v1/games/non_existent_engine/progress", headers=headers)
    assert res.status_code == 404
