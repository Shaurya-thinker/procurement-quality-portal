from datetime import date, time
from pydantic import BaseModel

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
