from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.quality.schemas.inspection import (
    InspectionCreate,
    InspectionRead
)
from app.quality.services.inspection_service import InspectionService
from app.quality.models.inspection import QualityInspection

router = APIRouter(prefix="/inspection", tags=["Quality - Inspection"])


@router.post("/", response_model=InspectionRead)
def inspect_material(
    payload: InspectionCreate,
    db: Session = Depends(get_db)
):
    try:
        return InspectionService.inspect_material(db, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{inspection_id}", response_model=InspectionRead)
def get_inspection(inspection_id: int, db: Session = Depends(get_db)):
    inspection = InspectionService.get_inspection(db, inspection_id)
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return inspection

