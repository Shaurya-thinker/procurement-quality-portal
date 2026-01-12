from sqlalchemy import Column, Integer, String, Date, Time, Text
from app.core.db import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    event_date = Column(Date)


class Training(Base):
    __tablename__ = "trainings"

    id = Column(Integer, primary_key=True, index=True)
    training_name = Column(String, nullable=False)
    start_date = Column(Date)
    end_date = Column(Date)
    description = Column(Text)


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    meeting_title = Column(String, nullable=False)
    meeting_date = Column(Date)
    meeting_time = Column(Time)
    meeting_link = Column(String, nullable=True)
