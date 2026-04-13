from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import jwt, JWTError
import os

from ..core.database import get_db
from ..models.user import User
from ..models.track import Track
from ..schemas.schemas import TrackResponse
from .deps import get_current_user
from ..core.config import settings

router = APIRouter(prefix="/tracks", tags=["tracks"])

async def _get_user_by_token(token: str, db: AsyncSession) -> User:
    """Resolve a user from a raw JWT string (used for query-param auth on audio URLs)."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    from sqlalchemy.future import select as sel
    result = await db.execute(sel(User).where(User.username == username))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

router = APIRouter(prefix="/tracks", tags=["tracks"])

@router.get("/", response_model=list[TrackResponse])
async def get_tracks(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Track).where(Track.user_id == current_user.id).order_by(Track.created_at.desc())
    result = await db.execute(stmt)
    tracks = result.scalars().all()
    return tracks

@router.get("/{track_id}/stream")
async def stream_track(track_id: int, token: str = Query(None), current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Support both Bearer header auth and ?token= query param (for WaveSurfer direct URL)
    user = current_user
    if token:
        user = await _get_user_by_token(token, db)
    stmt = select(Track).where(Track.id == track_id, Track.user_id == user.id)
    result = await db.execute(stmt)
    track = result.scalars().first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    if not os.path.exists(track.file_path):
        raise HTTPException(status_code=404, detail="Audio file missing on server")
    return FileResponse(track.file_path, media_type="audio/wav")

@router.get("/{track_id}/download")
async def download_track(track_id: int, token: str = Query(None), current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user = current_user
    if token:
        user = await _get_user_by_token(token, db)
    stmt = select(Track).where(Track.id == track_id, Track.user_id == user.id)
    result = await db.execute(stmt)
    track = result.scalars().first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    if not os.path.exists(track.file_path):
        raise HTTPException(status_code=404, detail="Audio file missing on server")
    filename = f"sonicai-{track.genre}-{track.id}.wav".lower().replace(" ", "-")
    return FileResponse(track.file_path, media_type="audio/wav", filename=filename)
