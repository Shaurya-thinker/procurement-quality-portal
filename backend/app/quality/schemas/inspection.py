from typing import List
from datetime import datetime
from pydantic import BaseModel, Field


# ---------- Line Item ----------

class InspectionLineCreate(BaseModel):
    mr_line_id: int
    accepted_quantity: int = Field(ge=0)
    rejected_quantity: int = Field(ge=0)


class InspectionLineRead(InspectionLineCreate):
    id: int

    class Config:
        from_attributes = True


# ---------- Inspection ----------

class InspectionCreate(BaseModel):
    mr_id: int
    inspected_by: str
    remarks: str | None = None
    lines: List[InspectionLineCreate]


class InspectionRead(BaseModel):
    id: int
    mr_id: int
    inspected_by: str
    remarks: str | None
    inspected_at: datetime
    result: str

    lines: List[InspectionLineRead]

    class Config:
        from_attributes = True
