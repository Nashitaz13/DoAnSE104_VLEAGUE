from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .db.config import register_db
from .api.routers import (
    auth_router,
    regulations_router,
    seasons_router,
    teams_router,
    players_router,
    matches_router,
    schedule_router,
    standings_router,
)


def get_application() -> FastAPI:
    _app = FastAPI(
        title="VLeague API",
        description="API for VLeague management system - Hệ thống quản lý giải bóng đá Vô địch Quốc Gia",
        debug=settings.DEBUG,
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )
    
    # CORS middleware
    _app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS] or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register database
    register_db(_app)

    # API v1 routers
    api_prefix = "/api/v1"
    
    _app.include_router(auth_router, prefix=api_prefix)
    _app.include_router(regulations_router, prefix=api_prefix)
    _app.include_router(seasons_router, prefix=api_prefix)
    _app.include_router(teams_router, prefix=api_prefix)
    _app.include_router(players_router, prefix=api_prefix)
    _app.include_router(matches_router, prefix=api_prefix)
    _app.include_router(schedule_router, prefix=api_prefix)
    _app.include_router(standings_router, prefix=api_prefix)

    # Root endpoint
    @_app.get("/")
    async def root():
        return {
            "message": "VLeague API - Hệ thống quản lý giải bóng đá Vô địch Quốc Gia",
            "docs": "/docs",
            "redoc": "/redoc",
            "version": "1.0.0",
            "api_prefix": "/api/v1"
        }

    # Health check
    @_app.get("/health")
    async def health_check():
        return {"status": "healthy"}

    return _app


app = get_application()

