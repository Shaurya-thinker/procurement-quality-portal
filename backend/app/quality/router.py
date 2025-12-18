from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .schemas import (
    MaterialReceiptCreate, MaterialReceiptRead,
    QualityInspectionCreate, QualityInspectionRead,
    QualityChecklistCreate, QualityChecklistRead,
    QualitySheetCreate, QualitySheetRead
)
from .services import QualityService
from .models import ReceiptStatus

router = APIRouter()

@router.post("/material-receipt", response_model=MaterialReceiptRead, status_code=status.HTTP_201_CREATED)
def create_material_receipt(
    receipt_create: MaterialReceiptCreate,
    db: Session = Depends(get_db)
):
    try:
        receipt = QualityService.create_material_receipt(db, receipt_create)
        return MaterialReceiptRead.model_validate(receipt)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/material-receipt", response_model=List[MaterialReceiptRead])
def get_material_receipts(
    status: Optional[ReceiptStatus] = None,
    db: Session = Depends(get_db)
):
    receipts = QualityService.get_material_receipts(db, status)
    return [MaterialReceiptRead.model_validate(receipt) for receipt in receipts]

@router.post("/inspect", response_model=QualityInspectionRead, status_code=status.HTTP_201_CREATED)
def inspect_material(
    inspection_create: QualityInspectionCreate,
    db: Session = Depends(get_db)
):
    try:
        inspection = QualityService.inspect_material(db, inspection_create)
        return QualityInspectionRead.model_validate(inspection)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/checklist", response_model=QualityChecklistRead, status_code=status.HTTP_201_CREATED)
def create_quality_checklist(
    checklist_create: QualityChecklistCreate,
    db: Session = Depends(get_db)
):
    try:
        checklist = QualityService.create_quality_checklist(db, checklist_create)
        return QualityChecklistRead.model_validate(checklist)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/quality-sheet", response_model=QualitySheetRead, status_code=status.HTTP_201_CREATED)
def create_quality_sheet(
    sheet_create: QualitySheetCreate,
    db: Session = Depends(get_db)
):
    try:
        sheet = QualityService.create_quality_sheet(db, sheet_create)
        return QualitySheetRead.model_validate(sheet)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/inspection/{inspection_id}", response_model=QualityInspectionRead)
def get_inspection_report(
    inspection_id: int,
    db: Session = Depends(get_db)
):
    inspection = QualityService.get_inspection_report(db, inspection_id)
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return QualityInspectionRead.model_validate(inspection)