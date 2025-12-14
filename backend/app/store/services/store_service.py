from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, Dict, Any, List
from ..models import InventoryItem, Dispatch
from ..schemas import InventoryCreate, DispatchCreate


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
    def dispatch_item(db: Session, dispatch_create: DispatchCreate) -> Dispatch:
        """Dispatch items from inventory, validating sufficient quantity."""
        inventory = db.query(InventoryItem).filter(
            InventoryItem.id == dispatch_create.inventory_item_id
        ).first()
        
        if not inventory:
            raise ValueError("Inventory item not found")
        if inventory.quantity < dispatch_create.quantity:
            raise ValueError("Insufficient inventory quantity")
        
        inventory.quantity -= dispatch_create.quantity
        
        dispatch = Dispatch(**dispatch_create.model_dump())
        db.add(dispatch)
        db.commit()
        db.refresh(dispatch)
        return dispatch
    
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