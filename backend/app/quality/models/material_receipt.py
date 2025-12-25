from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.db import Base



class MaterialReceipt(Base):
    __tablename__ = "material_receipts"

    id = Column(Integer, primary_key=True, index=True)

    mr_number = Column(String(50), unique=True, nullable=False, index=True)

    po_id = Column(Integer, nullable=False, index=True)
    vendor_id = Column(Integer, nullable=False, index=True)

    vehicle_no = Column(String(50), nullable=True)
    challan_no = Column(String(50), nullable=True)

    received_at = Column(DateTime, default=datetime.utcnow)

    status = Column(String(20), default="CREATED")  
    # CREATED → INSPECTED

    lines = relationship(
    "MaterialReceiptLine",
    back_populates="material_receipt",
    cascade="all, delete-orphan",
    lazy="joined"
    )




class MaterialReceiptLine(Base):
    __tablename__ = "material_receipt_lines"

    id = Column(Integer, primary_key=True, index=True)

    mr_id = Column(Integer, ForeignKey("material_receipts.id"), nullable=False)
    po_line_id = Column(Integer, nullable=False)

    ordered_quantity = Column(Integer, nullable=False)
    received_quantity = Column(Integer, nullable=False)

    material_receipt = relationship("MaterialReceipt", back_populates="lines")
