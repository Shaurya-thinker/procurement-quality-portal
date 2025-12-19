from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """Schema for creating a user."""
    name: str
    email: EmailStr
    employee_id: str
    department: str | None = None
    designation: str | None = None
    reporting_manager: str | None = None
    date_of_joining: datetime | None = None
    employment_type: str | None = None
    work_location: str | None = None
    phone: str | None = None
    avatar: str | None = None


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    name: str | None = None
    department: str | None = None
    designation: str | None = None
    reporting_manager: str | None = None
    date_of_joining: datetime | None = None
    employment_type: str | None = None
    work_location: str | None = None
    phone: str | None = None
    avatar: str | None = None


class UserResponse(BaseModel):
    """Schema for user response."""
    id: int
    name: str
    email: str
    employee_id: str
    department: str | None
    designation: str | None
    reporting_manager: str | None
    date_of_joining: datetime | None
    employment_type: str | None
    work_location: str | None
    phone: str | None
    avatar: str | None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
