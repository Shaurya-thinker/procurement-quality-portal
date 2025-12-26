from typing import List, Optional
from datetime import datetime, date
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

    vendor_name: Optional[str] = None
    component_details: Optional[str] = None

    bill_no: Optional[str] = None
    entry_no: Optional[str] = None
    mr_reference_no: Optional[str] = None

    receipt_date: Optional[date] = None

    vehicle_no: Optional[str] = None
    challan_no: Optional[str] = None

    store_id: Optional[int] = None
    bin_id: Optional[int] = None

    remarks: Optional[str] = None

    lines: List[MaterialReceiptLineCreate]


class MaterialReceiptRead(BaseModel):
    id: int
    mr_number: str

    po_id: int
    vendor_id: int

    vendor_name: Optional[str] = None
    component_details: Optional[str] = None

    bill_no: Optional[str]
    entry_no: Optional[str]
    mr_reference_no: Optional[str]

    receipt_date: Optional[date]
    vehicle_no: Optional[str]
    challan_no: Optional[str]

    store_id: Optional[int]
    bin_id: Optional[int]


    remarks: Optional[str]
    received_at: datetime
    status: str
    lines: List[MaterialReceiptLineRead]

    class Config:
        from_attributes = True
