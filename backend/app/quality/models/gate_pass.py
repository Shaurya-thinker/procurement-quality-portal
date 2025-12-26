from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.db import Base



class GatePass(Base):
    __tablename__ = "gate_passes"

    id = Column(Integer, primary_key=True, index=True)
    gate_pass_number = Column(String(50), unique=True, nullable=False)

    po_id = Column(Integer, nullable=False)
    mr_id = Column(Integer, nullable=False)
    inspection_id = Column(Integer, nullable=False)

    issued_by = Column(String(100), nullable=False)
    issued_at = Column(DateTime, default=datetime.utcnow)

    items = relationship(
    "backend.app.quality.models.gate_pass.GatePassItem",
    back_populates="gate_pass",
    cascade="all, delete-orphan"
    )


class GatePassItem(Base):
    __tablename__ = "gate_pass_items"

    id = Column(Integer, primary_key=True)
    gate_pass_id = Column(Integer, ForeignKey("gate_passes.id"), nullable=False)

    item_id = Column(Integer, nullable=False)
    accepted_quantity = Column(Integer, nullable=False)

    gate_pass = relationship(
        "GatePass",
        back_populates="items"
    )
