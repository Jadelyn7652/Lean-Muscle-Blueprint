# Lean Muscle Blueprint — Web App

Full-stack fitness course platform built with React + Vite (frontend) and Node/Express + PostgreSQL/Prisma (backend).

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) running locally

## Setup

### 1. Server

```bash
cd server
cp .env.example .env
# Edit .env: set DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev
```

Server runs at `http://localhost:3001`

### 2. Client

```bash
cd client
npm install
npm run dev
```

Client runs at `http://localhost:5173`

## Project Structure

```
fitness-app/
├── client/          # React + Vite frontend
│   └── src/
│       ├── pages/   # Home, Catalog, CourseDetail, LessonPlayer, Dashboard, Login, Register
│       ├── components/  # Navbar, CourseCard, ProgressBar
│       ├── context/ # AuthContext
│       └── api/     # Axios client
└── server/          # Express API
    ├── routes/      # auth, courses, lessons, progress
    ├── middleware/  # JWT auth
    └── prisma/      # Schema + seed
```

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/courses | No | List courses |
| GET | /api/courses/:id | No | Course + lessons |
| POST | /api/courses/:id/enroll | Yes | Enroll |
| GET | /api/lessons/:id | Yes | Lesson detail |
| POST | /api/lessons/:id/complete | Yes | Mark complete |
| GET | /api/progress | Yes | Progress summary |
