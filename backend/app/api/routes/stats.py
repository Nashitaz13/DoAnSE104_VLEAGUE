from typing import Any

from fastapi import APIRouter, HTTPException, Query

from app.api.deps import SessionDep
from app import crud
from app.models import PlayerStatsResponse, MatchStatsResponse, AwardsResponse, DisciplineResponse

router = APIRouter()


@router.get("/players", response_model=PlayerStatsResponse)
def get_player_stats(
    *,
    session: SessionDep,
    muagiai: str = Query(..., description="Season ID (e.g., '2024-2025')")
) -> Any:
    """
    Get player statistics for a season.
    
    Public endpoint - no authentication required.
    
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
    matran: str
) -> Any:
    """
    Get match statistics.
    
    Public endpoint - no authentication required.
    
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


@router.get("/awards", response_model=AwardsResponse)
def get_awards(
    *,
    session: SessionDep,
    muagiai: str = Query(..., description="Season ID (e.g., '2024-2025')"),
    limit: int = Query(10, ge=1, le=200, description="Max number to return (ties may exceed limit)")
) -> Any:
    """
    Get awards for top scorers and top assist providers.
    
    Public endpoint - no authentication required.
    
    **Algorithm:**
    - Top scorers: Count `loaisukien = "BanThang"` per player
    - Top assists: Count `cauthulienquan` in goal events
    - Returns top N with ties handled (if position N has ties, all tied players included)
    - Sorted by value DESC, player name ASC
    
    **Event types:**
    - Uses canonical event type "BanThang" (no space)
    - Auto-normalizes old data: "Ban Thang" → "BanThang"
    - Handles backward compatibility with spaced formats
    
    **Query Parameters:**
    - `muagiai`: Season ID (required)
    - `limit`: Maximum number to return (default 10, range 1-200)
               If position N has ties, all tied players are included (may exceed limit)
    
    **Response:**
    - `muagiai`: Season ID
    - `top_scorers`: Top N goal scorers (with ties)
    - `top_assists`: Top N assist providers (with ties)
    - `generated_at`: Timestamp
    
    **Example:**
    ```
    GET /api/stats/awards?muagiai=2024-2025&limit=10
    ```
    """
    try:
        awards = crud.compute_awards(session=session, muagiai=muagiai, limit=limit)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to compute awards: {str(e)}"
        )
    
    return awards


@router.get("/discipline", response_model=DisciplineResponse)
def get_discipline(
    *,
    session: SessionDep,
    muagiai: str = Query(..., description="Season ID (e.g., '2024-2025')"),
    limit: int = Query(50, ge=1, le=200, description="Max number to return (ties may exceed limit)")
) -> Any:
    """
    Get discipline statistics (yellow/red cards).
    
    Public endpoint - no authentication required.
    
    **Algorithm:**
    - Yellow cards: Count `loaisukien = "TheVang"`
    - Red cards: Count `loaisukien = "TheDo"`
    - Second yellows: If player gets 2+ yellow cards in SAME match, extras count as second yellow
    - Discipline points: yellow=1, second_yellow=2, red=3
    - Sorted by: discipline_points DESC, red_cards DESC, yellow_cards DESC, name ASC
    - Returns top N with ties (if position N has ties, all tied players included)
    
    **Event types:**
    - Uses canonical event types "TheVang", "TheDo" (no space)
    - Auto-normalizes old data: "The Vang" → "TheVang", "The Do" → "TheDo"
    - Handles backward compatibility with spaced formats
    
    **Discipline points calculation:**
    - Each yellow card = 1 point
    - Each second yellow (2+ in same match) = 2 points
    - Each red card = 3 points
    
    **Query Parameters:**
    - `muagiai`: Season ID (required)
    - `limit`: Maximum number to return (default 50, range 1-200)
               If position N has ties, all tied players are included (may exceed limit)
    
    **Response:**
    - `muagiai`: Season ID
    - `leaderboard`: Top N players with discipline statistics (with ties)
    - `generated_at`: Timestamp
    - `rules`: Description of discipline points calculation
    
    **Example:**
    ```
    GET /api/stats/discipline?muagiai=2024-2025&limit=50
    ```
    """
    try:
        discipline = crud.compute_discipline(session=session, muagiai=muagiai, limit=limit)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to compute discipline statistics: {str(e)}"
        )
    
    return discipline

