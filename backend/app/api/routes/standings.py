from typing import Any

from fastapi import APIRouter, HTTPException, Query

from app.api.deps import SessionDep
from app import crud
from app.models import StandingsResponse

router = APIRouter()


@router.get("", response_model=StandingsResponse)
def get_standings(
    *,
    session: SessionDep,
    muagiai: str = Query(..., description="Season ID (e.g., '2024-2025')")
) -> Any:
    """
    Get standings table for a season.
    
    Public endpoint - no authentication required.
    
    **Algorithm:**
    - Computes from match results (`lichthidau.tiso`)
    - Win = 3 points, Draw = 1 point, Loss = 0 points
    - Sorted by: Points DESC → Goal Difference DESC → Goals For DESC
    
    **Handles:**
    - Null/invalid `tiso` gracefully (skips match)
    - Returns empty standings if season not found
    
    **Query Parameters:**
    - `muagiai`: Season ID (required)
    
    **Response:**
    - `muagiai`: Season ID
    - `last_updated`: Timestamp of computation
    - `standings`: Array of team standings (sorted by position)
    
    **Example:**
    ```
    GET /api/standings?muagiai=2024-2025
    ```
    """
    try:
        standings = crud.compute_standings(session=session, muagiai=muagiai)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to compute standings: {str(e)}"
        )
    
    return standings
