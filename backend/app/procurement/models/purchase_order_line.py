from decimal import Decimal
from sqlalchemy import Column, Integer, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.core.db import Base



class PurchaseOrderLine(Base):
    """Purchase Order Line item model."""
    
    __tablename__ = "purchase_order_lines"
    
    id = Column(Integer, primary_key=True, index=True)
    po_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=False, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(precision=12, scale=2), nullable=False)
    
    # Relationship back to PurchaseOrder
    purchase_order = relationship(
        "PurchaseOrder",
        back_populates="lines"
    )
    
    def __repr__(self):
        return f"<PurchaseOrderLine(id={self.id}, po_id={self.po_id}, item_id={self.item_id}, quantity={self.quantity})>"
