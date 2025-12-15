from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DispatchCreate(BaseModel):
    inventory_item_id: int
    quantity: int
    requested_by: str
    reference: Optional[str] = None


class DispatchRead(BaseModel):
    id: int
    inventory_item_id: int
    quantity: int
    requested_by: str
    dispatched_at: datetime
    reference: Optional[str]
    
    class Config:
        from_attributes = True