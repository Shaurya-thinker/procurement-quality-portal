import random
import string
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.material_dispatch import MaterialDispatch, MaterialDispatchLineItem, DispatchStatus
from ..schemas.material_dispatch import MaterialDispatchCreate, MaterialDispatchRead, MaterialDispatchUpdate
from sqlalchemy.exc import IntegrityError
from ..models.inventory import InventoryItem

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
                dispatch_status=DispatchStatus.DRAFT,
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

                dispatch_qty = int(line.quantity_dispatched)  # ✅ FIXED

                if inventory.quantity < dispatch_qty:
                    raise ValueError(
                        f"Insufficient stock for item {line.item_code}. "
                        f"Available: {inventory.quantity}, Requested: {dispatch_qty}"
                    )

                inventory.quantity -= dispatch_qty

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

            dispatch.dispatch_status = DispatchStatus.DISPATCHED

            db.commit()
            db.refresh(dispatch)

            return MaterialDispatchRead.from_orm(dispatch)

        except Exception as e:
            db.rollback()
            raise e
    
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
