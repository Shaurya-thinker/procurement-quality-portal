from pydantic import BaseModel, EmailStr
from typing import Optional


class ContractorCreate(BaseModel):
    # Basic identity
    name: str
    contact_person: Optional[str] = None

    # Contact details
    phone: str
    alternate_phone: Optional[str] = None
    email: Optional[EmailStr] = None

    # Address & notes
    address: Optional[str] = None
    remarks: Optional[str] = None

    # Control
    status: Optional[str] = "ACTIVE"


class ContractorOut(ContractorCreate):
    id: int

    class Config:
        from_attributes = True


class ContractorUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    alternate_phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    remarks: Optional[str] = None
    status: Optional[str] = None
