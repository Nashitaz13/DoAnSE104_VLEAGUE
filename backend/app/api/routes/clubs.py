from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app import crud
from app.api.deps import SessionDep, require_role
from app.models import CauLacBoPublic, CauLacBoCreate, CauLacBoUpdate, Message

router = APIRouter()


@router.get("/", response_model=list[CauLacBoPublic])
def get_clubs(
    session: SessionDep,
    muagiai: Optional[str] = Query(None, description="Filter by season, e.g., '2024-2025'"),
    skip: int = 0,
    limit: int = 100
) -> list[CauLacBoPublic]:
    """
    Get all clubs, optionally filtered by season
    
    **Query Parameters:**
    - muagiai: Optional filter by season ID
    """
    clubs = crud.get_clubs(session=session, muagiai=muagiai, skip=skip, limit=limit)
    return clubs


@router.get("/{club_id}", response_model=CauLacBoPublic)
def get_club(
    session: SessionDep,
    club_id: str,
    muagiai: str = Query(..., description="Season ID (required for composite PK)")
) -> CauLacBoPublic:
    """
    Get club by ID
    
    **Requires muagiai parameter** due to composite primary key (maclb, muagiai)
    
    Example: `/clubs/CLB001?muagiai=2024-2025`
    """
    club = crud.get_club_by_id(session=session, maclb=club_id, muagiai=muagiai)
    if not club:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Club {club_id} not found for season {muagiai}"
        )
    return club


@router.post("/", response_model=CauLacBoPublic)
def create_club(
    session: SessionDep,
    club_in: CauLacBoCreate,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> CauLacBoPublic:
    """
    Create new club
    
    **Requires BTC role** - Only Ban Tổ Chức can create clubs.
    
    Club is registered for a specific season (muagiai).
    Can link to home stadium via masanvandong (must match muagiai).
    """
    return crud.create_club(session=session, club_in=club_in)


@router.put("/{club_id}", response_model=CauLacBoPublic)
def update_club(
    session: SessionDep,
    club_id: str,
    current_user: Annotated[None, Depends(require_role("BTC"))],
    club_in: CauLacBoUpdate,
    muagiai: str = Query(..., description="Season ID (required for composite PK)")
) -> CauLacBoPublic:
    """
    Update club
    
    **Requires BTC role** - Only Ban Tổ Chức can update clubs.
    **Requires muagiai parameter** due to composite primary key.
    
    Cannot change primary key fields (maclb, muagiai).
    """
    club = crud.get_club_by_id(session=session, maclb=club_id, muagiai=muagiai)
    if not club:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Club {club_id} not found for season {muagiai}"
        )
    return crud.update_club(session=session, db_club=club, club_in=club_in)


@router.delete("/{club_id}", response_model=Message)
def delete_club(
    session: SessionDep,
    club_id: str,
    current_user: Annotated[None, Depends(require_role("BTC"))],
    muagiai: str = Query(..., description="Season ID (required for composite PK)")
) -> Message:
    """
    Delete club
    
    **Requires BTC role** - Only Ban Tổ Chức can delete clubs.
    **Requires muagiai parameter** due to composite primary key.
    """
    success = crud.delete_club(session=session, maclb=club_id, muagiai=muagiai)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Club {club_id} not found for season {muagiai}"
        )
    return Message(message="Club deleted successfully")
