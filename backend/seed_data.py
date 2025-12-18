import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.app.database import SessionLocal, create_tables, drop_tables
from backend.app.procurement.models import Item, PurchaseOrder, PurchaseOrderLine, POStatus
from backend.app.store.models import Store, Bin
from decimal import Decimal

def seed_data():
    """Initialize database with seed data."""
    print("Dropping existing tables...")
    drop_tables()
    
    print("Creating all tables...")
    create_tables()
    
    db = SessionLocal()
    
    try:
        # Create items
        print("Creating items...")
        items = [
            Item(name="Electric Motor", code="MOTOR-001", unit="piece", description="High-efficiency electric motor"),
            Item(name="Battery Pack", code="BATT-001", unit="piece", description="Lithium-ion battery pack"),
            Item(name="Controller Board", code="CTRL-001", unit="piece", description="Motor controller board"),
            Item(name="Brake Cable", code="BRAKE-001", unit="piece", description="Stainless steel brake cable"),
            Item(name="Wheel Assembly", code="WHEEL-001", unit="piece", description="Complete wheel assembly"),
        ]
        for item in items:
            db.add(item)
        db.commit()
        print(f"  Created {len(items)} items")
        
        # Create purchase orders
        print("Creating purchase orders...")
        pos = [
            PurchaseOrder(po_number="PO-2024-001", vendor_id=1, status=POStatus.DRAFT),
            PurchaseOrder(po_number="PO-2024-002", vendor_id=2, status=POStatus.SENT),
            PurchaseOrder(po_number="PO-2024-003", vendor_id=1, status=POStatus.DRAFT),
        ]
        for po in pos:
            db.add(po)
        db.commit()
        print(f"  Created {len(pos)} purchase orders")
        
        # Create PO line items
        print("Creating purchase order lines...")
        lines = [
            PurchaseOrderLine(po_id=1, item_id=1, quantity=10, price=Decimal("500.00")),
            PurchaseOrderLine(po_id=1, item_id=2, quantity=20, price=Decimal("1500.00")),
            PurchaseOrderLine(po_id=2, item_id=3, quantity=15, price=Decimal("800.00")),
            PurchaseOrderLine(po_id=3, item_id=4, quantity=50, price=Decimal("100.00")),
            PurchaseOrderLine(po_id=3, item_id=5, quantity=8, price=Decimal("2000.00")),
        ]
        for line in lines:
            db.add(line)
        db.commit()
        print(f"  Created {len(lines)} purchase order lines")
        
        # Create stores
        print("Creating stores...")
        stores_data = [
            {
                "store_id": "STR-001",
                "name": "Main Store",
                "plant_name": "SMG Electric Scooters Ltd - Hoshiarpur",
                "in_charge_name": "Rajesh Kumar",
                "in_charge_mobile": "+91-9876543210",
                "in_charge_email": "rajesh.kumar@smg.com"
            },
            {
                "store_id": "STR-002",
                "name": "Secondary Store",
                "plant_name": "SMG Electric Scooters Ltd - Hoshiarpur",
                "in_charge_name": "Priya Singh",
                "in_charge_mobile": "+91-9876543211",
                "in_charge_email": "priya.singh@smg.com"
            },
            {
                "store_id": "STR-003",
                "name": "Component Store",
                "plant_name": "SMG Electric Scooters Ltd - Hoshiarpur",
                "in_charge_name": "Amit Patel",
                "in_charge_mobile": "+91-9876543212",
                "in_charge_email": "amit.patel@smg.com"
            }
        ]
        
        stores = []
        for store_data in stores_data:
            store = Store(
                store_id=store_data["store_id"],
                name=store_data["name"],
                plant_name=store_data["plant_name"],
                in_charge_name=store_data["in_charge_name"],
                in_charge_mobile=store_data["in_charge_mobile"],
                in_charge_email=store_data["in_charge_email"]
            )
            db.add(store)
            stores.append(store)
        db.commit()
        print(f"  Created {len(stores_data)} stores")
        
        # Create bins for each store
        print("Creating bins...")
        bins = []
        for store in stores:
            bins_data = [
                Bin(bin_no=f"{store.store_id}-BIN-01", store_id=store.id, component_details="Motor Parts", quantity=50),
                Bin(bin_no=f"{store.store_id}-BIN-02", store_id=store.id, component_details="Electronics", quantity=30),
                Bin(bin_no=f"{store.store_id}-BIN-03", store_id=store.id, component_details="Mechanical Components", quantity=45),
            ]
            for bin_item in bins_data:
                db.add(bin_item)
                bins.append(bin_item)
        db.commit()
        print(f"  Created {len(bins)} bins")
        
        print("\n✅ Database seeding completed successfully!")
        print(f"\nSummary:")
        print(f"  - Items: {len(items)}")
        print(f"  - Purchase Orders: {len(pos)}")
        print(f"  - PO Lines: {len(lines)}")
        print(f"  - Stores: {len(stores)}")
        print(f"  - Bins: {len(bins)}")
        
    except Exception as e:
        print(f"❌ Error seeding data: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
