from fastapi import APIRouter

from app.api.routes import (
    auth,
    season_management,
    stadiums,
    clubs,
    players,
    rosters,
    matches,
    match_events,
    match_lineup,
    match_referees,
    schedule,
    standings,
    stats,
)
from app.core.config import settings

api_router = APIRouter()

# V-League API routes
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(season_management.router, prefix="/season-management", tags=["season-management"])
api_router.include_router(stadiums.router, prefix="/stadiums", tags=["stadiums"])
api_router.include_router(clubs.router, prefix="/clubs", tags=["clubs"])
api_router.include_router(players.router, prefix="/players", tags=["players"])
api_router.include_router(rosters.router, prefix="/rosters", tags=["rosters"])

# Matches & Schedule routes
api_router.include_router(matches.router, prefix="/matches", tags=["matches"])
api_router.include_router(match_events.router, prefix="/matches", tags=["match-events"])
api_router.include_router(match_lineup.router, prefix="/matches", tags=["match-lineup"])
api_router.include_router(match_referees.router, prefix="/matches", tags=["match-referees"])
api_router.include_router(schedule.router, prefix="/schedule", tags=["schedule"])

# Standings & Statistics routes
api_router.include_router(standings.router, prefix="/standings", tags=["standings"])
api_router.include_router(stats.router, prefix="/stats", tags=["statistics"])
