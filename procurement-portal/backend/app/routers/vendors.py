from fastapi import APIRouter

router = APIRouter()

@router.get("/vendors")
def get_vendors():
    return {"vendors": []}