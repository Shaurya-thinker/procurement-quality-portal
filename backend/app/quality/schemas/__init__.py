from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, List
from ..models import ReceiptStatus

class MaterialReceiptCreate(BaseModel):
    po_id: int = Field(..., gt=0)
    vendor_id: int = Field(..., gt=0)
    received_by: str = Field(..., min_length=1, max_length=100)

class MaterialReceiptRead(BaseModel):
    id: int
    po_id: int
    vendor_id: int
    received_at: datetime
    received_by: str
    status: ReceiptStatus
    
    model_config = {"from_attributes": True}

class QualityInspectionCreate(BaseModel):
    material_receipt_id: int = Field(..., gt=0)
    inspector_name: str = Field(..., min_length=1, max_length=100)
    total_quantity: int = Field(..., ge=0)
    accepted_quantity: int = Field(..., ge=0)
    rejected_quantity: int = Field(..., ge=0)
    remarks: Optional[str] = None
    
    @field_validator('accepted_quantity', 'rejected_quantity')
    @classmethod
    def validate_quantities(cls, v):
        if v < 0:
            raise ValueError('Quantities must be non-negative')
        return v
    
    def model_post_init(self, __context):
        if self.accepted_quantity + self.rejected_quantity != self.total_quantity:
            raise ValueError('accepted_quantity + rejected_quantity must equal total_quantity')

class QualityInspectionRead(BaseModel):
    id: int
    material_receipt_id: int
    inspected_at: datetime
    inspector_name: str
    total_quantity: int
    accepted_quantity: int
    rejected_quantity: int
    remarks: Optional[str]
    
    model_config = {"from_attributes": True}

class QualityChecklistCreate(BaseModel):
    inspection_id: int = Field(..., gt=0)
    visual_inspection: bool = False
    dimension_check: bool = False
    weight_check: bool = False
    color_check: bool = False
    packaging_check: bool = False
    documentation_check: bool = False
    additional_notes: Optional[str] = None

class QualityChecklistRead(BaseModel):
    id: int
    inspection_id: int
    visual_inspection: bool
    dimension_check: bool
    weight_check: bool
    color_check: bool
    packaging_check: bool
    documentation_check: bool
    additional_notes: Optional[str]
    
    model_config = {"from_attributes": True}

class QualitySheetCreate(BaseModel):
    inspection_id: int = Field(..., gt=0)
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    batch_number: Optional[str] = Field(None, max_length=50)
    expiry_date: Optional[str] = Field(None, max_length=20)
    supplier_certificate: Optional[str] = Field(None, max_length=100)
    test_results: Optional[str] = None
    compliance_status: Optional[str] = Field(None, max_length=20)

class QualitySheetRead(BaseModel):
    id: int
    inspection_id: int
    temperature: Optional[float]
    humidity: Optional[float]
    batch_number: Optional[str]
    expiry_date: Optional[str]
    supplier_certificate: Optional[str]
    test_results: Optional[str]
    compliance_status: Optional[str]
    
    model_config = {"from_attributes": True}

__all__ = [
    "MaterialReceiptCreate",
    "MaterialReceiptRead",
    "QualityInspectionCreate",
    "QualityInspectionRead",
    "QualityChecklistCreate",
    "QualityChecklistRead",
    "QualitySheetCreate",
    "QualitySheetRead",
    "ReceiptStatus",
]
