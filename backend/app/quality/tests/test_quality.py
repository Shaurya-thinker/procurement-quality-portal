import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

from backend.app.quality.models import Base, MaterialReceipt, QualityInspection
from backend.app.quality.router import router
from backend.app import database
from fastapi import FastAPI


@pytest.fixture(scope="function")
def db_session() -> Session:
    """Create a fresh database session for each test."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    yield db
    db.close()


@pytest.fixture(scope="function")
def client(db_session: Session) -> TestClient:
    """Create a FastAPI test client with dependency overrides."""
    app = FastAPI()
    
    def override_get_db():
        return db_session
    
    app.dependency_overrides[database.get_db] = override_get_db
    app.include_router(router, prefix="/api/v1/quality")
    
    return TestClient(app)


class TestMaterialReceipt:
    """Tests for material receipt operations."""
    
    def test_create_material_receipt(self, client: TestClient):
        """Test creating a material receipt."""
        payload = {
            "po_id": 1,
            "vendor_id": 123,
            "received_by": "John Doe"
        }
        
        response = client.post("/api/v1/quality/material-receipt", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["po_id"] == 1
        assert data["vendor_id"] == 123
        assert data["received_by"] == "John Doe"
        assert "receipt_number" in data
    
    def test_list_material_receipts_empty(self, client: TestClient):
        """Test listing material receipts when empty."""
        response = client.get("/api/v1/quality/material-receipt")
        
        assert response.status_code == 200
        data = response.json()
        assert data == []
    
    def test_list_material_receipts_with_data(self, client: TestClient, db_session: Session):
        """Test listing material receipts with data."""
        # Create test receipts
        receipt1 = MaterialReceipt(
            receipt_number="MR-001",
            po_id=1,
            vendor_id=123,
            received_by="John Doe"
        )
        receipt2 = MaterialReceipt(
            receipt_number="MR-002", 
            po_id=2,
            vendor_id=456,
            received_by="Jane Smith"
        )
        
        db_session.add_all([receipt1, receipt2])
        db_session.commit()
        
        response = client.get("/api/v1/quality/material-receipt")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2


class TestQualityInspection:
    """Tests for quality inspection operations."""
    
    def test_perform_inspection(self, client: TestClient, db_session: Session):
        """Test performing a quality inspection."""
        # Create a material receipt first
        receipt = MaterialReceipt(
            receipt_number="MR-TEST",
            po_id=1,
            vendor_id=123,
            received_by="Inspector"
        )
        db_session.add(receipt)
        db_session.commit()
        db_session.refresh(receipt)
        
        payload = {
            "material_receipt_id": receipt.id,
            "inspector_name": "Quality Inspector",
            "inspection_result": "PASS",
            "notes": "All items meet quality standards"
        }
        
        response = client.post("/api/v1/quality/inspect", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["material_receipt_id"] == receipt.id
        assert data["inspector_name"] == "Quality Inspector"
        assert data["inspection_result"] == "PASS"
    
    def test_get_inspection_report(self, client: TestClient, db_session: Session):
        """Test retrieving an inspection report."""
        # Create material receipt and inspection
        receipt = MaterialReceipt(
            receipt_number="MR-REPORT",
            po_id=1,
            vendor_id=123,
            received_by="Inspector"
        )
        db_session.add(receipt)
        db_session.commit()
        db_session.refresh(receipt)
        
        inspection = QualityInspection(
            material_receipt_id=receipt.id,
            inspector_name="Test Inspector",
            inspection_result="PASS"
        )
        db_session.add(inspection)
        db_session.commit()
        db_session.refresh(inspection)
        
        response = client.get(f"/api/v1/quality/inspection/{inspection.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == inspection.id
        assert data["inspector_name"] == "Test Inspector"
    
    def test_get_inspection_not_found(self, client: TestClient):
        """Test retrieving a non-existent inspection returns 404."""
        response = client.get("/api/v1/quality/inspection/9999")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]


class TestQualityChecklist:
    """Tests for quality checklist operations."""
    
    def test_create_quality_checklist(self, client: TestClient):
        """Test creating a quality checklist."""
        payload = {
            "inspection_id": 1,
            "checklist_items": [
                {"item": "Visual inspection", "status": "PASS"},
                {"item": "Dimension check", "status": "PASS"},
                {"item": "Material test", "status": "FAIL"}
            ]
        }
        
        response = client.post("/api/v1/quality/checklist", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["inspection_id"] == 1
        assert len(data["checklist_items"]) == 3


class TestQualitySheet:
    """Tests for quality sheet operations."""
    
    def test_create_quality_sheet(self, client: TestClient):
        """Test creating a quality sheet."""
        payload = {
            "inspection_id": 1,
            "measurements": {
                "length": "10.5mm",
                "width": "5.2mm", 
                "weight": "15.3g"
            },
            "defects_found": ["Minor scratch on surface"],
            "overall_grade": "A"
        }
        
        response = client.post("/api/v1/quality/quality-sheet", json=payload)
        
        assert response.status_code == 201
        data = response.json()
        assert data["inspection_id"] == 1
        assert data["overall_grade"] == "A"
        assert "measurements" in data