from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.quality.schemas.gate_pass import GatePassRead
from backend.app.quality.services.gate_pass_service import GatePassService

router = APIRouter(prefix="/gate-pass", tags=["Quality - Gate Pass"])


@router.post("/{inspection_id}", response_model=GatePassRead)
def generate_gate_pass(
    inspection_id: int,
    issued_by: str,
    db: Session = Depends(get_db)
):
    try:
        return GatePassService.generate_gate_pass(
            db=db,
            inspection_id=inspection_id,
            issued_by=issued_by
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
