from typing import Any, Annotated

from fastapi import APIRouter, HTTPException, Depends

from app.api.deps import CurrentUserVLeague, SessionDep, require_role, TaiKhoan
from app import crud
from app.models import (
    ScheduleGenerateRequest,
    ScheduleGenerationResult,
    ScheduleValidateRequest,
    ScheduleValidationResult,
    LichThiDauPublic,
)

router = APIRouter()


@router.get("/{muagiai}", response_model=list[LichThiDauPublic])
def get_schedule(
    *,
    session: SessionDep,
    muagiai: str,
    current_user: CurrentUserVLeague,
) -> Any:
    """
    Get all matches for a season, sorted by round and time.
    
    **Authentication required.**
    
    Returns matches ordered by:
    1. Round (vong) ascending
    2. Match time (thoigianthidau) ascending
    3. Match ID (matran) ascending
    """
    # Verify season exists
    season = crud.get_season_by_id(session=session, id=muagiai)
    if not season:
        raise HTTPException(status_code=404, detail=f"Mùa giải {muagiai} không tồn tại")
    
    # Get all matches for this season
    matches = crud.get_matches(session=session, muagiai=muagiai, limit=2000)
    
    # Sort by vong, thoigianthidau, matran
    matches_sorted = sorted(
        matches,
        key=lambda m: (
            m.vong if m.vong is not None else 999,
            m.thoigianthidau if m.thoigianthidau is not None else "",
            m.matran
        )
    )
    
    return matches_sorted


@router.post("/generate", response_model=ScheduleGenerationResult)
def generate_schedule(
    *,
    session: SessionDep,
    request_in: ScheduleGenerateRequest,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
) -> Any:
    """
    Generate round-robin schedule for season.
    
    **Requires BTC role.**
    
    Algorithm:
    - Get all clubs in season
    - Generate (n-1) rounds per leg (for n teams)
    - First leg: home/away assigned
    - Second leg: swap home/away
    - Assign match times with interval
    
    Request parameters:
    - **muagiai**: Season ID
    - **ngaybatdau_lutdi**: Start date for first leg
    - **ngaybatdau_lutve**: Start date for return leg
    - **interval_days**: Days between rounds (default 7)
    
    Returns 200 OK even if generation fails (check success field and errors array).
    """
    try:
        result = crud.generate_round_robin_schedule(session=session, request_in=request_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return result


@router.post("/validate", response_model=ScheduleValidationResult)
def validate_schedule(
    *,
    session: SessionDep,
    request_in: ScheduleValidateRequest,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
) -> Any:
    """
    Validate schedule for season.
    
    **Requires BTC role.**
    
    Checks:
    - Each club plays (n-1) * 2 matches
    - Each pair plays exactly 2 times (home & away)
    - No duplicate rounds for same clubs
    - All matches within season dates
    
    Request parameters:
    - **muagiai**: Season ID
    """
    try:
        result = crud.validate_schedule(session=session, request_in=request_in)
    except ValueError as e:
        # Season not found or invalid input
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        # Unexpected errors
        raise HTTPException(status_code=500, detail=f"Validate schedule failed: {str(e)}")
    
    return result
