from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, Boolean, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.core.db import Base
from datetime import datetime
import enum

class DispatchStatus(enum.Enum):
    DRAFT = "DRAFT"
    DISPATCHED = "DISPATCHED"
    CANCELLED = "CANCELLED"

class ReferenceType(enum.Enum):
    PO = "PO"
    SO = "SO"
    TRANSFER = "TRANSFER"

class MaterialDispatch(Base):
    __tablename__ = "material_dispatches"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Dispatch Header
    dispatch_number = Column(String(50), unique=True, nullable=False, index=True)
    dispatch_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    dispatch_status = Column(Enum(DispatchStatus), default=DispatchStatus.DRAFT, nullable=False)
    reference_type = Column(Enum(ReferenceType), nullable=False)
    reference_id = Column(String(50), nullable=False)
    warehouse_id = Column(Integer, nullable=False)
    created_by = Column(String(100), nullable=False)
    remarks = Column(Text, nullable=True)
    
    # Receiver & Transport
    receiver_name = Column(String(200), nullable=False)
    receiver_contact = Column(String(20), nullable=False)
    delivery_address = Column(Text, nullable=False)
    vehicle_number = Column(String(20), nullable=False)
    driver_name = Column(String(100), nullable=False)
    driver_contact = Column(String(20), nullable=False)
    eway_bill_number = Column(String(50), nullable=True)
    
    # Audit Fields
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    line_items = relationship("MaterialDispatchLineItem", back_populates="dispatch", cascade="all, delete-orphan")

class MaterialDispatchLineItem(Base):
    __tablename__ = "material_dispatch_line_items"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Key
    dispatch_id = Column(Integer, ForeignKey("material_dispatches.id"), nullable=False)

    inventory_item_id = Column(
    Integer,
    ForeignKey("inventory_items.id"),
    nullable=False
)

    
    # Line Item Fields
    item_id = Column(Integer, nullable=False)
    item_code = Column(String(50), nullable=False)
    item_name = Column(String(200), nullable=False)
    quantity_dispatched = Column(Numeric(10, 3), nullable=False)
    uom = Column(String(20), nullable=False)
    batch_number = Column(String(50), nullable=True)
    remarks = Column(Text, nullable=True)
    
    # Audit Fields
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    dispatch = relationship("MaterialDispatch", back_populates="line_items")
