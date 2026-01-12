from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.core.db import Base


class User(Base):
    """User profile model."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    employee_id = Column(String(50), unique=True, nullable=False, index=True)
    department = Column(String(255), nullable=True)
    designation = Column(String(255), nullable=True)
    reporting_manager = Column(String(255), nullable=True)
    date_of_joining = Column(DateTime, nullable=True)
    employment_type = Column(String(50), nullable=True)
    work_location = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    avatar = Column(String(10), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, employee_id={self.employee_id})>"
