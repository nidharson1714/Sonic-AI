from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..core.database import Base

class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, default="Untitled Track")
    prompt_used = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    duration_sec = Column(Integer, nullable=True)
    genre = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
