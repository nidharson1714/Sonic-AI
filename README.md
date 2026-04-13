<div align="center">

<img src="https://img.shields.io/badge/SonicAI-Music%20Generation%20Platform-9d4edd?style=for-the-badge&logo=music&logoColor=white" alt="SonicAI" />

# SonicAI

**An AI-powered music education and generation platform built around a _Plan → Learn → Customize → Generate_ workflow.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.135-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](#) · [API Docs](http://localhost:8000/docs) · [Report Bug](https://github.com/nidharson1714/Sonic-AI/issues) · [Request Feature](https://github.com/nidharson1714/Sonic-AI/issues)

</div>

---

## What is SonicAI?

Most music generators are black boxes — you type a prompt and get audio. SonicAI is different.

Before generating a single note, SonicAI teaches you **why** the music sounds the way it does. You pick a genre, study the music theory behind it (chords, scales, tempo, instruments, sound design), then generate a track informed by what you just learned. It's a platform that turns passive generation into active musical education.

```
You enter a prompt
       ↓
SonicAI shows you the music theory for your chosen genre
       ↓
You understand what you're about to create
       ↓
The DSP engine synthesizes a layered, genre-accurate audio track
       ↓
You play it, download it, and keep it in your library
```

---

## Features

- **Teaching-first workflow** — every generation is preceded by a music theory lesson covering scales, chords, tempo, instruments, and sound design
- **6 genre presets** — Lo-Fi, Cinematic, Electronic, Ambient, Jazz, Pop — each with distinct DSP synthesis characteristics
- **Real-time progress** — WebSocket connection streams job status live as your track is synthesized
- **Waveform player** — interactive WaveSurfer.js player with seek, play/pause, and time display
- **Download** — export any track as a WAV file directly from the library
- **JWT authentication** — secure register/login with token-based session management
- **Full track library** — all generated tracks persisted per user, playable and downloadable at any time
- **Swagger UI** — full interactive API documentation at `/docs`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Zustand, WaveSurfer.js, Lucide React |
| Backend | FastAPI, SQLAlchemy (async), Pydantic v2, Python-JOSE |
| Audio | NumPy, SciPy — custom multi-oscillator DSP synthesis engine |
| Database | SQLite (dev) / PostgreSQL (production via Docker) |
| Auth | JWT Bearer tokens, bcrypt password hashing |
| Realtime | WebSocket (native FastAPI) |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
Sonic-AI/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py          # Settings (env vars, defaults)
│   │   │   ├── database.py        # Async SQLAlchemy engine + session
│   │   │   └── security.py        # JWT creation + bcrypt hashing
│   │   ├── models/
│   │   │   ├── user.py            # User ORM model
│   │   │   ├── track.py           # Track ORM model
│   │   │   └── job.py             # GenerationJob ORM model
│   │   ├── routers/
│   │   │   ├── auth.py            # POST /auth/register, /auth/login
│   │   │   ├── generation.py      # POST /generate/, GET /generate/learning-plan
│   │   │   ├── tracks.py          # GET /tracks/, /tracks/{id}/stream, /download
│   │   │   ├── websocket.py       # WS /ws/jobs/{id}
│   │   │   └── deps.py            # get_current_user dependency
│   │   ├── schemas/
│   │   │   └── schemas.py         # Pydantic request/response models
│   │   ├── services/
│   │   │   ├── dsp_engine.py      # Multi-oscillator audio synthesis engine
│   │   │   └── learning_plan.py   # Music theory data per genre
│   │   └── main.py                # FastAPI app, CORS, lifespan (DB init)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts          # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Layout.tsx         # Sidebar navigation shell
│   │   │   ├── WaveformPlayer.tsx # WaveSurfer.js player + download
│   │   │   ├── LearningPlanCard.tsx # Music theory display (fetches from API)
│   │   │   └── JobProgressBar.tsx # Live WebSocket progress bar
│   │   ├── pages/
│   │   │   ├── AuthPage.tsx       # Login / Register
│   │   │   ├── DashboardPage.tsx  # Home
│   │   │   ├── GeneratePage.tsx   # Main workflow page
│   │   │   └── LibraryPage.tsx    # Track library
│   │   ├── store/
│   │   │   └── index.ts           # Zustand stores (auth, job)
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript interfaces
│   │   └── App.tsx                # Router + auth gate
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## Quick Start

### Option 1 — Docker (recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
git clone https://github.com/nidharson1714/Sonic-AI.git
cd Sonic-AI
cp .env.example .env          # edit SECRET_KEY before deploying
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |

### Option 2 — Local (no Docker)

**Prerequisites:** Python 3.10+, Node.js 18+

```bash
git clone https://github.com/nidharson1714/Sonic-AI.git
cd Sonic-AI
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend** (new terminal):
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173, register an account, and start generating.

---

## Environment Variables

Copy `.env.example` to `.env` in the `backend/` directory:

```bash
cp .env.example backend/.env
```

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite+aiosqlite:///./sonicai.db` | Database connection string |
| `SECRET_KEY` | `super-secret-key` | JWT signing key — **change in production** |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Token lifetime |
| `AUDIO_OUTPUT_DIR` | `./audio_files` | Where generated WAV files are stored |

---

## API Reference

Full interactive docs at **http://localhost:8000/docs**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Create a new account |
| `POST` | `/auth/login` | — | Get JWT access token |
| `GET` | `/generate/genres` | ✓ | List all supported genres |
| `GET` | `/generate/learning-plan?genre=` | ✓ | Get music theory plan for a genre |
| `POST` | `/generate/` | ✓ | Submit a generation job |
| `GET` | `/generate/jobs/{id}` | ✓ | Poll job status |
| `WS` | `/ws/jobs/{id}` | — | Live job progress stream |
| `GET` | `/tracks/` | ✓ | List all user tracks |
| `GET` | `/tracks/{id}/stream` | ✓ | Stream audio (WAV) |
| `GET` | `/tracks/{id}/download` | ✓ | Download audio (WAV) |

---

## DSP Synthesis Engine

SonicAI generates audio without any AI model dependency using a custom multi-oscillator DSP engine built on NumPy and SciPy. Each genre has a preset that defines oscillator types, frequencies, chord ratios, and layering:

| Genre | Bass Oscillator | Lead/Pad | Character |
|---|---|---|---|
| Lo-Fi | Square (110 Hz) | Sine pads (Cmaj7) | Warm, detuned, nostalgic |
| Cinematic | Sine (65 Hz deep) | Sine string pads | Dark, sustained, emotional |
| Electronic | Square (130 Hz) | Saw wave lead | Bright, driving, energetic |
| Ambient | Sine (82 Hz slow) | Layered sine pads | Open, spacious, evolving |
| Jazz | Saw (110 Hz warm) | Sine maj7 chords | Warm, complex, swinging |
| Pop | Square (130 Hz) | Sine + saw layers | Bright, balanced, catchy |

All output passes through peak normalization, fade-in/out, and gentle tanh saturation before being saved as 16-bit 44.1kHz WAV.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">
Built with Python, React, and a love for music theory.
</div>
