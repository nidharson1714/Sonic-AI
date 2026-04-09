from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class JobCreate(BaseModel):
    prompt: str
    genre: Optional[str] = "Lo-Fi"
    parameters: Optional[Dict[str, Any]] = None

class JobResponse(BaseModel):
    id: str
    user_id: int
    prompt: str
    genre: Optional[str] = None
    status: str
    parameters: Optional[Dict[str, Any]] = None
    track_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class TrackResponse(BaseModel):
    id: int
    user_id: int
    title: str
    prompt_used: str
    genre: Optional[str] = None
    duration_sec: Optional[int] = None
    file_path: str
    created_at: datetime
    
    class Config:
        from_attributes = True
