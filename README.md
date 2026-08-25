# Business Intelligence Dashboard for Recruitment and Hiring Analytics

A full MERN stack mini project: MongoDB, Express, React, Node.js.

## What's included

- **Login & Register module** (mandatory) — JWT-based authentication with roles (admin, hr_manager, recruiter), passwords hashed with bcrypt.
- **Candidate/Applicant Management module** — add, view, filter, update stage, delete.
- **Recruitment Pipeline Tracking module** — stage flow: Applied → Shortlisted → Interviewed → Offered → Hired/Rejected.
- **Source-of-Hire Analytics module** — compares Referral, Job Portal, Campus, Social Media, Walk-in.
- **Time-to-Hire Analytics module** — average days to hire, by department.
- **Department-wise Hiring module** — hiring volume comparison across departments.
- **Dashboard & Visualization module** — KPI cards + bar chart, funnel chart, pie chart, line chart (using Recharts).
- **Filter & Report module** — filter candidates table by department, source, and stage.

## Folder structure

```
recruitment-bi-dashboard/
├── backend/          Node.js + Express + MongoDB API
│   ├── models/        User.js, Candidate.js
│   ├── controllers/    authController.js, candidateController.js, analyticsController.js
│   ├── routes/         authRoutes.js, candidateRoutes.js, analyticsRoutes.js
│   ├── middleware/     authMiddleware.js (JWT protect + role authorize)
│   ├── seed.js         sample demo data generator
│   └── server.js
└── frontend/         React (Vite) + Recharts
    └── src/
        ├── pages/       Login.jsx, Register.jsx, Dashboard.jsx, Candidates.jsx
        ├── components/  Navbar.jsx, KpiCards.jsx, ProtectedRoute.jsx
        ├── context/     AuthContext.jsx
        └── api/         axios.js
```

## Prerequisites

- Node.js (v18 or later)
- MongoDB installed locally, OR a free MongoDB Atlas cluster (cloud)

## Setup: Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set:
- `MONGO_URI` — your MongoDB connection string (local or Atlas)
- `JWT_SECRET` — any long random string

Then seed sample data (optional but recommended for demo):

```bash
node seed.js
```

This creates:
- A demo user: **hr@demo.com / password123**
- 80 sample candidates spread across departments, sources, and stages

Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

## Setup: Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Using the app

1. Go to `http://localhost:5173`
2. Register a new account, or log in with the seeded demo account (`hr@demo.com` / `password123`)
3. View the **Dashboard** — KPI cards, source effectiveness chart, time-to-hire chart, funnel chart, department pie chart, monthly trend line chart
4. Go to **Candidates** — add new candidates, filter by department/source/stage, update a candidate's pipeline stage, delete candidates
5. All changes on the Candidates page automatically reflect in the Dashboard charts on next load

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/auth/me | Get logged-in user profile |
| GET/POST | /api/candidates | List / add candidates |
| GET/PUT/DELETE | /api/candidates/:id | Get / update / delete one candidate |
| GET | /api/analytics/summary | KPI summary |
| GET | /api/analytics/source-effectiveness | Source-wise hire data |
| GET | /api/analytics/time-to-hire | Avg days to hire by department |
| GET | /api/analytics/funnel | Recruitment funnel counts |
| GET | /api/analytics/department-hiring | Department-wise hiring volume |
| GET | /api/analytics/monthly-trend | Monthly applicants vs hires |

## Notes for your project report

- Tech stack: MongoDB, Express.js, React.js, Node.js (MERN)
- Authentication: JWT + bcrypt password hashing
- Charts library: Recharts
- All analytics are computed using MongoDB aggregation pipelines (grouping, averaging, conditional counts) — a good talking point for your viva/defense.
