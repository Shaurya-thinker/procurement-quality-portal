from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, Enum
from datetime import datetime
from backend.app.core.db import Base
import enum

class DispatchStatus(enum.Enum):
    DRAFT = "DRAFT"
    ISSUED = "ISSUED"
    CANCELLED = "CANCELLED"

class DispatchType(enum.Enum):
    INTERNAL = "INTERNAL"
    EXTERNAL = "EXTERNAL"

class Dispatch(Base):
    __tablename__ = "dispatches"
    
    id = Column(Integer, primary_key=True, index=True)
    dispatch_number = Column(String(50), nullable=False, unique=True, index=True)
    dispatch_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    dispatch_type = Column(Enum(DispatchType), nullable=False, default=DispatchType.INTERNAL)
    status = Column(Enum(DispatchStatus), nullable=False, default=DispatchStatus.DRAFT)
    
    # Location and recipient info
    store = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    vendor = Column(String(100), nullable=True)
    project_site = Column(String(100), nullable=True)
    
    # Personnel
    issued_by = Column(String(100), nullable=False)
    received_by = Column(String(100), nullable=False)
    
    # Transport details
    vehicle_number = Column(String(50), nullable=True)
    gate_pass_number = Column(String(50), nullable=True)
    
    # Additional info
    remarks = Column(Text, nullable=True)
    total_value = Column(Float, nullable=True, default=0.0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DispatchItem(Base):
    __tablename__ = "dispatch_items"
    
    id = Column(Integer, primary_key=True, index=True)
    dispatch_id = Column(Integer, ForeignKey("dispatches.id"), nullable=False)
    
    item_code = Column(String(50), nullable=False)
    item_name = Column(String(200), nullable=False)
    unit = Column(String(20), nullable=False)
    dispatch_qty = Column(Float, nullable=False)
    batch_lot = Column(String(50), nullable=True)
    rate = Column(Float, nullable=True, default=0.0)
    line_value = Column(Float, nullable=True, default=0.0)