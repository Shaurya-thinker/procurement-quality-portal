from sqlalchemy.orm import Session
from typing import List, Optional
from .models import MaterialReceipt, QualityInspection, QualityChecklist, QualitySheet, ReceiptStatus
from .schemas import MaterialReceiptCreate, QualityInspectionCreate, QualityChecklistCreate, QualitySheetCreate

class QualityService:
    
    @staticmethod
    def create_material_receipt(db: Session, receipt_create: MaterialReceiptCreate) -> MaterialReceipt:
        receipt = MaterialReceipt(
            po_id=receipt_create.po_id,
            vendor_id=receipt_create.vendor_id,
            received_by=receipt_create.received_by,
            status=ReceiptStatus.RECEIVED
        )
        db.add(receipt)
        db.commit()
        db.refresh(receipt)
        return receipt
    
    @staticmethod
    def get_material_receipts(db: Session, status: Optional[ReceiptStatus] = None) -> List[MaterialReceipt]:
        query = db.query(MaterialReceipt)
        if status:
            query = query.filter(MaterialReceipt.status == status)
        return query.all()
    
    @staticmethod
    def inspect_material(db: Session, inspection_create: QualityInspectionCreate) -> QualityInspection:
        receipt = db.query(MaterialReceipt).filter(
            MaterialReceipt.id == inspection_create.material_receipt_id
        ).first()
        
        if not receipt:
            raise ValueError("Material receipt not found")
        
        inspection = QualityInspection(
            material_receipt_id=inspection_create.material_receipt_id,
            inspector_name=inspection_create.inspector_name,
            total_quantity=inspection_create.total_quantity,
            accepted_quantity=inspection_create.accepted_quantity,
            rejected_quantity=inspection_create.rejected_quantity,
            remarks=inspection_create.remarks
        )
        
        db.add(inspection)
        receipt.status = ReceiptStatus.INSPECTED
        db.commit()
        db.refresh(inspection)
        return inspection
    
    @staticmethod
    def create_quality_checklist(db: Session, checklist_create: QualityChecklistCreate) -> QualityChecklist:
        inspection = db.query(QualityInspection).filter(
            QualityInspection.id == checklist_create.inspection_id
        ).first()
        
        if not inspection:
            raise ValueError("Inspection not found")
        
        checklist = QualityChecklist(
            inspection_id=checklist_create.inspection_id,
            visual_inspection=checklist_create.visual_inspection,
            dimension_check=checklist_create.dimension_check,
            weight_check=checklist_create.weight_check,
            color_check=checklist_create.color_check,
            packaging_check=checklist_create.packaging_check,
            documentation_check=checklist_create.documentation_check,
            additional_notes=checklist_create.additional_notes
        )
        
        db.add(checklist)
        db.commit()
        db.refresh(checklist)
        return checklist
    
    @staticmethod
    def create_quality_sheet(db: Session, sheet_create: QualitySheetCreate) -> QualitySheet:
        inspection = db.query(QualityInspection).filter(
            QualityInspection.id == sheet_create.inspection_id
        ).first()
        
        if not inspection:
            raise ValueError("Inspection not found")
        
        sheet = QualitySheet(
            inspection_id=sheet_create.inspection_id,
            temperature=sheet_create.temperature,
            humidity=sheet_create.humidity,
            batch_number=sheet_create.batch_number,
            expiry_date=sheet_create.expiry_date,
            supplier_certificate=sheet_create.supplier_certificate,
            test_results=sheet_create.test_results,
            compliance_status=sheet_create.compliance_status
        )
        
        db.add(sheet)
        db.commit()
        db.refresh(sheet)
        return sheet
    
    @staticmethod
    def get_inspection_report(db: Session, inspection_id: int) -> Optional[QualityInspection]:
        return db.query(QualityInspection).filter(
            QualityInspection.id == inspection_id
        ).first()