from datetime import datetime, date
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.core.db import Base


class MaterialReceipt(Base):
    __tablename__ = "material_receipts"

    id = Column(Integer, primary_key=True, index=True)
    mr_number = Column(String(50), unique=True, nullable=False, index=True)

    # References
    po_id = Column(Integer, nullable=False, index=True)
    vendor_id = Column(Integer, nullable=False, index=True)

    vendor_name = Column(String(255), nullable=True)
    component_details = Column(String(1000), nullable=True)

    # Company-required fields
    bill_no = Column(String(50), nullable=True)
    entry_no = Column(String(50), nullable=True)
    mr_reference_no = Column(String(50), nullable=True)

    receipt_date = Column(Date, nullable=True)  # user-entered date
    vehicle_no = Column(String(50), nullable=True)
    challan_no = Column(String(50), nullable=True)

    store_id = Column(Integer, nullable=True)
    bin_id = Column(Integer, nullable=True)

    remarks = Column(String(500), nullable=True)
    received_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="CREATED")
    # CREATED → INSPECTED → GATE_PASSED

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

    material_receipt = relationship(
        "MaterialReceipt",
        back_populates="lines"
    )
