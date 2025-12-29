# Announcements Feature - Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AnnouncementsContext                                    │  │
│  │  - events[], trainings[], meetings[]                    │  │
│  │  - loadAll(), createEvent(), etc.                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ↓                                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Announcements.jsx (Main Component)                     │  │
│  │  - Create Form (Dynamic based on type)                 │  │
│  │  - Card Display (Grid layout)                          │  │
│  │  - Detail Modal (Full information)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ↓                                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  announcements.api.js                                   │  │
│  │  - fetchEvents()    - fetchTrainings()                 │  │
│  │  - fetchMeetings()  - createEvent()                    │  │
│  │  - createTraining() - createMeeting()                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                    HTTP/JSON (REST)
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                          ↓                                       │
│              BACKEND (FastAPI)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  router.py (API Endpoints)                              │  │
│  │  GET  /api/v1/announcements/events                      │  │
│  │  GET  /api/v1/announcements/trainings                   │  │
│  │  GET  /api/v1/announcements/meetings                    │  │
│  │  POST /api/v1/announcements/events                      │  │
│  │  POST /api/v1/announcements/trainings                   │  │
│  │  POST /api/v1/announcements/meetings                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ↓                                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  schemas.py (Data Validation)                           │  │
│  │  - EventCreate, EventOut                               │  │
│  │  - TrainingCreate, TrainingOut                         │  │
│  │  - MeetingCreate, MeetingOut                           │  │
│  │  (All with: location, agenda, organizer fields)        │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ↓                                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  models.py (Database Models)                            │  │
│  │  - Event  (7 columns)                                  │  │
│  │  - Training (8 columns)                                │  │
│  │  - Meeting (8 columns)                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ↓                                                      │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                      SQLAlchemy ORM
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                          ↓                                       │
│              DATABASE (SQLite)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  events table                                            │  │
│  │  - id, title, description, event_date                  │  │
│  │  - location, agenda, organizer (NEW)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  trainings table                                         │  │
│  │  - id, training_name, start_date, end_date             │  │
│  │  - description, location, trainer_name, agenda (NEW)   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  meetings table                                          │  │
│  │  - id, meeting_title, meeting_date, meeting_time       │  │
│  │  - meeting_link, location, agenda, organizer (NEW)     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

### Creating an Announcement

```
User fills form
      ↓
Form submitted to handleCreate()
      ↓
Payload sent to API (createEvent/Training/Meeting)
      ↓
HTTP POST to backend
      ↓
Router receives request
      ↓
Schema validates data (EventCreate/TrainingCreate/MeetingCreate)
      ↓
Model created from validated data
      ↓
Database insert (INSERT INTO events/trainings/meetings)
      ↓
Database returns created record
      ↓
Schema serializes response (EventOut/TrainingOut/MeetingOut)
      ↓
HTTP response sent to frontend
      ↓
Context loadAll() refreshes data
      ↓
UI re-renders with new announcement
      ↓
User sees announcement in list
```

### Viewing Announcements

```
User navigates to page
      ↓
Component mounts
      ↓
Context loads all data (loadAll())
      ↓
API calls: fetchEvents, fetchTrainings, fetchMeetings
      ↓
HTTP GET requests to backend
      ↓
Router queries database
      ↓
Database returns records
      ↓
Schema serializes responses
      ↓
Frontend receives data
      ↓
Context combines data into announcements array
      ↓
Component renders:
   ├─ Create form button
   ├─ Announcement cards
   └─ Detail modal (on click)
      ↓
User sees:
   ├─ Quick overview in cards
   └─ Full details in modal
```

---

## 🔀 Component Interaction

```
┌─────────────────────────────────────────────────────┐
│         Announcements.jsx (Main Component)          │
└─────────────────────────────────────────────────────┘
              ↑                    ↓
              │                    │
    useAnnouncements()         Display Logic:
    (Read data)                ├─ Show form
              │                ├─ Render cards
              │                ├─ Show modal
              │                └─ Handle clicks
    ┌─────────────────┐
    │ Context Provider│
    │ (Global State) │
    └─────────────────┘
              ↑
              │
    ┌─────────────────┐
    │   API Calls     │
    │  (announcements │
    │   .api.js)     │
    └─────────────────┘
              ↑
              │
         ┌────────┐
         │ Backend│
         └────────┘
              ↑
              │
         ┌────────┐
         │Database│
         └────────┘
```

---

## 🎯 State Management

### Context State Structure

```javascript
{
  // Data from API
  events: [
    {
      id: 1,
      title: "...",
      description: "...",
      event_date: "2026-01-15",
      location: "...",
      agenda: "...",
      organizer: "..."
    }
  ],
  
  trainings: [
    {
      id: 1,
      training_name: "...",
      start_date: "2026-01-20",
      end_date: "2026-01-24",
      description: "...",
      location: "...",
      trainer_name: "...",
      agenda: "..."
    }
  ],
  
  meetings: [
    {
      id: 1,
      meeting_title: "...",
      meeting_date: "2026-01-10",
      meeting_time: "10:00:00",
      meeting_link: "...",
      location: "...",
      agenda: "...",
      organizer: "..."
    }
  ],
  
  // Combined array (sorted by date)
  announcements: [...], // merged from above 3 arrays
  
  // UI State
  loading: false,
  error: null
}
```

### Component Local State

```javascript
{
  showCreate: false,              // Form visibility
  formType: "Event",              // Which form to show
  selectedAnnouncement: null,     // For modal display
  
  formData: {
    // Event fields
    title: "",
    description: "",
    event_date: "",
    location: "",
    agenda: "",
    organizer: "",
    
    // Training fields
    training_name: "",
    start_date: "",
    end_date: "",
    trainer_name: "",
    
    // Meeting fields
    meeting_title: "",
    meeting_date: "",
    meeting_time: "",
    meeting_link: ""
  },
  
  submitting: false               // Form submission state
}
```

---

## 🔄 API Request/Response Cycle

### Example: Create Event

```
Request:
POST /api/v1/announcements/events
{
  "title": "Team Meeting",
  "description": "Q1 planning",
  "event_date": "2026-01-15",
  "location": "Room A",
  "agenda": "Planning items",
  "organizer": "Manager"
}

Processing:
┌─────────────────────────────────┐
│ Router receives request          │
│ ↓                               │
│ Schema validates (EventCreate)  │
│ ↓                               │
│ Model creates instance          │
│ ↓                               │
│ Database INSERT                 │
│ ↓                               │
│ Record retrieved                │
│ ↓                               │
│ Schema serializes (EventOut)    │
└─────────────────────────────────┘

Response:
HTTP 200 OK
{
  "id": 1,
  "title": "Team Meeting",
  "description": "Q1 planning",
  "event_date": "2026-01-15",
  "location": "Room A",
  "agenda": "Planning items",
  "organizer": "Manager"
}
```

---

## 📈 Database Schema

### Event Record Example

```sql
{
  id: 1,
  title: "Annual Meeting",
  description: "Review 2025 results",
  event_date: "2026-01-15",
  location: "Main Hall",
  agenda: "Results, Planning, Awards",
  organizer: "HR"
}
```

### Training Record Example

```sql
{
  id: 1,
  training_name: "Python Course",
  start_date: "2026-01-20",
  end_date: "2026-01-24",
  description: "Advanced Python",
  location: "Lab 301",
  trainer_name: "Dr. Smith",
  agenda: "Topics covered..."
}
```

### Meeting Record Example

```sql
{
  id: 1,
  meeting_title: "Q1 Planning",
  meeting_date: "2026-01-10",
  meeting_time: "10:00:00",
  meeting_link: "https://zoom.us/...",
  location: "Conference Room",
  agenda: "Objectives, Budget, Timeline",
  organizer: "Project Manager"
}
```

---

## 🎨 UI Component Hierarchy

```
Announcements
├── Header (with buttons)
│   ├── Title
│   └── Button Group
│       ├── New Event
│       ├── New Training
│       └── New Meeting
├── Form (conditional)
│   ├── Dynamic Input Fields
│   └── Submit/Cancel Buttons
├── Announcements Grid
│   └── Card (repeating)
│       ├── Type Icon
│       ├── Title & Date
│       ├── Metadata (Location, Organizer)
│       ├── Description Preview
│       └── View Details Link
└── Modal (conditional)
    ├── Header (Title)
    ├── Content (All Details)
    │   ├── Type, Date(s), Time
    │   ├── Location
    │   ├── Organizer/Trainer
    │   ├── Description
    │   └── Agenda
    └── Close Button
```

---

## 📞 API Endpoints Summary

```
GET  /api/v1/announcements/events      → List all events
GET  /api/v1/announcements/trainings   → List all trainings
GET  /api/v1/announcements/meetings    → List all meetings

POST /api/v1/announcements/events      → Create event
POST /api/v1/announcements/trainings   → Create training
POST /api/v1/announcements/meetings    → Create meeting
```

---

## 🔐 Data Validation Flow

```
Frontend Form
      ↓
User Input
      ↓
Frontend checks (required fields)
      ↓
Submit to API
      ↓
Backend Pydantic Schema validates:
├─ Field types
├─ Required/optional
├─ String length limits
└─ Date/time formats
      ↓
If valid → Process
If invalid → Return 422 error
      ↓
Create database record
      ↓
Return validated response
```

---

## 🚀 Deployment Architecture

```
┌─────────────────┐
│  Git Repository │
└────────┬────────┘
         │
    Push changes
         │
┌────────▼─────────────┐
│  CI/CD Pipeline      │
├──────────────────────┤
│ 1. Tests pass       │
│ 2. Build artifacts  │
│ 3. Generate docs    │
└────────┬─────────────┘
         │
         │Deploy
         │
    ┌────▼──────────┐
    │ Prod Server   │
    │ - Backend     │
    │ - Frontend    │
    │ - Database    │
    └───────────────┘
```

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Proper data validation
- ✅ Scalable design
- ✅ Easy maintenance
- ✅ Professional code organization
