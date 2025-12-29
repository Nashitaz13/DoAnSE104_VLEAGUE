from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app import crud
from app.api.deps import SessionDep, require_role, CurrentUserVLeague
from app.models import CauThuPublic, CauThuCreate, CauThuUpdate, Message, TaiKhoan

router = APIRouter()


@router.get("/", response_model=list[CauThuPublic])
def get_players(
    session: SessionDep,
    keyword: Optional[str] = Query(None, description="Search by player name"),
    quoctich: Optional[str] = Query(None, description="Filter by nationality (e.g., 'VN')"),
    vitrithidau: Optional[str] = Query(None, description="Filter by position (GK, DF, MF, FW)"),
    skip: int = 0,
    limit: int = 100
) -> list[CauThuPublic]:
    """
    Get all players with optional filters
    
    Public endpoint - no authentication required
    
    **Query Parameters:**
    - keyword: Search in player name (case-insensitive)
    - quoctich: Filter by nationality
    - vitrithidau: Filter by position (GK, DF, MF, FW)
    """
    players = crud.get_players(
        session=session,
        keyword=keyword,
        quoctich=quoctich,
        vitrithidau=vitrithidau,
        skip=skip,
        limit=limit
    )
    return players


@router.get("/{player_id}", response_model=CauThuPublic)
def get_player(
    session: SessionDep,
    player_id: str
) -> CauThuPublic:
    """
    Get player by ID
    
    Public endpoint - no authentication required
    """
    player = crud.get_player_by_id(session=session, macauthu=player_id)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player {player_id} not found"
        )
    return player


@router.post("/", response_model=CauThuPublic, status_code=status.HTTP_201_CREATED)
def create_player(
    session: SessionDep,
    player_in: CauThuCreate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))]
) -> CauThuPublic:
    """
    Create new player
    
    **Requires BTC role** - Only Ban Tổ Chức can create players
    
    Player fields:
    - macauthu: Unique player ID (e.g., "CT001")
    - tencauthu: Full name
    - ngaysinh: Date of birth
    - quoctich: Nationality ("VN" for Vietnamese)
    - vitrithidau: Position (GK, DF, MF, FW)
    - chieucao: Height in cm
    - cannang: Weight in kg
    """
    # Check if player already exists
    existing = crud.get_player_by_id(session=session, macauthu=player_in.macauthu)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Player {player_in.macauthu} already exists"
        )
    
    try:
        return crud.create_player(session=session, player_in=player_in)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.patch("/{player_id}", response_model=CauThuPublic)
def update_player(
    session: SessionDep,
    player_id: str,
    player_in: CauThuUpdate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))]
) -> CauThuPublic:
    """
    Partially update player information (PATCH)
    
    **Requires BTC role** - Only Ban Tổ Chức can update players
    
    **PATCH semantics:** Only fields provided in request body will be updated.
    Omitted fields remain unchanged. Empty body ({}) returns 200 with no changes.
    
    **Restrictions:**
    - Cannot change player ID (macauthu) - must delete and recreate
    
    **Example:**
    ```json
    {"quoctich": "BR", "chieucao": 180.0}
    ```
    Only nationality and height will be updated.
    """
    player = crud.get_player_by_id(session=session, macauthu=player_id)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player {player_id} not found"
        )
    
    try:
        return crud.update_player(session=session, db_player=player, player_in=player_in)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{player_id}", response_model=Message)
def delete_player(
    session: SessionDep,
    player_id: str,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))]
) -> Message:
    """
    Delete player
    
    **Requires BTC role** - Only Ban Tổ Chức can delete players
    
    **Warning:** This will also remove player from all rosters (cascade delete)
    """
    player = crud.get_player_by_id(session=session, macauthu=player_id)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player {player_id} not found"
        )
    
    success = crud.delete_player(session=session, macauthu=player_id)
    if success:
        return Message(message=f"Player {player_id} deleted successfully")
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete player"
        )
