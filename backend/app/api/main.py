from fastapi import APIRouter

from app.api.routes import auth, season_management, stadiums, clubs, players, rosters
from app.core.config import settings

api_router = APIRouter()

# V-League API routes
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(season_management.router, prefix="/season-management", tags=["season-management"])
api_router.include_router(stadiums.router, prefix="/stadiums", tags=["stadiums"])
api_router.include_router(clubs.router, prefix="/clubs", tags=["clubs"])
api_router.include_router(players.router, prefix="/players", tags=["players"])
api_router.include_router(rosters.router, prefix="/rosters", tags=["rosters"])
