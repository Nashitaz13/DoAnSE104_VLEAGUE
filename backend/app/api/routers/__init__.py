"""
API Routers Export
"""

from .auth import router as auth_router, get_current_user, get_admin_user
from .regulations import router as regulations_router
from .seasons import router as seasons_router
from .teams import router as teams_router
from .players import router as players_router
from .matches import router as matches_router, schedule_router
from .standings import router as standings_router

__all__ = [
    "auth_router",
    "regulations_router",
    "seasons_router",
    "teams_router",
    "players_router",
    "matches_router",
    "schedule_router",
    "standings_router",
    "get_current_user",
    "get_admin_user",
]
