import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uvicorn

# Procurement imports
from backend.app.procurement.models import Base as ProcurementBase
from backend.app.procurement.routers import procurement as procurement_module
from backend.app.procurement.routers.procurement import router as procurement_router

# Quality imports
from backend.app.quality.models import Base as QualityBase
from backend.app.quality.router import router as quality_router
from backend.app import database as quality_database

# Store imports
from backend.app.store.models import Base as StoreBase
from backend.app.store.routers.store import router as store_router
from backend.app.core import dependencies as core_dependencies

# Database Configuration
PROCUREMENT_DATABASE_URL = "sqlite:///./procurement.db"
QUALITY_DATABASE_URL = "sqlite:///./quality.db"
STORE_DATABASE_URL = "sqlite:///./store.db"

# Create engines for each module
procurement_engine = create_engine(
    PROCUREMENT_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
procurement_session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=procurement_engine
)

quality_engine = create_engine(
    QUALITY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
quality_session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=quality_engine
)

store_engine = create_engine(
    STORE_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
store_session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=store_engine
)

# Create tables for all modules
ProcurementBase.metadata.create_all(bind=procurement_engine)
QualityBase.metadata.create_all(bind=quality_engine)
StoreBase.metadata.create_all(bind=store_engine)

# Create database session dependencies for each module
def get_procurement_db():
    """Get database session for procurement module."""
    db = procurement_session()
    try:
        yield db
    finally:
        db.close()

def get_quality_db():
    """Get database session for quality module."""
    db = quality_session()
    try:
        yield db
    finally:
        db.close()

def get_store_db():
    """Get database session for store module."""
    db = store_session()
    try:
        yield db
    finally:
        db.close()

# Initialize FastAPI application
app = FastAPI(
    title="Procurement Quality Portal",
    description="Unified API for Procurement, Quality Control, and Store Management",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Override dependencies for each module's router
app.dependency_overrides[procurement_module.get_db] = get_procurement_db
app.dependency_overrides[quality_database.get_db] = get_quality_db
app.dependency_overrides[core_dependencies.get_db] = get_store_db

# Include routers from all modules
# Note: Procurement and Store routers already have prefixes defined, so we only add them for Quality
app.include_router(procurement_router, tags=["Procurement"])
app.include_router(quality_router, prefix="/api/v1/quality", tags=["Quality"])
app.include_router(store_router, tags=["Store"])

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Procurement Quality Portal API",
        "version": "1.0.0",
        "status": "running",
        "modules": {
            "procurement": {
                "status": "active",
                "endpoints": "GET /api/v1/procurement"
            },
            "quality": {
                "status": "active",
                "endpoints": "GET /api/v1/quality/material-receipt"
            },
            "store": {
                "status": "active",
                "endpoints": "GET /api/v1/store/inventory"
            }
        }
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "procurement-quality-portal",
        "modules": {
            "procurement": "operational",
            "quality": "operational",
            "store": "operational"
        }
    }

# API Documentation endpoint
@app.get("/api/status")
def api_status():
    return {
        "message": "Procurement Quality Portal - Unified API",
        "modules": {
            "Procurement": {
                "description": "Purchase order management and vendor tracking",
                "prefix": "/api/v1/procurement",
                "endpoints": [
                    "POST /api/v1/procurement/ - Create purchase order",
                    "GET /api/v1/procurement/ - List purchase orders",
                    "GET /api/v1/procurement/{po_id} - Get purchase order details",
                    "POST /api/v1/procurement/{po_id}/send - Send purchase order"
                ]
            },
            "Quality": {
                "description": "Quality inspection and material receipt management",
                "prefix": "/api/v1/quality",
                "endpoints": [
                    "POST /api/v1/quality/material-receipt - Create material receipt",
                    "GET /api/v1/quality/material-receipt - List material receipts",
                    "POST /api/v1/quality/inspect - Perform quality inspection",
                    "POST /api/v1/quality/checklist - Fill quality checklist",
                    "POST /api/v1/quality/quality-sheet - Create quality sheet",
                    "GET /api/v1/quality/inspection/{inspection_id} - Get inspection report"
                ]
            },
            "Store": {
                "description": "Inventory management and dispatch operations",
                "prefix": "/api/v1/store",
                "endpoints": [
                    "POST /api/v1/store/inventory - Add inventory",
                    "GET /api/v1/store/inventory - List inventory",
                    "GET /api/v1/store/inventory/{id} - Get inventory item",
                    "POST /api/v1/store/dispatch - Dispatch items",
                    "GET /api/v1/store/dispatches - List dispatch records"
                ]
            }
        }
    }

if __name__ == "__main__":
    print("=" * 80)
    print("🚀 PROCUREMENT QUALITY PORTAL - UNIFIED API")
    print("=" * 80)
    print()
    print("📊 Available Modules:")
    print("  ✅ Procurement  - Purchase order management")
    print("  ✅ Quality      - Quality inspection and control")
    print("  ✅ Store        - Inventory and dispatch management")
    print()
    print("📍 Server: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("📋 Alternative Docs: http://localhost:8000/redoc")
    print("🔍 API Status: http://localhost:8000/api/status")
    print()
    print("=" * 80)
    print("📦 Databases:")
    print(f"  • Procurement: {PROCUREMENT_DATABASE_URL}")
    print(f"  • Quality: {QUALITY_DATABASE_URL}")
    print(f"  • Store: {STORE_DATABASE_URL}")
    print("=" * 80)
    print()
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
