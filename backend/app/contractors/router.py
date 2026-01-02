from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.contractors.models import Contractor
from app.contractors.schemas import ContractorCreate, ContractorOut, ContractorUpdate


router = APIRouter(
    prefix="/api/v1/contractors",
    tags=["Contractors"],
)


@router.get("/", response_model=list[ContractorOut])
def list_contractors(db: Session = Depends(get_db)):
    return db.query(Contractor).all()

@router.get("/{contractor_id}", response_model=ContractorOut)
def get_contractor(contractor_id: int, db: Session = Depends(get_db)):
    contractor = db.query(Contractor).filter(Contractor.id == contractor_id).first()
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor not found")
    return contractor

@router.post("/", response_model=ContractorOut)
def create_contractor(
    payload: ContractorCreate,
    db: Session = Depends(get_db),
):
    contractor = Contractor(**payload.dict())
    db.add(contractor)
    db.commit()
    db.refresh(contractor)
    return contractor

@router.put("/{contractor_id}", response_model=ContractorOut)
def update_contractor(
    contractor_id: int,
    payload: ContractorUpdate,
    db: Session = Depends(get_db),
):
    contractor = db.query(Contractor).filter(Contractor.id == contractor_id).first()
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor not found")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(contractor, field, value)

    db.commit()
    db.refresh(contractor)
    return contractor


@router.delete("/{contractor_id}")
def delete_contractor(contractor_id: int, db: Session = Depends(get_db)):
    contractor = db.query(Contractor).filter(Contractor.id == contractor_id).first()
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor not found")

    db.delete(contractor)
    db.commit()
    return {"message": "Contractor deleted"}


@router.post("/{contractor_id}/deactivate", response_model=ContractorOut)
def deactivate_contractor(contractor_id: int, db: Session = Depends(get_db)):
    contractor = db.query(Contractor).filter(Contractor.id == contractor_id).first()
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor not found")

    contractor.status = "INACTIVE"
    db.commit()
    db.refresh(contractor)
    return contractor


@router.post("/{contractor_id}/deactivate", response_model=ContractorOut)
def deactivate_contractor(contractor_id: int, db: Session = Depends(get_db)):
    contractor = db.query(Contractor).filter(Contractor.id == contractor_id).first()
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor not found")

    contractor.status = "INACTIVE"
    db.commit()
    db.refresh(contractor)
    return contractor



