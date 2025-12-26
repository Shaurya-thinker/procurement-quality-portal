from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.db import Base


class QualityInspection(Base):
    __tablename__ = "quality_inspections"

    id = Column(Integer, primary_key=True, index=True)
    mr_id = Column(Integer, ForeignKey("material_receipts.id"), unique=True)

    inspected_by = Column(String(100), nullable=False)
    remarks = Column(String(500), nullable=True)
    inspected_at = Column(DateTime, default=datetime.utcnow)
    result = Column(String(30), nullable=False)

    material_receipt = relationship("MaterialReceipt")  # ✅ ADD THIS

    lines = relationship(
    "backend.app.quality.models.inspection.QualityInspectionLine",
    back_populates="inspection",
    cascade="all, delete-orphan",
    lazy="joined"
    )



class QualityInspectionLine(Base):
    __tablename__ = "quality_inspection_lines"

    id = Column(Integer, primary_key=True, index=True)

    inspection_id = Column(Integer, ForeignKey("quality_inspections.id"))
    mr_line_id = Column(Integer, nullable=False)

    accepted_quantity = Column(Integer, nullable=False)
    rejected_quantity = Column(Integer, nullable=False)

    inspection = relationship("QualityInspection", back_populates="lines")
