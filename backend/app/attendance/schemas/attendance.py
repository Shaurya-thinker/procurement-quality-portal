from datetime import datetime, date
from pydantic import BaseModel


class AttendanceCreate(BaseModel):
    """Schema for creating attendance record."""
    user_id: int
    date: date
    check_in_time: datetime | None = None
    check_out_time: datetime | None = None
    status: str = "Present"
    working_hours: str | None = None
    notes: str | None = None


class AttendanceUpdate(BaseModel):
    """Schema for updating attendance record."""
    check_out_time: datetime | None = None
    status: str | None = None
    working_hours: str | None = None
    notes: str | None = None


class AttendanceCheckInOut(BaseModel):
    """Schema for check-in/check-out."""
    user_id: int
    action: str  # "check_in" or "check_out"


class AttendanceResponse(BaseModel):
    """Schema for attendance response."""
    id: int
    user_id: int
    date: date
    check_in_time: datetime | None
    check_out_time: datetime | None
    status: str
    working_hours: str | None
    notes: str | None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AttendanceSummary(BaseModel):
    """Schema for attendance summary."""
    present: int
    absent: int
    leave: int
    half_day: int
    total_working_days: int
