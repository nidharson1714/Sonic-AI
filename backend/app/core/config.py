from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./sonicai.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "super-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    AUDIO_OUTPUT_DIR: str = "./audio_files"
    USE_GPU: bool = False
    MUSICGEN_MODEL: str = "facebook/musicgen-small"

    class Config:
        env_file = ".env"

settings = Settings()
