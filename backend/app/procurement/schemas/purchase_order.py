from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict, field_serializer


class POStatus(str, Enum):
    """Purchase Order status enumeration."""
    DRAFT = "DRAFT"
    SENT = "SENT"


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
