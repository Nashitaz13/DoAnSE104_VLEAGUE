from collections.abc import Generator
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session

from app.core import security
from app.core.config import settings
from app.core.db import engine
from app.models import TokenPayload, TaiKhoan
from app import crud

# Simple Bearer token scheme (no OAuth2 complexity)
http_bearer = HTTPBearer(
    scheme_name="Bearer Token",
    description="Enter your access token from /auth/login"
)


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[HTTPAuthorizationCredentials, Depends(http_bearer)]


# =============================================
# V-LEAGUE AUTHENTICATION DEPENDENCIES
# =============================================

def get_current_user_vleague(session: SessionDep, credentials: TokenDep) -> TaiKhoan:
    """
    Get current authenticated V-League user from JWT token
    """
    token = credentials.credentials  # Extract token from credentials
    
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    
    # Get user by MaTaiKhoan
    if token_data.sub is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials"
        )
    
    user = session.get(TaiKhoan, int(token_data.sub))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.isactive:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


CurrentUserVLeague = Annotated[TaiKhoan, Depends(get_current_user_vleague)]
CurrentUser = CurrentUserVLeague


def require_role(*allowed_roles: str):
    """
    Dependency factory to check user role
    Usage: Depends(require_role("BTC", "QuanLyDoi"))
    """
    def role_checker(session: SessionDep, current_user: CurrentUserVLeague) -> TaiKhoan:
        user_role = crud.get_user_role(session=session, user=current_user)
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker

# Compatibility dependency for routes expecting superuser access
def get_current_active_superuser(
    session: SessionDep,
    current_user: CurrentUserVLeague,
) -> TaiKhoan:
    role = crud.get_user_role(session=session, user=current_user)
    if role != "BTC":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user
