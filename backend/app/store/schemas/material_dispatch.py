from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import List, Optional
from decimal import Decimal
from app.store.models.material_dispatch import DispatchStatus, ReferenceType    

class MaterialDispatchLineItemCreate(BaseModel):
    inventory_item_id: int = Field(..., gt=0)
    item_id: int = Field(..., gt=0)
    item_code: str = Field(..., min_length=1, max_length=50)
    item_name: str = Field(..., min_length=1, max_length=200)
    quantity_dispatched: Decimal = Field(..., gt=0)
    uom: str = Field(..., min_length=1, max_length=20)
    batch_number: Optional[str] = Field(None, max_length=50)
    remarks: Optional[str] = None

class MaterialDispatchLineItemRead(BaseModel):
    id: int
    dispatch_id: int
    item_id: int
    item_code: str
    item_name: str
    quantity_dispatched: Decimal
    uom: str
    batch_number: Optional[str]
    remarks: Optional[str]
    created_at: datetime
    updated_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class MaterialDispatchCreate(BaseModel):
    # Dispatch Header
    dispatch_date: datetime
    reference_type: ReferenceType
    reference_id: str = Field(..., min_length=1, max_length=50)
    warehouse_id: int = Field(..., gt=0)
    created_by: str = Field(..., min_length=1, max_length=100)
    remarks: Optional[str] = None
    
    is_draft: bool = False

    # Receiver & Transport
    receiver_name: str = Field(..., min_length=1, max_length=200)
    receiver_contact: str = Field(..., min_length=1, max_length=20)
    delivery_address: str = Field(..., min_length=1)
    vehicle_number: str = Field(..., min_length=1, max_length=20)
    driver_name: str = Field(..., min_length=1, max_length=100)
    driver_contact: str = Field(..., min_length=1, max_length=20)
    eway_bill_number: Optional[str] = Field(None, max_length=50)
    
    # Line Items
    line_items: List[MaterialDispatchLineItemCreate] = Field(..., min_items=1)
    
    @validator('line_items')
    def validate_line_items(cls, v):
        if not v or len(v) == 0:
            raise ValueError('At least one line item is required')
        return v

class MaterialDispatchRead(BaseModel):
    id: int
    dispatch_number: str
    dispatch_date: datetime
    dispatch_status: DispatchStatus
    reference_type: ReferenceType
    reference_id: str
    warehouse_id: int
    created_by: str
    remarks: Optional[str]
    
    # Receiver & Transport
    receiver_name: str
    receiver_contact: str
    delivery_address: str
    vehicle_number: str
    driver_name: str
    driver_contact: str
    eway_bill_number: Optional[str]
    
    # Line Items
    line_items: List[MaterialDispatchLineItemRead]
    
    # Audit Fields
    created_at: datetime
    updated_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class MaterialDispatchUpdate(BaseModel):
    dispatch_status: Optional[DispatchStatus] = None
    remarks: Optional[str] = None
