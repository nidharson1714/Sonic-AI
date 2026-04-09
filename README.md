# SonicAI — AI Music Learning Platform

An AI-powered interactive music education and generation platform built around a **Plan → Learn → Customize → Generate** workflow.

---

## 🚀 Quick Start (Windows, CPU-only)

### Prerequisites
- [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
- Git

### 1. Clone / open the project
```
cd sonicai
```

### 2. Start all services
```bash
docker-compose up --build
```

This starts:
| Service | URL |
|---|---|
| React Frontend | http://localhost:5173 |
| FastAPI Backend | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

### 3. Open the app
Visit **http://localhost:5173**, register an account, and start generating!

---

## 🏗️ Project Structure

```
sonicai/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env
│   └── app/
│       ├── main.py                    # FastAPI entry point
│       ├── core/
│       │   ├── config.py              # Settings from .env
│       │   ├── database.py            # SQLAlchemy + session
│       │   └── security.py            # JWT auth
│       ├── models/
│       │   ├── user.py
│       │   ├── track.py
│       │   └── job.py
│       ├── schemas/
│       │   └── schemas.py             # Pydantic request/response
│       ├── routers/
│       │   ├── auth.py                # /auth/*
│       │   ├── generation.py          # /generate/*
│       │   ├── tracks.py              # /tracks/*
│       │   └── websocket.py           # /ws/jobs/{id}
│       ├── services/
│       │   ├── dsp_engine.py          # CPU synthesis engine
│       │   ├── musicgen_service.py    # MusicGen AI (GPU)
│       │   ├── learning_plan.py       # Music theory plans
│       │   └── post_processing.py     # Audio normalization
│       └── tasks/
│           └── celery_tasks.py        # Async generation worker
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx                    # Router
        ├── api/client.ts              # Axios API client
        ├── store/index.ts             # Zustand stores
        ├── types/index.ts             # TypeScript types
        ├── components/
        │   ├── Layout.tsx             # Sidebar nav
        │   ├── WaveformPlayer.tsx     # WaveSurfer.js player
        │   ├── LearningPlanCard.tsx   # Music theory display
        │   └── JobProgressBar.tsx     # Live WebSocket progress
        └── pages/
            ├── LoginPage.tsx
            ├── RegisterPage.tsx
            ├── DashboardPage.tsx
            ├── GeneratePage.tsx       # ← Main workflow
            └── LibraryPage.tsx
```

---

## 🎵 How It Works

### The Plan → Learn → Customize → Generate Workflow

1. **Plan** — Enter a natural language prompt (e.g. "relaxing Lo-Fi track for studying")
2. **Learn** — SonicAI generates a personalized music theory plan covering chords, scales, rhythm, instruments, and theory tips
3. **Customize** — Adjust genre, tempo, key, mood, instruments, and duration before generating
4. **Generate** — The Celery worker picks up the job, runs the DSP engine (or MusicGen on GPU), post-processes the audio, and streams live progress back over WebSocket

### Audio Generation Engines

| Engine | When Used | Quality |
|---|---|---|
| DSP Synthesis | CPU-only (default) | Structured, genre-appropriate |
| MusicGen | GPU available (`USE_GPU=True`) | AI-generated, high quality |

### DSP Engine Presets
- **Lo-Fi** — Detuned sine bass + low-pass filtered saw lead
- **Cinematic** — Deep bass + string-like sine pads
- **Electronic** — Saw + square oscillator with full frequency range
- **Ambient** — Slow sine pads with heavy reverb
- **Jazz** — Piano-like saw + warm bass
- **Pop** — Balanced sine + saw + square layers

---

## ⚙️ Configuration

### Enable MusicGen (GPU only)
In `backend/.env`:
```
USE_GPU=True
MUSICGEN_MODEL=facebook/musicgen-small
```

### Change secret key (production)
```
SECRET_KEY=your-long-random-string-here
```

---

## 🛠️ Development (without Docker)

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# In another terminal:
celery -A app.tasks.celery_app worker --loglevel=info
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Requires PostgreSQL on port 5432 and Redis on port 6379.

---

## 📚 API Reference
Visit **http://localhost:8000/docs** for the full interactive Swagger UI.

Key endpoints:
- `POST /auth/register` — Create account
- `POST /auth/login` — Get JWT token
- `POST /generate/` — Submit generation job (returns job_id immediately)
- `GET /generate/jobs/{id}` — Poll job status
- `GET /generate/learning-plan?prompt=...` — Get music theory plan
- `WS /ws/jobs/{id}` — Live progress WebSocket
- `GET /tracks/` — List all generated tracks
- `GET /tracks/{id}/stream` — Stream audio file
- `GET /tracks/{id}/download` — Download WAV
