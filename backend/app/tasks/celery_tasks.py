from .celery_app import celery_app
from ..services.dsp_engine import generate_track_dsp
from ..models.job import GenerationJob
from ..models.track import Track
from ..core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Use a synchronous engine for Celery tasks
_sync_url = settings.DATABASE_URL.replace("+asyncpg", "").replace("+aiosqlite", "")
sync_engine = create_engine(_sync_url)
SyncSession = sessionmaker(bind=sync_engine)

def update_job_status(job_id: str, status: str, track_id: int = None):
    with SyncSession() as db:
        job = db.get(GenerationJob, job_id)
        if job:
            job.status = status
            if track_id is not None:
                job.track_id = track_id
            db.commit()

def create_track_record(user_id: int, prompt: str, path: str, genre: str) -> int:
    with SyncSession() as db:
        track = Track(user_id=user_id, prompt_used=prompt, file_path=path, duration_sec=15, genre=genre)
        db.add(track)
        db.commit()
        db.refresh(track)
        return track.id

@celery_app.task(bind=True)
def process_generation_job(self, job_id: str, prompt: str, genre: str, user_id: int):
    update_job_status(job_id, "inference")

    output_dir = settings.AUDIO_OUTPUT_DIR
    os.makedirs(output_dir, exist_ok=True)
    filename = f"{job_id}.wav"
    output_path = os.path.join(output_dir, filename)

    try:
        generate_track_dsp(prompt, genre, output_path)
        track_id = create_track_record(user_id, prompt, output_path, genre)
        update_job_status(job_id, "complete", track_id)
        return {"status": "success", "track_id": track_id}
    except Exception as e:
        update_job_status(job_id, "failed")
        return {"status": "failed", "error": str(e)}
