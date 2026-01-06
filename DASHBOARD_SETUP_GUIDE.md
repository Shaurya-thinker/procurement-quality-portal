# Dashboard Full Setup Guide

Your dashboard is now configured to use real data! Follow these steps to get everything working:

## What's Been Fixed

✅ **Backend User API** - Now registered and ready to use
✅ **Dashboard Component** - Updated to fetch real data from APIs  
✅ **Database Seeding** - Sample data script created
✅ **Error Handling** - Graceful fallbacks and error messages

## Setup Steps

### Step 1: Start the Backend Server

The backend needs to be running on `http://localhost:8000` for the frontend to connect.

**Option A: Using Command Line (Recommended)**

Open a new terminal/command prompt in the project root:

```bash
# Navigate to backend
cd backend

# Install dependencies (if not done)
pip install -r requirements.txt

# Run database seeding to populate with sample data
python seed_data.py

# Start the backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Option B: One-Command Setup (Windows)**

```batch
cd backend && python seed_data.py && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Option C: One-Command Setup (Linux/Mac)**

```bash
cd backend && python seed_data.py && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 2: Verify Backend is Running

Once the backend starts, you should see output like:

```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Test it by visiting in your browser:
- http://localhost:8000/ - Should show API info
- http://localhost:8000/health - Should show health status

### Step 3: Frontend Will Auto-Connect

The frontend dev server (already running on port 5173) will automatically detect and connect to the backend once you:
1. Keep the backend server running in the terminal
2. Refresh your browser

## What the Dashboard Now Shows

The dashboard displays real data:

- **Total Employees** - Fetched from `/api/v1/users` endpoint
- **Total POs** - Fetched from `/api/v1/procurement` endpoint  
- **Today's Events** - Fetched from `/api/v1/announcements/events` endpoint
- **Recent Activity** - Built from actual announcements and meetings

## Sample Data Included

When you run the seed script (`python seed_data.py`), it creates:

### 10 Sample Employees
- Rajesh Kumar (Senior Developer)
- Priya Singh (Engineering Manager)
- Amit Sharma (QA Lead)
- Sneha Patel (Procurement Specialist)
- Vikram Singh (Procurement Manager)
- Neha Gupta (Store Manager)
- Arjun Reddy (Quality Inspector)
- Anjali Verma (HR Executive)
- Rohan Kapoor (Finance Manager)
- Divya Nair (Junior Developer)

### 5 Sample Events
- Quarterly Town Hall Meeting
- Product Launch Event
- Employee Wellness Program
- Safety Training Session
- Team Building Activity

### 2 Sample Trainings
- Advanced Python Programming
- Project Management Essentials

### 2 Sample Meetings
- Weekly Sync - Development Team
- Procurement Review Board

## Troubleshooting

### Backend Connection Error
**Error**: "Failed to load dashboard data"

**Solution**: 
1. Verify backend is running on `http://localhost:8000`
2. Check that Python dependencies are installed: `pip install -r requirements.txt`
3. Check backend logs for errors
4. Refresh the page after backend starts

### No Data Showing
**Error**: All stats show 0

**Solution**:
1. Ensure seed script ran successfully: `python seed_data.py`
2. Check that database file exists (SQLite creates `*.db` file in backend directory)
3. Run seed script again: `python seed_data.py`

### Port Already in Use
**Error**: "Address already in use" on port 8000

**Solution**:
1. Find and kill process using port 8000
2. Or use a different port: `python -m uvicorn app.main:app --port 8001`
3. Update `frontend/src/api/axios.js` to use new port

### Module Import Errors
**Error**: "ModuleNotFoundError: No module named 'app'"

**Solution**:
1. Ensure you're in the `backend` directory: `cd backend`
2. Run from parent directory: `cd .. && python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000`

## API Endpoints Available

Once backend is running, these endpoints work:

```
Users:
  GET    /api/v1/users              - List all users
  POST   /api/v1/users              - Create user
  GET    /api/v1/users/{id}         - Get user by ID
  GET    /api/v1/users/email/{email} - Get user by email
  PUT    /api/v1/users/{id}         - Update user
  DELETE /api/v1/users/{id}         - Delete user

Events:
  GET    /api/v1/announcements/events - List events
  POST   /api/v1/announcements/events - Create event

Meetings:
  GET    /api/v1/announcements/meetings - List meetings
  POST   /api/v1/announcements/meetings - Create meeting

Attendance:
  GET    /api/v1/attendance/today/{user_id}   - Today's attendance
  POST   /api/v1/attendance/check-in          - Check in
  POST   /api/v1/attendance/check-out         - Check out
```

## Files Modified/Created

**New Files Created**:
- `backend/seed_data.py` - Database seeding script
- `backend/run_with_seed.sh` - Linux/Mac setup script
- `backend/run_with_seed.bat` - Windows setup script
- `backend/user/__init__.py` - User module initialization

**Files Modified**:
- `backend/app/main.py` - Added user router registration
- `frontend/src/pages/Dashboard.jsx` - Updated with real data fetching
- `frontend/src/pages/Dashboard.css` - Added loading/error states

## Next Steps

1. **Start Backend**: Open terminal → Run seed & backend
2. **Dashboard Ready**: Frontend auto-connects and shows real data
3. **Add More Data**: Use API endpoints to add more users/events
4. **Integrate Other Features**: Now other pages can also use these APIs

---

**Questions?** Check the logs in the terminal where backend is running for detailed error messages.
