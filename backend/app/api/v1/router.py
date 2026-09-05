"""API v1 master router assembly.

Mounts feature routers and prepares puzzle engine endpoints.
"""

from fastapi import APIRouter
from app.core.config import settings

api_v1_router = APIRouter(prefix=settings.API_V1_STR)

# Placeholder sub-router for modular puzzle engines (primed for future puzzle plugins)
puzzles_router = APIRouter(prefix="/puzzles", tags=["Puzzles"])

api_v1_router.include_router(puzzles_router)
