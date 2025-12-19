from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, extract
from backend.app.attendance.models.attendance import Attendance, AttendanceStatus
from backend.app.attendance.schemas.attendance import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceCheckInOut,
    AttendanceSummary,
)


class AttendanceService:
    """Service for attendance operations."""
    
    @staticmethod
    def create_attendance(db: Session, attendance: AttendanceCreate) -> Attendance:
        """Create a new attendance record."""
        db_attendance = Attendance(**attendance.model_dump())
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance
    
    @staticmethod
    def get_attendance_by_id(db: Session, attendance_id: int) -> Attendance | None:
        """Get attendance record by ID."""
        return db.query(Attendance).filter(Attendance.id == attendance_id).first()
    
    @staticmethod
    def get_attendance_by_user_and_date(
        db: Session, user_id: int, att_date: date
    ) -> Attendance | None:
        """Get attendance record by user and date."""
        return db.query(Attendance).filter(
            and_(Attendance.user_id == user_id, Attendance.date == att_date)
        ).first()
    
    @staticmethod
    def get_user_attendance(
        db: Session,
        user_id: int,
        month: int | None = None,
        year: int | None = None,
    ) -> list[Attendance]:
        """Get attendance records for a user."""
        query = db.query(Attendance).filter(Attendance.user_id == user_id)
        
        if month and year:
            query = query.filter(
                and_(
                    extract("month", Attendance.date) == month,
                    extract("year", Attendance.date) == year,
                )
            )
        elif year:
            query = query.filter(extract("year", Attendance.date) == year)
        
        return query.order_by(Attendance.date.desc()).all()
    
    @staticmethod
    def check_in(db: Session, user_id: int) -> Attendance:
        """Check in user."""
        today = date.today()
        attendance = AttendanceService.get_attendance_by_user_and_date(db, user_id, today)
        
        if not attendance:
            attendance = Attendance(
                user_id=user_id,
                date=today,
                check_in_time=datetime.now(),
                status=AttendanceStatus.PRESENT,
            )
            db.add(attendance)
        else:
            attendance.check_in_time = datetime.now()
            attendance.status = AttendanceStatus.PRESENT
        
        db.commit()
        db.refresh(attendance)
        return attendance
    
    @staticmethod
    def check_out(db: Session, user_id: int) -> Attendance:
        """Check out user."""
        today = date.today()
        attendance = AttendanceService.get_attendance_by_user_and_date(db, user_id, today)
        
        if not attendance:
            raise ValueError("No check-in record found for today")
        
        attendance.check_out_time = datetime.now()
        
        if attendance.check_in_time:
            working_hours = attendance.check_out_time - attendance.check_in_time
            hours = int(working_hours.total_seconds() // 3600)
            minutes = int((working_hours.total_seconds() % 3600) // 60)
            attendance.working_hours = f"{hours}h {minutes}m"
        
        db.commit()
        db.refresh(attendance)
        return attendance
    
    @staticmethod
    def update_attendance(
        db: Session, attendance_id: int, attendance_update: AttendanceUpdate
    ) -> Attendance | None:
        """Update attendance record."""
        db_attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
        if not db_attendance:
            return None
        
        update_data = attendance_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_attendance, field, value)
        
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance
    
    @staticmethod
    def get_attendance_summary(
        db: Session, user_id: int, month: int, year: int
    ) -> AttendanceSummary:
        """Get attendance summary for a user."""
        records = AttendanceService.get_user_attendance(db, user_id, month, year)
        
        summary = {
            "present": 0,
            "absent": 0,
            "leave": 0,
            "half_day": 0,
        }
        
        for record in records:
            if record.status == AttendanceStatus.PRESENT:
                summary["present"] += 1
            elif record.status == AttendanceStatus.ABSENT:
                summary["absent"] += 1
            elif record.status == AttendanceStatus.LEAVE:
                summary["leave"] += 1
            elif record.status == AttendanceStatus.HALF_DAY:
                summary["half_day"] += 1
        
        total_working_days = len(records)
        
        return AttendanceSummary(
            present=summary["present"],
            absent=summary["absent"],
            leave=summary["leave"],
            half_day=summary["half_day"],
            total_working_days=total_working_days,
        )
    
    @staticmethod
    def get_today_status(db: Session, user_id: int) -> Attendance | None:
        """Get today's attendance status."""
        today = date.today()
        return AttendanceService.get_attendance_by_user_and_date(db, user_id, today)
