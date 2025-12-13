import sys
from pathlib import Path

# Add workspace root to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.procurement.models import Base
from backend.app.procurement.routers.procurement import router as procurement_router, get_db

# Database setup
DATABASE_URL = "sqlite:///./procurement.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(title="Procurement API", version="1.0.0")

# Override get_db dependency
def get_db_override():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = get_db_override

# Include routers
app.include_router(procurement_router, prefix="/api/v1/procurement", tags=["procurement"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
