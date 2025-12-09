from __future__ import annotations

from pathlib import Path
from typing import Any, List, Optional
from enum import Enum

from pydantic import Field, field_validator, computed_field
from pydantic_settings import BaseSettings


class StrEnum(str, Enum):
    pass


class Environment(StrEnum):
    dev = "dev"
    prod = "prod"


class Paths:
    # vleague_api
    ROOT_DIR: Path = Path(__file__).parent.parent.parent
    BASE_DIR: Path = ROOT_DIR / "app"
    LOGIN_PATH: str = "/auth/login"


class Settings(BaseSettings):
    @property
    def PATHS(self) -> Paths:
        return Paths()

    ENVIRONMENT: Environment = Environment.dev
    SECRET_KEY: str = "your-secret-key-change-in-production"
    DEBUG: bool = True
    AUTH_TOKEN_LIFETIME_SECONDS: int = 3600
    SERVER_HOST: str = "http://localhost:8000"
    PAGINATION_PER_PAGE: int = 20

    BACKEND_CORS_ORIGINS: List[str] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # PostgreSQL Configuration
    POSTGRESQL_HOST: str = "localhost"
    POSTGRESQL_PORT: int = 5432
    POSTGRESQL_USER: str = "postgres"
    POSTGRESQL_PASSWORD: str = "postgres"
    POSTGRESQL_DB: str = "vleague"
    POSTGRESQL_SSLMODE: str = "disable"

    @computed_field
    @property
    def DATABASE_URI(self) -> str:
        """Build database URI from individual components"""
        ssl_param = f"?sslmode={self.POSTGRESQL_SSLMODE}" if self.POSTGRESQL_SSLMODE else ""
        return (
            f"postgres://{self.POSTGRESQL_USER}:{self.POSTGRESQL_PASSWORD}"
            f"@{self.POSTGRESQL_HOST}:{self.POSTGRESQL_PORT}/{self.POSTGRESQL_DB}{ssl_param}"
        )

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()


