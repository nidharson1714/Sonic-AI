from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, generation, tracks, websocket

app = FastAPI(title="SonicAI API", version="1.0.0")

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
