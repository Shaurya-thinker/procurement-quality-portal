from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.db import get_db
from backend.app.quality.schemas.gate_pass import GatePassRead
from backend.app.quality.services.gate_pass_service import GatePassService
from backend.app.quality.schemas.gate_pass import GatePassCreate

router = APIRouter(prefix="/gate-pass", tags=["Quality - Gate Pass"])


@router.post("/", response_model=GatePassRead)
def generate_gate_pass(
    payload: GatePassCreate,
    db: Session = Depends(get_db)
):
    try:
        return GatePassService.generate_gate_pass(
            db=db,
            inspection_id=payload.inspection_id,
            issued_by=payload.issued_by
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
