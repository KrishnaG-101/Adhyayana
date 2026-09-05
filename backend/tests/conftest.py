"""Pytest configuration and shared test fixtures."""

import sys
from pathlib import Path
from typing import AsyncGenerator

import httpx
from httpx import ASGITransport
import pytest_asyncio

# Ensure backend directory is in sys.path for test resolution
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app  # noqa: E402


@pytest_asyncio.fixture
async def async_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Reusable asynchronous HTTP test client with ASGI transport."""
    transport = ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
