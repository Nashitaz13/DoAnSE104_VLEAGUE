from fastapi import APIRouter

from app.api.routes import auth, regulations, seasons, utils
from app.core.config import settings

api_router = APIRouter()

# V-League API routes
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(regulations.router, prefix="/regulations", tags=["regulations"])
api_router.include_router(seasons.router, prefix="/seasons", tags=["seasons"])
# Legacy/utility routes required by health checks and existing client
api_router.include_router(utils.router)
