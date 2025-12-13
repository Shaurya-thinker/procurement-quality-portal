# Procurement Quality Portal - Project Structure

## 📁 Directory Structure

```
procurement-quality-portal/
│
├── backend/
│   └── app/
│       ├── __init__.py
│       ├── core/                 # Core utilities (future)
│       ├── procurement/          # ✅ COMPLETED
│       │   ├── __init__.py
│       │   ├── main.py          # Entry point for testing
│       │   ├── models/          # SQLAlchemy ORM models
│       │   │   ├── __init__.py
│       │   │   ├── item.py
│       │   │   ├── purchase_order.py
│       │   │   └── purchase_order_line.py
│       │   ├── schemas/         # Pydantic validation schemas
│       │   │   ├── __init__.py
│       │   │   ├── item.py
│       │   │   └── purchase_order.py
│       │   ├── services/        # Business logic layer
│       │   │   ├── __init__.py
│       │   │   └── procurement_service.py
│       │   ├── routers/         # FastAPI route handlers
│       │   │   ├── __init__.py
│       │   │   └── procurement.py
│       │   └── tests/           # pytest test suite
│       │       ├── __init__.py
│       │       └── test_procurement.py  # 13 passing tests
│       ├── quality/             # Quality module (future)
│       ├── store/               # Store module (future)
│       └── utils/               # Utility functions (future)
│
├── docs/                         # Documentation
├── frontend/                     # Frontend code
│   └── src/
│       ├── procurement/
│       ├── quality/
│       └── store/
│
└── README.md
```

## ✅ Completed: Procurement Backend

### Features
- **Models**: Item, PurchaseOrder, PurchaseOrderLine with SQLAlchemy ORM
- **Schemas**: Pydantic v2 with validation, decimal serialization
- **Services**: Business logic with CRUD operations
- **API Routes**: 4 endpoints with proper error handling
- **Tests**: 13 comprehensive pytest tests (all passing)

### Database
- **Type**: SQLite
- **Location**: `procurement.db` (auto-created on first run)
- **Tables**: items, purchase_orders, purchase_order_lines

## 🚀 Running the Procurement Backend

### Start Server
```bash
cd backend/app
python procurement/main.py
```

Server runs on: `http://localhost:8000`

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Test the API

**Run pytest tests:**
```bash
python -m pytest backend/app/procurement/tests/test_procurement.py -v
```

**Using cURL:**
```bash
# List all POs
curl -X GET http://localhost:8000/api/v1/procurement/ \
  -H "Authorization: Bearer test-token"

# Create PO
curl -X POST http://localhost:8000/api/v1/procurement/ \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{
    "vendor_id": 123,
    "lines": [
      {"item_id": 1, "quantity": 10, "price": "99.99"}
    ]
  }'

# Get PO by ID
curl -X GET http://localhost:8000/api/v1/procurement/1 \
  -H "Authorization: Bearer test-token"

# Send PO (change status to SENT)
curl -X POST http://localhost:8000/api/v1/procurement/1/send \
  -H "Authorization: Bearer test-token"
```

## 📋 API Endpoints

| Method | Endpoint | Status |
|--------|----------|--------|
| POST | `/api/v1/procurement/` | ✅ Create PO |
| GET | `/api/v1/procurement/` | ✅ List POs (with pagination & filtering) |
| GET | `/api/v1/procurement/{po_id}` | ✅ Get specific PO |
| POST | `/api/v1/procurement/{po_id}/send` | ✅ Send PO |

## 🧪 Test Suite Status

**All 13 tests passing** ✅

1. ✅ Create PO with valid data
2. ✅ Create PO with invalid item ID
3. ✅ Create PO with invalid vendor ID
4. ✅ Create PO with no line items
5. ✅ Create PO with multiple line items
6. ✅ List empty POs
7. ✅ List POs with pagination
8. ✅ Filter POs by status
9. ✅ Get PO by ID
10. ✅ Get non-existent PO (404)
11. ✅ Send PO (change status)
12. ✅ Send already-sent PO (idempotent)
13. ✅ Send non-existent PO (404)

## 🔄 Status

- ✅ **Procurement Backend**: Complete and tested
- ⏳ **Quality Backend**: Not yet implemented
- ⏳ **Store Backend**: Not yet implemented
- ⏳ **Main App**: Waiting for all modules

## 📝 Technology Stack

- **Framework**: FastAPI
- **Database**: SQLAlchemy ORM + SQLite
- **Validation**: Pydantic v2
- **Testing**: pytest
- **Server**: Uvicorn
