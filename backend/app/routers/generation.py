from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import uuid

from ..core.database import get_db
from ..models.user import User
from ..models.job import GenerationJob
from ..schemas.schemas import JobCreate, JobResponse
from .deps import get_current_user
from ..tasks.celery_tasks import process_generation_job

router = APIRouter(prefix="/generate", tags=["generation"])

@router.post("/", response_model=JobResponse)
async def create_job(job_in: JobCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
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
    
    # Trigger Celery Background Task
    process_generation_job.delay(job_id, job.prompt, job.genre, current_user.id)
    
    return job

@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job_status(job_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(GenerationJob).where(GenerationJob.id == job_id, GenerationJob.user_id == current_user.id)
    result = await db.execute(stmt)
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
