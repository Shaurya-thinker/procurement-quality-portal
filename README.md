# Procurement Quality Portal

A comprehensive enterprise platform for managing procurement processes, quality control operations, inventory management, and workforce operations.

## Project Structure

```
procurement-quality-portal/
├── backend/              # FastAPI backend application
│   ├── alembic/         # Database migrations with Alembic
│   ├── app/             # Main application package
│   │   ├── core/        # Core configuration and database setup
│   │   ├── procurement/ # Procurement module (POs, items, vendors)
│   │   ├── quality/     # Quality control module (inspections, gate passes)
│   │   ├── store/       # Inventory/Store module (stock, dispatches)
│   │   ├── user/        # User management module
│   │   ├── attendance/  # Employee attendance tracking
│   │   ├── contractors/ # Contractor management
│   │   ├── announcements/ # Company announcements
│   │   └── utils/       # Utility functions
│   ├── app.db          # SQLite database file
│   └── requirements.txt # Python dependencies
├── frontend/            # React + Vite frontend application
│   ├── src/
│   │   ├── api/         # API client modules
│   │   ├── auth/        # Authentication components
│   │   ├── layout/      # Dashboard layout and navigation
│   │   ├── pages/       # General pages (Dashboard, Profile, etc.)
│   │   ├── procurement/ # Procurement UI components
│   │   ├── quality/     # Quality control UI components
│   │   ├── store/       # Store/Inventory UI components
│   │   ├── contractors/ # Contractor management UI
│   │   └── routes/      # React Router configuration
│   └── package.json    # Node.js dependencies
├── docs/                # Documentation
└── README.md           # This file
```

## Modules

All modules are unified under a single FastAPI application (`backend/app/main.py`) with a shared SQLite database (`app.db`).

### Procurement Module (`/api/v1/procurement`)
Handles purchase orders, item management, and vendor operations.
- **Key Operations**: Create/manage POs, track items, vendor management, PO approval workflow
- **Models**: PurchaseOrder, PurchaseOrderLine, Item
- **Features**: PO tracking, vendor-specific PO listing, item catalog management

### Quality Module (`/api/v1/quality`)
Manages quality control inspections, material receipts, and gate passes.
- **Key Operations**: Material receipt processing, quality inspections, gate pass management
- **Models**: MaterialReceipt, Inspection, GatePass, GatePassItem
- **Features**: Inspection workflows, gate pass generation, quality tracking

### Store Module (`/api/v1/store`)
Manages inventory, stock levels, storage operations, and material dispatches.
- **Key Operations**: Inventory management, store/bin organization, material dispatches, gate pass receiving
- **Models**: Store, Bin, InventoryItem, MaterialDispatch, InventoryTransaction
- **Features**: Multi-store support, bin-level tracking, dispatch management

### User Management Module (`/api/v1/users`)
Handles user accounts and authentication.
- **Key Operations**: User CRUD operations, email-based lookup
- **Models**: User
- **Features**: User profile management, role-based access

### Attendance Module (`/api/v1/attendance`)
Tracks employee attendance and working hours.
- **Key Operations**: Check-in/check-out, attendance history, daily summaries
- **Models**: Attendance
- **Features**: Real-time attendance tracking, historical reports

### Contractors Module (`/api/v1/contractors`)
Manages contractor information and status.
- **Key Operations**: Contractor CRUD, status management (active/inactive)
- **Models**: Contractor
- **Features**: Contractor lifecycle management

### Announcements Module (`/api/v1/announcements`)
Handles company-wide announcements and events.
- **Key Operations**: Announcement management, event notifications
- **Models**: Announcement
- **Features**: Company communication system

## Database Architecture

The application uses a **unified SQLite database** (`app.db`) with Alembic for migrations:

- **Single Database**: All modules share one database for data consistency and referential integrity
- **Alembic Migrations**: Version-controlled database schema changes
- **Cross-Module Relations**: Enables data relationships between modules (e.g., PO → Material Receipt → Gate Pass → Inventory)

This design ensures:
- **Data Integrity**: Foreign key relationships across modules
- **Transaction Consistency**: ACID compliance across all operations
- **Simplified Deployment**: Single database file for easy backup/restore
- **Performance**: Reduced connection overhead and faster cross-module queries

## Quick Start

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- Git

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Initialize database (optional - auto-created on first run):**
   ```bash
   # Set environment variable to auto-create tables
   set AUTO_CREATE_DB=true  # Windows
   export AUTO_CREATE_DB=true  # Mac/Linux
   ```

3. **Run the application:**
   ```bash
   python -m app.main
   ```

   **Development mode with auto-reload:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Access the API:**
   - **Swagger UI**: http://localhost:8000/docs
   - **ReDoc**: http://localhost:8000/redoc
   - **Health Check**: http://localhost:8000/health
   - **API Status**: http://localhost:8000/

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - **Frontend**: http://localhost:5173
   - **Build for production**: `npm run build`

## API Endpoints Overview

### System Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | API status with all module information |
| `/health` | GET | Health check for all modules |

### Procurement Endpoints (`/api/v1/procurement`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **Items Management** |
| POST | `/items` | Create new item (dev only) |
| GET | `/items` | List all items |
| **Purchase Orders** |
| POST | `/` | Create purchase order |
| GET | `/` | List purchase orders (paginated) |
| GET | `/{po_id}` | Get purchase order details |
| PUT | `/{po_id}` | Update purchase order (DRAFT only) |
| POST | `/{po_id}/send` | Send purchase order for approval |
| POST | `/{po_id}/cancel` | Cancel purchase order |
| GET | `/{po_id}/tracking` | Get PO tracking information |
| GET | `/{po_id}/pending-items` | Get pending items for PO |
| GET | `/vendor/{vendor_id}` | List POs by vendor |
| GET | `/vendors/{vendor_id}` | Get vendor details (mock) |

### Quality Endpoints (`/api/v1/quality`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **Material Receipts** |
| POST | `/material-receipt/` | Create material receipt |
| GET | `/material-receipt/` | List material receipts |
| GET | `/material-receipt/{mr_id}` | Get material receipt details |
| PUT | `/material-receipt/{mr_id}` | Update material receipt |
| **Inspections** |
| POST | `/inspection/` | Create quality inspection |
| GET | `/inspection/` | List inspections |
| GET | `/inspection/{inspection_id}` | Get inspection details |
| **Gate Passes** |
| POST | `/gate-pass/` | Create gate pass |
| GET | `/gate-pass/` | List gate passes |
| GET | `/gate-pass/{gate_pass_id}` | Get gate pass details |

### Store Endpoints (`/api/v1/store`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **Inventory Management** |
| GET | `/inventory` | List inventory (with filters) |
| GET | `/inventory/{id}` | Get inventory item details |
| **Store Management** |
| POST | `/stores` | Create new store |
| GET | `/stores` | List all stores |
| GET | `/stores/{store_id}` | Get store details with bins |
| PUT | `/stores/{store_id}` | Update store information |
| DELETE | `/stores/{store_id}` | Delete store |
| POST | `/stores/{store_id}/bins` | Add bin to store |
| GET | `/stores/{store_id}/bins` | Get store bins |
| **Gate Pass Operations** |
| POST | `/receive-gate-pass/{gate_pass_id}` | Receive gate pass in store |
| GET | `/stores/{store_id}/pending-gate-passes` | Get pending gate passes |
| GET | `/stores/{store_id}/received-gate-passes` | Get received gate passes |
| GET | `/gate-passes/{gate_pass_id}` | Get gate pass details |
| **Material Dispatch** |
| POST | `/material-dispatch/` | Create material dispatch |
| GET | `/material-dispatch/` | List material dispatches |
| GET | `/material-dispatch/{dispatch_id}` | Get dispatch details |

### User Management (`/api/v1/users`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/` | Create new user |
| GET | `/{user_id}` | Get user by ID |
| GET | `/email/{email}` | Get user by email |
| GET | `/` | List all users |
| PUT | `/{user_id}` | Update user |
| DELETE | `/{user_id}` | Delete user |

### Attendance (`/api/v1/attendance`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/check-in` | Check in user |
| POST | `/check-out` | Check out user |
| GET | `/today/{user_id}` | Get today's attendance |
| GET | `/history/{user_id}` | Get attendance history |

### Contractors (`/api/v1/contractors`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | List all contractors |
| POST | `/` | Create new contractor |
| GET | `/{contractor_id}` | Get contractor details |
| PUT | `/{contractor_id}` | Update contractor |
| DELETE | `/{contractor_id}` | Delete contractor |
| POST | `/{contractor_id}/deactivate` | Deactivate contractor |

### Announcements (`/api/v1/announcements`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/events` | List announcements/events |
| POST | `/` | Create announcement |
| GET | `/{announcement_id}` | Get announcement details |

## Technology Stack

### Backend
- **Framework**: FastAPI 0.104.1
- **Database**: SQLite with SQLAlchemy 2.0.31
- **Migrations**: Alembic
- **Validation**: Pydantic 2.8.2
- **Server**: Uvicorn
- **Testing**: Pytest with async support

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.10.1
- **HTTP Client**: Axios 1.13.2
- **Styling**: CSS with custom components

## Testing

### Interactive API Testing

Use the built-in Swagger UI at `http://localhost:8000/docs` for interactive API testing.

### Sample API Calls

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Create Purchase Order:**
```bash
curl -X POST http://localhost:8000/api/v1/procurement/ \
  -H "Content-Type: application/json" \
  -d '{
    "vendor_id": 123,
    "lines": [
      {"item_id": 1, "quantity": 10, "price": "99.99"}
    ]
  }'
```

**Create Material Receipt:**
```bash
curl -X POST http://localhost:8000/api/v1/quality/material-receipt/ \
  -H "Content-Type: application/json" \
  -d '{
    "po_id": 1,
    "vendor_name": "ABC Suppliers",
    "received_by": "John Doe",
    "store_id": 1
  }'
```

**Check User Attendance:**
```bash
curl -X POST http://localhost:8000/api/v1/attendance/check-in \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1}'
```

### Running Tests

```bash
# Backend tests (if available)
cd backend
python -m pytest -v

# Frontend tests
cd frontend
npm test
```

## Key Features

### 🏭 **Procurement Management**
- Purchase order lifecycle management
- Item catalog with code-based identification
- Vendor management and PO tracking
- Multi-status workflow (DRAFT → SENT → RECEIVED)

### 🔍 **Quality Control**
- Material receipt processing
- Quality inspection workflows
- Gate pass generation and management
- Cross-module integration (PO → MR → Gate Pass)

### 📦 **Inventory & Store Management**
- Multi-store and bin-level inventory tracking
- Material dispatch management
- Gate pass receiving workflows
- Real-time stock level monitoring

### 👥 **Workforce Management**
- User account management
- Real-time attendance tracking
- Contractor lifecycle management
- Company-wide announcements

### 🔗 **Integration Features**
- Cross-module data relationships
- Unified database with referential integrity
- Real-time status updates across workflows
- Comprehensive audit trails

## Development

### Database Migrations

```bash
# Create new migration
cd backend
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Project Structure Notes

- **Modular Architecture**: Each business domain has its own models, schemas, services, and routers
- **Shared Database**: All modules use the same SQLite database for data consistency
- **Service Layer**: Business logic is encapsulated in service classes
- **Schema Validation**: Pydantic models ensure data validation and serialization
- **CORS Enabled**: Frontend can communicate with backend from different origins

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.