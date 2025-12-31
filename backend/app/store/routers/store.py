from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional, List
from app.store.services import StoreService
from app.store.schemas import (
    InventoryRead,
    StoreCreate,
    StoreRead,
    StoreUpdate,
    StoreDetailRead,
    BinCreate,
    BinRead,
)
from app.store.models.inventory import InventoryItem
from app.store.models.store import Store, Bin
from ...core.db import get_db

router = APIRouter(prefix="/api/v1/store", tags=["Store"])

@router.post("/receive-gate-pass/{gate_pass_id}")
def receive_gate_pass(
    gate_pass_id: int,
    db: Session = Depends(get_db)
):
    try:
        return StoreService.receive_gate_pass(db, gate_pass_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/stores/{store_id}/pending-gate-passes")
def get_pending_gate_passes(store_id: int, db: Session = Depends(get_db)):
    from app.quality.models.gate_pass import GatePass
    from app.quality.models.material_receipt import MaterialReceipt

    results = (
        db.query(
            GatePass.id,
            GatePass.gate_pass_number,
            MaterialReceipt.mr_number,
            MaterialReceipt.vendor_name,   # ✅ USE THIS
        )
        .join(MaterialReceipt, GatePass.mr_id == MaterialReceipt.id)
        .filter(MaterialReceipt.store_id == store_id)
        .filter(GatePass.store_status == "DISPATCHED")
        .all()
    )

    return [
        {
            "id": r.id,
            "gate_pass_number": r.gate_pass_number,
            "mr_number": r.mr_number,
            "vendor_name": r.vendor_name,
        }
        for r in results
    ]



@router.get("/inventory")
def get_inventory(
    store_id: Optional[int] = Query(None),
    bin_id: Optional[int] = Query(None),
    item_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = (
        db.query(
            InventoryItem.id,
            InventoryItem.item_id,
            InventoryItem.quantity,
            InventoryItem.store_id,
            Store.name.label("store_name"),
            InventoryItem.bin_id,
            Bin.bin_no.label("bin_no"),
            InventoryItem.created_at,
        )
        .join(Store, Store.id == InventoryItem.store_id)
        .join(Bin, Bin.id == InventoryItem.bin_id)
    )

    if store_id:
        query = query.filter(InventoryItem.store_id == store_id)
    if bin_id:
        query = query.filter(InventoryItem.bin_id == bin_id)
    if item_id:
        query = query.filter(InventoryItem.item_id == item_id)

    results = query.all()

    return [
        {
            "id": r.id,
            "item_id": r.item_id,
            "quantity": r.quantity,
            "store_id": r.store_id,
            "store_name": r.store_name,
            "bin_id": r.bin_id,
            "bin_no": r.bin_no,
            "created_at": r.created_at,
        }
        for r in results
    ]




@router.get("/inventory/{id}", response_model=InventoryRead)
def get_inventory_item(
    id: int,
    db: Session = Depends(get_db),
):
    """Get inventory item details by ID."""
    item = db.query(InventoryItem).filter(InventoryItem.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return item


# Store Management Endpoints

@router.post("/stores", response_model=StoreRead)
def create_store(
    store: StoreCreate,
    db: Session = Depends(get_db),
):
    """Create a new store."""
    try:
        return StoreService.create_store(db, store)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stores", response_model=List[StoreRead])
def list_stores(
    page: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    """List all stores with pagination."""
    return StoreService.get_all_stores(db, page * limit, limit)


@router.get("/stores/{store_id}", response_model=StoreDetailRead)
def get_store_details(
    store_id: int,
    db: Session = Depends(get_db),
):
    """Get store details including all bins."""
    store = StoreService.get_store_by_id(db, store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


@router.put("/stores/{store_id}", response_model=StoreRead)
def update_store(
    store_id: int,
    store_update: StoreUpdate,
    db: Session = Depends(get_db),
):
    """Update store information."""
    store = StoreService.update_store(db, store_id, store_update)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


@router.delete("/stores/{store_id}")
def delete_store(
    store_id: int,
    db: Session = Depends(get_db),
):
    """Delete a store and all its bins."""
    success = StoreService.delete_store(db, store_id)
    if not success:
        raise HTTPException(status_code=404, detail="Store not found")
    return {"message": "Store deleted successfully"}


@router.post("/stores/{store_id}/bins", response_model=BinRead)
def add_bin(
    store_id: int,
    bin_create: BinCreate,
    db: Session = Depends(get_db),
):
    """Add a bin to a store."""
    try:
        return StoreService.add_bin_to_store(db, store_id, bin_create)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stores/{store_id}/bins", response_model=List[BinRead])
def get_bins(
    store_id: int,
    db: Session = Depends(get_db),
):
    """Get all bins for a store."""
    store = StoreService.get_store_by_id(db, store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return StoreService.get_store_bins(db, store_id)
