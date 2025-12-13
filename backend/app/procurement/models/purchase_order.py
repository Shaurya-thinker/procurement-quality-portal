from datetime import datetime
from enum import Enum
from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.procurement.models.item import Base


class POStatus(str, Enum):
    """Purchase Order status enumeration."""
    DRAFT = "DRAFT"
    SENT = "SENT"


class PurchaseOrder(Base):
    """Purchase Order model."""
    
    __tablename__ = "purchase_orders"
    
    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String(100), unique=True, nullable=False, index=True)
    vendor_id = Column(Integer, nullable=False, index=True)
    status = Column(SQLEnum(POStatus), default=POStatus.DRAFT, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship to PurchaseOrderLine
    lines = relationship(
        "PurchaseOrderLine",
        back_populates="purchase_order",
        cascade="all, delete-orphan",
        lazy="joined"
    )
    
    def __repr__(self):
        return f"<PurchaseOrder(id={self.id}, po_number={self.po_number}, status={self.status})>"
