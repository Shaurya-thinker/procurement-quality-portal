from datetime import datetime
from pydantic import BaseModel


class GatePassCreate(BaseModel):
    inspection_id: int
    issued_by: str


class GatePassRead(BaseModel):
    id: int
    gate_pass_number: str
    po_id: int
    mr_id: int
    inspection_id: int
    issued_by: str
    issued_at: datetime

    class Config:
        from_attributes = True
