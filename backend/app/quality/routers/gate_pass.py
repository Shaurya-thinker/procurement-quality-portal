from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.quality.schemas.gate_pass import GatePassRead
from app.quality.services.gate_pass_service import GatePassService
from app.quality.schemas.gate_pass import GatePassCreate
from app.quality.models.gate_pass import GatePass

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
            issued_by=payload.issued_by,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/", response_model=list[GatePassRead])
def list_gate_passes(
    store_status: str | None = None,
    db: Session = Depends(get_db)
):
    return GatePassService.list_gate_passes(
        db=db,
        store_status=store_status
    )

@router.get(
    "/pending",
    response_model=list[GatePassRead]
)
def get_pending_gate_passes_for_store(
    db: Session = Depends(get_db)
):
    return db.query(GatePass).filter(
        GatePass.store_status == "PENDING"
    ).order_by(GatePass.issued_at.desc()).all()



@router.get(
    "/by-inspection/{inspection_id}",
    response_model=GatePassRead
)
def get_gate_pass_by_inspection(
    inspection_id: int,
    db: Session = Depends(get_db)
):
    gate_pass = db.query(GatePass).filter(
        GatePass.inspection_id == inspection_id
    ).first()

    if not gate_pass:
        raise HTTPException(
            status_code=404,
            detail="Gate Pass not found for this inspection"
        )

    return gate_pass


@router.get("/{gate_pass_id}", response_model=GatePassRead)
def get_gate_pass(
    gate_pass_id: int,
    db: Session = Depends(get_db)
):
    try:
        return GatePassService.get_gate_pass(db, gate_pass_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{gate_pass_id}/dispatch", response_model=GatePassRead)
def dispatch_gate_pass_to_store(
    gate_pass_id: int,
    db: Session = Depends(get_db)
):
    try:
        return GatePassService.dispatch_to_store(
            db=db,
            gate_pass_id=gate_pass_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


