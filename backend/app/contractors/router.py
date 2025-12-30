from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.contractors.models import Contractor
from app.contractors.schemas import ContractorCreate, ContractorOut


router = APIRouter(
    prefix="/api/v1/contractors",
    tags=["Contractors"],
)


@router.get("/", response_model=list[ContractorOut])
def list_contractors(db: Session = Depends(get_db)):
    return db.query(Contractor).all()


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