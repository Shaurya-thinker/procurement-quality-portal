import random
import string
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.store.models.material_dispatch import MaterialDispatch, MaterialDispatchLineItem, DispatchStatus, ReferenceType
from app.store.schemas.material_dispatch import MaterialDispatchCreate, MaterialDispatchRead, MaterialDispatchUpdate
from sqlalchemy.exc import IntegrityError
from app.store.models.inventory import InventoryItem
from app.store.models.inventory_transaction import InventoryTransaction
from app.store.services.store_service import StoreService



class MaterialDispatchService:
    
    @staticmethod
    def _generate_dispatch_number() -> str:
        """Generate unique dispatch number"""
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"MD-{timestamp}-{random_suffix}"
    
    @staticmethod
    def create_material_dispatch(db: Session, dispatch_create: MaterialDispatchCreate):
        try:
            db.begin()

            dispatch = MaterialDispatch(
                dispatch_number=MaterialDispatchService._generate_dispatch_number(),
                dispatch_date=dispatch_create.dispatch_date,
                dispatch_status = DispatchStatus.DRAFT,

                reference_type=dispatch_create.reference_type,
                reference_id=dispatch_create.reference_id,
                warehouse_id=dispatch_create.warehouse_id,
                created_by=dispatch_create.created_by,
                remarks=dispatch_create.remarks,
                receiver_name=dispatch_create.receiver_name,
                receiver_contact=dispatch_create.receiver_contact,
                delivery_address=dispatch_create.delivery_address,
                vehicle_number=dispatch_create.vehicle_number,
                driver_name=dispatch_create.driver_name,
                driver_contact=dispatch_create.driver_contact,
            )

            db.add(dispatch)
            db.flush()

            for line in dispatch_create.line_items:
                inventory = (
                    db.query(InventoryItem)
                    .filter(InventoryItem.id == line.inventory_item_id)
                    .with_for_update()
                    .first()
                )

                if not inventory:
                    raise ValueError(
                        f"Inventory item not found (ID: {line.inventory_item_id})"
                    )

                # ✅ ALWAYS create line item (draft or issued)
                dispatch_line = MaterialDispatchLineItem(
                    dispatch_id=dispatch.id,
                    inventory_item_id=inventory.id,
                    item_id=line.item_id,
                    item_code=line.item_code,
                    item_name=line.item_name,
                    quantity_dispatched=line.quantity_dispatched,
                    uom=line.uom,
                    batch_number=line.batch_number,
                    remarks=line.remarks
                )

                db.add(dispatch_line)

            db.commit()
            db.refresh(dispatch)
            return MaterialDispatchRead.from_orm(dispatch)

        except Exception as e:
            db.rollback()
            raise e


        
    @staticmethod
    def cancel_material_dispatch(db: Session, dispatch_id: int, cancelled_by: str, cancel_reason: str):
        dispatch = (
            db.query(MaterialDispatch)
            .filter(MaterialDispatch.id == dispatch_id)
            .with_for_update()
            .first()
        )

        if not dispatch:
            raise ValueError("Dispatch not found")

        if dispatch.dispatch_status != DispatchStatus.DISPATCHED:
            raise ValueError("Only DISPATCHED dispatches can be cancelled")

        try:
            for line in dispatch.line_items:
                inventory = (
                    db.query(InventoryItem)
                    .filter(InventoryItem.id == line.inventory_item_id)
                    .with_for_update()
                    .first()
                )

                if not inventory:
                    raise ValueError("Inventory item not found during reversal")

                reversal_qty = int(line.quantity_dispatched)

                # 🔁 Restore inventory
                inventory.quantity += reversal_qty

                # 🔁 Log REVERSAL transaction
                txn = InventoryTransaction(
                    inventory_item_id=inventory.id,
                    transaction_type="REVERSAL",
                    quantity=reversal_qty,
                    reference_type="DISPATCH_CANCEL",
                    reference_id=dispatch.id,
                    remarks=f"Dispatch cancelled: {cancel_reason}",
                    created_by=cancelled_by
                )

                db.add(txn)

            dispatch.dispatch_status = DispatchStatus.CANCELLED
            dispatch.remarks = (
                f"❌ Cancelled by {cancelled_by}\n"
                f"Reason: {cancel_reason}"
            )

            db.commit()
            db.refresh(dispatch)
            return dispatch

        except Exception:
            db.rollback()
            raise

    
    @staticmethod
    def get_material_dispatches(db: Session, skip: int = 0, limit: int = 100) -> List[MaterialDispatchRead]:
        """Get all material dispatches"""
        dispatches = db.query(MaterialDispatch).filter(
            MaterialDispatch.is_active == True
        ).offset(skip).limit(limit).all()
        
        return [MaterialDispatchRead.from_orm(dispatch) for dispatch in dispatches]
    
    @staticmethod
    def get_material_dispatch(db: Session, dispatch_id: int) -> Optional[MaterialDispatchRead]:
        """Get material dispatch by ID"""
        dispatch = db.query(MaterialDispatch).filter(
            MaterialDispatch.id == dispatch_id,
            MaterialDispatch.is_active == True
        ).first()
        
        if not dispatch:
            return None
            
        return MaterialDispatchRead.from_orm(dispatch)
    
    @staticmethod
    def update_material_dispatch(
        db: Session,
        dispatch_id: int,
        dispatch_update: MaterialDispatchUpdate
    ) -> Optional[MaterialDispatchRead]:

        dispatch = (
            db.query(MaterialDispatch)
            .filter(
                MaterialDispatch.id == dispatch_id,
                MaterialDispatch.is_active == True
            )
            .first()
        )

        if not dispatch:
            return None

        # 🔒 Only DRAFT can be updated
        if dispatch.dispatch_status != DispatchStatus.DRAFT:
            raise ValueError("Only DRAFT dispatches can be updated")

        try:
            # -----------------------------
            # Update header fields
            # -----------------------------
            if dispatch_update.remarks is not None:
                dispatch.remarks = dispatch_update.remarks

            if dispatch_update.dispatch_date is not None:
                dispatch.dispatch_date = dispatch_update.dispatch_date

            # -----------------------------
            # Replace line items (FULL REPLACE)
            # -----------------------------
            if dispatch_update.line_items is not None:
                # Delete old line items
                dispatch.line_items.clear()
                db.flush()

                for line in dispatch_update.line_items:
                    inventory = (
                        db.query(InventoryItem)
                        .filter(InventoryItem.id == line.inventory_item_id)
                        .first()
                    )

                    if not inventory:
                        raise ValueError(
                            f"Inventory item not found (ID: {line.inventory_item_id})"
                        )

                    new_line = MaterialDispatchLineItem(
                        dispatch_id=dispatch.id,
                        inventory_item_id=inventory.id,
                        item_id=line.item_id,
                        item_code=line.item_code,
                        item_name=line.item_name,
                        quantity_dispatched=line.quantity_dispatched,
                        uom=line.uom,
                        batch_number=line.batch_number,
                        remarks=line.remarks,
                    )

                    db.add(new_line)

            dispatch.updated_at = datetime.utcnow()

            db.commit()
            db.refresh(dispatch)

            return MaterialDispatchRead.from_orm(dispatch)

        except Exception as e:
            db.rollback()
            raise e
       
        
    print("🔥🔥🔥 NEW ISSUE LOGIC ACTIVE 🔥🔥🔥")

    @staticmethod
    def issue_material_dispatch(db: Session, dispatch_id: int) -> MaterialDispatchRead:
        dispatch = (
            db.query(MaterialDispatch)
            .filter(MaterialDispatch.id == dispatch_id)
            .with_for_update()
            .first()
        )

        if not dispatch:
            raise ValueError("Dispatch not found")

        if dispatch.dispatch_status != DispatchStatus.DRAFT:
            raise ValueError("Only DRAFT dispatches can be issued")

        try:
            print(f"\n[ISSUE DISPATCH] Dispatch ID: {dispatch.id}")
            print(f"[ISSUE DISPATCH] Reference: {dispatch.reference_type} {dispatch.reference_id}")

            # 🔒 Fetch PO pending items ONCE
            pending_items = []
            if dispatch.reference_type == ReferenceType.PO:
                pending_items = StoreService.get_po_pending_items(
                    db, int(dispatch.reference_id)
                )

                print("[ISSUE DISPATCH] PO Pending Items:")
                for p in pending_items:
                    print(
                        f"  - item_code={p.get('item_code')} | "
                        f"item_id={p.get('item_id')} | "
                        f"pending_qty={p.get('pending_qty')}"
                    )

            for line in dispatch.line_items:
                print(
                    f"\n[ISSUE DISPATCH] Processing line item:"
                    f" item_code={line.item_code},"
                    f" item_id={line.item_id},"
                    f" qty={line.quantity_dispatched}"
                )

                inventory = (
                    db.query(InventoryItem)
                    .filter(InventoryItem.id == line.inventory_item_id)
                    .with_for_update()
                    .first()
                )

                if not inventory:
                    raise ValueError(
                        f"Inventory item not found for item {line.item_code}"
                    )

                dispatch_qty = int(line.quantity_dispatched)

                # ==================================================
                # ✅ RECOMMENDED FIX — MATCH BY item_code (NOT item_id)
                # ==================================================
                if dispatch.reference_type == ReferenceType.PO:
                    po_item = next(
                        (p for p in pending_items if p["item_id"] == line.item_id),
                        None
                    )

                    if not po_item:
                        raise ValueError(
                            f"Item {line.item_code} not part of PO {dispatch.reference_id}"
                        )

                    if dispatch_qty > po_item["pending_qty"]:
                        raise ValueError(
                            f"Dispatch qty exceeds PO pending qty for item {line.item_code}. "
                            f"Pending: {po_item['pending_qty']}, Requested: {dispatch_qty}"
                        )

                    print(
                        f"[ISSUE DISPATCH] PO validation passed "
                        f"(pending={po_item['pending_qty']}, dispatching={dispatch_qty})"
                    )

                # 🔻 Inventory validation
                if inventory.quantity < dispatch_qty:
                    raise ValueError(
                        f"Insufficient stock for item {line.item_code}. "
                        f"Available: {inventory.quantity}, Requested: {dispatch_qty}"
                    )

                # 🔻 Deduct inventory
                inventory.quantity -= dispatch_qty

                txn = InventoryTransaction(
                    inventory_item_id=inventory.id,
                    transaction_type="OUT",
                    quantity=dispatch_qty,
                    reference_type="DISPATCH",
                    reference_id=dispatch.id,
                    remarks="Material dispatched",
                    created_by=dispatch.created_by
                )

                db.add(txn)

                print(
                    f"[ISSUE DISPATCH] Inventory deducted. "
                    f"Remaining stock: {inventory.quantity}"
                )

            # ✅ Finalize dispatch
            dispatch.dispatch_status = DispatchStatus.DISPATCHED
            dispatch.updated_at = datetime.utcnow()

            db.commit()
            db.refresh(dispatch)

            print(f"[ISSUE DISPATCH] Dispatch {dispatch.id} successfully ISSUED\n")

            return MaterialDispatchRead.from_orm(dispatch)

        except Exception as e:
            db.rollback()
            print(f"[ISSUE DISPATCH][ERROR] {str(e)}")
            raise e

