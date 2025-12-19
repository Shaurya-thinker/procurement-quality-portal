from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class ReceiptStatus(enum.Enum):
    RECEIVED = "RECEIVED"
    INSPECTED = "INSPECTED"

class MaterialReceipt(Base):
    __tablename__ = "material_receipts"
    
    id = Column(Integer, primary_key=True, index=True)
    po_id = Column(Integer, nullable=False)
    vendor_id = Column(Integer, nullable=False)
    received_at = Column(DateTime, default=datetime.utcnow)
    received_by = Column(String(100), nullable=False)
    status = Column(Enum(ReceiptStatus), default=ReceiptStatus.RECEIVED)
    
    # New required attributes
    bill_no = Column(String(50), nullable=False)
    date = Column(DateTime, nullable=False)
    vehicle_no = Column(String(20), nullable=True)
    entry_no = Column(String(50), nullable=False)
    vendor_name = Column(String(200), nullable=False)
    component_details = Column(Text, nullable=False)
    quantity = Column(Integer, nullable=False)
    store_no_bin_no = Column(String(50), nullable=True)
    purchase_number = Column(String(50), nullable=False)
    mr_reference_no = Column(String(50), nullable=False, unique=True)
    
    inspections = relationship("QualityInspection", back_populates="material_receipt")

class QualityInspection(Base):
    __tablename__ = "quality_inspections"
    
    id = Column(Integer, primary_key=True, index=True)
    material_receipt_id = Column(Integer, ForeignKey("material_receipts.id"), nullable=False)
    inspected_at = Column(DateTime, default=datetime.utcnow)
    inspector_name = Column(String(100), nullable=False)
    total_quantity = Column(Integer, nullable=False)
    accepted_quantity = Column(Integer, nullable=False)
    rejected_quantity = Column(Integer, nullable=False)
    remarks = Column(Text)
    
    material_receipt = relationship("MaterialReceipt", back_populates="inspections")
    checklist = relationship("QualityChecklist", back_populates="inspection", uselist=False)
    quality_sheet = relationship("QualitySheet", back_populates="inspection", uselist=False)

class QualityChecklist(Base):
    __tablename__ = "quality_checklists"
    
    id = Column(Integer, primary_key=True, index=True)
    inspection_id = Column(Integer, ForeignKey("quality_inspections.id"), nullable=False)
    visual_inspection = Column(Boolean, default=False)
    dimension_check = Column(Boolean, default=False)
    weight_check = Column(Boolean, default=False)
    color_check = Column(Boolean, default=False)
    packaging_check = Column(Boolean, default=False)
    documentation_check = Column(Boolean, default=False)
    additional_notes = Column(Text)
    
    inspection = relationship("QualityInspection", back_populates="checklist")

class QualitySheet(Base):
    __tablename__ = "quality_sheets"
    
    id = Column(Integer, primary_key=True, index=True)
    inspection_id = Column(Integer, ForeignKey("quality_inspections.id"), nullable=False)
    temperature = Column(Float)
    humidity = Column(Float)
    batch_number = Column(String(50))
    expiry_date = Column(String(20))
    supplier_certificate = Column(String(100))
    test_results = Column(Text)
    compliance_status = Column(String(20))
    
    inspection = relationship("QualityInspection", back_populates="quality_sheet")

__all__ = [
    "Base",
    "ReceiptStatus",
    "MaterialReceipt",
    "QualityInspection",
    "QualityChecklist",
    "QualitySheet",
]
