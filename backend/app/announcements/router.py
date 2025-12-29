
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from .models import Event, Training, Meeting
from . import schemas

router = APIRouter(
    prefix="/api/v1/announcements",
    tags=["Announcements"]
)

@router.get("/events", response_model=list[schemas.EventOut])
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).all()

@router.post("/events", response_model=schemas.EventOut)
def create_event(event: schemas.EventIn, db: Session = Depends(get_db)):
    try:
        obj = Event(**event.dict())
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/trainings", response_model=list[schemas.TrainingOut])
def get_trainings(db: Session = Depends(get_db)):
    return db.query(Training).all()

@router.post("/trainings", response_model=schemas.TrainingOut)
def create_training(training: schemas.TrainingIn, db: Session = Depends(get_db)):
    try:
        obj = Training(**training.dict())
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/meetings", response_model=list[schemas.MeetingOut])
def get_meetings(db: Session = Depends(get_db)):
    return db.query(Meeting).all()

@router.post("/meetings", response_model=schemas.MeetingOut)
def create_meeting(meeting: schemas.MeetingIn, db: Session = Depends(get_db)):
    try:
        obj = Meeting(**meeting.dict())
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
