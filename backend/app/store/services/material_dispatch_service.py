import random
import string
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.material_dispatch import MaterialDispatch, MaterialDispatchLineItem, DispatchStatus
from ..schemas.material_dispatch import MaterialDispatchCreate, MaterialDispatchRead, MaterialDispatchUpdate

class MaterialDispatchService:
    
    @staticmethod
    def _generate_dispatch_number() -> str:
        """Generate unique dispatch number"""
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"MD-{timestamp}-{random_suffix}"
    
    @staticmethod
    def create_material_dispatch(db: Session, dispatch_create: MaterialDispatchCreate) -> MaterialDispatchRead:
        """Create a new material dispatch"""
        print(f"[DEBUG] Service create_material_dispatch called with: {dispatch_create.dict()}")
        try:
            # Generate dispatch number
            dispatch_number = MaterialDispatchService._generate_dispatch_number()
            print(f"[DEBUG] Generated dispatch number: {dispatch_number}")
            
            # Create dispatch
            db_dispatch = MaterialDispatch(
                dispatch_number=dispatch_number,
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
                eway_bill_number=dispatch_create.eway_bill_number
            )
            print(f"[DEBUG] Created dispatch object: {db_dispatch.__dict__}")
            
            db.add(db_dispatch)
            print(f"[DEBUG] Added dispatch to session")
            db.flush()  # Get the ID
            print(f"[DEBUG] Flushed - dispatch ID: {db_dispatch.id}")
            
            # Create line items
            for i, line_item in enumerate(dispatch_create.line_items):
                print(f"[DEBUG] Creating line item {i}: {line_item.dict()}")
                db_line_item = MaterialDispatchLineItem(
                    dispatch_id=db_dispatch.id,
                    item_id=line_item.item_id,
                    item_code=line_item.item_code,
                    item_name=line_item.item_name,
                    quantity_dispatched=line_item.quantity_dispatched,
                    uom=line_item.uom,
                    batch_number=line_item.batch_number,
                    remarks=line_item.remarks
                )
                db.add(db_line_item)
                print(f"[DEBUG] Added line item {i} to session")
            
            print(f"[DEBUG] Committing transaction")
            db.commit()
            print(f"[DEBUG] Transaction committed successfully")
            db.refresh(db_dispatch)
            print(f"[DEBUG] Refreshed dispatch object")
            
            result = MaterialDispatchRead.from_orm(db_dispatch)
            print(f"[DEBUG] Created MaterialDispatchRead: {result.dict()}")
            return result
            
        except Exception as e:
            print(f"[DEBUG] Service exception: {type(e).__name__}: {str(e)}")
            import traceback
            print(f"[DEBUG] Service traceback: {traceback.format_exc()}")
            db.rollback()
            print(f"[DEBUG] Transaction rolled back")
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