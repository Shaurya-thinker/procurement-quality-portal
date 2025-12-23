from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.procurement.schemas import (
    PurchaseOrderCreate,
    PurchaseOrderRead,
    PurchaseOrderUpdate,
    POStatus,
)
from backend.app.procurement.schemas import VendorRead
from backend.app.procurement.schemas import PurchaseOrderTracking
from backend.app.procurement.services import ProcurementService
from backend.app.procurement.schemas.purchase_order import PurchaseOrderDetailRead
from backend.app.procurement.models import Item
from backend.app.procurement.schemas.item import ItemRead

router = APIRouter(prefix="/api/v1/procurement", tags=["Procurement"])


@router.post("/", response_model=PurchaseOrderRead, summary="Create Purchase Order")
def create_purchase_order(
    po_data: PurchaseOrderCreate,
    db: Session = Depends(get_db),
) -> dict:
    """Create a new purchase order."""
    try:
        return ProcurementService.create_purchase_order(db, po_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/items", response_model=list[ItemRead], summary="List Items")
def list_items(db: Session = Depends(get_db)):
    return db.query(Item).all()

@router.get("/", response_model=list[PurchaseOrderRead], summary="List Purchase Orders")
def list_purchase_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list:
    """List all purchase orders with pagination."""
    try:
        page = (skip // limit) + 1 if limit > 0 else 1
        result = ProcurementService.get_purchase_orders(db, status=None, page=page, page_size=limit)
        return result["items"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{po_id}", response_model=PurchaseOrderDetailRead, summary="Get Purchase Order Details")
def get_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
) -> dict:
    """Get details of a specific purchase order."""
    try:
        po = ProcurementService.get_purchase_order(db, po_id)
        if not po:
            raise HTTPException(status_code=404, detail="Purchase order not found")
        return po
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{po_id}", response_model=PurchaseOrderRead, summary="Update Purchase Order")
def update_purchase_order(
    po_id: int,
    po_update: PurchaseOrderUpdate,
    db: Session = Depends(get_db),
) -> dict:
    """Update a purchase order (only DRAFT orders can be updated)."""
    try:
        po = ProcurementService.update_purchase_order(db, po_id, po_update)
        if not po:
            raise HTTPException(status_code=404, detail="Purchase order not found")
        return po
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{po_id}/cancel", response_model=PurchaseOrderRead, summary="Cancel Purchase Order")
def cancel_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
):
    """Cancel a purchase order (DRAFT or SENT only)."""
    try:
        return ProcurementService.cancel_purchase_order(db, po_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{po_id}/send", response_model=PurchaseOrderRead, summary="Send Purchase Order")
def send_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
) -> dict:
    """Send a purchase order for approval."""
    try:
        po = ProcurementService.send_purchase_order(db, po_id)
        if not po:
            raise HTTPException(status_code=404, detail="Purchase order not found")
        return po
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/vendor/{vendor_id}", response_model=list[PurchaseOrderRead], summary="Get POs by Vendor")
def get_pos_by_vendor(
    vendor_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list:
    """Get all purchase orders for a specific vendor."""
    try:
        return ProcurementService.get_purchase_orders_by_vendor(db, vendor_id, skip, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/vendors/{vendor_id}", response_model=VendorRead)
def get_vendor_details(vendor_id: int):
    """
    TEMP: Vendor data is owned by Vendor Service.
    Procurement only references vendor_id.
    """
    return {
        "id": vendor_id,
        "name": f"Vendor #{vendor_id}",
        "contact": None,
        "status": "ACTIVE"
    }



@router.get("/{po_id}/tracking", response_model=PurchaseOrderTracking, summary="Track Purchase Order")
def get_po_tracking(
    po_id: int,
    db: Session = Depends(get_db),
) -> dict:
    """Get tracking information for a purchase order."""
    try:
        tracking = ProcurementService.get_po_tracking_summary(db, po_id)
        if not tracking:
            raise HTTPException(status_code=404, detail="Tracking information not found")
        return tracking
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

