from datetime import date, time
from pydantic import BaseModel
from typing import Optional

class EventOut(BaseModel):
    id: int
    title: str
    description: str | None
    event_date: date

    class Config:
        orm_mode = True


class TrainingOut(BaseModel):
    id: int
    training_name: str
    start_date: date
    end_date: date

    class Config:
        orm_mode = True


class MeetingOut(BaseModel):
    id: int
    meeting_title: str
    meeting_date: date
    meeting_time: time | None

    class Config:
        orm_mode = True


class EventIn(BaseModel):
    title: str
    event_date: date
    description: str | None = None


class TrainingIn(BaseModel):
    training_name: str
    start_date: date
    end_date: date
    description: str | None = None


class MeetingIn(BaseModel):
    meeting_title: str
    meeting_date: date
    meeting_time: time | None = None
    meeting_link: str | None = None


# ===================== UPDATE SCHEMAS =====================

class EventUpdate(BaseModel):
    title: Optional[str] = None
    event_date: Optional[date] = None
    description: Optional[str] = None


class TrainingUpdate(BaseModel):
    training_name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None


class MeetingUpdate(BaseModel):
    meeting_title: Optional[str] = None
    meeting_date: Optional[date] = None
    meeting_time: Optional[time] = None
    meeting_link: Optional[str] = None