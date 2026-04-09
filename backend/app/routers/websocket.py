from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import asyncio
from ..core.database import SessionLocal
from ..models.job import GenerationJob

router = APIRouter(prefix="/ws", tags=["websocket"])

@router.websocket("/jobs/{job_id}")
async def job_status_ws(websocket: WebSocket, job_id: str):
    await websocket.accept()
    try:
        while True:
            # Poll DB every 2 seconds for status. 
            async with SessionLocal() as db:
                job = await db.get(GenerationJob, job_id)
                if not job:
                    await websocket.send_json({"error": "Job not found"})
                    break
                    
                await websocket.send_json({
                    "status": job.status,
                    "track_id": job.track_id
                })
                
                if job.status in ["complete", "failed"]:
                    break
                    
            await asyncio.sleep(2)
            
    except WebSocketDisconnect:
        pass
