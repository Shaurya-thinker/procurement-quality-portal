from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from typing import List
from app.core.dependencies import require_store_role
from app.core.db import get_db
from app.store.schemas.material_dispatch import MaterialDispatchCreate, MaterialDispatchRead, MaterialDispatchUpdate
from app.store.services.material_dispatch_service import MaterialDispatchService
from app.store.schemas.material_dispatch import MaterialDispatchCancel

router = APIRouter(prefix="/api/v1/store/material-dispatch", tags=["Material Dispatch"])

@router.post("/", response_model=MaterialDispatchRead)
def create_material_dispatch(
    dispatch: MaterialDispatchCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_store_role)
):
    """Create a new material dispatch"""
    print(f"[DEBUG] Controller hit - creating dispatch: {dispatch.dict()}")
    try:
        print(f"[DEBUG] Calling service create_material_dispatch")
        result = MaterialDispatchService.create_material_dispatch(db, dispatch)
        print(f"[DEBUG] Service returned: {result}")
        return result
    except ValueError as e:
        print(f"[DEBUG] ValueError: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"[DEBUG] Exception: {type(e).__name__}: {str(e)}")
        import traceback
        print(f"[DEBUG] Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to create material dispatch: {str(e)}")

@router.get("/", response_model=List[MaterialDispatchRead])
def get_material_dispatches(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    _: None = Depends(require_store_role)
):
    """Get all material dispatches"""
    return MaterialDispatchService.get_material_dispatches(db, skip, limit)

@router.get("/{dispatch_id}", response_model=MaterialDispatchRead)
def get_material_dispatch(
    dispatch_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(require_store_role)
):
    """Get material dispatch by ID"""
    dispatch = MaterialDispatchService.get_material_dispatch(db, dispatch_id)
    if not dispatch:
        raise HTTPException(status_code=404, detail="Material dispatch not found")
    return dispatch

@router.put("/{dispatch_id}", response_model=MaterialDispatchRead)
def update_material_dispatch(
    dispatch_id: int,
    dispatch_update: MaterialDispatchUpdate,
    db: Session = Depends(get_db),
    _: None = Depends(require_store_role)
):
    """Update material dispatch"""
    try:
        dispatch = MaterialDispatchService.update_material_dispatch(db, dispatch_id, dispatch_update)
        if not dispatch:
            raise HTTPException(status_code=404, detail="Material dispatch not found")
        return dispatch
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update material dispatch")
    

@router.post("/{dispatch_id}/cancel", response_model=MaterialDispatchRead)
def cancel_material_dispatch(
    dispatch_id: int,
    payload: MaterialDispatchCancel,
    authorization: str = Header(None),
    db: Session = Depends(get_db),
    _: None = Depends(require_store_role)
):
    cancelled_by = "store_user"
    if authorization and authorization.startswith("Bearer "):
        cancelled_by = "authenticated_user"

    try:
        dispatch = MaterialDispatchService.cancel_material_dispatch(
            db=db,
            dispatch_id=dispatch_id,
            cancelled_by=cancelled_by,
            cancel_reason=payload.cancel_reason
        )
        return MaterialDispatchRead.from_orm(dispatch)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

