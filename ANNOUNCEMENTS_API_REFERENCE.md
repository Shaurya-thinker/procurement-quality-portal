# Announcements API - Request/Response Examples

## Overview
This document shows example API requests and responses for the enhanced announcements feature.

---

## Events API

### Create Event Request
```bash
POST /api/v1/announcements/events
Content-Type: application/json

{
  "title": "Annual Company Meeting",
  "description": "Join us for our annual company meeting to review 2025 achievements and set 2026 goals.",
  "event_date": "2026-01-15",
  "location": "Grand Ballroom, 5th Floor",
  "organizer": "HR Department",
  "agenda": "- Opening remarks\n- Financial review\n- Strategic initiatives\n- Team recognition\n- Q&A Session"
}
```

### Create Event Response
```json
{
  "id": 1,
  "title": "Annual Company Meeting",
  "description": "Join us for our annual company meeting to review 2025 achievements and set 2026 goals.",
  "event_date": "2026-01-15",
  "location": "Grand Ballroom, 5th Floor",
  "organizer": "HR Department",
  "agenda": "- Opening remarks\n- Financial review\n- Strategic initiatives\n- Team recognition\n- Q&A Session"
}
```

### Get All Events Request
```bash
GET /api/v1/announcements/events
```

### Get All Events Response
```json
[
  {
    "id": 1,
    "title": "Annual Company Meeting",
    "description": "Join us for our annual company meeting to review 2025 achievements and set 2026 goals.",
    "event_date": "2026-01-15",
    "location": "Grand Ballroom, 5th Floor",
    "organizer": "HR Department",
    "agenda": "- Opening remarks\n- Financial review\n- Strategic initiatives\n- Team recognition\n- Q&A Session"
  },
  {
    "id": 2,
    "title": "Product Launch Event",
    "description": "Unveiling of our new product line to stakeholders and media.",
    "event_date": "2026-02-20",
    "location": "Innovation Center",
    "organizer": "Product Team",
    "agenda": "- Welcome\n- Product Demo\n- Q&A\n- Networking"
  }
]
```

---

## Trainings API

### Create Training Request
```bash
POST /api/v1/announcements/trainings
Content-Type: application/json

{
  "training_name": "Advanced Python Development",
  "start_date": "2026-01-20",
  "end_date": "2026-01-24",
  "description": "A comprehensive 5-day training program on advanced Python concepts including decorators, metaclasses, and async programming.",
  "location": "Training Center, Building A, Room 201",
  "trainer_name": "Dr. Sarah Johnson",
  "agenda": "Day 1: Decorators & Function Wrapping\nDay 2: Metaclasses & OOP Advanced\nDay 3: Async/Await & Concurrency\nDay 4: Performance Optimization\nDay 5: Project & Assessment"
}
```

### Create Training Response
```json
{
  "id": 1,
  "training_name": "Advanced Python Development",
  "start_date": "2026-01-20",
  "end_date": "2026-01-24",
  "description": "A comprehensive 5-day training program on advanced Python concepts including decorators, metaclasses, and async programming.",
  "location": "Training Center, Building A, Room 201",
  "trainer_name": "Dr. Sarah Johnson",
  "agenda": "Day 1: Decorators & Function Wrapping\nDay 2: Metaclasses & OOP Advanced\nDay 3: Async/Await & Concurrency\nDay 4: Performance Optimization\nDay 5: Project & Assessment"
}
```

### Get All Trainings Request
```bash
GET /api/v1/announcements/trainings
```

### Get All Trainings Response
```json
[
  {
    "id": 1,
    "training_name": "Advanced Python Development",
    "start_date": "2026-01-20",
    "end_date": "2026-01-24",
    "description": "A comprehensive 5-day training program on advanced Python concepts including decorators, metaclasses, and async programming.",
    "location": "Training Center, Building A, Room 201",
    "trainer_name": "Dr. Sarah Johnson",
    "agenda": "Day 1: Decorators & Function Wrapping\nDay 2: Metaclasses & OOP Advanced\nDay 3: Async/Await & Concurrency\nDay 4: Performance Optimization\nDay 5: Project & Assessment"
  }
]
```

---

## Meetings API

### Create Meeting Request
```bash
POST /api/v1/announcements/meetings
Content-Type: application/json

{
  "meeting_title": "Q1 Planning Session",
  "meeting_date": "2026-01-10",
  "meeting_time": "10:00:00",
  "location": "Conference Room A / Zoom Virtual",
  "meeting_link": "https://zoom.us/j/meeting123456789",
  "organizer": "Project Manager - Alice Smith",
  "agenda": "1. Q1 Objectives Review (15 min)\n2. Budget Allocation (20 min)\n3. Resource Planning (15 min)\n4. Risk Assessment (10 min)\n5. Timeline & Milestones (10 min)\n6. Q&A (10 min)"
}
```

### Create Meeting Response
```json
{
  "id": 1,
  "meeting_title": "Q1 Planning Session",
  "meeting_date": "2026-01-10",
  "meeting_time": "10:00:00",
  "location": "Conference Room A / Zoom Virtual",
  "meeting_link": "https://zoom.us/j/meeting123456789",
  "organizer": "Project Manager - Alice Smith",
  "agenda": "1. Q1 Objectives Review (15 min)\n2. Budget Allocation (20 min)\n3. Resource Planning (15 min)\n4. Risk Assessment (10 min)\n5. Timeline & Milestones (10 min)\n6. Q&A (10 min)"
}
```

### Get All Meetings Request
```bash
GET /api/v1/announcements/meetings
```

### Get All Meetings Response
```json
[
  {
    "id": 1,
    "meeting_title": "Q1 Planning Session",
    "meeting_date": "2026-01-10",
    "meeting_time": "10:00:00",
    "location": "Conference Room A / Zoom Virtual",
    "meeting_link": "https://zoom.us/j/meeting123456789",
    "organizer": "Project Manager - Alice Smith",
    "agenda": "1. Q1 Objectives Review (15 min)\n2. Budget Allocation (20 min)\n3. Resource Planning (15 min)\n4. Risk Assessment (10 min)\n5. Timeline & Milestones (10 min)\n6. Q&A (10 min)"
  },
  {
    "id": 2,
    "meeting_title": "Weekly Team Standup",
    "meeting_date": "2026-01-08",
    "meeting_time": "09:30:00",
    "location": "Teams Video Call",
    "meeting_link": "https://teams.microsoft.com/l/meetup-join/meeting123",
    "organizer": "Scrum Master - Bob Wilson",
    "agenda": "- Sprint Progress Review\n- Blockers & Issues\n- Daily Updates\n- Sprint Planning"
  }
]
```

---

## Data Field Reference

### Event Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | integer | No (auto) | Unique identifier |
| title | string | Yes | Event name |
| description | string | No | Detailed description |
| event_date | date | Yes | Event date (YYYY-MM-DD) |
| location | string | No | Event location |
| organizer | string | No | Organizing person/department |
| agenda | text | No | Detailed agenda/topics |

### Training Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | integer | No (auto) | Unique identifier |
| training_name | string | Yes | Training title |
| description | string | No | Training description |
| start_date | date | Yes | Start date (YYYY-MM-DD) |
| end_date | date | Yes | End date (YYYY-MM-DD) |
| location | string | No | Training venue |
| trainer_name | string | No | Trainer's name |
| agenda | text | No | Course curriculum/topics |

### Meeting Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | integer | No (auto) | Unique identifier |
| meeting_title | string | Yes | Meeting name |
| meeting_date | date | Yes | Meeting date (YYYY-MM-DD) |
| meeting_time | time | No | Meeting time (HH:MM:SS) |
| location | string | No | Location/venue |
| meeting_link | string | No | Video conference URL |
| organizer | string | No | Meeting organizer |
| agenda | text | No | Discussion topics/agenda |

---

## Minimal Request Examples

If you only want to provide required fields:

### Minimal Event
```json
{
  "title": "Team Meeting",
  "event_date": "2026-01-15"
}
```

### Minimal Training
```json
{
  "training_name": "Python Basics",
  "start_date": "2026-02-01",
  "end_date": "2026-02-05"
}
```

### Minimal Meeting
```json
{
  "meeting_title": "Daily Standup",
  "meeting_date": "2026-01-15"
}
```

---

## Curl Examples

### Create Event with Curl
```bash
curl -X POST http://localhost:8000/api/v1/announcements/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Annual Meeting",
    "event_date": "2026-01-15",
    "location": "Main Hall",
    "organizer": "HR",
    "agenda": "Company review and planning"
  }'
```

### Get All Events with Curl
```bash
curl http://localhost:8000/api/v1/announcements/events
```

### Create Meeting with Curl
```bash
curl -X POST http://localhost:8000/api/v1/announcements/meetings \
  -H "Content-Type: application/json" \
  -d '{
    "meeting_title": "Q1 Planning",
    "meeting_date": "2026-01-10",
    "meeting_time": "10:00:00",
    "location": "Zoom",
    "meeting_link": "https://zoom.us/j/123456789",
    "organizer": "PM",
    "agenda": "Review Q1 objectives"
  }'
```

---

## Response Codes

| Status | Meaning |
|--------|---------|
| 200 | Success (GET request) |
| 201 | Created (POST request) |
| 400 | Bad request (validation error) |
| 404 | Not found |
| 500 | Server error |

---

## Error Response Example

```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## Notes

- All dates must be in ISO format: YYYY-MM-DD
- All times must be in ISO format: HH:MM:SS (24-hour)
- Text fields can contain newlines for multiline content
- URLs in meeting_link field should include http:// or https://
- Maximum field lengths: string fields (255 chars), text fields (unlimited)
- Optional fields can be omitted or set to null
