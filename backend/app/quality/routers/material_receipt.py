from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.quality.schemas.material_receipt import (
    MaterialReceiptCreate,
    MaterialReceiptRead
)
from backend.app.quality.services.material_receipt_service import MaterialReceiptService

router = APIRouter(prefix="/material-receipt", tags=["Quality - Material Receipt"])


@router.post("/", response_model=MaterialReceiptRead)
def create_material_receipt(
    payload: MaterialReceiptCreate,
    db: Session = Depends(get_db)
):
    try:
        return MaterialReceiptService.create_material_receipt(db, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{mr_id}", response_model=MaterialReceiptRead)
def get_material_receipt(mr_id: int, db: Session = Depends(get_db)):
    mr = MaterialReceiptService.get_material_receipt(db, mr_id)
    if not mr:
        raise HTTPException(status_code=404, detail="Material Receipt not found")
    return mr
