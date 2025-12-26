from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.procurement.models.item import Item

def seed_items():
    db: Session = SessionLocal()

    items = [
        {
            "name": "Lithium Battery Pack 48V",
            "code": "LBP-48V",
            "unit": "Nos",
            "description": "Industrial battery pack"
        },
        {
            "name": "Copper Wire 2mm",
            "code": "CW-2MM",
            "unit": "Meters",
            "description": "Electrical copper wire"
        },
        {
            "name": "Steel Bolt M12",
            "code": "SB-M12",
            "unit": "Nos",
            "description": "High tensile steel bolt"
        },

        {
            "name": "Lithium Battery Pack 48V",
            "code": "LBP-48V",
            "unit": "Nos",
            "description": "Industrial battery pack"
        },
        {
            "name": "Copper Wire 2mm",
            "code": "CW-2MM",
            "unit": "Meters",
            "description": "Electrical copper wire"
        },
        {
            "name": "Steel Bolt M12",
            "code": "SB-M12",
            "unit": "Nos",
            "description": "High tensile steel bolt"
        },

        {
            "name": "Controller Unit 48V",
            "code": "CTRL-48V",
            "unit": "Nos",
            "description": "Motor controller unit for 48V electric scooters"
        },
        {
            "name": "Disc Brake Assembly",
            "code": "DBA-FRT",
            "unit": "Nos",
            "description": "Front disc brake assembly with caliper and pads"
        },
        {
            "name": "Wiring Harness Main",
            "code": "WH-MAIN",
            "unit": "Nos",
            "description": "Main electrical wiring harness for scooter body"
        }

    ]

    for item in items:
        exists = db.query(Item).filter(Item.code == item["code"]).first()
        if not exists:
            db.add(Item(**item))

    db.commit()
    db.close()
    print("✅ Items seeded successfully")

if __name__ == "__main__":
    seed_items()
