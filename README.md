# College Student Management System

A full-stack college management app with three roles:

- Admin/HOD: manage students, fees, detentions, and dashboard stats.
- Staff/Teacher: mark attendance and enter marks.
- Student: view own profile, attendance, fees, and marks.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Auth: JWT

## Quick Start

1. Start PostgreSQL:

```bash
docker compose up -d
```

2. Install dependencies:

```bash
npm run install:all
```

3. Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Run database schema:

```bash
npm run db:setup --prefix backend
```

5. Seed the first admin account:

```bash
npm run db:seed --prefix backend
```

Default admin login:

```text
Email: admin@college.test
Password: Admin@123
```

6. Start the app:

```bash
npm run dev
```

PostgreSQL is exposed on `localhost:5435` to avoid conflicts with any local PostgreSQL install.
Backend runs on `http://localhost:5000`.
Frontend runs on `http://localhost:5173`.
