from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from ..core.database import Base

class GenerationJob(Base):
    __tablename__ = "generation_jobs"
    
    id = Column(String, primary_key=True, index=True) # UUID string
    user_id = Column(Integer, ForeignKey("users.id"))
    prompt = Column(String, nullable=False)
    genre = Column(String, nullable=True)
    status = Column(String, default="queued") # queued, processing, inference, post_processing, complete, failed
    parameters = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    track_id = Column(Integer, ForeignKey("tracks.id"), nullable=True)
