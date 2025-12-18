"""Global pytest configuration and fixtures."""

import pytest
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

# Import all models to ensure they're registered
from backend.app.procurement.models import Base as ProcurementBase
from backend.app.quality.models import Base as QualityBase  
from backend.app.store.models import Base as StoreBase


@pytest.fixture(scope="session")
def procurement_engine():
    """Create a procurement database engine for testing."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    ProcurementBase.metadata.create_all(bind=engine)
    return engine


@pytest.fixture(scope="session")
def quality_engine():
    """Create a quality database engine for testing."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    QualityBase.metadata.create_all(bind=engine)
    return engine


@pytest.fixture(scope="session")
def store_engine():
    """Create a store database engine for testing."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    StoreBase.metadata.create_all(bind=engine)
    return engine


@pytest.fixture(scope="function")
def procurement_db(procurement_engine) -> Generator[Session, None, None]:
    """Create a fresh procurement database session for each test."""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=procurement_engine)
    db = SessionLocal()
    yield db
    db.close()


@pytest.fixture(scope="function")
def quality_db(quality_engine) -> Generator[Session, None, None]:
    """Create a fresh quality database session for each test."""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=quality_engine)
    db = SessionLocal()
    yield db
    db.close()


@pytest.fixture(scope="function")
def store_db(store_engine) -> Generator[Session, None, None]:
    """Create a fresh store database session for each test."""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=store_engine)
    db = SessionLocal()
    yield db
    db.close()


# Test data fixtures
@pytest.fixture
def sample_test_data():
    """Common test data used across modules."""
    return {
        "vendor_id": 123,
        "item_data": {
            "name": "Test Item",
            "code": "TEST-001", 
            "unit": "pcs",
            "description": "Test item for integration tests"
        },
        "po_data": {
            "vendor_id": 123,
            "lines": [
                {"item_id": 1, "quantity": 10, "price": "99.99"}
            ]
        }
    }