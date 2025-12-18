# Procurement Quality Portal - Setup and Run Guide

## Quick Start (Both Backend and Frontend)

### On Windows:
```bash
start_all.bat
```

This will open two terminal windows:
- Backend Server on `http://localhost:8000`
- Frontend Server on `http://localhost:5173`

### On Linux/Mac:
```bash
chmod +x start_all.sh
./start_all.sh
```

---

## Manual Setup

### Step 1: Install Dependencies

#### Backend:
```bash
cd backend
pip install -r requirements.txt
```

#### Frontend:
```bash
cd frontend
npm install
```

### Step 2: Initialize Database with Sample Data (Optional)

```bash
cd backend
python init_stores.py
```

This creates sample stores with bins for testing.

### Step 3: Start the Servers

#### Terminal 1 - Start Backend:
```bash
cd backend
python -m app.main
```

Backend will run on: `http://localhost:8000`

#### Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## Access the Application

### Frontend (Main Application):
```
http://localhost:5173
```

### Backend API Documentation:
```
http://localhost:8000/docs
```

### Demo Login Credentials:

| Email | Role | Usage |
|-------|------|-------|
| procurement@demo.com | Procurement | Purchase Orders, Vendor Management |
| quality@demo.com | Quality | Material Receipts, Inspections |
| store@demo.com | Store | Store Management, Inventory |

**Password:** Any password (demo mode)

---

## Troubleshooting

### Issue: "Network Error" in Store or Procurement Sections

**Cause:** Backend server is not running

**Solution:** 
1. Make sure the backend is running on `http://localhost:8000`
2. Check that `python -m app.main` is running in the backend terminal
3. Verify no other process is using port 8000

### Issue: Frontend can't connect to Backend

**Cause:** Port conflict or server not started

**Solution:**
```bash
# Check if port 8000 is in use (Linux/Mac)
lsof -i :8000

# Kill process using port 8000 (Linux/Mac)
kill -9 <PID>

# For Windows, use Task Manager to kill the process
```

### Issue: Module not found errors

**Cause:** Dependencies not installed

**Solution:**
```bash
cd backend
pip install -r requirements.txt

cd ../frontend
npm install
```

---

## Project Structure

```
backend/
├── app/
│   ├── core/           # Core dependencies and database
│   ├── procurement/    # Purchase Order management
│   ├── quality/        # Quality inspection
│   ├── store/          # Store and inventory management
│   └── main.py         # FastAPI application
└── requirements.txt    # Python dependencies

frontend/
├── src/
│   ├── api/            # API endpoints
│   ├── auth/           # Authentication
│   ├── pages/          # Main pages
│   ├── store/          # Store module (pages, components, CSS, hooks)
│   ├── procurement/    # Procurement module
│   ├── quality/        # Quality module
│   └── App.jsx         # Main app
├── package.json        # Node dependencies
└── vite.config.js      # Vite configuration
```

---

## Features

### Store Management
- View all stores with details
- Store details including:
  - Store ID
  - Plant Name
  - In-Charge Name, Mobile, Email
  - Number of Bins
- Add bins to stores
- Search stores

### Procurement
- Create purchase orders
- Track purchase orders
- Vendor management

### Quality
- Material receipt management
- Quality inspections
- Quality reports

---

## API Endpoints

### Store API
- `GET /api/v1/store/stores` - List all stores
- `POST /api/v1/store/stores` - Create new store
- `GET /api/v1/store/stores/{id}` - Get store details
- `PUT /api/v1/store/stores/{id}` - Update store
- `DELETE /api/v1/store/stores/{id}` - Delete store
- `GET /api/v1/store/stores/{id}/bins` - Get store bins
- `POST /api/v1/store/stores/{id}/bins` - Add bin to store

### Procurement API
- `GET /api/v1/procurement` - List purchase orders
- `POST /api/v1/procurement` - Create purchase order
- `GET /api/v1/procurement/{id}` - Get purchase order details

### Quality API
- `GET /api/v1/quality/material-receipt` - List material receipts
- `POST /api/v1/quality/material-receipt` - Create material receipt
- `POST /api/v1/quality/inspect` - Perform inspection

---

## Environment Setup

Both frontend and backend use `http://localhost:8000` as the API base URL.

To change the API base URL, modify:
- **Frontend**: `frontend/src/api/axios.js` - `baseURL` property
- **Backend**: `backend/app/main.py` - Configure `uvicorn.run()` port

---

## Notes

- Demo authentication is used for development
- SQLite databases are used (auto-created on first run)
- CORS is enabled for local development
- API documentation available at `/docs` endpoint
