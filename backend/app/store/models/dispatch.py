from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.core.db import Base


class Dispatch(Base):
    __tablename__ = "dispatches"
    
    id = Column(Integer, primary_key=True, index=True)
    inventory_item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    requested_by = Column(String(255), nullable=False)
    dispatched_at = Column(DateTime, default=datetime.utcnow)
    reference = Column(String(255), nullable=True)