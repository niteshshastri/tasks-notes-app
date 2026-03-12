# TaskFlow — Tasks & Notes Application

A full-stack task management application with notes support, built with **Node.js + Express** (backend) and **React + Vite** (frontend).

---

## Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Backend   | Node.js, Express, better-sqlite3 |
| Frontend  | React 18, Vite |
| Database  | SQLite (file-based, zero config) |
| Validation| express-validator |

---

## Project Structure

```
tasks-app/
├── backend/
│   ├── db/
│   │   ├── database.js        # DB connection & schema init
│   │   └── schema.sql         # SQL migration file
│   ├── models/
│   │   ├── taskModel.js       # Task DB queries
│   │   └── noteModel.js       # Note DB queries
│   ├── services/
│   │   ├── taskService.js     # Task business logic
│   │   └── noteService.js     # Note business logic
│   ├── controllers/
│   │   ├── taskController.js  # Task request handlers
│   │   └── noteController.js  # Note request handlers
│   ├── routes/
│   │   ├── taskRoutes.js      # Task route definitions
│   │   └── noteRoutes.js      # Note route definitions
│   ├── middleware/
│   │   └── errorHandler.js    # Global error middleware
│   └── server.js              # Express entry point
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── tasks.js        # API client (fetch wrapper)
    │   ├── components/
    │   │   ├── TaskCard.jsx    # Task card component
    │   │   ├── TaskForm.jsx    # Create/edit form
    │   │   └── TaskDetail.jsx  # Task detail + notes panel
    │   ├── hooks/
    │   │   ├── useTasks.js     # Tasks state & CRUD hook
    │   │   └── useNotes.js     # Notes state & CRUD hook
    │   ├── styles/
    │   │   └── global.css      # Global CSS design system
    │   ├── App.jsx             # Root component
    │   └── main.jsx            # React entry point
    ├── index.html
    └── vite.config.js
```

---

## Prerequisites

- **Node.js** v18+ and **npm** v9+

---

## Setup & Running Locally

### 1. Clone / unzip the project

```bash
cd tasks-app
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev        # uses nodemon for hot-reload
# or: npm start   # production
```

The server starts at **http://localhost:5000**

> The SQLite database file (`database.sqlite`) is created automatically on first run.  
> No additional database setup required.

### 3. Start the Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

The React app starts at **http://localhost:5173**

---

## API Reference

### Tasks — `GET /api/tasks`

Query parameters:

| Param    | Type   | Description                            |
|----------|--------|----------------------------------------|
| search   | string | Filter by title or description         |
| status   | string | `todo` \| `in_progress` \| `done`      |
| priority | string | `low` \| `medium` \| `high`            |
| page     | number | Page number (default: 1)               |
| limit    | number | Items per page (default: 10, max: 50)  |

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}
```

### Tasks — Full CRUD

| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| GET    | /api/tasks        | List with filters |
| GET    | /api/tasks/:id    | Get single task   |
| POST   | /api/tasks        | Create task       |
| PATCH  | /api/tasks/:id    | Update task       |
| DELETE | /api/tasks/:id    | Delete task       |

### Notes — Nested under Tasks

| Method | Endpoint                          | Description   |
|--------|-----------------------------------|---------------|
| GET    | /api/tasks/:taskId/notes          | List notes    |
| POST   | /api/tasks/:taskId/notes          | Create note   |
| PATCH  | /api/tasks/:taskId/notes/:id      | Update note   |
| DELETE | /api/tasks/:taskId/notes/:id      | Delete note   |

### Task Payload

```json
{
  "title":       "string (required)",
  "description": "string (optional)",
  "status":      "todo | in_progress | done",
  "priority":    "low | medium | high",
  "due_date":    "YYYY-MM-DD (optional)",
  "tags":        ["array", "of", "strings"]
}
```

---

## Database Schema

See `backend/db/schema.sql` for the full SQL.

**tables:** `tasks`, `notes`  
**relationships:** notes.task_id → tasks.id (CASCADE DELETE)

---

## Features

- ✅ Create, read, update, delete tasks
- ✅ Task status: `todo` → `in_progress` → `done`
- ✅ Priority levels: low / medium / high
- ✅ Due dates with overdue highlighting
- ✅ Tag support
- ✅ Full-text search (title + description)
- ✅ Filter by status and priority
- ✅ Pagination
- ✅ Notes per task (CRUD)
- ✅ Clean layered architecture: routes → controllers → services → models
- ✅ Input validation with `express-validator`
- ✅ Global error handling middleware
