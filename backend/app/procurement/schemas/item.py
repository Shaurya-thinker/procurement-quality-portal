from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class ItemCreate(BaseModel):
    """Schema for creating an item."""
    
    name: str = Field(..., min_length=1, max_length=255, description="Item name")
    code: str = Field(..., min_length=1, max_length=100, description="Item code (unique)")
    unit: str = Field(..., min_length=1, max_length=50, description="Unit of measurement")
    description: Optional[str] = Field(None, description="Item description")


class ItemRead(BaseModel):
    """Schema for reading an item."""
    
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    code: str
    unit: str
    description: Optional[str]
