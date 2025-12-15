from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..core.db import Base
from .routers.store import router as store_router

# SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Procurement Quality Portal", version="1.0.0")

# Include routers
app.include_router(store_router)

@app.get("/")
def read_root():
    return {"message": "Procurement Quality Portal API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}