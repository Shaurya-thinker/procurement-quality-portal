from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum as SQLEnum
from sqlalchemy.sql import func
from datetime import datetime
from enum import Enum
from app.core.db import Base


class AttendanceStatus(str, Enum):
    """Attendance status enumeration."""
    NOT_STARTED = "NOT_STARTED"
    PRESENT = "PRESENT"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


class Attendance(Base):
    """Attendance model for tracking user check-in/check-out times."""
    
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    attendance_date = Column(String(10), nullable=False, index=True)  # YYYY-MM-DD
    check_in_time = Column(DateTime, nullable=False)
    check_out_time = Column(DateTime, nullable=True)
    total_worked_minutes = Column(Integer, nullable=True, default=0)
    status = Column(SQLEnum(AttendanceStatus), default=AttendanceStatus.IN_PROGRESS, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    def __repr__(self):
        return f"<Attendance(id={self.id}, user_id={self.user_id}, date={self.attendance_date}, status={self.status})>"
