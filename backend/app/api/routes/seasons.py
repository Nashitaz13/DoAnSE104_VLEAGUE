from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app import crud
from app.api.deps import SessionDep, CurrentUserVLeague, require_role
from app.models import MuaGiaiPublic, MuaGiaiCreate, MuaGiaiUpdate, Message

router = APIRouter()


@router.get("/", response_model=list[MuaGiaiPublic])
def get_seasons(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = Query(None, description="Filter by status: Active, Finished, Cancelled")
) -> list[MuaGiaiPublic]:
    """
    Get all seasons with optional status filter
    
    Public access - any authenticated user can view seasons.
    
    **Query Parameters:**
    - status: Filter by trangthai (Active, Finished, Cancelled)
    """
    seasons = crud.get_seasons(session=session, skip=skip, limit=limit, status=status)
    return seasons


@router.get("/{id}", response_model=MuaGiaiPublic)
def get_season(
    session: SessionDep,
    id: int
) -> MuaGiaiPublic:
    """
    Get season by ID
    
    Public access - any authenticated user can view season details.
    """
    season = crud.get_season_by_id(session=session, id=id)
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    return season


@router.post("/", response_model=MuaGiaiPublic)
def create_season(
    session: SessionDep,
    season_in: MuaGiaiCreate,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> MuaGiaiPublic:
    """
    Create new season
    
    **Requires BTC role** - Only Ban Tổ Chức can create seasons.
    """
    return crud.create_season(session=session, season_in=season_in)


@router.put("/{id}", response_model=MuaGiaiPublic)
def update_season(
    session: SessionDep,
    id: int,
    season_in: MuaGiaiUpdate,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> MuaGiaiPublic:
    """
    Update existing season
    
    **Requires BTC role** - Only Ban Tổ Chức can update seasons.
    """
    season = crud.get_season_by_id(session=session, id=id)
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    return crud.update_season(
        session=session,
        db_season=season,
        season_in=season_in
    )


@router.delete("/{id}", response_model=Message)
def delete_season(
    session: SessionDep,
    id: int,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> Message:
    """
    Delete season
    
    **Requires BTC role** - Only Ban Tổ Chức can delete seasons.
    """
    success = crud.delete_season(session=session, id=id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    return Message(message="Season deleted successfully")
