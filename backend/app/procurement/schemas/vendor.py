from pydantic import BaseModel, ConfigDict
from typing import Optional


class VendorRead(BaseModel):
    """Schema for reading vendor information (read-only)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    contact: Optional[str] = None
    status: Optional[str] = "ACTIVE"
