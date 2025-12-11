from pydantic import BaseModel
from typing import List

class POItem(BaseModel):
    product_id: str
    quantity: int
    unit_price: float

class PurchaseOrder(BaseModel):
    vendor_id: str
    items: List[POItem]