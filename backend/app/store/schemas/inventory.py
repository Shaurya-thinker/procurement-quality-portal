from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class InventoryCreate(BaseModel):
    item_id: int
    quantity: int
    location: str
    source_reference: Optional[str] = None  # inspection_id or accepted_material_id


class InventoryRead(BaseModel):
    id: int
    item_id: int
    quantity: int
    location: str
    source_reference: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
