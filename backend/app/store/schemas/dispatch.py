from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum

class DispatchType(str, Enum):
    INTERNAL = "INTERNAL"
    EXTERNAL = "EXTERNAL"

class DispatchStatus(str, Enum):
    DRAFT = "DRAFT"
    ISSUED = "ISSUED"
    CANCELLED = "CANCELLED"

class DispatchItemCreate(BaseModel):
    item_code: str
    item_name: str
    unit: str
    dispatch_qty: float
    batch_lot: str = ""
    rate: float = 0.0
    line_value: float = 0.0

class DispatchItemRead(BaseModel):
    id: int
    item_code: str
    item_name: str
    unit: str
    dispatch_qty: float
    batch_lot: Optional[str]
    rate: Optional[float]
    line_value: Optional[float]
    
    class Config:
        from_attributes = True

class DispatchCreate(BaseModel):
    dispatch_number: str
    dispatch_date: str
    dispatch_type: str  # Change to string
    store: str = ""
    department: str = ""
    vendor: str = ""
    project_site: str = ""
    issued_by: str
    received_by: str
    vehicle_number: str = ""
    gate_pass_number: str = ""
    remarks: str = ""
    items: List[DispatchItemCreate]
    action: str

class DispatchRead(BaseModel):
    id: int
    dispatch_number: str
    dispatch_date: datetime
    dispatch_type: DispatchType
    status: DispatchStatus
    store: Optional[str]
    department: Optional[str]
    vendor: Optional[str]
    project_site: Optional[str]
    issued_by: str
    received_by: str
    vehicle_number: Optional[str]
    gate_pass_number: Optional[str]
    remarks: Optional[str]
    total_value: Optional[float]
    created_at: datetime
    updated_at: datetime
    items: Optional[List[DispatchItemRead]] = []
    
    class Config:
        from_attributes = True