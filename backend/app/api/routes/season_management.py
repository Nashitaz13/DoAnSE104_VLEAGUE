from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app import crud
from app.api.deps import SessionDep, CurrentUserVLeague, require_role
from app.models import (
    MuaGiaiPublic, MuaGiaiCreate, MuaGiaiUpdate,
    LoaiCauThuPublic, LoaiCauThuCreate, LoaiCauThuUpdate,
    Message
)

router = APIRouter()


# =============================================
# SEASONS (with integrated regulations)
# =============================================

@router.get("/seasons", response_model=list[MuaGiaiPublic])
def get_seasons(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100
) -> list[MuaGiaiPublic]:
    """
    Get all seasons with integrated regulations
    
    Public access - any authenticated user can view seasons and their regulations.
    """
    seasons = crud.get_seasons(session=session, skip=skip, limit=limit)
    return seasons


@router.get("/seasons/{season_id}", response_model=MuaGiaiPublic)
def get_season(
    session: SessionDep,
    season_id: str
) -> MuaGiaiPublic:
    """
    Get season by ID with all regulations
    
    **season_id**: e.g., "2024-2025"
    """
    season = crud.get_season_by_id(session=session, id=season_id)
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    return season


@router.post("/seasons", response_model=MuaGiaiPublic)
def create_season(
    session: SessionDep,
    season_in: MuaGiaiCreate,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> MuaGiaiPublic:
    """
    Create new season with regulations
    
    **Requires BTC role** - Only Ban Tổ Chức can create seasons.
    
    Sets all regulations for the season:
    - Player limits, age limits
    - Club requirements
    - Stadium requirements
    - Coach certifications
    - Match regulations
    """
    return crud.create_season(session=session, season_in=season_in)


@router.put("/seasons/{season_id}", response_model=MuaGiaiPublic)
def update_season(
    session: SessionDep,
    season_id: str,
    season_in: MuaGiaiUpdate,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> MuaGiaiPublic:
    """
    Update season regulations
    
    **Requires BTC role** - Only Ban Tổ Chức can update season regulations.
    
    Can update any regulation fields without affecting others (partial update).
    """
    season = crud.get_season_by_id(session=session, id=season_id)
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


@router.delete("/seasons/{season_id}", response_model=Message)
def delete_season(
    session: SessionDep,
    season_id: str,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> Message:
    """
    Delete season
    
    **Requires BTC role** - Only Ban Tổ Chức can delete seasons.
    """
    success = crud.delete_season(session=session, id=season_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    return Message(message="Season deleted successfully")


# =============================================
# PLAYER TYPE REGULATIONS
# =============================================

@router.get("/player-types", response_model=list[LoaiCauThuPublic])
def get_player_types(
    session: SessionDep,
    muagiai: Optional[str] = Query(None, description="Filter by season, e.g., '2024-2025'"),
    skip: int = 0,
    limit: int = 100
) -> list[LoaiCauThuPublic]:
    """
    Get player type regulations
    
    Optionally filter by season to see player type limits per season.
    
    **Query Parameters:**
    - muagiai: Filter by season ID (e.g., "2024-2025")
    """
    player_types = crud.get_player_types(
        session=session,
        muagiai=muagiai,
        skip=skip,
        limit=limit
    )
    return player_types


@router.get("/player-types/{player_type_id}", response_model=LoaiCauThuPublic)
def get_player_type(
    session: SessionDep,
    player_type_id: str
) -> LoaiCauThuPublic:
    """
    Get player type regulation by ID
    """
    player_type = crud.get_player_type_by_id(session=session, id=player_type_id)
    if not player_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player type not found"
        )
    return player_type


@router.post("/player-types", response_model=LoaiCauThuPublic)
def create_player_type(
    session: SessionDep,
    player_type_in: LoaiCauThuCreate,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> LoaiCauThuPublic:
    """
    Create player type regulation
    
    **Requires BTC role** - Only Ban Tổ Chức can create player type regulations.
    
    Defines maximum number of players per type (e.g., foreign players) for a season.
    """
    return crud.create_player_type(session=session, player_type_in=player_type_in)


@router.put("/player-types/{player_type_id}", response_model=LoaiCauThuPublic)
def update_player_type(
    session: SessionDep,
    player_type_id: str,
    player_type_in: LoaiCauThuUpdate,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> LoaiCauThuPublic:
    """
    Update player type regulation
    
    **Requires BTC role** - Only Ban Tổ Chức can update player type regulations.
    """
    player_type = crud.get_player_type_by_id(session=session, id=player_type_id)
    if not player_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player type not found"
        )
    return crud.update_player_type(
        session=session,
        db_player_type=player_type,
        player_type_in=player_type_in
    )


@router.delete("/player-types/{player_type_id}", response_model=Message)
def delete_player_type(
    session: SessionDep,
    player_type_id: str,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> Message:
    """
    Delete player type regulation
    
    **Requires BTC role** - Only Ban Tổ Chức can delete player type regulations.
    """
    success = crud.delete_player_type(session=session, id=player_type_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player type not found"
        )
    return Message(message="Player type deleted successfully")
