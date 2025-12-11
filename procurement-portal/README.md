# Procurement & Quality Portal

A comprehensive portal for managing procurement processes and quality control operations.

## Project Structure

```
procurement-portal/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   └── .env.example
├── frontend/
├── docs/
└── scripts/
```

## Setup

### Backend
1. Navigate to the backend directory
2. Install dependencies: `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and configure
4. Run: `uvicorn app.main:app --reload`

### Frontend
1. Navigate to the frontend directory
2. Open `index.html` in a browser

## API Endpoints

See `docs/API_CONTRACT.md` for detailed API documentation.