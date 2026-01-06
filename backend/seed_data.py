#!/usr/bin/env python3
"""
Seed script to populate the database with sample data for testing
"""
import sys
from pathlib import Path
from datetime import datetime, timedelta

sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy.orm import Session
from app.core.db import SessionLocal, Base, engine
from app.user.models.user import User
from app.announcements.models import Event, Training, Meeting

def seed_users(db: Session):
    """Seed sample users"""
    sample_users = [
        {
            "name": "Rajesh Kumar",
            "email": "rajesh.kumar@company.com",
            "employee_id": "EMP001",
            "department": "Software Development",
            "designation": "Senior Developer",
            "reporting_manager": "Priya Singh",
            "phone": "9876543210",
            "employment_type": "Full-time",
            "work_location": "Bangalore",
            "date_of_joining": datetime(2020, 1, 15),
        },
        {
            "name": "Priya Singh",
            "email": "priya.singh@company.com",
            "employee_id": "EMP002",
            "department": "Software Development",
            "designation": "Engineering Manager",
            "reporting_manager": "Amit Gupta",
            "phone": "9876543211",
            "employment_type": "Full-time",
            "work_location": "Bangalore",
            "date_of_joining": datetime(2019, 6, 10),
        },
        {
            "name": "Amit Sharma",
            "email": "amit.sharma@company.com",
            "employee_id": "EMP003",
            "department": "Quality Assurance",
            "designation": "QA Lead",
            "reporting_manager": "Priya Singh",
            "phone": "9876543212",
            "employment_type": "Full-time",
            "work_location": "Bangalore",
            "date_of_joining": datetime(2021, 3, 20),
        },
        {
            "name": "Sneha Patel",
            "email": "sneha.patel@company.com",
            "employee_id": "EMP004",
            "department": "Procurement",
            "designation": "Procurement Specialist",
            "reporting_manager": "Vikram Singh",
            "phone": "9876543213",
            "employment_type": "Full-time",
            "work_location": "Mumbai",
            "date_of_joining": datetime(2020, 8, 5),
        },
        {
            "name": "Vikram Singh",
            "email": "vikram.singh@company.com",
            "employee_id": "EMP005",
            "department": "Procurement",
            "designation": "Procurement Manager",
            "reporting_manager": "Amit Gupta",
            "phone": "9876543214",
            "employment_type": "Full-time",
            "work_location": "Mumbai",
            "date_of_joining": datetime(2018, 11, 12),
        },
        {
            "name": "Neha Gupta",
            "email": "neha.gupta@company.com",
            "employee_id": "EMP006",
            "department": "Store Operations",
            "designation": "Store Manager",
            "reporting_manager": "Vikram Singh",
            "phone": "9876543215",
            "employment_type": "Full-time",
            "work_location": "Delhi",
            "date_of_joining": datetime(2020, 5, 18),
        },
        {
            "name": "Arjun Reddy",
            "email": "arjun.reddy@company.com",
            "employee_id": "EMP007",
            "department": "Quality Control",
            "designation": "Quality Inspector",
            "reporting_manager": "Amit Sharma",
            "phone": "9876543216",
            "employment_type": "Full-time",
            "work_location": "Bangalore",
            "date_of_joining": datetime(2021, 9, 1),
        },
        {
            "name": "Anjali Verma",
            "email": "anjali.verma@company.com",
            "employee_id": "EMP008",
            "department": "HR",
            "designation": "HR Executive",
            "reporting_manager": "Amit Gupta",
            "phone": "9876543217",
            "employment_type": "Full-time",
            "work_location": "Bangalore",
            "date_of_joining": datetime(2020, 12, 1),
        },
        {
            "name": "Rohan Kapoor",
            "email": "rohan.kapoor@company.com",
            "employee_id": "EMP009",
            "department": "Finance",
            "designation": "Finance Manager",
            "reporting_manager": "Amit Gupta",
            "phone": "9876543218",
            "employment_type": "Full-time",
            "work_location": "Mumbai",
            "date_of_joining": datetime(2019, 7, 22),
        },
        {
            "name": "Divya Nair",
            "email": "divya.nair@company.com",
            "employee_id": "EMP010",
            "department": "Software Development",
            "designation": "Junior Developer",
            "reporting_manager": "Rajesh Kumar",
            "phone": "9876543219",
            "employment_type": "Full-time",
            "work_location": "Bangalore",
            "date_of_joining": datetime(2022, 6, 15),
        },
    ]
    
    for user_data in sample_users:
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing:
            user = User(**user_data)
            db.add(user)
    
    db.commit()
    print("✅ Sample users created successfully")


def seed_events(db: Session):
    """Seed sample events/announcements"""
    now = datetime.now()
    sample_events = [
        {
            "title": "Quarterly Town Hall Meeting",
            "description": "Join us for our quarterly update on company performance and strategic direction",
            "event_date": (now + timedelta(days=7)).date(),
        },
        {
            "title": "Product Launch Event",
            "description": "Announcing our new product lineup for Q1 2026",
            "event_date": (now + timedelta(days=14)).date(),
        },
        {
            "title": "Employee Wellness Program",
            "description": "Register for yoga and meditation sessions starting this month",
            "event_date": (now + timedelta(days=3)).date(),
        },
        {
            "title": "Safety Training Session",
            "description": "Mandatory safety training for all warehouse staff",
            "event_date": (now + timedelta(days=5)).date(),
        },
        {
            "title": "Team Building Activity",
            "description": "Annual team outing and recreational activities",
            "event_date": (now + timedelta(days=21)).date(),
        },
    ]

    for event_data in sample_events:
        existing = db.query(Event).filter(Event.title == event_data["title"]).first()
        if not existing:
            event = Event(**event_data)
            db.add(event)

    db.commit()
    print("✅ Sample events created successfully")


def seed_trainings(db: Session):
    """Seed sample training programs"""
    now = datetime.now()
    sample_trainings = [
        {
            "training_name": "Advanced Python Programming",
            "description": "Learn advanced concepts in Python including decorators, generators, and async programming",
            "start_date": (now + timedelta(days=10)).date(),
            "end_date": (now + timedelta(days=20)).date(),
        },
        {
            "training_name": "Project Management Essentials",
            "description": "Comprehensive training on project management methodologies and best practices",
            "start_date": (now + timedelta(days=8)).date(),
            "end_date": (now + timedelta(days=15)).date(),
        },
    ]

    for training_data in sample_trainings:
        existing = db.query(Training).filter(Training.training_name == training_data["training_name"]).first()
        if not existing:
            training = Training(**training_data)
            db.add(training)

    db.commit()
    print("✅ Sample trainings created successfully")


def seed_meetings(db: Session):
    """Seed sample meetings"""
    now = datetime.now()
    sample_meetings = [
        {
            "meeting_title": "Weekly Sync - Development Team",
            "meeting_date": (now + timedelta(days=2)).date(),
            "meeting_time": "10:30",
        },
        {
            "meeting_title": "Procurement Review Board",
            "meeting_date": (now + timedelta(days=4)).date(),
            "meeting_time": "15:00",
        },
    ]

    for meeting_data in sample_meetings:
        existing = db.query(Meeting).filter(Meeting.meeting_title == meeting_data["meeting_title"]).first()
        if not existing:
            meeting = Meeting(**meeting_data)
            db.add(meeting)

    db.commit()
    print("✅ Sample meetings created successfully")


def main():
    """Run all seed functions"""
    print("\n" + "=" * 60)
    print("🌱 DATABASE SEEDING STARTED")
    print("=" * 60 + "\n")
    
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created/verified\n")
        
        # Seed data
        db = SessionLocal()
        try:
            seed_users(db)
            seed_events(db)
            seed_trainings(db)
            seed_meetings(db)
            
            print("\n" + "=" * 60)
            print("✅ SEEDING COMPLETED SUCCESSFULLY")
            print("=" * 60 + "\n")
        finally:
            db.close()
    except Exception as e:
        print(f"\n❌ SEEDING FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
