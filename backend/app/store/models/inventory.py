from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from datetime import datetime
from app.core.db import Base


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)

    item_id = Column(Integer, nullable=False, index=True)

    store_id = Column(Integer, nullable=False)
    bin_id = Column(Integer, nullable=False)

    quantity = Column(Integer, nullable=False)

    gate_pass_id = Column(Integer, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint(
            "item_id",
            "store_id",
            "bin_id",
            "gate_pass_id",
            name="uq_inventory_gate_pass"
        ),
    )
