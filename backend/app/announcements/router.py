from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.db import get_db
from .models import Event, Training, Meeting
from .schemas import EventOut, TrainingOut, MeetingOut

router = APIRouter(
    prefix="/api/v1/announcements",
    tags=["Announcements"]
)

@router.get("/events", response_model=List[EventOut])
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).all()

@router.get("/trainings", response_model=List[TrainingOut])
def get_trainings(db: Session = Depends(get_db)):
    return db.query(Training).all()

@router.get("/meetings", response_model=List[MeetingOut])
def get_meetings(db: Session = Depends(get_db)):
    return db.query(Meeting).all()
