from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, Dict, Any, List
from app.store.models.inventory import InventoryItem
from app.store.models.store import Store
from app.store.models.inventory import InventoryItem
from app.store.models.store import Store, Bin
from app.store.schemas import InventoryRead, StoreCreate, StoreUpdate, BinCreate
from app.store.models.inventory_transaction import InventoryTransaction
from datetime import datetime
import uuid
from app.store.models.store import Store, Bin
from sqlalchemy import func
from app.procurement.models.purchase_order_line import PurchaseOrderLine
from app.store.models.material_dispatch import MaterialDispatch, MaterialDispatchLineItem, DispatchStatus

class StoreService:
    
    @staticmethod
    def receive_gate_pass(db: Session, gate_pass_id: int):
        from app.quality.models.gate_pass import GatePass
        from app.quality.models.material_receipt import MaterialReceipt

        # 1️⃣ Fetch Gate Pass
        gate_pass = db.query(GatePass).filter(
            GatePass.id == gate_pass_id
        ).first()

        if not gate_pass:
            raise ValueError("Gate Pass not found")

        if gate_pass.store_status == "RECEIVED":
            raise ValueError("Gate Pass already received into store")

        # 2️⃣ Fetch MR for location
        mr = db.query(MaterialReceipt).filter(
            MaterialReceipt.id == gate_pass.mr_id
        ).first()

        if not mr:
            raise ValueError("Material Receipt not found")

        
        # 2️⃣ Validate Store exists
        store = db.query(Store).filter(Store.id == mr.store_id).first()
        if not store:
            raise ValueError("Invalid Store assigned in Material Receipt")


        # 3️⃣ Receive inventory (IN)
        for item in gate_pass.items:
            received_qty = int(item.accepted_quantity)

            inventory = (
                db.query(InventoryItem)
                .filter(
                    InventoryItem.item_id == item.item_id,
                    InventoryItem.store_id == mr.store_id,
                    InventoryItem.bin_id == mr.bin_id, 
                )
                .with_for_update()
                .first()
            )

            if inventory:
                inventory.quantity += received_qty
            else:
                inventory = InventoryItem(
                    item_id=item.item_id,
                    store_id=mr.store_id,
                    bin_id=mr.bin_id,
                    quantity=received_qty,
                    gate_pass_id=gate_pass.id
                )
                db.add(inventory)
                db.flush()

            # 🔹 INVENTORY TRANSACTION (IN)
            txn = InventoryTransaction(
                inventory_item_id=inventory.id,
                transaction_type="IN",
                quantity=received_qty,
                reference_type="GATE_PASS",
                reference_id=gate_pass.id,
                remarks="Material received into store",
                created_by="system"
            )
            db.add(txn)


        # 4️⃣ Lock gate pass
        gate_pass.store_status = "RECEIVED"

        db.commit()

        return {
            "message": "Inventory received successfully",
            "gate_pass_id": gate_pass.id
        }
    
    @staticmethod
    def get_inventory(db: Session, filters: Optional[Dict[str, Any]] = None, 
                     skip: int = 0, limit: int = 100) -> List[InventoryItem]:
        """Get inventory items with optional filtering and pagination."""
        query = db.query(InventoryItem)
        
        if filters:
            if "item_id" in filters:
                query = query.filter(InventoryItem.item_id == filters["item_id"])
            if "location" in filters:
                query = query.filter(InventoryItem.location == filters["location"])
        
        return query.offset(skip).limit(limit).all()


    @staticmethod
    def create_store(db: Session, store_create: StoreCreate) -> Store:
        """Create a new store with basic information."""
        # Check if store_id already exists
        existing = db.query(Store).filter(Store.store_id == store_create.store_id).first()
        if existing:
            raise ValueError(f"Store with ID {store_create.store_id} already exists")

        store = Store(**store_create.model_dump())
        db.add(store)
        db.commit()
        db.refresh(store)
        return store

    @staticmethod
    def get_all_stores(db: Session, skip: int = 0, limit: int = 100) -> List[Store]:
        """Get all stores with pagination."""
        return db.query(Store).offset(skip).limit(limit).all()

    @staticmethod
    def get_store_by_id(db: Session, store_id: int) -> Optional[Store]:
        """Get store details by ID including all bins."""
        return db.query(Store).filter(Store.id == store_id).first()

    @staticmethod
    def update_store(db: Session, store_id: int, store_update: StoreUpdate) -> Optional[Store]:
        """Update store information."""
        store = db.query(Store).filter(Store.id == store_id).first()
        if not store:
            return None

        update_data = store_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(store, field, value)

        db.commit()
        db.refresh(store)
        return store

    @staticmethod
    def delete_store(db: Session, store_id: int) -> bool:
        """Delete a store and all its bins."""
        store = db.query(Store).filter(Store.id == store_id).first()
        if not store:
            return False

        db.delete(store)
        db.commit()
        return True

    @staticmethod
    def add_bin_to_store(db: Session, store_id: int, bin_create: BinCreate) -> Bin:
        """Add a bin to a store."""
        store = db.query(Store).filter(Store.id == store_id).first()
        if not store:
            raise ValueError("Store not found")

        bin_item = Bin(store_id=store_id, **bin_create.model_dump())
        db.add(bin_item)
        db.commit()
        db.refresh(bin_item)
        return bin_item

    @staticmethod
    def get_store_bins(db: Session, store_id: int) -> List[Bin]:
        """Get all bins for a store."""
        return db.query(Bin).filter(Bin.store_id == store_id).all()

    @staticmethod
    def get_po_pending_items(db: Session, po_id: int):
        """
        Returns PO items with pending quantity.
        pending = ordered - dispatched
        """

        # 1️⃣ Get PO lines
        po_lines = (
            db.query(
                PurchaseOrderLine.item_id,
                PurchaseOrderLine.quantity.label("ordered_qty"),
            )
            .filter(PurchaseOrderLine.po_id == po_id)
            .all()
        )

        if not po_lines:
            return []

        # 2️⃣ Get already dispatched qty per item
        dispatched = (
            db.query(
                MaterialDispatchLineItem.item_id,
                func.coalesce(func.sum(MaterialDispatchLineItem.quantity_dispatched), 0)
                .label("dispatched_qty")
            )
            .join(MaterialDispatch)
            .filter(
                MaterialDispatch.reference_type == "PO",
                MaterialDispatch.reference_id == str(po_id),
                MaterialDispatch.dispatch_status == DispatchStatus.DISPATCHED
            )
            .group_by(MaterialDispatchLineItem.item_id)
            .all()
        )

        dispatched_map = {
            d.item_id: float(d.dispatched_qty) for d in dispatched
        }

        # 3️⃣ Build response
        result = []
        for line in po_lines:
            pending = float(line.ordered_qty) - dispatched_map.get(line.item_id, 0)
            if pending > 0:
                result.append({
                    "item_id": line.item_id,
                    "ordered_qty": float(line.ordered_qty),
                    "dispatched_qty": dispatched_map.get(line.item_id, 0),
                    "pending_qty": pending
                })

        return result