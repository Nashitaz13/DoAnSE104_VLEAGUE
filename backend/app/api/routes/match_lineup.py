from typing import Any, Annotated

from fastapi import APIRouter, HTTPException, Depends

from app.api.deps import CurrentUserVLeague, SessionDep, require_role, TaiKhoan
from app import crud
from app.models import (
    DoiHinhXuatPhat,
    DoiHinhXuatPhatCreate,
    DoiHinhXuatPhatPublic,
    DoiHinhXuatPhatUpdate,
    LineupResponse,
    Message,
)

router = APIRouter()


@router.get("/{matran}/lineup", response_model=LineupResponse)
def read_match_lineup(
    session: SessionDep,
    matran: str,
    maclb: str | None = None,
) -> Any:
    """
    Get lineup for match with starting XI, substitutes, and captains.
    
    Public endpoint - no authentication required.
    
    - **maclb**: Optional filter by team
    """
    # Verify match exists
    match = crud.get_match_by_id(session=session, matran=matran)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    lineup_response = crud.get_match_lineup_detailed(session=session, matran=matran, maclb=maclb)
    
    return lineup_response


@router.post("/{matran}/lineup", response_model=DoiHinhXuatPhatPublic, status_code=201)
def add_player_to_lineup(
    *,
    session: SessionDep,
    matran: str,
    lineup_in: DoiHinhXuatPhatCreate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
) -> Any:
    """
    Add player to match lineup.
    
    **Requires BTC role.**
    
    Validates:
    - Match exists
    - Player in roster for one of the teams in that season
    - Not already in lineup
    - Max 11 starting players per team
    - Max 1 captain per team
    """
    # Override matran from path
    lineup_in.matran = matran
    
    try:
        lineup = crud.add_player_to_lineup(session=session, lineup_in=lineup_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return lineup


@router.patch("/{matran}/lineup/{macauthu}", response_model=DoiHinhXuatPhatPublic)
def update_lineup_entry(
    *,
    session: SessionDep,
    matran: str,
    macauthu: str,
    lineup_in: DoiHinhXuatPhatUpdate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
) -> Any:
    """
    Partially update lineup entry (PATCH)
    
    **Requires BTC role.**
    
    **PATCH semantics:** Only provided fields will be updated.
    Empty body ({}) returns 200 with no changes.
    
    **Common use cases:**
    - Set as captain: `{"ladoitruong": true}`
    - Move to bench: `{"duocxuatphat": false}`
    - Change position: `{"vitri": "Tien Dao"}`
    - Promote substitute to starting XI: `{"duocxuatphat": true}`
    """
    lineup = crud.get_lineup_entry(session=session, matran=matran, macauthu=macauthu)
    if not lineup:
        raise HTTPException(status_code=404, detail="Player not in lineup")
    
    try:
        lineup = crud.update_lineup_player(session=session, db_lineup=lineup, lineup_in=lineup_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return lineup


@router.delete("/{matran}/lineup/{macauthu}")
def remove_player_from_lineup(
    session: SessionDep,
    matran: str,
    macauthu: str,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
) -> Message:
    """
    Remove player from lineup.
    
    **Requires BTC role.**
    """
    success = crud.remove_player_from_lineup(session=session, matran=matran, macauthu=macauthu)
    if not success:
        raise HTTPException(status_code=404, detail="Player not in lineup")
    
    return Message(message="Player removed from lineup successfully")
