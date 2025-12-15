from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from ..services import StoreService
from ..schemas import InventoryCreate, InventoryRead, DispatchCreate, DispatchRead
from ..models import InventoryItem
from ...core.dependencies import get_db, require_store_role

router = APIRouter(prefix="/api/v1/store", tags=["Store"])


@router.post("/inventory", response_model=InventoryRead)
def add_inventory(
    inventory: InventoryCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_store_role)
):
    """Add or receive inventory items."""
    try:
        return StoreService.add_inventory(db, inventory)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/inventory", response_model=List[InventoryRead])
def get_inventory(
    item_id: Optional[int] = Query(None),
    location: Optional[str] = Query(None),
    page: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    _: None = Depends(require_store_role)
):
    """List inventory items with optional filtering and pagination."""
    filters = {}
    if item_id:
        filters["item_id"] = item_id
    if location:
        filters["location"] = location
    
    return StoreService.get_inventory(db, filters, page * limit, limit)


@router.get("/inventory/{id}", response_model=InventoryRead)
def get_inventory_item(
    id: int,
    db: Session = Depends(get_db),
    _: None = Depends(require_store_role)
):
    """Get inventory item details by ID."""
    item = db.query(InventoryItem).filter(InventoryItem.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return item


@router.post("/dispatch", response_model=DispatchRead)
def dispatch_item(
    dispatch: DispatchCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_store_role)
):
    """Dispatch items from inventory to requesters."""
    try:
        return StoreService.dispatch_item(db, dispatch)
    except ValueError as e:
        if "not found" in str(e):
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dispatches", response_model=List[DispatchRead])
def get_dispatches(
    inventory_item_id: Optional[int] = Query(None),
    requested_by: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _: None = Depends(require_store_role)
):
    """List dispatch records with optional filtering."""
    filters = {}
    if inventory_item_id:
        filters["inventory_item_id"] = inventory_item_id
    if requested_by:
        filters["requested_by"] = requested_by
    
    return StoreService.get_dispatches(db, filters)
