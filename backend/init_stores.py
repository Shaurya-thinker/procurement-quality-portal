import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.store.models import Base, Store, Bin
from backend.app.store.services import StoreService
from backend.app.store.schemas import StoreCreate, BinCreate

# Database Configuration
STORE_DATABASE_URL = "sqlite:///./store.db"

# Create engine and session
engine = create_engine(
    STORE_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize with sample data
def init_stores():
    db = SessionLocal()
    
    try:
        # Check if stores already exist
        existing_stores = db.query(Store).count()
        if existing_stores > 0:
            print(f"Database already initialized with {existing_stores} store(s)")
            return
        
        # Create sample stores
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
        
        for store_data in stores_data:
            store = StoreService.create_store(db, StoreCreate(**store_data))
            
            # Add sample bins to each store
            bins_data = [
                {"bin_no": f"{store.store_id}-BIN-01", "component_details": "Motor Parts", "quantity": 50},
                {"bin_no": f"{store.store_id}-BIN-02", "component_details": "Electronics", "quantity": 30},
                {"bin_no": f"{store.store_id}-BIN-03", "component_details": "Mechanical Components", "quantity": 45},
            ]
            
            for bin_data in bins_data:
                StoreService.add_bin_to_store(db, store.id, BinCreate(**bin_data))
            
            print(f"Created store: {store.name} ({store.store_id}) with {len(bins_data)} bins")
        
        print("\nStore initialization completed successfully!")
        
    except Exception as e:
        print(f"Error initializing stores: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_stores()
