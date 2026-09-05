"""Health check schema definition."""

from pydantic import BaseModel, ConfigDict, Field


class HealthCheckResponse(BaseModel):
    """Payload returned by the server health probe endpoint."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    status: str = Field(default="healthy", description="Overall service status indicator")
    service: str = Field(default="adhyayana-backend", description="Backend service identifier")
    version: str = Field(default="0.1.0", description="Current semantic release version")
