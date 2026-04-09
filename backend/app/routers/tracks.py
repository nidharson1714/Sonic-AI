from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import os

from ..core.database import get_db
from ..models.user import User
from ..models.track import Track
from ..schemas.schemas import TrackResponse
from .deps import get_current_user

router = APIRouter(prefix="/tracks", tags=["tracks"])

@router.get("/", response_model=list[TrackResponse])
async def get_tracks(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Track).where(Track.user_id == current_user.id).order_by(Track.created_at.desc())
    result = await db.execute(stmt)
    tracks = result.scalars().all()
    return tracks

@router.get("/{track_id}/stream")
async def stream_track(track_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Track).where(Track.id == track_id, Track.user_id == current_user.id)
    result = await db.execute(stmt)
    track = result.scalars().first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
        
    if not os.path.exists(track.file_path):
        raise HTTPException(status_code=404, detail="Audio file missing on server")
        
    return FileResponse(track.file_path, media_type="audio/wav")
