# Procurement Quality Portal

A comprehensive platform for managing procurement processes and quality control operations.

## Project Structure

```
procurement-quality-portal/
├── backend/              # FastAPI backend application
│   ├── app/             # Main application package
│   │   ├── core/        # Core configuration and utilities
│   │   ├── utils/       # Utility functions
│   │   ├── procurement/ # Procurement module
│   │   ├── quality/     # Quality control module
│   │   └── store/       # Inventory/Store module
│   ├── migrations/      # Database migrations
│   └── tests/           # Backend tests
├── frontend/            # Frontend application
│   └── src/
│       ├── procurement/ # Procurement UI components
│       ├── quality/     # Quality control UI components
│       └── store/       # Store/Inventory UI components
├── docs/                # Documentation
└── README.md           # This file
```

## Modules

All three modules are now unified under a single FastAPI application (`backend/app/main.py`) with independent databases for each module.

### Procurement Module (`/api/v1/procurement`)
Handles purchase orders, vendor management, and procurement workflows.
- **Database**: `procurement.db`
- **Key Operations**: Create POs, manage items, track vendor orders, send POs for approval
- **Endpoints**: Create, list, retrieve, update, and send purchase orders

### Quality Module (`/api/v1/quality`)
Manages quality control inspections, defect tracking, and compliance.
- **Database**: `quality.db`
- **Key Operations**: Receive materials, perform inspections, track quality metrics, generate reports
- **Endpoints**: Material receipts, inspections, quality checklists, quality sheets

### Store Module (`/api/v1/store`)
Manages inventory, stock levels, and storage operations.
- **Database**: `store.db`
- **Key Operations**: Track inventory, manage stock locations, dispatch items, process gatepasses
- **Endpoints**: Add inventory, list stock, dispatch items, track deliveries

## Database Architecture

Each module maintains its own SQLite database for modularity and independence:

- **`procurement.db`**: Purchase orders, items, vendors, line items
- **`quality.db`**: Material receipts, inspections, quality checklists, quality sheets
- **`store.db`**: Inventory items, dispatch records, gatepasses

This design ensures:
- Module isolation - changes in one database don't affect others
- Independent scaling - each module can be optimized separately
- Data consistency - each module maintains its own transaction context
- Flexibility - databases can be migrated to different backends independently

## Getting Started

### Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Run the unified application (all three modules):
   ```bash
   python -m app.main
   ```

   The server will start on `http://0.0.0.0:8000` with all three modules active.

   **Alternative**: Run with auto-reload for development:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

3. Access the API:
   - **Interactive Swagger UI**: http://localhost:8000/docs
   - **ReDoc Documentation**: http://localhost:8000/redoc
   - **API Status & Endpoints**: http://localhost:8000/api/status
   - **Health Check**: http://localhost:8000/health

### Running Individual Modules (Optional)

Each module can still be run separately if needed:

```bash
# Procurement only
python -m app.procurement.main

# Quality only
python -m app.quality.main

# Store only
python -m app.store.main
```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install and run frontend application (instructions to follow)

## API Endpoints Overview

### Root & Health Checks

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Root endpoint with module status |
| `/health` | GET | Health check for all modules |
| `/api/status` | GET | Detailed API documentation |

### Procurement Endpoints (`/api/v1/procurement`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/` | Create purchase order |
| GET | `/` | List purchase orders |
| GET | `/{po_id}` | Get purchase order details |
| POST | `/{po_id}/send` | Send purchase order |
| PUT | `/{po_id}` | Update purchase order (DRAFT only) |
| GET | `/vendor/{vendor_id}` | List POs by vendor |

### Quality Endpoints (`/api/v1/quality`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/material-receipt` | Create material receipt |
| GET | `/material-receipt` | List material receipts |
| POST | `/inspect` | Perform quality inspection |
| POST | `/checklist` | Fill quality checklist |
| POST | `/quality-sheet` | Create quality sheet |
| GET | `/inspection/{inspection_id}` | Get inspection report |

### Store Endpoints (`/api/v1/store`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/inventory` | Add inventory items |
| GET | `/inventory` | List inventory |
| GET | `/inventory/{id}` | Get inventory item details |
| POST | `/dispatch` | Dispatch items from inventory |
| GET | `/dispatches` | List dispatch records |

## Testing

### Using Swagger UI

Once the server is running, visit `http://localhost:8000/docs` to test all endpoints interactively.

### Using cURL

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Create Purchase Order:**
```bash
curl -X POST http://localhost:8000/api/v1/procurement/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "vendor_id": 123,
    "lines": [
      {"item_id": 1, "quantity": 10, "price": "99.99"}
    ]
  }'
```

**Create Material Receipt:**
```bash
curl -X POST http://localhost:8000/api/v1/quality/material-receipt \
  -H "Content-Type: application/json" \
  -d '{
    "po_id": 1,
    "vendor_id": 123,
    "received_by": "John Doe"
  }'
```

**Add Inventory:**
```bash
curl -X POST http://localhost:8000/api/v1/store/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": 1,
    "quantity": 50,
    "location": "Warehouse A"
  }'
```

### Running Tests

```bash
# All Procurement tests
python -m pytest backend/app/procurement/tests/test_procurement.py -v

# All Store tests
python -m pytest backend/app/store/tests/test_store.py -v
```

## Documentation

See the [docs](./docs) folder for detailed API documentation and guides. For comprehensive unified backend information, see [UNIFIED_BACKEND.md](./backend/UNIFIED_BACKEND.md).

## License

(Add license information here)
