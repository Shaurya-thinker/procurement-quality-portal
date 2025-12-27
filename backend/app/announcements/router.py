from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from .models import Event, Training, Meeting

router = APIRouter(
    prefix="/api/v1/announcements",
    tags=["Announcements"]
)

@router.get("/events")
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).all()

@router.get("/trainings")
def get_trainings(db: Session = Depends(get_db)):
    return db.query(Training).all()

@router.get("/meetings")
def get_meetings(db: Session = Depends(get_db)):
    return db.query(Meeting).all()
