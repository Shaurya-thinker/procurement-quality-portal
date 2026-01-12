from sqlalchemy import Column, Integer, String, Text
from app.core.db import Base


class Item(Base):
    """Item model representing products/goods in the procurement system."""
    
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    code = Column(String(100), unique=True, nullable=False, index=True)
    unit = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<Item(id={self.id}, code={self.code}, name={self.name})>"
