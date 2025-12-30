from datetime import datetime
from typing import List
from pydantic import BaseModel


class GatePassCreate(BaseModel):
    inspection_id: int
    issued_by: str


class GatePassItemRead(BaseModel):
    id: int
    item_id: int
    accepted_quantity: int

    class Config:
        from_attributes = True  


class GatePassRead(BaseModel):
    id: int
    gate_pass_number: str
    po_id: int
    mr_id: int
    inspection_id: int
    issued_by: str
    issued_at: datetime
    store_status: str
    items: List[GatePassItemRead]

    class Config:
        from_attributes = True
