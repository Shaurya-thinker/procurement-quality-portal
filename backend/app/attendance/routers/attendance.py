print("[STARTUP] Attendance router file loaded")

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..services.attendance_service import AttendanceService
from ..schemas.attendance import (
    CheckInRequest,
    CheckOutRequest,
    AttendanceResponse,
    TodayAttendanceResponse,
    AttendanceHistoryResponse
)
from ...database import get_db
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
print(f"[STARTUP] Attendance APIRouter created (no prefix in router definition)")


@router.post("/check-in", response_model=AttendanceResponse)
def check_in(
    request: CheckInRequest,
    db: Session = Depends(get_db)
):
    """Check in user for today."""
    print(f"[CONTROLLER HIT] Check-in endpoint called for user {request.user_id}")
    logger.info(f"[API] Check-in request for user {request.user_id}")
    
    try:
        attendance = AttendanceService.check_in(db, request.user_id)
        logger.info(f"[API] Check-in successful for user {request.user_id}")
        return attendance
    except ValueError as e:
        logger.error(f"[API] Check-in failed for user {request.user_id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"[API] Check-in error for user {request.user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during check-in")


@router.post("/check-out", response_model=AttendanceResponse)
def check_out(
    request: CheckOutRequest,
    db: Session = Depends(get_db)
):
    """Check out user for today."""
    logger.info(f"[API] Check-out request for user {request.user_id}")
    
    try:
        attendance = AttendanceService.check_out(db, request.user_id)
        logger.info(f"[API] Check-out successful for user {request.user_id}")
        return attendance
    except ValueError as e:
        logger.error(f"[API] Check-out failed for user {request.user_id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"[API] Check-out error for user {request.user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during check-out")


@router.get("/today/{user_id}", response_model=TodayAttendanceResponse)
def get_today_attendance(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get today's attendance summary for user."""
    logger.info(f"[API] Today attendance request for user {user_id}")
    
    try:
        if user_id <= 0:
            raise HTTPException(status_code=400, detail="User ID must be positive")
        
        summary = AttendanceService.get_today_attendance(db, user_id)
        logger.info(f"[API] Today attendance retrieved for user {user_id}")
        return summary
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[API] Today attendance error for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error fetching today's attendance")


@router.get("/history/{user_id}", response_model=AttendanceHistoryResponse)
def get_attendance_history(
    user_id: int,
    limit: int = 30,
    db: Session = Depends(get_db)
):
    """Get attendance history for user."""
    logger.info(f"[API] History request for user {user_id}, limit {limit}")
    
    try:
        if user_id <= 0:
            raise HTTPException(status_code=400, detail="User ID must be positive")
        
        if limit <= 0 or limit > 100:
            raise HTTPException(status_code=400, detail="Limit must be between 1 and 100")
        
        history = AttendanceService.get_attendance_history(db, user_id, limit)
        logger.info(f"[API] History retrieved for user {user_id}: {history['total']} records")
        return history
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[API] History error for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error fetching attendance history")