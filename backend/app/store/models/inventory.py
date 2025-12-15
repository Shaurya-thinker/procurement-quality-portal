from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.db import Base


class InventoryItem(Base):
    __tablename__ = "inventory_items"
    
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, nullable=False, index=True)
    quantity = Column(Integer, nullable=False, default=0)
    location = Column(String(255), nullable=False)
    source_reference = Column(String(255), nullable=True)  # inspection_id or accepted_material_id
    created_at = Column(DateTime, default=datetime.utcnow)