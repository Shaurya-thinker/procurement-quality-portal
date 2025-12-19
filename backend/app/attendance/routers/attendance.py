from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from backend.app.database import get_db
from backend.app.attendance.schemas.attendance import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceResponse,
    AttendanceCheckInOut,
    AttendanceSummary,
)
from backend.app.attendance.services.attendance_service import AttendanceService

router = APIRouter(prefix="/api/v1/attendance", tags=["Attendance"])


@router.post("", response_model=AttendanceResponse)
def create_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    """Create a new attendance record."""
    db_attendance = AttendanceService.create_attendance(db, attendance)
    return db_attendance


@router.get("/{attendance_id}", response_model=AttendanceResponse)
def get_attendance(attendance_id: int, db: Session = Depends(get_db)):
    """Get attendance record by ID."""
    attendance = AttendanceService.get_attendance_by_id(db, attendance_id)
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return attendance


@router.get("/user/{user_id}", response_model=list[AttendanceResponse])
def get_user_attendance(
    user_id: int,
    month: int | None = None,
    year: int | None = None,
    db: Session = Depends(get_db),
):
    """Get attendance records for a user."""
    attendance_records = AttendanceService.get_user_attendance(db, user_id, month, year)
    return attendance_records


@router.post("/check-in", response_model=AttendanceResponse)
def check_in(check_in: AttendanceCheckInOut, db: Session = Depends(get_db)):
    """Check in user."""
    try:
        attendance = AttendanceService.check_in(db, check_in.user_id)
        return attendance
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/check-out", response_model=AttendanceResponse)
def check_out(check_out: AttendanceCheckInOut, db: Session = Depends(get_db)):
    """Check out user."""
    try:
        attendance = AttendanceService.check_out(db, check_out.user_id)
        return attendance
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/user/{user_id}/today", response_model=AttendanceResponse | None)
def get_today_status(user_id: int, db: Session = Depends(get_db)):
    """Get today's attendance status."""
    attendance = AttendanceService.get_today_status(db, user_id)
    return attendance


@router.get("/user/{user_id}/summary", response_model=AttendanceSummary)
def get_attendance_summary(
    user_id: int,
    month: int,
    year: int,
    db: Session = Depends(get_db),
):
    """Get attendance summary for a user."""
    summary = AttendanceService.get_attendance_summary(db, user_id, month, year)
    return summary


@router.put("/{attendance_id}", response_model=AttendanceResponse)
def update_attendance(
    attendance_id: int,
    attendance_update: AttendanceUpdate,
    db: Session = Depends(get_db),
):
    """Update attendance record."""
    attendance = AttendanceService.update_attendance(db, attendance_id, attendance_update)
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return attendance
