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
from app.procurement.services.procurement_service import ProcurementService


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
                dispatch_status=(
                    DispatchStatus.DRAFT
                    if dispatch_create.is_draft
                    else DispatchStatus.DISPATCHED
                ),
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

                # ✅ Only validate & deduct stock when issuing
                if not dispatch_create.is_draft:

                    if dispatch.reference_type == ReferenceType.PO:
                        pending_items = ProcurementService.get_po_items_with_pending_qty(
                            db, int(dispatch.reference_id)
                        )

                        po_item = next(
                            (p for p in pending_items if p["item_id"] == line.item_id),
                            None
                        )

                        if not po_item:
                            raise ValueError(
                                f"Item {line.item_code} is not part of PO {dispatch.reference_id}"
                            )

                        dispatch_qty = int(line.quantity_dispatched)

                        if dispatch_qty > po_item["pending_qty"]:
                            raise ValueError(
                                f"Dispatch qty exceeds PO pending qty for item {line.item_code}. "
                                f"Pending: {po_item['pending_qty']}, Requested: {dispatch_qty}"
                            )

                    dispatch_qty = int(line.quantity_dispatched)

                    if inventory.quantity < dispatch_qty:
                        raise ValueError(
                            f"Insufficient stock for item {line.item_code}. "
                            f"Available: {inventory.quantity}, Requested: {dispatch_qty}"
                        )

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
    def update_material_dispatch(db: Session, dispatch_id: int, dispatch_update: MaterialDispatchUpdate) -> Optional[MaterialDispatchRead]:
        """Update material dispatch"""
        dispatch = db.query(MaterialDispatch).filter(
            MaterialDispatch.id == dispatch_id,
            MaterialDispatch.is_active == True
        ).first()
        
        if not dispatch:
            return None
        
        # Only allow updates if status is DRAFT
        if dispatch.dispatch_status != DispatchStatus.DRAFT:
            raise ValueError("Only DRAFT dispatches can be updated")
        
        try:
            if dispatch_update.dispatch_status is not None:
                dispatch.dispatch_status = dispatch_update.dispatch_status
            if dispatch_update.remarks is not None:
                dispatch.remarks = dispatch_update.remarks
            
            dispatch.updated_at = datetime.utcnow()
            
            db.commit()
            db.refresh(dispatch)
            
            return MaterialDispatchRead.from_orm(dispatch)
            
        except Exception as e:
            db.rollback()
            raise e


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
            for line in dispatch.line_items:
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

                # 🔒 PO validation
                if dispatch.reference_type == ReferenceType.PO:
                    pending_items = ProcurementService.get_po_items_with_pending_qty(
                        db, int(dispatch.reference_id)
                    )

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
                            f"Dispatch qty exceeds PO pending qty for item {line.item_code}"
                        )

                # 🔻 Inventory validation
                if inventory.quantity < dispatch_qty:
                    raise ValueError(
                        f"Insufficient stock for item {line.item_code}"
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
                print("DEBUG pending_items:", pending_items)
                print("DEBUG dispatch line:", line.item_code)


                db.add(txn)

            # ✅ Finalize dispatch
            dispatch.dispatch_status = DispatchStatus.DISPATCHED
            dispatch.updated_at = datetime.utcnow()

            db.commit()
            db.refresh(dispatch)

            return MaterialDispatchRead.from_orm(dispatch)

        except Exception as e:
            db.rollback()
            raise e

