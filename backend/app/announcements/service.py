from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.announcements.models import Event, Training, Meeting
from app.announcements.schemas import (
    EventIn, EventUpdate,
    TrainingIn, TrainingUpdate,
    MeetingIn, MeetingUpdate
)

# ===================== EVENTS =====================

def get_events(db: Session):
    return db.query(Event)\
        .filter(~Event.description.like("[DELETED]%"))\
        .order_by(Event.event_date.desc())\
        .all()



def create_event(db: Session, event: EventIn):
    exists = db.query(Event).filter(
        Event.event_date == event.event_date,
        Event.description == event.description
    ).first()

    if exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Event with same date and description already exists"
        )

    obj = Event(**event.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_event(db: Session, event_id: int, payload: EventUpdate):
    obj = db.query(Event).filter(Event.id == event_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Event not found")

    data = payload.dict(exclude_unset=True)

    duplicate = db.query(Event).filter(
        Event.id != event_id,
        Event.event_date == data.get("event_date", obj.event_date),
        Event.description == data.get("description", obj.description)
    ).first()

    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="Event with same date and description already exists"
        )

    for k, v in data.items():
        setattr(obj, k, v)

    db.commit()
    db.refresh(obj)
    return obj


def delete_event(db: Session, event_id: int):
    obj = db.query(Event).filter(Event.id == event_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Event not found")

    if obj.description and obj.description.startswith("[DELETED]"):
        raise HTTPException(status_code=400, detail="Event already deleted")

    obj.description = f"[DELETED] {obj.description or ''}"
    db.commit()

    return {"message": "Event soft-deleted successfully"}


# ===================== TRAININGS =====================

def get_trainings(db: Session):
    return db.query(Training)\
        .filter(~Training.description.like("[DELETED]%"))\
        .order_by(Training.start_date.desc())\
        .all()



def create_training(db: Session, training: TrainingIn):
    exists = db.query(Training).filter(
        Training.training_name == training.training_name,
        Training.start_date == training.start_date,
        Training.end_date == training.end_date,
        Training.description == training.description
    ).first()

    if exists:
        raise HTTPException(
            status_code=409,
            detail="Training with same name, duration and description already exists"
        )

    obj = Training(**training.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_training(db: Session, training_id: int, payload: TrainingUpdate):
    obj = db.query(Training).filter(Training.id == training_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Training not found")

    data = payload.dict(exclude_unset=True)

    duplicate = db.query(Training).filter(
        Training.id != training_id,
        Training.training_name == data.get("training_name", obj.training_name),
        Training.start_date == data.get("start_date", obj.start_date),
        Training.end_date == data.get("end_date", obj.end_date),
        Training.description == data.get("description", obj.description)
    ).first()

    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="Training with same name, duration and description already exists"
        )

    for k, v in data.items():
        setattr(obj, k, v)

    db.commit()
    db.refresh(obj)
    return obj


def delete_training(db: Session, training_id: int):
    obj = db.query(Training).filter(Training.id == training_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Training not found")

    if obj.description and obj.description.startswith("[DELETED]"):
        raise HTTPException(status_code=400, detail="Training already deleted")

    obj.description = f"[DELETED] {obj.description or ''}"
    db.commit()

    return {"message": "Training soft-deleted successfully"}


# ===================== MEETINGS =====================

def get_meetings(db: Session):
    return db.query(Meeting)\
        .filter(~Meeting.meeting_title.like("[DELETED]%"))\
        .order_by(Meeting.meeting_date.desc())\
        .all()



def create_meeting(db: Session, meeting: MeetingIn):
    exists = db.query(Meeting).filter(
        Meeting.meeting_title == meeting.meeting_title,
        Meeting.meeting_date == meeting.meeting_date,
        Meeting.meeting_time == meeting.meeting_time,
        Meeting.meeting_link == meeting.meeting_link
    ).first()

    if exists:
        raise HTTPException(
            status_code=409,
            detail="Meeting with same title, date and time already exists"
        )

    obj = Meeting(**meeting.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_meeting(db: Session, meeting_id: int, payload: MeetingUpdate):
    obj = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Meeting not found")

    data = payload.dict(exclude_unset=True)

    duplicate = db.query(Meeting).filter(
        Meeting.id != meeting_id,
        Meeting.meeting_title == data.get("meeting_title", obj.meeting_title),
        Meeting.meeting_date == data.get("meeting_date", obj.meeting_date),
        Meeting.meeting_time == data.get("meeting_time", obj.meeting_time),
        Meeting.meeting_link == data.get("meeting_link", obj.meeting_link)
    ).first()

    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="Meeting with same title, date and time already exists"
        )

    for k, v in data.items():
        setattr(obj, k, v)

    db.commit()
    db.refresh(obj)
    return obj


def delete_meeting(db: Session, meeting_id: int):
    obj = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Meeting not found")

    if obj.meeting_title.startswith("[DELETED]"):
        raise HTTPException(status_code=400, detail="Meeting already deleted")

    obj.meeting_title = f"[DELETED] {obj.meeting_title}"
    db.commit()

    return {"message": "Meeting soft-deleted successfully"}

