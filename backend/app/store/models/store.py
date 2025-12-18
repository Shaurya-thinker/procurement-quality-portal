from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.db import Base


class Store(Base):
    __tablename__ = "stores"
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    plant_name = Column(String(255), nullable=False)
    in_charge_name = Column(String(255), nullable=False)
    in_charge_mobile = Column(String(20), nullable=False)
    in_charge_email = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    bins = relationship("Bin", back_populates="store", cascade="all, delete-orphan")


class Bin(Base):
    __tablename__ = "bins"
    
    id = Column(Integer, primary_key=True, index=True)
    bin_no = Column(String(50), nullable=False, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    component_details = Column(String(255), nullable=True)
    quantity = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    store = relationship("Store", back_populates="bins")
