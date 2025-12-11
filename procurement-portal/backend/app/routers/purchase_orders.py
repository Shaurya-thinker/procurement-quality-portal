from fastapi import APIRouter
from app.models.purchase_order import PurchaseOrder

router = APIRouter()

@router.post("/po")
def create_purchase_order(po: PurchaseOrder):
    return {"po_id": "PO001", "status": "created", "total_amount": 0}