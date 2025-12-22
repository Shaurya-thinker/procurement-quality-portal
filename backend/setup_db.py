from backend.app.database import SessionLocal, create_tables
from backend.app.procurement.models.item import Item

def create_sample_items():
    create_tables()
    db = SessionLocal()
    
    # Check if items already exist
    existing_items = db.query(Item).count()
    if existing_items > 0:
        print(f"Database already has {existing_items} items")
        db.close()
        return
    
    # Sample items
    items = [
        Item(name="Laptop", code="LAP-001", unit="pcs", description="Business laptop"),
        Item(name="Mouse", code="MOU-001", unit="pcs", description="Wireless mouse"),
        Item(name="Keyboard", code="KEY-001", unit="pcs", description="Mechanical keyboard"),
        Item(name="Monitor", code="MON-001", unit="pcs", description="24-inch monitor"),
        Item(name="Printer", code="PRI-001", unit="pcs", description="Laser printer"),
    ]
    
    try:
        for item in items:
            db.add(item)
        db.commit()
        print(f"Created {len(items)} sample items")
    except Exception as e:
        print(f"Error creating items: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_items()