from typing import Any, Annotated

from fastapi import APIRouter, HTTPException, Depends

from app.api.deps import CurrentUserVLeague, SessionDep, require_role, TaiKhoan
from app import crud
from app.models import (
    ChiTietTrongTai,
    ChiTietTrongTaiCreate,
    ChiTietTrongTaiPublic,
    Message,
)

router = APIRouter()


@router.get("/{matran}/referees", response_model=list[ChiTietTrongTaiPublic])
def read_match_referees(
    session: SessionDep,
    current_user: CurrentUserVLeague,
    matran: str,
) -> Any:
    """
    Get referees for match.
    """
    # Verify match exists
    match = crud.get_match_by_id(session=session, matran=matran)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    referees = crud.get_match_referees(session=session, matran=matran)
    
    return referees


@router.post("/{matran}/referees", response_model=ChiTietTrongTaiPublic, status_code=201)
def assign_referee_to_match(
    *,
    session: SessionDep,
    matran: str,
    referee_in: ChiTietTrongTaiCreate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
) -> Any:
    """
    Assign referee to match.
    
    **Requires BTC role.**
    
    Validates:
    - Match exists
    - Not duplicate (matran, tentrongtai)
    """
    # Override matran from path
    referee_in.matran = matran
    
    try:
        referee = crud.assign_referee(session=session, referee_in=referee_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return referee


@router.delete("/{matran}/referees/{tentrongtai}")
def remove_referee_from_match(
    session: SessionDep,
    matran: str,
    tentrongtai: str,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
) -> Message:
    """
    Remove referee from match.
    
    **Requires BTC role.**
    """
    success = crud.remove_referee(session=session, matran=matran, tentrongtai=tentrongtai)
    if not success:
        raise HTTPException(status_code=404, detail="Referee not assigned to match")
    
    return Message(message="Referee removed from match successfully")
