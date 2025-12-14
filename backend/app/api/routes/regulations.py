from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status

from app import crud
from app.api.deps import SessionDep, CurrentUserVLeague, require_role
from app.models import QuyDinhPublic, QuyDinhCreate, QuyDinhUpdate, Message

router = APIRouter()


@router.get("/", response_model=list[QuyDinhPublic])
def get_regulations(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100
) -> list[QuyDinhPublic]:
    """
    Get all regulations
    
    Public access - any authenticated user can view regulations.
    """
    regulations = crud.get_regulations(session=session, skip=skip, limit=limit)
    return regulations


@router.get("/{id}", response_model=QuyDinhPublic)
def get_regulation(
    session: SessionDep,
    id: int
) -> QuyDinhPublic:
    """
    Get regulation by ID
    
    Public access - any authenticated user can view regulation details.
    """
    regulation = crud.get_regulation_by_id(session=session, id=id)
    if not regulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Regulation not found"
        )
    return regulation


@router.post("/", response_model=QuyDinhPublic)
def create_regulation(
    session: SessionDep,
    regulation_in: QuyDinhCreate,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> QuyDinhPublic:
    """
    Create new regulation
    
    **Requires BTC role** - Only Ban Tổ Chức can create regulations.
    """
    return crud.create_regulation(session=session, regulation_in=regulation_in)


@router.put("/{id}", response_model=QuyDinhPublic)
def update_regulation(
    session: SessionDep,
    id: int,
    regulation_in: QuyDinhUpdate,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> QuyDinhPublic:
    """
    Update existing regulation
    
    **Requires BTC role** - Only Ban Tổ Chức can update regulations.
    """
    regulation = crud.get_regulation_by_id(session=session, id=id)
    if not regulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Regulation not found"
        )
    return crud.update_regulation(
        session=session,
        db_regulation=regulation,
        regulation_in=regulation_in
    )


@router.delete("/{id}", response_model=Message)
def delete_regulation(
    session: SessionDep,
    id: int,
    current_user: Annotated[None, Depends(require_role("BTC"))]
) -> Message:
    """
    Delete regulation
    
    **Requires BTC role** - Only Ban Tổ Chức can delete regulations.
    """
    success = crud.delete_regulation(session=session, id=id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Regulation not found"
        )
    return Message(message="Regulation deleted successfully")
