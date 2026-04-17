from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import uuid, os

from ..core.database import get_db, SessionLocal
from ..models.user import User
from ..models.job import GenerationJob
from ..models.track import Track
from ..schemas.schemas import JobCreate, JobResponse
from .deps import get_current_user
from ..services.dsp_engine import generate_track_dsp
from ..services.learning_plan import get_learning_plan, get_all_genres
from ..core.config import settings

router = APIRouter(prefix="/generate", tags=["generation"])

@router.get("/learning-plan")
async def learning_plan(genre: str = "Lo-Fi", current_user: User = Depends(get_current_user)):
    """Return the music theory learning plan for a given genre."""
    return get_learning_plan(genre)

@router.get("/genres")
async def list_genres(current_user: User = Depends(get_current_user)):
    """Return all supported genres."""
    return get_all_genres()

async def run_generation(job_id: str, prompt: str, genre: str, user_id: int):
    async with SessionLocal() as db:
        job = await db.get(GenerationJob, job_id)
        if job:
            job.status = "inference"
            await db.commit()

    output_dir = settings.AUDIO_OUTPUT_DIR
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"{job_id}.wav")

    try:
        generate_track_dsp(prompt, genre, output_path, duration=20)
        async with SessionLocal() as db:
            track = Track(user_id=user_id, prompt_used=prompt, file_path=output_path, duration_sec=20, genre=genre)
            db.add(track)
            await db.commit()
            await db.refresh(track)
            track_id = track.id

        async with SessionLocal() as db:
            job = await db.get(GenerationJob, job_id)
            if job:
                job.status = "complete"
                job.track_id = track_id
                await db.commit()
    except Exception as e:
        async with SessionLocal() as db:
            job = await db.get(GenerationJob, job_id)
            if job:
                job.status = "failed"
                await db.commit()

@router.post("/", response_model=JobResponse)
async def create_job(job_in: JobCreate, background_tasks: BackgroundTasks, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    job_id = str(uuid.uuid4())
    job = GenerationJob(
        id=job_id,
        user_id=current_user.id,
        prompt=job_in.prompt,
        genre=job_in.genre,
        status="queued",
        parameters=job_in.parameters
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)

    background_tasks.add_task(run_generation, job_id, job.prompt, job.genre, current_user.id)
    return job

@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job_status(job_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(GenerationJob).where(GenerationJob.id == job_id, GenerationJob.user_id == current_user.id)
    result = await db.execute(stmt)
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
