"""Adhyayana FastAPI Main Application Entrypoint.

Configures ASGI middleware, root health probe, and versioned API routers.
"""

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.schemas.health import HealthCheckResponse
from app.api.v1.router import api_v1_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Cross-Origin Resource Sharing (CORS) Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/health",
    response_model=HealthCheckResponse,
    status_code=status.HTTP_200_OK,
    tags=["System"],
    summary="System Health Probe",
    description="Returns the operational health and identity of the Adhyayana backend service.",
)
async def health_check() -> HealthCheckResponse:
    """Returns service health status, name, and current version."""
    return HealthCheckResponse(
        status="healthy",
        service="adhyayana-backend",
        version=settings.VERSION,
    )


# Mount versioned API v1 routes
app.include_router(api_v1_router)
