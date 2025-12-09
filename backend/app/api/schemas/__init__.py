"""
API Schemas Export
"""

from .auth import (
    LoginRequest,
    LoginResponse,
    UserResponse,
    UserCreate,
)
from .regulation import (
    RegulationBase,
    RegulationUpdate,
    RegulationBulkUpdate,
    RegulationResponse,
)
from .season import (
    SeasonCreate,
    SeasonStatusUpdate,
    SeasonResponse,
)
from .team import (
    StadiumResponse,
    TeamCreate,
    TeamUpdate,
    TeamResponse,
    TeamWithPlayersResponse,
)
from .player import (
    PlayerCreate,
    PlayerResponse,
    PlayerSearchParams,
)
from .match import (
    MatchScheduleUpdate,
    MatchResultUpdate,
    MatchEventCreate,
    MatchEventResponse,
    MatchResponse,
    MatchDetailResponse,
)
from .standings import (
    StandingsResponse,
    TopScorerResponse,
)
from .common import (
    ErrorResponse,
    PaginatedResponse,
)

__all__ = [
    # Auth
    "LoginRequest",
    "LoginResponse",
    "UserResponse",
    "UserCreate",
    # Regulation
    "RegulationBase",
    "RegulationUpdate",
    "RegulationBulkUpdate",
    "RegulationResponse",
    # Season
    "SeasonCreate",
    "SeasonStatusUpdate",
    "SeasonResponse",
    # Team
    "StadiumResponse",
    "TeamCreate",
    "TeamUpdate",
    "TeamResponse",
    "TeamWithPlayersResponse",
    # Player
    "PlayerCreate",
    "PlayerResponse",
    "PlayerSearchParams",
    # Match
    "MatchScheduleUpdate",
    "MatchResultUpdate",
    "MatchEventCreate",
    "MatchEventResponse",
    "MatchResponse",
    "MatchDetailResponse",
    # Standings
    "StandingsResponse",
    "TopScorerResponse",
    # Common
    "ErrorResponse",
    "PaginatedResponse",
]
