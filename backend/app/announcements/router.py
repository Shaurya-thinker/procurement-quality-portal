from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.announcements import schemas, service

router = APIRouter(tags=["Announcements"])


@router.get("/events", response_model=list[schemas.EventOut])
def get_events(db: Session = Depends(get_db)):
    return service.get_events(db)


@router.post("/events", response_model=schemas.EventOut)
def create_event(event: schemas.EventIn, db: Session = Depends(get_db)):
    return service.create_event(db, event)

@router.put("/events/{event_id}", response_model=schemas.EventOut)
def update_event(event_id: int, payload: schemas.EventUpdate, db: Session = Depends(get_db)):
    return service.update_event(db, event_id, payload)

@router.delete("/events/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    return service.delete_event(db, event_id)



@router.get("/trainings", response_model=list[schemas.TrainingOut])
def get_trainings(db: Session = Depends(get_db)):
    return service.get_trainings(db)


@router.post("/trainings", response_model=schemas.TrainingOut)
def create_training(training: schemas.TrainingIn, db: Session = Depends(get_db)):
    return service.create_training(db, training)

@router.put("/trainings/{training_id}", response_model=schemas.TrainingOut)
def update_training(training_id: int, payload: schemas.TrainingUpdate, db: Session = Depends(get_db)):
    return service.update_training(db, training_id, payload)

@router.delete("/trainings/{training_id}")
def delete_training(training_id: int, db: Session = Depends(get_db)):
    return service.delete_training(db, training_id)


@router.get("/meetings", response_model=list[schemas.MeetingOut])
def get_meetings(db: Session = Depends(get_db)):
    return service.get_meetings(db)


@router.post("/meetings", response_model=schemas.MeetingOut)
def create_meeting(meeting: schemas.MeetingIn, db: Session = Depends(get_db)):
    return service.create_meeting(db, meeting)

@router.put("/meetings/{meeting_id}", response_model=schemas.MeetingOut)
def update_meeting(meeting_id: int, payload: schemas.MeetingUpdate, db: Session = Depends(get_db)):
    return service.update_meeting(db, meeting_id, payload)

@router.delete("/meetings/{meeting_id}")
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    return service.delete_meeting(db, meeting_id)