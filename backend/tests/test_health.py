"""Tests for system health check endpoint and CORS middleware."""

import pytest
import httpx


@pytest.mark.asyncio
async def test_health_check_success(async_client: httpx.AsyncClient) -> None:
    """Verify GET /health returns HTTP 200 with expected service identity payload."""
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data == {
        "status": "healthy",
        "service": "adhyayana-backend",
        "version": "0.1.0",
    }


@pytest.mark.asyncio
async def test_cors_preflight_headers(async_client: httpx.AsyncClient) -> None:
    """Verify CORS middleware responds with proper access-control headers for allowed origins."""
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "authorization,content-type",
    }
    response = await async_client.options("/health", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert response.headers.get("access-control-allow-credentials") == "true"
