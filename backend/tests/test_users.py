"""Test Suite for User Authentication, Profile Management, and Guest Migration."""

import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_auth_me_unauthorized_without_token():
    """Requests to /auth/me without an Authorization header must yield 401."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert "detail" in response.json()


@pytest.mark.asyncio
async def test_auth_me_success_with_valid_bearer_token():
    """Requests with a valid bearer token should return a complete UserProfile."""
    headers = {"Authorization": "Bearer mock-token-test-user-42"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["uid"] == "test-user-42"
    assert data["is_anonymous"] is False
    assert "stats" in data
    assert "preferences" in data
    assert data["stats"]["total_xp"] >= 0


@pytest.mark.asyncio
async def test_auth_me_with_anonymous_guest_token():
    """Requests with an anonymous guest token should reflect is_anonymous: True."""
    headers = {"Authorization": "Bearer mock-guest-token"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["is_anonymous"] is True
    assert data["display_name"] == "Guest Learner"


@pytest.mark.asyncio
async def test_update_profile_success():
    """Authenticated user can update their display name and preferences."""
    headers = {"Authorization": "Bearer mock-token-profile-tester"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        update_res = await ac.patch(
            "/api/v1/users/profile",
            headers=headers,
            json={
                "display_name": "Arjun Sharma",
                "preferences": {"theme": "dark", "sound": False},
            },
        )
    assert update_res.status_code == 200
    updated_data = update_res.json()
    assert updated_data["display_name"] == "Arjun Sharma"
    assert updated_data["preferences"]["theme"] == "dark"
    assert updated_data["preferences"]["sound"] is False


@pytest.mark.asyncio
async def test_update_profile_invalid_display_name():
    """Submitting a 1-character display name should trigger 422 Unprocessable Entity."""
    headers = {"Authorization": "Bearer mock-token-profile-tester-2"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.patch(
            "/api/v1/users/profile",
            headers=headers,
            json={"display_name": "A"},
        )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_migrate_guest_session_success():
    """Migrates guest XP, streaks, and cleared stages into user profile."""
    headers = {"Authorization": "Bearer mock-token-migrator-1"}
    migration_payload = {
        "total_xp": 240,
        "current_streak": 4,
        "cleared_stages_count": 6,
        "discovered_words_summary": ["BAT", "CAT", "HAT"],
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post(
            "/api/v1/users/migrate-guest-data",
            headers=headers,
            json=migration_payload,
        )
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    assert body["migrated_xp"] == 240
    assert body["migrated_stages"] == 6
    assert body["updated_profile"]["stats"]["total_xp"] == 240
    assert body["updated_profile"]["stats"]["current_streak"] == 4
    assert body["updated_profile"]["stats"]["word_blanks_cleared"] == 6
