from typing import List
from datetime import datetime
from pydantic import BaseModel, Field


# ---------- Line Item ----------

class MaterialReceiptLineCreate(BaseModel):
    po_line_id: int
    received_quantity: int = Field(gt=0)


class MaterialReceiptLineRead(MaterialReceiptLineCreate):
    id: int

    class Config:
        from_attributes = True


# ---------- Material Receipt ----------

class MaterialReceiptCreate(BaseModel):
    po_id: int
    vendor_id: int

    vehicle_no: str | None = None
    challan_no: str | None = None

    lines: List[MaterialReceiptLineCreate]


class MaterialReceiptRead(BaseModel):
    id: int
    mr_number: str
    po_id: int
    vendor_id: int

    vehicle_no: str | None
    challan_no: str | None

    received_at: datetime
    status: str

    lines: List[MaterialReceiptLineRead]

    class Config:
        from_attributes = True
