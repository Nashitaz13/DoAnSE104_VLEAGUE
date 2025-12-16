from typing import Any, Annotated
from datetime import datetime

from fastapi import APIRouter, HTTPException, Query, Depends
from sqlmodel import func

from app.api.deps import CurrentUserVLeague, SessionDep, require_role, TaiKhoan
from app import crud
from app.models import (
    LichThiDau,
    LichThiDauCreate,
    LichThiDauPublic,
    LichThiDauUpdate,
    LichThiDauDetail,
    Message,
)

router = APIRouter()


@router.get("/", response_model=list[LichThiDauPublic])
def read_matches(
    session: SessionDep,
    current_user: CurrentUserVLeague,
    skip: int = 0,
    limit: int = Query(default=100, le=100),
    muagiai: str | None = None,
    vong: int | None = None,
    maclb: str | None = None,
    tungay: datetime | None = None,
    denngay: datetime | None = None,
) -> Any:
    """
    Retrieve matches with optional filters.
    
    - **muagiai**: Filter by season
    - **vong**: Filter by round number
    - **maclb**: Filter by club (home OR away)
    - **tungay**: Filter by date from (inclusive)
    - **denngay**: Filter by date to (inclusive)
    """
    matches = crud.get_matches(
        session=session,
        muagiai=muagiai,
        vong=vong,
        maclb=maclb,
        tungay=tungay,
        denngay=denngay,
        skip=skip,
        limit=limit,
    )
    
    return matches


@router.get("/{matran}", response_model=LichThiDauDetail)
def read_match(
    session: SessionDep,
    current_user: CurrentUserVLeague,
    matran: str,
) -> Any:
    """
    Get match details with lineup, events, and referees.
    """
    match_detail = crud.get_match_detail(session=session, matran=matran)
    if not match_detail:
        raise HTTPException(status_code=404, detail="Match not found")
    return match_detail


@router.post("/", response_model=LichThiDauPublic, status_code=201)
def create_match(
    *,
    session: SessionDep,
    match_in: LichThiDauCreate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
) -> Any:
    """
    Create new match.
    
    **Requires BTC role.**
    
    Validates:
    - Season exists
    - Home != away clubs
    - Both clubs exist in season
    - Stadium exists in season (if provided)
    - Match time within season dates
    - Round number > 0
    """
    try:
        match = crud.create_match(session=session, match_in=match_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return match


@router.patch("/{matran}", response_model=LichThiDauPublic)
def update_match(
    *,
    session: SessionDep,
    matran: str,
    match_in: LichThiDauUpdate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
) -> Any:
    """
    Partially update match (PATCH)
    
    **Requires BTC role.**
    
    **PATCH semantics:** Only provided fields will be updated.
    Empty body ({}) returns 200 with no changes.
    
    **Common use cases:**
    - Update match time: `{"thoigianthidau": "2024-03-15T19:00:00"}`
    - Update final score: `{"tiso": "2-1"}`
    - Update stadium: `{"masanvandong": "SVD_02"}`
    - Update attendance: `{"sokhangia": 15000}`
    """
    match = crud.get_match_by_id(session=session, matran=matran)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    try:
        match = crud.update_match(session=session, db_match=match, match_in=match_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return match


@router.delete("/{matran}")
def delete_match(
    session: SessionDep,
    matran: str,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
) -> Message:
    """
    Delete match (cascades to events, lineup, referees).
    
    **Requires BTC role.**
    """
    success = crud.delete_match(session=session, matran=matran)
    if not success:
        raise HTTPException(status_code=404, detail="Match not found")
    
    return Message(message="Match deleted successfully")
