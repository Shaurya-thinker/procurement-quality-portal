from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from ..models.attendance import AttendanceStatus


class CheckInRequest(BaseModel):
    user_id: int = Field(..., gt=0, description="User ID must be positive")


class CheckOutRequest(BaseModel):
    user_id: int = Field(..., gt=0, description="User ID must be positive")


class AttendanceResponse(BaseModel):
    id: int
    user_id: int
    attendance_date: str
    check_in_time: datetime
    check_out_time: Optional[datetime]
    total_worked_minutes: Optional[int]
    status: AttendanceStatus
    created_at: datetime
    updated_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True


class TodayAttendanceResponse(BaseModel):
    user_id: int
    attendance_date: str
    check_in_time: Optional[datetime]
    check_out_time: Optional[datetime]
    total_worked_minutes: Optional[int]
    status: Optional[AttendanceStatus]
    can_check_in: bool
    can_check_out: bool


class AttendanceHistoryItem(BaseModel):
    attendance_date: str
    check_in_time: Optional[datetime]
    check_out_time: Optional[datetime]
    total_worked_minutes: Optional[int]
    status: AttendanceStatus
    
    class Config:
        from_attributes = True


class AttendanceHistoryResponse(BaseModel):
    records: list[AttendanceHistoryItem]
    total: int
