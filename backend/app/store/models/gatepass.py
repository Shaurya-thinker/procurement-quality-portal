from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.db import Base


class GatePass(Base):
    __tablename__ = "gatepasses"
    
    id = Column(Integer, primary_key=True, index=True)
    po_id = Column(Integer, nullable=True)
    mr_id = Column(Integer, nullable=True)
    issued_at = Column(DateTime, default=datetime.utcnow)
    issued_by = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)