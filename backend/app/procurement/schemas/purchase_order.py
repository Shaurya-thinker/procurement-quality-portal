from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict, field_serializer


class POStatus(str, Enum):
    """Purchase Order status enumeration."""
    DRAFT = "DRAFT"
    SENT = "SENT"
    CANCELLED = "CANCELLED"


class PurchaseOrderLineCreate(BaseModel):
    """Schema for creating a purchase order line."""
    
    item_id: int = Field(..., gt=0, description="Item ID")
    quantity: int = Field(..., gt=0, description="Quantity of items")
    price: Decimal = Field(..., decimal_places=2, description="Unit price")


class PurchaseOrderLineRead(BaseModel):
    """Schema for reading a purchase order line."""
    
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    po_id: int
    item_id: int
    quantity: int
    price: Decimal
    
    @field_serializer("price")
    def serialize_price(self, value: Decimal) -> str:
        """Serialize Decimal price to string for JSON compatibility."""
        return str(value)


class PurchaseOrderCreate(BaseModel):
    """Schema for creating a purchase order."""
    
    vendor_id: int = Field(..., gt=0, description="Vendor ID")
    lines: List[PurchaseOrderLineCreate] = Field(
        ...,
        min_length=1,
        description="List of purchase order lines"
    )


class PurchaseOrderRead(BaseModel):
    """Schema for reading a purchase order."""
    
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    po_number: str
    vendor_id: int
    status: POStatus
    created_at: datetime
    lines: List[PurchaseOrderLineRead]


class PurchaseOrderTracking(BaseModel):
    """Consolidated PO tracking summary combining procurement, material receipt, and QC."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    po_number: str
    status: POStatus
    material_receipt_status: Optional[str] = None
    qc_accepted_quantity: Optional[int] = 0
    qc_rejected_quantity: Optional[int] = 0


class PurchaseOrderUpdate(BaseModel):
    """Schema for updating a purchase order (DRAFT only)."""

    vendor_id: Optional[int] = Field(None, gt=0, description="Vendor ID")
    lines: Optional[List[PurchaseOrderLineCreate]] = Field(
        None,
        description="Optional list of purchase order lines to replace existing lines"
    )

class PurchaseOrderLineDetailRead(BaseModel):
    item_id: int
    item_code: str
    item_description: str
    unit: str
    quantity: int
    rate: Decimal


class PurchaseOrderDetailRead(BaseModel):
    id: int
    po_number: str
    vendor_id: int
    status: POStatus
    created_at: datetime
    line_items: list[PurchaseOrderLineDetailRead]

