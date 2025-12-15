from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.quality.router import router as quality_router
from backend.app.quality.models import Base
from backend.app.database import engine
import uvicorn

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Quality Management API",
    description="Complete Quality User Implementation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quality_router, prefix="/api/v1/quality", tags=["Quality"])

@app.get("/")
def root():
    return {
        "message": "Quality Management API is running!",
        "status": "healthy",
        "capabilities": {
            "view_mrs": "GET /api/v1/quality/material-receipt",
            "perform_quality_checking": "POST /api/v1/quality/inspect",
            "fill_quality_checklist": "POST /api/v1/quality/checklist",
            "fill_quality_sheet": "POST /api/v1/quality/quality-sheet",
            "enter_accepted_rejected_quantity": "included in inspect endpoint"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "quality-backend"}

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 QUALITY USER API - ALL CAPABILITIES IMPLEMENTED")
    print("=" * 60)
    print("📍 Server: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("=" * 60)
    print("✅ Quality User CAN:")
    print("  - View MRs: GET /api/v1/quality/material-receipt")
    print("  - Perform Quality Checking: POST /api/v1/quality/inspect")
    print("  - Fill Quality Checklist: POST /api/v1/quality/checklist")
    print("  - Fill Quality Sheet: POST /api/v1/quality/quality-sheet")
    print("  - Enter Accepted & Rejected Quantity: (in inspect endpoint)")
    print("=" * 60)
    print("❌ Quality User CANNOT:")
    print("  - Create PO: No procurement endpoints")
    print("  - Dispatch to store: No store endpoints")
    print("=" * 60)
    
    uvicorn.run(app, host="localhost", port=8000)