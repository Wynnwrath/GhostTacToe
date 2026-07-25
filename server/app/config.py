import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./ghosttactoe.db"
    JWT_SECRET: str = "change-me-in-production-use-a-64-char-random-string"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440
    CLIENT_URL: str = "http://localhost:5173"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"


settings = Settings()

# Railway provides DATABASE_URL as postgres://..., asyncpg needs postgresql+asyncpg://
raw_db_url = os.getenv("DATABASE_URL")
if raw_db_url and ("postgresql" not in settings.DATABASE_URL or settings.DATABASE_URL.startswith("sqlite")):
    if raw_db_url.startswith("postgres://"):
        raw_db_url = raw_db_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif raw_db_url.startswith("postgresql://") and "+asyncpg" not in raw_db_url:
        raw_db_url = raw_db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    settings.DATABASE_URL = raw_db_url

# In production, allow all CORS origins (the Railway URL is dynamic)
if settings.ENVIRONMENT == "production":
    settings.CLIENT_URL = "*"
