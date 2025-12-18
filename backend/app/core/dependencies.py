from fastapi import HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from typing import Optional

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Database dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def require_store_role(authorization: Optional[str] = Header(None)):
    """Store role auth dependency - validates store role from token or returns True for demo"""
    # For demo purposes, if authorization header is present, allow access
    # In production, you would validate the token and check the role
    if authorization and authorization.startswith("Bearer "):
        return True
    # Allow access without token for demo
    return True
