from sqlalchemy.orm import Session
from datetime import datetime, date
from ..models.attendance import Attendance, AttendanceStatus
from ..schemas.attendance import CheckInRequest, CheckOutRequest
import logging

logger = logging.getLogger(__name__)


class AttendanceService:
    """Service for handling attendance operations."""
    
    @staticmethod
    def check_in(db: Session, user_id: int) -> Attendance:
        """
        Check in user for today.
        Raises ValueError if already checked in.
        """
        logger.info(f"[CHECK-IN] User {user_id} attempting check-in")
        AttendanceService.auto_close_previous_attendance(db, user_id)
        
        today = datetime.utcnow().date().isoformat()
        
        # Check if already checked in today
        existing = db.query(Attendance).filter(
            Attendance.user_id == user_id,
            Attendance.attendance_date == today,
            Attendance.is_active == True
        ).first()
        
        if existing:
            logger.warning(f"[CHECK-IN] User {user_id} already checked in today")
            raise ValueError("Already checked in today")
        
        # Create new attendance record
        attendance = Attendance(
            user_id=user_id,
            attendance_date=today,
            check_in_time=datetime.utcnow(),
            status=AttendanceStatus.IN_PROGRESS,
            total_worked_minutes=0
        )
        
        logger.info(f"[CHECK-IN] Creating attendance record for user {user_id}")
        db.add(attendance)
        db.commit()
        db.refresh(attendance)
        
        logger.info(f"[CHECK-IN] Successfully checked in user {user_id} at {attendance.check_in_time}")
        return attendance
    
    @staticmethod
    def check_out(db: Session, user_id: int) -> Attendance:
        """
        Check out user for today.
        Calculates total worked minutes.
        Raises ValueError if not checked in.
        """
        logger.info(f"[CHECK-OUT] User {user_id} attempting check-out")

        AttendanceService.auto_close_previous_attendance(db, user_id)
        
        today = datetime.utcnow().date().isoformat()
        
        # Find today's attendance record
        attendance = db.query(Attendance).filter(
            Attendance.user_id == user_id,
            Attendance.attendance_date == today,
            Attendance.is_active == True
        ).first()
        
        if not attendance:
            logger.error(f"[CHECK-OUT] No check-in found for user {user_id}")
            raise ValueError("Cannot check out without check-in")
        
        if attendance.check_out_time:
            logger.warning(f"[CHECK-OUT] User {user_id} already checked out")
            raise ValueError("Already checked out today")
        
        # Update attendance with check-out time
        check_out_time = datetime.utcnow()
        time_diff = check_out_time - attendance.check_in_time
        import math
        total_minutes = max(1, math.ceil(time_diff.total_seconds() / 60))
        
        logger.info(f"[CHECK-OUT] Calculating worked time: {total_minutes} minutes")

        
        attendance.check_out_time = check_out_time
        attendance.total_worked_minutes = total_minutes
        attendance.status = AttendanceStatus.COMPLETED
        
        db.commit()
        db.refresh(attendance)
        
        logger.info(f"[CHECK-OUT] Successfully checked out user {user_id} at {check_out_time}")
        return attendance
    
    @staticmethod
    def get_today_attendance(db: Session, user_id: int) -> dict:
        """Get today's attendance summary for user."""
        logger.info(f"[TODAY] Fetching today's attendance for user {user_id}")
        AttendanceService.auto_close_previous_attendance(db, user_id)

        
        today = datetime.utcnow().date().isoformat()
        
        attendance = db.query(Attendance).filter(
            Attendance.user_id == user_id,
            Attendance.attendance_date == today,
            Attendance.is_active == True
        ).first()
        
        if not attendance:
            logger.info(f"[TODAY] No attendance record for user {user_id} - returning NOT_STARTED state")
            return {
                "user_id": user_id,
                "attendance_date": today,
                "check_in_time": None,
                "check_out_time": None,
                "total_worked_minutes": None,
                "status": "NOT_STARTED",
                "can_check_in": True,
                "can_check_out": False
            }
        
        can_check_out = attendance.check_in_time is not None and attendance.check_out_time is None
        
        return {
            "user_id": user_id,
            "attendance_date": attendance.attendance_date,
            "check_in_time": attendance.check_in_time,
            "check_out_time": attendance.check_out_time,
            "total_worked_minutes": attendance.total_worked_minutes,
            "status": attendance.status,
            "can_check_in": False,
            "can_check_out": can_check_out
        }
    
    @staticmethod
    def get_attendance_history(db: Session, user_id: int, limit: int = 30) -> dict:
        """Get attendance history for user."""
        logger.info(f"[HISTORY] Fetching attendance history for user {user_id}")
        
        records = db.query(Attendance).filter(
            Attendance.user_id == user_id,
            Attendance.is_active == True
        ).order_by(Attendance.attendance_date.desc()).limit(limit).all()
        
        logger.info(f"[HISTORY] Found {len(records)} records for user {user_id}")
        
        return {
            "records": records,
            "total": len(records)
        }

    @staticmethod
    def auto_close_previous_attendance(db: Session, user_id: int):
        """
        Auto-checkout any IN_PROGRESS attendance from previous days.
        Called before any attendance operation.
        """
        today = datetime.utcnow().date()

        open_records = db.query(Attendance).filter(
            Attendance.user_id == user_id,
            Attendance.status == AttendanceStatus.IN_PROGRESS,
            Attendance.attendance_date < today.isoformat(),
            Attendance.is_active == True
        ).all()

        for record in open_records:
            # Auto checkout at 23:59:59 of that day
            checkout_time = datetime.combine(
                date.fromisoformat(record.attendance_date),
                datetime.max.time()
            )

            time_diff = checkout_time - record.check_in_time
            total_minutes = max(1, int(time_diff.total_seconds() / 60))

            record.check_out_time = checkout_time
            record.total_worked_minutes = total_minutes
            record.status = AttendanceStatus.COMPLETED

        if open_records:
            db.commit()
