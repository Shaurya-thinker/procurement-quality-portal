from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InventoryRead(BaseModel):
    id: int
    item_id: int
    quantity: int

    store_id: int
    store_name: str

    bin_id: int
    bin_no: str

    gate_pass_id: int
    created_at: datetime

    class Config:
        from_attributes = True
