from .celery_app import celery_app
from ..services.dsp_engine import generate_track_dsp
from ..models.job import GenerationJob
from ..models.track import Track
from ..core.database import SessionLocal
from ..core.config import settings
import asyncio
import os

async def update_job_status(job_id: str, status: str, track_id: int = None):
    async with SessionLocal() as db:
        job = await db.get(GenerationJob, job_id)
        if job:
            job.status = status
            if track_id:
                job.track_id = track_id
            await db.commit()

async def create_track_record(user_id: int, prompt: str, path: str, genre: str):
    async with SessionLocal() as db:
        track = Track(user_id=user_id, prompt_used=prompt, file_path=path, duration_sec=15, genre=genre)
        db.add(track)
        await db.commit()
        await db.refresh(track)
        return track.id

@celery_app.task(bind=True)
def process_generation_job(self, job_id: str, prompt: str, genre: str, user_id: int):
    # Status Update
    asyncio.run(update_job_status(job_id, "inference"))
    
    # Generation
    output_dir = settings.AUDIO_OUTPUT_DIR
    os.makedirs(output_dir, exist_ok=True)
    filename = f"{job_id}.wav"
    output_path = os.path.join(output_dir, filename)
    
    try:
        generate_track_dsp(prompt, genre, output_path)
        track_id = asyncio.run(create_track_record(user_id, prompt, output_path, genre))
        asyncio.run(update_job_status(job_id, "complete", track_id))
        
        return {"status": "success", "track_id": track_id}
        
    except Exception as e:
        asyncio.run(update_job_status(job_id, "failed"))
        return {"status": "failed", "error": str(e)}
