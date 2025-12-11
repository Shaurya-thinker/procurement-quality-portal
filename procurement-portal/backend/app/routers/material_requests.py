from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class MRItem(BaseModel):
    product_id: str
    quantity: int
    urgency: str

class MaterialRequest(BaseModel):
    department: str
    items: List[MRItem]

@router.post("/mr")
def create_material_request(mr: MaterialRequest):
    return {"mr_id": "MR001", "status": "pending"}