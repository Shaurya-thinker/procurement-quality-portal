from datetime import datetime
from enum import Enum
from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum, ForeignKey, Date, Time
from backend.app.core.db import Base


class AttendanceStatus(str, Enum):
    """Attendance status enumeration."""
    PRESENT = "Present"
    ABSENT = "Absent"
    LEAVE = "Leave"
    HALF_DAY = "Half Day"


class Attendance(Base):
    """Attendance record model."""
    
    __tablename__ = "attendance_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    check_in_time = Column(DateTime, nullable=True)
    check_out_time = Column(DateTime, nullable=True)
    status = Column(SQLEnum(AttendanceStatus), default=AttendanceStatus.ABSENT, nullable=False)
    working_hours = Column(String(20), nullable=True)
    notes = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<Attendance(id={self.id}, user_id={self.user_id}, date={self.date}, status={self.status})>"
