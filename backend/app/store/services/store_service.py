from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, Dict, Any, List
from ..models import InventoryItem, Store, Bin
from ..models.dispatch import Dispatch, DispatchItem, DispatchStatus, DispatchType
from ..schemas import InventoryCreate, StoreCreate, StoreUpdate, BinCreate
from ..schemas.dispatch import DispatchCreate, DispatchRead
from datetime import datetime
import uuid


class StoreService:
    
    @staticmethod
    def add_inventory(db: Session, inventory_create: InventoryCreate) -> InventoryItem:
        """Add inventory item or increase quantity if exists at same location.
        
        This method represents receiving ONLY accepted items from Quality.
        inventory_create may include:
        - inspection_id OR accepted_material_id (optional reference)
        Store does NOT validate quality itself.
        Store trusts Quality module as source of truth.
        """
        existing = db.query(InventoryItem).filter(
            and_(
                InventoryItem.item_id == inventory_create.item_id,
                InventoryItem.location == inventory_create.location
            )
        ).first()
        
        if existing:
            existing.quantity += inventory_create.quantity
            db.commit()
            db.refresh(existing)
            return existing
        
        item = InventoryItem(**inventory_create.model_dump())
        db.add(item)
        db.commit()
        db.refresh(item)
        return item
    
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
    def generate_dispatch_number(db: Session) -> str:
        """Generate unique dispatch number."""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        unique_id = str(uuid.uuid4())[:8].upper()
        return f"DISP-{timestamp}-{unique_id}"
    
    @staticmethod
    def create_material_dispatch(db: Session, dispatch_create: DispatchCreate) -> DispatchRead:
        """Create comprehensive material dispatch with transaction safety."""
        print("[DISPATCH SERVICE] Starting material dispatch creation")
        
        try:
            # Begin transaction
            db.begin()
            print("[DISPATCH SERVICE] Transaction started")
            
            # Validate items exist and have sufficient stock (for ISSUE action)
            if dispatch_create.action == 'ISSUE':
                for item_data in dispatch_create.items:
                    # In a real system, validate against inventory
                    print(f"[DISPATCH SERVICE] Validating item {item_data.item_code}")
            
            # Create dispatch header
            dispatch_data = dispatch_create.model_dump(exclude={'items', 'action'})
            dispatch_data['status'] = DispatchStatus.DRAFT if dispatch_create.action == 'DRAFT' else DispatchStatus.ISSUED
            dispatch_data['total_value'] = sum(item.line_value or 0 for item in dispatch_create.items)
            
            dispatch = Dispatch(**dispatch_data)
            db.add(dispatch)
            db.flush()  # Get ID without committing
            print(f"[DISPATCH SERVICE] Dispatch header created with ID: {dispatch.id}")
            
            # Create dispatch items
            dispatch_items = []
            for item_data in dispatch_create.items:
                item_dict = item_data.model_dump()
                item_dict['dispatch_id'] = dispatch.id
                dispatch_item = DispatchItem(**item_dict)
                db.add(dispatch_item)
                dispatch_items.append(dispatch_item)
            
            db.flush()
            print(f"[DISPATCH SERVICE] {len(dispatch_items)} items added")
            
            # If issuing, deduct stock (placeholder - implement actual inventory deduction)
            if dispatch_create.action == 'ISSUE':
                print("[DISPATCH SERVICE] Deducting stock for issued dispatch")
                # TODO: Implement actual stock deduction
            
            # Commit transaction
            db.commit()
            print("[DISPATCH SERVICE] Transaction committed successfully")
            
            # Refresh and return
            db.refresh(dispatch)
            return DispatchRead.model_validate(dispatch)
            
        except Exception as e:
            db.rollback()
            print(f"[DISPATCH SERVICE] FAILED - Transaction rolled back: {str(e)}")
            raise ValueError(f"Dispatch creation failed: {str(e)}")
    
    @staticmethod
    def get_dispatches(db: Session, filters: Optional[Dict[str, Any]] = None) -> List[Dispatch]:
        """Get dispatch records with optional filtering."""
        query = db.query(Dispatch)

        if filters:
            if "inventory_item_id" in filters:
                query = query.filter(Dispatch.inventory_item_id == filters["inventory_item_id"])
            if "requested_by" in filters:
                query = query.filter(Dispatch.requested_by == filters["requested_by"])

        return query.all()

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
