from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InventoryRead(BaseModel):
    id: int
    item_id: int
    quantity: int
    store_id: int
    bin_id: int
    gate_pass_id: int
    created_at: datetime

    class Config:
        from_attributes = True
