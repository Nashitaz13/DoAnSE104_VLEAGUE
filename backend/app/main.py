from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .db.config import register_db


def get_application() -> FastAPI:
    _app = FastAPI(
        title="VLeague API",
        description="API for VLeague management system - Student Project",
        debug=settings.DEBUG,
        version="1.0.0",
    )
    
    # CORS middleware
    _app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register database
    register_db(_app)

    # Simple root endpoint
    @_app.get("/")
    async def root():
        return {
            "message": "VLeague API - Student Project",
            "docs": "/docs",
            "version": "1.0.0"
        }

    return _app


app = get_application()
