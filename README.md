# Simple TODO App

A simple personal task manager to improve daily productivity. Built with Node.js, Express, MongoDB, and React.

## Features

- Add new tasks with a title
- Mark tasks as complete or incomplete
- Delete tasks
- Filter tasks by status (All / Active / Completed)
- Tasks sorted by creation time (newest first)
- Responsive mobile-friendly design

## Prerequisites

- Node.js 18+
- MongoDB (local installation or MongoDB Atlas)
- npm 9+

## Project Structure

```
/
├── server/          # Node.js + Express + MongoDB backend
└── client/          # React + TypeScript frontend
```

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd simple-todo-app
```

### 2. Set up environment variables

**Server:**
```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
NODE_ENV=development
```

### 3. Install dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

## Running the Application

### Development Mode

**Start the backend server:**
```bash
cd server
npm run dev
```
The server will run on http://localhost:5000

**Start the frontend (in a new terminal):**
```bash
cd client
npm run dev
```
The client will run on http://localhost:5173

### Production Build

**Build the backend:**
```bash
cd server
npm run build
npm start
```

**Build the frontend:**
```bash
cd client
npm run build
npm run preview
```

## Running Tests

```bash
cd server
npm test
```

Tests use `mongodb-memory-server`, so no real MongoDB instance is needed.

## API Documentation

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| GET | /api/tasks | Get all tasks | - | `{ success, data: Task[] }` |
| GET | /api/tasks?status=active | Get active tasks | - | `{ success, data: Task[] }` |
| GET | /api/tasks?status=completed | Get completed tasks | - | `{ success, data: Task[] }` |
| POST | /api/tasks | Create a task | `{ title: string }` | `{ success, data: Task }` |
| PUT | /api/tasks/:id | Update task status | `{ completed: boolean }` | `{ success, data: Task }` |
| DELETE | /api/tasks/:id | Delete a task | - | `{ success, message, data: Task }` |

### Task Object

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2024-03-25T10:00:00.000Z",
  "updatedAt": "2024-03-25T10:00:00.000Z"
}
```

## Seed Data

To populate the database with sample tasks:

```bash
cd server
npx ts-node scripts/seed.ts
```

This creates 5 sample tasks (2 completed, 3 active) to help you explore the application.

## Health Check

```
GET /health
```

Returns server status and timestamp.
