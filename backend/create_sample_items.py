#!/usr/bin/env python3

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.procurement.models import Base, Item

# Database setup
DATABASE_URL = "sqlite:///./procurement.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

def create_sample_items():
    db = SessionLocal()
    try:
        # Check if items already exist
        existing_count = db.query(Item).count()
        if existing_count > 0:
            print(f"Items already exist: {existing_count} items found")
            return

        # Create sample items
        sample_items = [
            Item(name="Laptop", description="Business laptop", category="Electronics"),
            Item(name="Office Chair", description="Ergonomic office chair", category="Furniture"),
            Item(name="Printer Paper", description="A4 white paper", category="Stationery"),
            Item(name="USB Cable", description="USB-C charging cable", category="Electronics"),
            Item(name="Desk Lamp", description="LED desk lamp", category="Furniture"),
        ]

        for item in sample_items:
            db.add(item)
        
        db.commit()
        print(f"Created {len(sample_items)} sample items successfully!")
        
        # Display created items
        items = db.query(Item).all()
        for item in items:
            print(f"ID: {item.id}, Name: {item.name}, Category: {item.category}")
            
    except Exception as e:
        print(f"Error creating items: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_items()