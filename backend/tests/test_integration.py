import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.app.main import app
from backend.app.procurement.models import Base as ProcurementBase, Item
from backend.app.quality.models import Base as QualityBase
from backend.app.store.models import Base as StoreBase


@pytest.fixture(scope="function")
def test_client():
    """Create a test client for integration tests."""
    # Create in-memory databases for all modules
    procurement_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    quality_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    store_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    # Create tables
    ProcurementBase.metadata.create_all(bind=procurement_engine)
    QualityBase.metadata.create_all(bind=quality_engine)
    StoreBase.metadata.create_all(bind=store_engine)
    
    # Create sessions
    procurement_session = sessionmaker(bind=procurement_engine)
    quality_session = sessionmaker(bind=quality_engine)
    store_session = sessionmaker(bind=store_engine)
    
    # Override dependencies
    def get_procurement_db():
        db = procurement_session()
        try:
            yield db
        finally:
            db.close()
    
    def get_quality_db():
        db = quality_session()
        try:
            yield db
        finally:
            db.close()
    
    def get_store_db():
        db = store_session()
        try:
            yield db
        finally:
            db.close()
    
    # Override app dependencies
    from backend.app.procurement.routers import procurement as procurement_module
    from backend.app import database as quality_database
    from backend.app.core import dependencies as core_dependencies
    
    app.dependency_overrides[procurement_module.get_db] = get_procurement_db
    app.dependency_overrides[quality_database.get_db] = get_quality_db
    app.dependency_overrides[core_dependencies.get_db] = get_store_db
    
    # Add test data
    db = procurement_session()
    test_item = Item(name="Test Item", code="TEST-001", unit="pcs")
    db.add(test_item)
    db.commit()
    db.close()
    
    return TestClient(app)


class TestUnifiedAPI:
    """Integration tests for the unified API."""
    
    def test_root_endpoint(self, test_client):
        """Test the root endpoint returns module status."""
        response = test_client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Procurement Quality Portal API"
        assert "modules" in data
        assert "procurement" in data["modules"]
        assert "quality" in data["modules"]
        assert "store" in data["modules"]
    
    def test_health_check(self, test_client):
        """Test health check endpoint."""
        response = test_client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "procurement-quality-portal"
    
    def test_api_status(self, test_client):
        """Test API status endpoint."""
        response = test_client.get("/api/status")
        
        assert response.status_code == 200
        data = response.json()
        assert "modules" in data
        assert "Procurement" in data["modules"]
        assert "Quality" in data["modules"]
        assert "Store" in data["modules"]


class TestCrossModuleWorkflow:
    """Test workflows that span multiple modules."""
    
    def test_procurement_to_quality_workflow(self, test_client):
        """Test complete workflow from PO creation to quality inspection."""
        # Step 1: Create a purchase order
        po_payload = {
            "vendor_id": 123,
            "lines": [
                {"item_id": 1, "quantity": 10, "price": "99.99"}
            ]
        }
        
        po_response = test_client.post(
            "/api/v1/procurement/",
            json=po_payload,
            headers={"Authorization": "Bearer test-token"}
        )
        
        assert po_response.status_code == 201
        po_data = po_response.json()
        po_id = po_data["id"]
        
        # Step 2: Send the purchase order
        send_response = test_client.post(
            f"/api/v1/procurement/{po_id}/send",
            headers={"Authorization": "Bearer test-token"}
        )
        
        assert send_response.status_code == 200
        
        # Step 3: Create material receipt in quality module
        mr_payload = {
            "po_id": po_id,
            "vendor_id": 123,
            "received_by": "Quality Inspector"
        }
        
        mr_response = test_client.post("/api/v1/quality/material-receipt", json=mr_payload)
        
        assert mr_response.status_code == 201
        mr_data = mr_response.json()
        
        # Step 4: Perform quality inspection
        inspection_payload = {
            "material_receipt_id": mr_data["id"],
            "inspector_name": "John Inspector",
            "inspection_result": "PASS",
            "notes": "All items passed inspection"
        }
        
        inspection_response = test_client.post("/api/v1/quality/inspect", json=inspection_payload)
        
        assert inspection_response.status_code == 201
        inspection_data = inspection_response.json()
        assert inspection_data["inspection_result"] == "PASS"
    
    def test_quality_to_store_workflow(self, test_client):
        """Test workflow from quality approval to inventory addition."""
        # Step 1: Create material receipt
        mr_payload = {
            "po_id": 1,
            "vendor_id": 123,
            "received_by": "Warehouse Staff"
        }
        
        mr_response = test_client.post("/api/v1/quality/material-receipt", json=mr_payload)
        assert mr_response.status_code == 201
        
        # Step 2: Pass quality inspection
        inspection_payload = {
            "material_receipt_id": mr_response.json()["id"],
            "inspector_name": "Quality Inspector",
            "inspection_result": "PASS"
        }
        
        inspection_response = test_client.post("/api/v1/quality/inspect", json=inspection_payload)
        assert inspection_response.status_code == 201
        
        # Step 3: Add to inventory (assuming quality passed)
        inventory_payload = {
            "item_id": 1,
            "quantity": 10,
            "location": "Warehouse A"
        }
        
        inventory_response = test_client.post("/api/v1/store/inventory", json=inventory_payload)
        assert inventory_response.status_code == 201
        
        # Step 4: Verify inventory was added
        inventory_list = test_client.get("/api/v1/store/inventory")
        assert inventory_list.status_code == 200
        assert len(inventory_list.json()) == 1


class TestErrorHandling:
    """Test error handling across modules."""
    
    def test_procurement_invalid_token(self, test_client):
        """Test procurement endpoints with invalid token."""
        payload = {"vendor_id": 1, "lines": []}
        
        response = test_client.post(
            "/api/v1/procurement/",
            json=payload,
            headers={"Authorization": "Bearer invalid-token"}
        )
        
        # Should return 401 or 403 depending on auth implementation
        assert response.status_code in [401, 403]
    
    def test_quality_invalid_material_receipt(self, test_client):
        """Test quality inspection with non-existent material receipt."""
        payload = {
            "material_receipt_id": 9999,
            "inspector_name": "Inspector",
            "inspection_result": "PASS"
        }
        
        response = test_client.post("/api/v1/quality/inspect", json=payload)
        
        # Should return 400 or 404 depending on implementation
        assert response.status_code in [400, 404]
    
    def test_store_insufficient_inventory(self, test_client):
        """Test dispatch with insufficient inventory."""
        # First add some inventory
        inventory_payload = {
            "item_id": 1,
            "quantity": 5,
            "location": "Test Location"
        }
        
        inventory_response = test_client.post("/api/v1/store/inventory", json=inventory_payload)
        assert inventory_response.status_code == 201
        inventory_id = inventory_response.json()["id"]
        
        # Try to dispatch more than available
        dispatch_payload = {
            "inventory_item_id": inventory_id,
            "quantity": 10,  # More than the 5 available
            "requested_by": "Test User"
        }
        
        response = test_client.post("/api/v1/store/dispatch", json=dispatch_payload)
        
        # Should return 400 for insufficient inventory
        assert response.status_code == 400