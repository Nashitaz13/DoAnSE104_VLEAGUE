from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app import crud
from app.api.deps import SessionDep, require_role
from app.models import SanVanDongPublic, SanVanDongCreate, SanVanDongUpdate, Message

router = APIRouter()


@router.get("/", response_model=list[SanVanDongPublic])
def get_stadiums(
    session: SessionDep,
    muagiai: Optional[str] = Query(None, description="Filter by season, e.g., '2024-2025'"),
    skip: int = 0,
    limit: int = 100
) -> list[SanVanDongPublic]:
    """
    Get all stadiums, optionally filtered by season
    
    **Query Parameters:**
    - muagiai: Optional filter by season ID
    """
    stadiums = crud.get_stadiums(session=session, muagiai=muagiai, skip=skip, limit=limit)
    return stadiums


@router.get("/{stadium_id}", response_model=SanVanDongPublic)
def get_stadium(
    session: SessionDep,
    stadium_id: str,
    muagiai: str = Query(..., description="Season ID (required for composite PK)")
) -> SanVanDongPublic:
    """
    Get stadium by ID
    
    **Requires muagiai parameter** due to composite primary key (masanvandong, muagiai)
    
    Example: `/stadiums/SVD001?muagiai=2024-2025`
    """
    stadium = crud.get_stadium_by_id(session=session, masanvandong=stadium_id, muagiai=muagiai)
    if not stadium:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stadium {stadium_id} not found for season {muagiai}"
        )
    return stadium


@router.post("/", response_model=SanVanDongPublic)
def create_stadium(
    session: SessionDep,
    stadium_in: SanVanDongCreate,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> SanVanDongPublic:
    """
    Create new stadium
    
    **Requires BTC role** - Only Ban Tổ Chức can create stadiums.
    
    Stadium is created for a specific season (muagiai).
    """
    return crud.create_stadium(session=session, stadium_in=stadium_in)


@router.put("/{stadium_id}", response_model=SanVanDongPublic)
def update_stadium(
    session: SessionDep,
    stadium_id: str,
    current_user: Annotated[None, Depends(require_role("BTC"))],
    stadium_in: SanVanDongUpdate,
    muagiai: str = Query(..., description="Season ID (required for composite PK)")
) -> SanVanDongPublic:
    """
    Update stadium
    
    **Requires BTC role** - Only Ban Tổ Chức can update stadiums.
    **Requires muagiai parameter** due to composite primary key.
    
    Cannot change primary key fields (masanvandong, muagiai).
    """
    stadium = crud.get_stadium_by_id(session=session, masanvandong=stadium_id, muagiai=muagiai)
    if not stadium:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stadium {stadium_id} not found for season {muagiai}"
        )
    return crud.update_stadium(session=session, db_stadium=stadium, stadium_in=stadium_in)


@router.delete("/{stadium_id}", response_model=Message)
def delete_stadium(
    session: SessionDep,
    stadium_id: str,
    current_user: Annotated[None, Depends(require_role("BTC"))],
    muagiai: str = Query(..., description="Season ID (required for composite PK)")
) -> Message:
    """
    Delete stadium
    
    **Requires BTC role** - Only Ban Tổ Chức can delete stadiums.
    **Requires muagiai parameter** due to composite primary key.
    """
    success = crud.delete_stadium(session=session, masanvandong=stadium_id, muagiai=muagiai)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stadium {stadium_id} not found for season {muagiai}"
        )
    return Message(message="Stadium deleted successfully")
