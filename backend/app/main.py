from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .routers import auth, generation, tracks, websocket
from .core.database import engine, Base
from .models import User, Track, GenerationJob  # ensure models are registered

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="SonicAI API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(generation.router)
app.include_router(tracks.router)
app.include_router(websocket.router)


@app.get("/")
def root():
    return {"message": "Welcome to SonicAI API"}
