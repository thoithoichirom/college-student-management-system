# College Student Management System

A full-stack college management app with three roles:

- Admin/HOD: manage students, fees, detentions, and dashboard stats.
- Staff/Teacher: mark attendance and enter marks.
- Student: view own profile, attendance, fees, and marks.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL (Supabase)
- Auth: JWT

## Quick Start

1. Install dependencies:

```bash
npm run install:all
```

2. Copy environment files and fill in your Supabase DATABASE_URL and JWT_SECRET:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Run database schema:

```bash
npm run db:setup --prefix backend
```

4. Seed the first admin account:

```bash
npm run db:seed --prefix backend
```

Default admin login:

```
Email:    admin@college.test
Password: Admin@123
```

5. Start the app:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.
Frontend runs on `http://localhost:5173`.
