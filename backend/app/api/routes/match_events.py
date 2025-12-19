from typing import Any, Annotated

from fastapi import APIRouter, HTTPException, Depends

from app.api.deps import CurrentUserVLeague, SessionDep, require_role, TaiKhoan
from app import crud
from app.models import (
    SuKienTranDau,
    SuKienTranDauCreate,
    SuKienTranDauPublic,
    SuKienTranDauUpdate,
    Message,
)

router = APIRouter()


@router.get("/{matran}/events", response_model=list[SuKienTranDauPublic])
def read_match_events(
    session: SessionDep,
    current_user: CurrentUserVLeague,
    matran: str,
    loaisukien: str | None = None,
) -> Any:
    """
    Get events for match, ordered by time.
    
    - **loaisukien**: Optional filter by event type (BanThang, TheVang, TheDo, ThayNguoi)
    """
    # Verify match exists
    match = crud.get_match_by_id(session=session, matran=matran)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    events = crud.get_match_events(
        session=session,
        matran=matran,
        loaisukien=loaisukien
    )
    
    return events


@router.post("/{matran}/events", response_model=SuKienTranDauPublic, status_code=201)
def create_match_event(
    *,
    session: SessionDep,
    matran: str,
    event_in: SuKienTranDauCreate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
) -> Any:
    """
    Create match event.
    
    **Requires BTC role.**
    
    Validates:
    - Match exists
    - Player exists
    - Player in roster for club in that season
    - Club is one of the two teams playing
    - Event time 1-130 minutes
    - Event type valid (BanThang, TheVang, TheDo, ThayNguoi)
    
    **Note:** Event types are auto-normalized. Both "BanThang" and "Ban Thang" are accepted.
    """
    # Override matran from path (client doesn't send in body)
    event_in.matran = matran
    
    try:
        event = crud.create_match_event(session=session, event_in=event_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return event


@router.patch("/{matran}/events/{masukien}", response_model=SuKienTranDauPublic)
def update_match_event(
    *,
    session: SessionDep,
    matran: str,
    masukien: str,
    event_in: SuKienTranDauUpdate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
) -> Any:
    """
    Partially update match event (PATCH)
    
    **Requires BTC role.**
    
    **PATCH semantics:** Only provided fields will be updated.
    Empty body ({}) returns 200 with no changes.
    
    **Allowed fields to update:**
    - `loaisukien`: Event type (BanThang, TheVang, TheDo, ThayNguoi)
    - `phutthidau`: Minute of event (1-130)
    - `bugio`: Half period (0, 1, 2 for extra time)
    - `motasukien`: Description text
    - `cauthulienquan`: Related player ID (for substitutions)
    
    **Note:** Cannot update `macauthu`, `maclb`, or `matran` via PATCH.
    Extra fields will be rejected with 422 Unprocessable Entity.
    
    **Common use cases:**
    - Fix event time: `{"phutthidau": 25, "bugio": 0}`
    - Change event type: `{"loaisukien": "TheVang"}`
    - Add description: `{"motasukien": "Phạm lỗi thô bạo"}`
    """
    event = crud.get_event_by_id(session=session, masukien=masukien)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Verify event belongs to this match
    if event.matran != matran:
        raise HTTPException(
            status_code=400, 
            detail=f"Event {masukien} does not belong to match {matran}"
        )
    
    try:
        event = crud.update_match_event(session=session, db_event=event, event_in=event_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return event


@router.delete("/{matran}/events/{masukien}")
def delete_match_event(
    session: SessionDep,
    matran: str,
    masukien: str,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
) -> Message:
    """
    Delete match event.
    
    **Requires BTC role.**
    """
    event = crud.get_event_by_id(session=session, masukien=masukien)
    if event and event.matran != matran:
        raise HTTPException(
            status_code=400,
            detail=f"Event {masukien} does not belong to match {matran}"
        )
    
    success = crud.delete_match_event(session=session, masukien=masukien)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return Message(message="Event deleted successfully")
