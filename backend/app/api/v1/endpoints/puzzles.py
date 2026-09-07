"""Endpoints for puzzle discovery, catalog exploration, and metadata retrieval."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.puzzles import PuzzleCatalogResponse, PuzzleMetadata
from app.services.catalog import CatalogService, get_catalog_service

router = APIRouter()


@router.get(
    "",
    response_model=PuzzleCatalogResponse,
    status_code=status.HTTP_200_OK,
    summary="List Puzzle Catalog",
    description="Retrieves the catalog of registered linguistic puzzle engines with progression levels and XP metadata.",
)
async def list_puzzles(
    catalog_service: CatalogService = Depends(get_catalog_service),
) -> PuzzleCatalogResponse:
    """Returns all available puzzle engines, difficulty tiers, and level ladders."""
    return catalog_service.get_catalog()


@router.get(
    "/{puzzle_id}",
    response_model=PuzzleMetadata,
    status_code=status.HTTP_200_OK,
    summary="Get Puzzle Metadata",
    description="Retrieves detailed catalog metadata and level progression for a specific puzzle identifier or slug.",
)
async def get_puzzle(
    puzzle_id: str,
    catalog_service: CatalogService = Depends(get_catalog_service),
) -> PuzzleMetadata:
    """Returns metadata for a specific puzzle, or 404 if not registered."""
    puzzle = catalog_service.get_puzzle_by_id(puzzle_id) or catalog_service.get_puzzle_by_slug(puzzle_id)
    if not puzzle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Puzzle with identifier '{puzzle_id}' was not found in the catalog.",
        )
    return puzzle
