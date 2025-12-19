import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import database
from backend.app.database import engine, Base, get_db, create_tables

# Import routers
from backend.app.procurement.routers.procurement import router as procurement_router
from backend.app.quality.router import router as quality_router
from backend.app.store.routers.store import router as store_router

# Create all tables
create_tables()

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

# Include routers
app.include_router(procurement_router)
app.include_router(quality_router, prefix="/api/v1/quality", tags=["Quality"])
app.include_router(store_router)

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
                "endpoints": "GET /api/v1/store/stores"
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
                    "POST /api/v1/procurement - Create purchase order",
                    "GET /api/v1/procurement - List purchase orders",
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
                    "POST /api/v1/quality/inspect - Perform quality inspection"
                ]
            },
            "Store": {
                "description": "Inventory and store management",
                "prefix": "/api/v1/store",
                "endpoints": [
                    "GET /api/v1/store/stores - List stores",
                    "POST /api/v1/store/stores - Create store",
                    "GET /api/v1/store/stores/{id} - Get store details",
                    "POST /api/v1/store/stores/{id}/bins - Add bin to store"
                ]
            }
        }
    }

if __name__ == "__main__":
    print("=" * 80)
    print("PROCUREMENT QUALITY PORTAL - STARTING SERVER")
    print("=" * 80)
    print()
    print("Available Modules:")
    print("  * Procurement  - Purchase order management")
    print("  * Quality      - Quality inspection and control")
    print("  * Store        - Store and inventory management")
    print()
    print("Server: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    print()
    print("=" * 80)
    print()
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
