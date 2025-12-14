import pytest
from decimal import Decimal
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from backend.app.procurement.models import Base, Item, PurchaseOrder, PurchaseOrderLine, POStatus
from backend.app.procurement.routers.procurement import router, get_db, require_procurement_token
from fastapi import FastAPI


@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    """Create a fresh database session for each test with isolated in-memory SQLite."""
    from sqlalchemy.pool import StaticPool
    
    # Use StaticPool to ensure a single connection for the in-memory database
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,  # Keep a single connection for in-memory DB
    )
    
    # Create all tables in this engine
    Base.metadata.create_all(bind=engine)
    
    # Create session factory bound to this engine
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    yield db
    
    db.close()


@pytest.fixture(scope="function")
def client(db_session: Session) -> TestClient:
    """Create a FastAPI test client with dependency overrides."""
    app = FastAPI()
    
    # Override dependencies BEFORE including router
    def override_get_db():
        return db_session
    
    async def override_token():
        return "test-token"
    
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[require_procurement_token] = override_token
    
    # Include router AFTER setting overrides
    app.include_router(router)
    
    return TestClient(app)


@pytest.fixture(scope="function")
def sample_item(db_session: Session) -> Item:
    """Create a sample item for testing."""
    item = Item(
        name="Test Item",
        code="TEST-001",
        unit="pcs",
        description="Test item for PO creation"
    )
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)
    return item


class TestCreatePurchaseOrder:
    """Tests for purchase order creation."""
    
    def test_create_po_happy_path(self, client: TestClient, sample_item: Item):
        """Test successful PO creation with valid data."""
        payload = {
            "vendor_id": 1,
            "lines": [
                {
                    "item_id": sample_item.id,
                    "quantity": 10,
                    "price": "99.99"
                }
            ]
        }
        
        response = client.post("/api/v1/procurement/", json=payload)
        
        if response.status_code != 201:
            print(f"Response status: {response.status_code}")
            print(f"Response body: {response.json()}")
        
        assert response.status_code == 201
        data = response.json()
        assert data["vendor_id"] == 1
        assert data["status"] == "DRAFT"
        assert data["po_number"].startswith("PO-")
        assert len(data["lines"]) == 1
        assert data["lines"][0]["quantity"] == 10
        assert data["lines"][0]["price"] == "99.99"
    
    def test_create_po_invalid_item(self, client: TestClient):
        """Test PO creation with non-existent item returns 400."""
        payload = {
            "vendor_id": 1,
            "lines": [
                {
                    "item_id": 9999,  # Non-existent item
                    "quantity": 5,
                    "price": "50.00"
                }
            ]
        }
        
        response = client.post("/api/v1/procurement/", json=payload)
        
        assert response.status_code == 400
        assert "do not exist" in response.json()["detail"]
    
    def test_create_po_invalid_vendor_id(self, client: TestClient, sample_item: Item):
        """Test PO creation with invalid vendor_id returns 422 (validation error)."""
        payload = {
            "vendor_id": -1,  # Invalid vendor ID
            "lines": [
                {
                    "item_id": sample_item.id,
                    "quantity": 5,
                    "price": "50.00"
                }
            ]
        }
        
        response = client.post("/api/v1/procurement/", json=payload)
        
        assert response.status_code == 422  # Pydantic validation error
        assert "greater than 0" in response.json()["detail"][0]["msg"].lower()
    
    def test_create_po_no_lines(self, client: TestClient):
        """Test PO creation with empty lines list returns 400."""
        payload = {
            "vendor_id": 1,
            "lines": []
        }
        
        response = client.post("/api/v1/procurement/", json=payload)
        
        assert response.status_code == 422  # Validation error
    
    def test_create_po_multiple_lines(self, client: TestClient, db_session: Session):
        """Test PO creation with multiple line items."""
        # Create multiple items
        items = []
        for i in range(3):
            item = Item(
                name=f"Item {i}",
                code=f"CODE-{i:03d}",
                unit="pcs",
            )
            db_session.add(item)
            db_session.commit()
            db_session.refresh(item)
            items.append(item)
        
        payload = {
            "vendor_id": 42,
            "lines": [
                {"item_id": items[0].id, "quantity": 5, "price": "10.00"},
                {"item_id": items[1].id, "quantity": 10, "price": "20.50"},
                {"item_id": items[2].id, "quantity": 3, "price": "150.00"},
            ]
        }
        
        response = client.post("/api/v1/procurement/", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["vendor_id"] == 42
        assert len(data["lines"]) == 3
        assert data["lines"][0]["quantity"] == 5
        assert data["lines"][1]["price"] == "20.50"


class TestGetPurchaseOrders:
    """Tests for retrieving purchase orders."""
    
    def test_get_po_list_empty(self, client: TestClient):
        """Test retrieving PO list when empty."""
        response = client.get("/api/v1/procurement/")
        
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0
        assert data["page"] == 1
    
    def test_get_po_list_with_pagination(self, client: TestClient, db_session: Session, sample_item: Item):
        """Test PO list with pagination."""
        # Create multiple POs
        for i in range(30):
            po = PurchaseOrder(
                po_number=f"PO-TEST-{i:04d}",
                vendor_id=i + 1,
                status=POStatus.DRAFT
            )
            db_session.add(po)
        db_session.commit()
        
        # Get first page
        response = client.get("/api/v1/procurement/?page=1&page_size=10")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 10
        assert data["total"] == 30
        assert data["page"] == 1
        assert data["total_pages"] == 3
    
    def test_get_po_list_filter_by_status(self, client: TestClient, db_session: Session):
        """Test PO list filtered by status."""
        # Create POs with different statuses
        for i in range(5):
            status = POStatus.DRAFT if i < 3 else POStatus.SENT
            po = PurchaseOrder(
                po_number=f"PO-STATUS-{i:04d}",
                vendor_id=i + 1,
                status=status
            )
            db_session.add(po)
        db_session.commit()
        
        # Filter by DRAFT status
        response = client.get("/api/v1/procurement/?status=DRAFT")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 3
        for item in data["items"]:
            assert item["status"] == "DRAFT"


class TestGetPurchaseOrder:
    """Tests for retrieving a single purchase order."""
    
    def test_get_po_by_id(self, client: TestClient, db_session: Session, sample_item: Item):
        """Test retrieving a single PO by ID."""
        # Create a PO
        po = PurchaseOrder(
            po_number="PO-GET-TEST",
            vendor_id=123,
            status=POStatus.DRAFT
        )
        db_session.add(po)
        db_session.commit()
        db_session.refresh(po)
        
        response = client.get(f"/api/v1/procurement/{po.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == po.id
        assert data["po_number"] == "PO-GET-TEST"
        assert data["vendor_id"] == 123
        assert data["status"] == "DRAFT"
    
    def test_get_po_not_found(self, client: TestClient):
        """Test retrieving a non-existent PO returns 404."""
        response = client.get("/api/v1/procurement/9999")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]


class TestSendPurchaseOrder:
    """Tests for sending a purchase order."""
    
    def test_send_po_changes_status(self, client: TestClient, db_session: Session):
        """Test that sending a PO changes status from DRAFT to SENT."""
        # Create a PO in DRAFT status
        po = PurchaseOrder(
            po_number="PO-SEND-TEST",
            vendor_id=456,
            status=POStatus.DRAFT
        )
        db_session.add(po)
        db_session.commit()
        db_session.refresh(po)
        
        # Verify initial status
        assert po.status == POStatus.DRAFT
        
        # Send the PO
        response = client.post(f"/api/v1/procurement/{po.id}/send")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SENT"
        assert data["po_number"] == "PO-SEND-TEST"
    
    def test_send_po_already_sent(self, client: TestClient, db_session: Session):
        """Test that sending an already sent PO returns 400."""
        # Create a PO already in SENT status
        po = PurchaseOrder(
            po_number="PO-ALREADY-SENT",
            vendor_id=789,
            status=POStatus.SENT
        )
        db_session.add(po)
        db_session.commit()
        db_session.refresh(po)
        
        # Try to send again
        response = client.post(f"/api/v1/procurement/{po.id}/send")
        
        assert response.status_code == 400
        assert "already sent" in response.json()["detail"]
    
    def test_send_po_not_found(self, client: TestClient):
        """Test that sending a non-existent PO returns 404."""
        response = client.post("/api/v1/procurement/9999/send")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]


class TestUpdatePurchaseOrder:
    """Tests for updating a purchase order (DRAFT only)."""

    def test_update_po_happy_path(self, client: TestClient, db_session: Session):
        """Update vendor and replace lines for a DRAFT PO."""
        # create two items
        item1 = Item(name="Update Item 1", code="UPD-001", unit="pcs")
        item2 = Item(name="Update Item 2", code="UPD-002", unit="pcs")
        db_session.add_all([item1, item2])
        db_session.commit()
        db_session.refresh(item1)
        db_session.refresh(item2)

        # create PO with item1
        po = PurchaseOrder(po_number="PO-UPDATE-1", vendor_id=10, status=POStatus.DRAFT)
        db_session.add(po)
        db_session.commit()
        db_session.refresh(po)

        line = PurchaseOrderLine(po_id=po.id, item_id=item1.id, quantity=2, price=Decimal("5.00"))
        db_session.add(line)
        db_session.commit()

        payload = {
            "vendor_id": 99,
            "lines": [
                {"item_id": item2.id, "quantity": 3, "price": "12.34"}
            ]
        }

        response = client.put(f"/api/v1/procurement/{po.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["vendor_id"] == 99
        assert data["status"] == "DRAFT"
        assert len(data["lines"]) == 1
        assert data["lines"][0]["item_id"] == item2.id
        assert data["lines"][0]["price"] == "12.34"

    def test_update_po_vendor_only(self, client: TestClient, db_session: Session, sample_item: Item):
        """Update only vendor_id; lines remain unchanged."""
        po = PurchaseOrder(po_number="PO-UPDATE-2", vendor_id=1, status=POStatus.DRAFT)
        db_session.add(po)
        db_session.commit()
        db_session.refresh(po)

        line = PurchaseOrderLine(po_id=po.id, item_id=sample_item.id, quantity=1, price=Decimal("1.00"))
        db_session.add(line)
        db_session.commit()

        response = client.put(f"/api/v1/procurement/{po.id}", json={"vendor_id": 555})
        assert response.status_code == 200
        data = response.json()
        assert data["vendor_id"] == 555
        assert len(data["lines"]) == 1

    def test_update_po_replace_lines(self, client: TestClient, db_session: Session):
        """Replace existing lines with a new set."""
        item_a = Item(name="A", code="A-001", unit="pcs")
        item_b = Item(name="B", code="B-001", unit="pcs")
        db_session.add_all([item_a, item_b])
        db_session.commit()
        db_session.refresh(item_a)
        db_session.refresh(item_b)

        po = PurchaseOrder(po_number="PO-UPDATE-3", vendor_id=2, status=POStatus.DRAFT)
        db_session.add(po)
        db_session.commit()
        db_session.refresh(po)

        l1 = PurchaseOrderLine(po_id=po.id, item_id=item_a.id, quantity=1, price=Decimal("2.00"))
        db_session.add(l1)
        db_session.commit()

        payload = {"lines": [{"item_id": item_b.id, "quantity": 4, "price": "8.00"}]}
        response = client.put(f"/api/v1/procurement/{po.id}", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert len(data["lines"]) == 1
        assert data["lines"][0]["item_id"] == item_b.id

    def test_update_po_sent_rejected(self, client: TestClient, db_session: Session, sample_item: Item):
        """Attempting to update a SENT PO should be rejected with 400."""
        po = PurchaseOrder(po_number="PO-UPDATE-4", vendor_id=3, status=POStatus.SENT)
        db_session.add(po)
        db_session.commit()
        db_session.refresh(po)

        l = PurchaseOrderLine(po_id=po.id, item_id=sample_item.id, quantity=1, price=Decimal("3.00"))
        db_session.add(l)
        db_session.commit()

        response = client.put(f"/api/v1/procurement/{po.id}", json={"vendor_id": 777})
        assert response.status_code == 400
        assert "draft" in response.json()["detail"].lower()

    def test_update_po_not_found(self, client: TestClient):
        response = client.put("/api/v1/procurement/9999", json={"vendor_id": 1})
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]
