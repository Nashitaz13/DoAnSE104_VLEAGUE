from typing import Any

from fastapi import APIRouter, HTTPException, Query

from app.api.deps import CurrentUserVLeague, SessionDep
from app import crud
from app.models import PlayerStatsResponse, MatchStatsResponse

router = APIRouter()


@router.get("/players", response_model=PlayerStatsResponse)
def get_player_stats(
    *,
    session: SessionDep,
    current_user: CurrentUserVLeague,
    muagiai: str = Query(..., description="Season ID (e.g., '2024-2025')")
) -> Any:
    """
    Get player statistics for a season.
    
    **Authentication required** - Any authenticated user can view stats.
    
    **Algorithm:**
    - Computes from match events (`sukientrandau`)
    - Goals: `loaisukien = "BanThang"`
    - Assists: Count as `cauthulienquan` in goal events
    - Yellow cards: `loaisukien = "TheVang"`
    - Red cards: `loaisukien = "TheDo"`
    - Matches played: Distinct `matran` from `doihinhxuatphat`
    
    **Handles:**
    - Returns empty list if season not found
    - Skips players with no activity
    
    **Query Parameters:**
    - `muagiai`: Season ID (required)
    
    **Response:**
    - `muagiai`: Season ID
    - `total_players`: Number of players with statistics
    - `stats`: Array of player statistics (sorted by goals DESC, assists DESC)
    
    **Example:**
    ```
    GET /api/stats/players?muagiai=2024-2025
    ```
    """
    try:
        stats = crud.compute_player_stats(session=session, muagiai=muagiai)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to compute player statistics: {str(e)}"
        )
    
    return stats


@router.get("/matches/{matran}", response_model=MatchStatsResponse)
def get_match_stats(
    *,
    session: SessionDep,
    current_user: CurrentUserVLeague,
    matran: str
) -> Any:
    """
    Get match statistics.
    
    **Authentication required** - Any authenticated user can view stats.
    
    **Note:** Since `thong_ke_tran_dau` table is not implemented,
    returns limited statistics from match events only (cards).
    
    **Available Stats:**
    - Yellow cards (computed from events)
    - Red cards (computed from events)
    - Other stats (shots, corners, fouls) return 0
    
    **Response:**
    - `matran`: Match ID
    - `muagiai`: Season ID
    - `home_team`: Home team statistics
    - `away_team`: Away team statistics
    - `available`: True if stats available (partial or full)
    - `message`: Info message about data availability
    
    **Example:**
    ```
    GET /api/stats/matches/MT_V1_01
    ```
    """
    try:
        stats = crud.get_match_stats(session=session, matran=matran)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get match statistics: {str(e)}"
        )
    
    return stats
