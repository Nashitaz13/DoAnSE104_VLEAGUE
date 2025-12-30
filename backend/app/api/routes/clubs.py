from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app import crud
from app.api.deps import SessionDep, require_role, CurrentUserVLeague
from app.models import CauLacBoPublic, CauLacBoCreate, CauLacBoUpdate, Message

router = APIRouter()


# Mapping username -> club ID (heuristic-based, no DB column needed)
USERNAME_CLUB_MAPPING = {
    "hanoi": ["hanoi", "hn"],
    "viettel": ["viettel", "thecong"],
    "hcmc": ["tphcm", "hcm", "hcmc"],
    "binhdinh": ["binhdinh"],
    "slna": ["slna", "songlamnghe"],
    "hagl": ["hagl", "gialai"],
    "namdinh": ["namdinh"],
    "haiphong": ["haiphong"],
    "thanhhoa": ["thanhhoa"],
    "quangninh": ["quangninh"],
    "binhduong": ["binhduong"],
}


def _find_club_for_user(username: str, clubs: list) -> Optional[dict]:
    """Find club matching username using heuristic mapping"""
    username_lower = username.lower()
    
    for club in clubs:
        club_id = str(club.maclb or "").lower()
        
        # Direct match
        if club_id == username_lower:
            return club
        
        # Check mapping patterns
        if username_lower in USERNAME_CLUB_MAPPING:
            patterns = USERNAME_CLUB_MAPPING[username_lower]
            for pattern in patterns:
                if pattern in club_id:
                    return club
    
    return None


@router.get("/me", response_model=CauLacBoPublic)
def get_my_club(
    session: SessionDep,
    current_user: CurrentUserVLeague,
    muagiai: str = Query(..., description="Season ID (required)")
) -> CauLacBoPublic:
    """
    Get the club assigned to the current user (QuanLyDoi)
    
    **Authentication required** - Returns the club linked to current user based on username mapping
    
    **Query Parameters:**
    - muagiai: Season ID (required)
    
    Returns 404 if no matching club found for the user
    """
    # Get all clubs for the season
    clubs = crud.get_clubs(session=session, muagiai=muagiai, skip=0, limit=100)
    
    # Find matching club using heuristic
    my_club = _find_club_for_user(current_user.tendangnhap, clubs)
    
    if not my_club:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No club assigned to current user"
        )
    
    return my_club


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
