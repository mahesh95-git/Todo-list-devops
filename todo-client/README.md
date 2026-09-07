# TaskFlow - Modern Fullstack Todo Client

A responsive React + TypeScript frontend client for the Todo API built with Vite and Tailwind CSS.

## Features

- **Authentication**:
  - Sign Up & Sign In with validation
  - Persistent JWT session in `localStorage`
  - Automatic session recovery with `GET /api/auth/me`
  - Auto-logout on token expiration (401 response handling)

- **Todo Management**:
  - **Create Task**: Quick input with Enter key shortcut and character counter (`POST /api/todos`).
  - **Toggle Complete**: Checkbox toggle updating task status (`PATCH /api/todos/:id`).
  - **Inline Editing**: Double-click or click the edit icon to rename tasks inline (`PATCH /api/todos/:id`).
  - **Delete Task**: Delete with inline confirmation protection (`DELETE /api/todos/:id`).
  - **Filter by Status**: Filter tasks by All, Active, or Completed.
  - **Debounced Search**: Search tasks by title in real-time.
  - **Sorting**: Sort by Newest, Oldest, Title (A-Z), and Title (Z-A).
  - **Pagination**: Page size selector (5, 10, 20, 50 per page), direct page jumps, and total count metadata.

- **UI & UX Highlights**:
  - Live backend health status indicator (`GET /health`).
  - Real-time statistics overview (Total tasks, In Progress, Completed, Completion rate %).
  - Animated toast notifications for all operations.
  - Loading skeleton states and clear empty state indicators.
  - Glassmorphic dark theme styled with Tailwind CSS and Lucide icons.

## Getting Started

### 1. Install Dependencies
```bash
cd todo-client
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will open on `http://localhost:5173` and automatically proxy API requests to `http://localhost:5000`.

### 3. Build for Production
```bash
npm run build
```

## Backend API Endpoints Connected

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health status check |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Login user & receive JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/todos` | List todos with pagination, filters, search, sort |
| `POST` | `/api/todos` | Create a new task |
| `GET` | `/api/todos/:id` | Fetch single task by ID |
| `PATCH` | `/api/todos/:id` | Update task title / completion status |
| `DELETE` | `/api/todos/:id` | Delete task |
