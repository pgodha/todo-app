# Todo App

A full-stack todo application with a React frontend and an Express backend, persisting data in a local SQLite database. State management on the frontend is handled by **Zustand**.

## Features

- Add, edit, and delete tasks
- Mark tasks as complete/incomplete
- Filter tasks by All, Active, or Completed
- Clear all completed tasks at once
- Persistent storage — todos survive page refreshes and server restarts

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 19, Zustand, Vite           |
| Backend  | Express 5, better-sqlite3         |
| Database | SQLite (local file `todos.db`)    |

### Why Zustand?

[Zustand](https://github.com/pmndrs/zustand) is a lightweight state management library for React. It replaces Redux or Context API with a simpler, boilerplate-free API. All todo state (fetching, adding, editing, deleting) lives in a single Zustand store at `client/src/store/todoStore.js`.

## Prerequisites

- Node.js 18+
- npm

## Getting Started

### 1. Clone the repo

```bash
git clone git@github.com:pgodha/todo-app.git
cd todo-app
```

### 2. Install dependencies

The project has two sets of dependencies: the backend (root) and the frontend (`client/`). Install both with a single command:

```bash
npm run install:all
```

This is equivalent to:

```bash
npm install                  # installs Express, better-sqlite3, etc.
npm install --prefix client  # installs React, Zustand, Vite, etc.
```

> Zustand is a frontend dependency and lives in `client/package.json`. It is installed automatically as part of `npm install --prefix client`.

### 3. Start the development servers

```bash
npm run dev
```

This starts both servers concurrently:

| Server   | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3001 |

Open http://localhost:5173 in your browser.

## Project Structure

```
todo-app/
├── client/               # React frontend (Vite)
│   ├── package.json      # Frontend deps: React, Zustand, Vite
│   └── src/
│       ├── components/   # TodoInput, TodoList, TodoFilter
│       ├── store/        # Zustand store (todoStore.js)
│       └── App.jsx
├── server/               # Express backend
│   ├── db/               # SQLite database file and setup
│   ├── routes/           # /api/todos REST routes
│   └── index.js
└── package.json          # Backend deps + root scripts (dev, build, install:all)
```

## API Endpoints

| Method | Endpoint       | Description       |
|--------|----------------|-------------------|
| GET    | /api/todos     | Fetch all todos   |
| POST   | /api/todos     | Create a new todo |
| PUT    | /api/todos/:id | Update a todo     |
| DELETE | /api/todos/:id | Delete a todo     |

## Building for Production

```bash
npm run build
```

The compiled frontend will be output to `client/dist/`.
