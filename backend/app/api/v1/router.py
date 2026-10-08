"""API v1 master router assembly.

Mounts feature routers and prepares puzzle engine endpoints.
"""

from fastapi import APIRouter
from app.core.config import settings
from app.api.v1.endpoints.puzzles import router as puzzles_router
from app.api.v1.endpoints.word_blanks import router as word_blanks_router

api_v1_router = APIRouter(prefix=settings.API_V1_STR)

# Mount puzzle catalog and engine routers
api_v1_router.include_router(puzzles_router, prefix="/puzzles", tags=["Puzzles"])
api_v1_router.include_router(
    word_blanks_router, prefix="/puzzles/word-blanks", tags=["Word Blanks Engine"]
)
