import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.core.db import Base
from ..models import InventoryItem, Dispatch
from ..schemas import InventoryCreate, DispatchCreate
from ..services import StoreService

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    yield session
    session.close()


def test_add_inventory_new_item(db_session):
    inventory_data = InventoryCreate(item_id=1, quantity=10, location="A1")
    result = StoreService.add_inventory(db_session, inventory_data)
    
    assert result.item_id == 1
    assert result.quantity == 10
    assert result.location == "A1"


def test_add_inventory_existing_item(db_session):
    # Add initial inventory
    inventory_data = InventoryCreate(item_id=1, quantity=10, location="A1")
    StoreService.add_inventory(db_session, inventory_data)
    
    # Add more to same item/location
    additional_data = InventoryCreate(item_id=1, quantity=5, location="A1")
    result = StoreService.add_inventory(db_session, additional_data)
    
    assert result.quantity == 15


def test_dispatch_success(db_session):
    # Add inventory first
    inventory_data = InventoryCreate(item_id=1, quantity=10, location="A1")
    inventory = StoreService.add_inventory(db_session, inventory_data)
    
    # Dispatch some items
    dispatch_data = DispatchCreate(
        inventory_item_id=inventory.id,
        quantity=5,
        requested_by="user1"
    )
    result = StoreService.dispatch_item(db_session, dispatch_data)
    
    assert result.quantity == 5
    assert result.requested_by == "user1"
    
    # Check inventory was decremented
    updated_inventory = db_session.query(InventoryItem).filter(
        InventoryItem.id == inventory.id
    ).first()
    assert updated_inventory.quantity == 5


def test_dispatch_insufficient_quantity(db_session):
    # Add inventory first
    inventory_data = InventoryCreate(item_id=1, quantity=5, location="A1")
    inventory = StoreService.add_inventory(db_session, inventory_data)
    
    # Try to dispatch more than available
    dispatch_data = DispatchCreate(
        inventory_item_id=inventory.id,
        quantity=10,
        requested_by="user1"
    )
    
    with pytest.raises(ValueError, match="Insufficient inventory quantity"):
        StoreService.dispatch_item(db_session, dispatch_data)