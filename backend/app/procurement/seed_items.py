from app.core.db import SessionLocal
from app.procurement.models import Item

def seed_items():
    db = SessionLocal()

    items = [
        {"name": "Lithium Battery Pack 48V", "code": "LBP-48V", "unit": "Nos", "description": "Industrial battery pack"},
        {"name": "Copper Wire 2mm", "code": "CW-2MM", "unit": "Meter", "description": "Electrical copper wire"},
        {"name": "Steel Bolt M12", "code": "SB-M12", "unit": "Nos", "description": "High tensile bolt"},
        {"name": "Controller 48V", "code": "CTRL-48V", "unit": "Nos", "description": "Motor controller"},
        {"name": "Dashboard Front", "code": "DBA-FRT", "unit": "Nos", "description": "Front dashboard panel"},
        {"name": "Main Wiring Harness", "code": "WH-MAIN", "unit": "Set", "description": "Complete wiring harness"},
    ]

    for item_data in items:
        exists = db.query(Item).filter(
            Item.code == item_data["code"]
        ).first()

        if exists:
            print(f"⚠️ Already exists: {item_data['code']}")
            continue

        db.add(Item(**item_data))
        db.commit()     # ✅ commit immediately
        print(f"✅ Inserted: {item_data['code']}")

    db.close()

if __name__ == "__main__":
    seed_items()
