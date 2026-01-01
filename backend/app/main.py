import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import time

# Import database
from app.core.db import create_tables


# Import routers
from app.procurement.routers.procurement import router as procurement_router
from app.quality.routers import (
    material_receipt_router,
    inspection_router,
    gate_pass_router,
)
from app.store.routers.store import router as store_router
from app.attendance.routers.attendance import router as attendance_router
from app.store.services.store_service import StoreService
from app.store.routers.material_dispatch import router as material_dispatch_router
from app.announcements.router import router as announcements_router


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

# Global request logger middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    print(f"\n🔵 [INCOMING] {request.method} {request.url.path}")

    response = await call_next(request)

    process_time = time.time() - start_time
    status_emoji = "✅" if response.status_code < 400 else "❌"
    print(f"{status_emoji} [{response.status_code}] {process_time:.3f}s\n")

    return response

# Include routers
app.include_router(procurement_router)
app.include_router(material_receipt_router, prefix="/api/v1/quality")
app.include_router(inspection_router, prefix="/api/v1/quality")
app.include_router(gate_pass_router, prefix="/api/v1/quality")
app.include_router(store_router)
app.include_router(material_dispatch_router)
app.include_router(attendance_router, prefix="/api/v1/attendance", tags=["Attendance"])

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
            },
            "attendance": {
                "status": "active",
                "endpoints": "GET /api/v1/attendance/today/{user_id}"
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

if __name__ == "__main__":
    print("\n" + "=" * 80)
    print("PROCUREMENT QUALITY PORTAL - STARTING SERVER")
    print("=" * 80)
    print("\nRegistered Routes:")
    for route in app.routes:
        if hasattr(route, "path") and hasattr(route, "methods"):
            methods = ",".join(route.methods) if route.methods else "N/A"
            print(f"   {methods:8} {route.path}")
    print("\n" + "=" * 80 + "\n")

    uvicorn.run(app, host="0.0.0.0", port=8000)
