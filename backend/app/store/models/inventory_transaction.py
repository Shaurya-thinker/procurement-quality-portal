from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from app.core.db import Base

class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id = Column(Integer, primary_key=True, index=True)

    inventory_item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)

    transaction_type = Column(
        Enum("IN", "OUT", "REVERSAL", name="inventory_transaction_type"),
        nullable=False
    )

    quantity = Column(Integer, nullable=False)

    reference_type = Column(String, nullable=False)  
    reference_id = Column(Integer, nullable=False)

    remarks = Column(String)

    created_by = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
