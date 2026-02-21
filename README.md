# CR Friday Night

Celebrate Recovery Friday night data portal for collecting and viewing attendance, donations, and small group metrics.

**Stack:** React (frontend), Node/Express (backend), MongoDB Atlas, deployed on Render.

---

## Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

## Quick Start

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd cr-friday-night

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 2. Environment variables

**Backend** – create `backend/.env`:

```
# Required: MongoDB connection string
# Local:    mongodb://localhost:27017/cr-friday-night
# Atlas:   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/cr-friday-night
MONGO_URI=your_mongodb_connection_string

# Optional
PORT=5002

# Optional – for report email notifications
# EMAIL_USER=your-gmail@gmail.com
# EMAIL_PASS=your-gmail-app-password
# EMAIL_TO=recipient@example.com
```

Use `backend/.env.example` as a template. Do not commit real credentials to git.

**Frontend** – for production or custom API URL, create `frontend/.env`:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

If unset, the frontend uses `http://localhost:5002` in development.

### 3. Run locally

**Terminal 1 – backend:**

```bash
cd backend
npm run dev
```

Server runs at `http://localhost:5002`.

**Terminal 2 – frontend:**

```bash
cd frontend
npm start
```

App opens at `http://localhost:3000`.

---

## Project structure

```
cr-friday-night/
├── backend/
│   ├── config/          # DB connection
│   ├── models/          # CRReport, PendingReport
│   ├── routes/          # /api/pending, /api/reports
│   ├── validation/      # express-validator rules
│   ├── utils/           # sendEmail
│   ├── scripts/         # Maintenance scripts
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── components/   # NavBar, AppLayout
│   │   ├── pages/        # Dashboard, Review, Forms, Graphs
│   │   └── fieldConfig.js
│   └── public/
└── README.md
```

---

## Environment variables

| Variable | Where | Required | Description |
|----------|-------|----------|-------------|
| `MONGO_URI` | Backend | Yes | MongoDB connection string |
| `PORT` | Backend | No | Server port (default 5002) |
| `ALLOWED_ORIGINS` | Backend | No | CORS origins, comma-separated (defaults for Render + localhost) |
| `EMAIL_USER` | Backend | No | Gmail for report emails |
| `EMAIL_PASS` | Backend | No | Gmail app password |
| `EMAIL_TO` | Backend | No | Report email recipient |
| `REACT_APP_API_URL` | Frontend | No | Backend URL (default localhost:5002) |

---

## Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm start` | backend | Run production server |
| `npm run dev` | backend | Run with nodemon |
| `npm run test:validation` | backend | Test input validation (backend must be running) |
| `npm start` | frontend | Development server |
| `npm run build` | frontend | Production build |

---

## Deployment (Render)

### Backend (Web Service)

- **Build:** `cd backend && npm install`
- **Start:** `npm start`
- **Env vars:** Set `MONGO_URI`, and optionally `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, `PORT`

### Frontend (Static Site)

- **Build:** `cd frontend && npm install && npm run build`
- **Publish directory:** `build`
- **Env var:** `REACT_APP_API_URL` = your backend URL (e.g. `https://cr-friday-night-backend.onrender.com`)

### CORS

Set `ALLOWED_ORIGINS` to your frontend URL(s), comma-separated (e.g. `https://your-app.onrender.com,http://localhost:3000`). If unset, defaults include the Render frontend URL and localhost.

### Health check

The backend exposes `GET /health` for load balancers and monitoring. Returns 200 when the database is connected, 503 when disconnected.

---

## Security notes

- Never commit `.env` or real credentials.
- `MONGO_URI` is never logged in production.
- API endpoints use rate limiting, input validation, and error handling.
- Email errors surface as 500 responses with a clear message.
