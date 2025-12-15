from typing import Optional
import traceback
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend.app.procurement.schemas import (
    PurchaseOrderCreate,
    PurchaseOrderRead,
    PurchaseOrderUpdate,
    POStatus,
)
from backend.app.procurement.schemas import VendorRead
from backend.app.procurement.schemas import PurchaseOrderTracking
from backend.app.procurement.services import ProcurementService


# Minimal dependency for token validation (can be enhanced later)
def get_db() -> Session:
    """
    Get database session dependency.
    Replace with actual DB connection from app.core.db when available.
    """
    # TODO: Import from app.core.db once implemented
    # This will be overridden in tests or main app initialization
    raise NotImplementedError("Database session not yet configured. Override this dependency in your FastAPI app.")


async def require_procurement_token(token: Optional[str] = None) -> str:
    """
    Minimal token validation dependency for procurement endpoints.
    Replace with actual auth from app.core.dependencies when available.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token required"
        )
    # TODO: Add actual token validation when auth is configured in core
    return token


router = APIRouter(
    prefix="/api/v1/procurement",
    tags=["Procurement"],
)


@router.post(
    "/",
    response_model=PurchaseOrderRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new purchase order"
)
def create_purchase_order(
    po_create: PurchaseOrderCreate,
    db: Session = Depends(get_db),
    token: str = Depends(require_procurement_token),
) -> PurchaseOrderRead:
    """
    Create a new purchase order with line items.
    
    **Request body:**
    - vendor_id: Vendor ID (required, > 0)
    - lines: List of line items with item_id, quantity, and price
    
    **Returns:** Created purchase order with ID and po_number
    """
    try:
        return ProcurementService.create_purchase_order(db, po_create)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        print(f"DEBUG Error: {e}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create purchase order"
        )


@router.get(
    "/",
    response_model=dict,
    summary="List purchase orders"
)
def list_purchase_orders(
    status_filter: Optional[POStatus] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
    token: str = Depends(require_procurement_token),
) -> dict:
    """
    List purchase orders with pagination and optional status filtering.
    
    **Query parameters:**
    - status: Filter by PO status (DRAFT or SENT) - optional
    - page: Page number (default: 1)
    - page_size: Items per page (default: 25, max: 100)
    
    **Returns:** List of purchase orders with pagination metadata
    """
    try:
        return ProcurementService.get_purchase_orders(
            db,
            status=status_filter,
            page=page,
            page_size=page_size
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve purchase orders"
        )


@router.get(
    "/{po_id}",
    response_model=PurchaseOrderRead,
    summary="Get purchase order details"
)
def get_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(require_procurement_token),
) -> PurchaseOrderRead:
    """
    Get detailed information about a specific purchase order.
    
    **Path parameters:**
    - po_id: Purchase order ID
    
    **Returns:** Full purchase order details including all line items
    """
    try:
        return ProcurementService.get_purchase_order(db, po_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve purchase order"
        )


@router.post(
    "/{po_id}/send",
    response_model=PurchaseOrderRead,
    summary="Send purchase order"
)
def send_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(require_procurement_token),
) -> PurchaseOrderRead:
    """
    Send a purchase order (mark as SENT).
    
    **Path parameters:**
    - po_id: Purchase order ID
    
    **Returns:** Updated purchase order with status=SENT
    
    **Note:** Idempotent - will reject if already sent
    """
    try:
        return ProcurementService.send_purchase_order(db, po_id)
    except ValueError as e:
        # Distinguish between not found (404) and other validation errors (400)
        if "not found" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send purchase order"
        )


@router.put(
    "/{po_id}",
    response_model=PurchaseOrderRead,
    summary="Update purchase order (DRAFT only)"
)
def update_purchase_order(
    po_id: int,
    po_update: PurchaseOrderUpdate,
    db: Session = Depends(get_db),
    token: str = Depends(require_procurement_token),
) -> PurchaseOrderRead:
    """
    Update a purchase order. Allowed only if status == DRAFT.
    """
    try:
        return ProcurementService.update_purchase_order(db, po_id, po_update)
    except ValueError as e:
        # Distinguish not found (404) vs validation/business errors (400)
        if "not found" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update purchase order"
        )


@router.get(
    "/vendors/{vendor_id}",
    response_model=VendorRead,
    summary="Get vendor details (read-only)"
)
def get_vendor(
    vendor_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(require_procurement_token),
) -> VendorRead:
    """
    Retrieve vendor details from the Vendor Portal (read-only).

    Procurement cannot create/update vendors; this endpoint only reads vendor info.
    """
    try:
        return ProcurementService.get_vendor_details(db, vendor_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve vendor details")


@router.get(
    "/{po_id}/tracking",
    response_model=PurchaseOrderTracking,
    summary="Get consolidated tracking information for a purchase order"
)
def get_po_tracking(
    po_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(require_procurement_token),
) -> PurchaseOrderTracking:
    """Return consolidated tracking view for a PO, reading quality tables (read-only)."""
    try:
        return ProcurementService.get_po_tracking_summary(db, po_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve tracking information")
