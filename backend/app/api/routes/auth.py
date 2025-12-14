from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app import crud
from app.api.deps import SessionDep, get_current_user_vleague
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash
from app.models import LoginResponse, Message, TaiKhoanPublic, TaiKhoan

router = APIRouter(tags=["auth"])


# Login request model
class LoginRequest(BaseModel):
    """Login request with username and password"""
    username: str
    password: str

class SignUpRequest(BaseModel):
    """Sign up request"""
    username: str
    password: str
    hoten: str | None = None
    email: str | None = None

@router.post("/login", response_model=LoginResponse)
def login(session: SessionDep, credentials: LoginRequest) -> LoginResponse:
    """
    Login with username and password (V-League)
    
    Simple JSON-based authentication:
    - **username**: TenDangNhap (username)
    - **password**: Password (plaintext, will be verified)
    
    Returns JWT access token with role and expiration time.
    """
    user = crud.authenticate(
        session=session, 
        username=credentials.username, 
        password=credentials.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password"
        )
    
    if not user.isactive:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Get user role
    role = crud.get_user_role(session=session, user=user)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=str(user.mataikhoan),
        expires_delta=access_token_expires
    )

    return LoginResponse(
        token=access_token,
        token_type="bearer",
        role=role,
        expiresIn=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60  # Convert to seconds
    )

@router.post("/signup", response_model=TaiKhoanPublic)
def signup(session: SessionDep, body: SignUpRequest) -> TaiKhoanPublic:
    """
    Create a new V-League account
    """
    existing = crud.get_user_by_username(session=session, username=body.username)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )
    user = TaiKhoan(
        tendangnhap=body.username,
        matkhau=get_password_hash(body.password),
        hoten=body.hoten,
        email=body.email,
        isactive=True,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return TaiKhoanPublic(
        mataikhoan=user.mataikhoan,
        tendangnhap=user.tendangnhap,
        hoten=user.hoten,
        email=user.email,
        manhom=user.manhom,
        isactive=user.isactive,
    )

@router.post("/logout", response_model=Message)
def logout() -> Message:
    """
    Logout (V-League)
    
    Simple logout endpoint. Since we're using stateless JWT tokens,
    the actual token invalidation happens on the client side.
    
    For production, consider implementing token blacklisting.
    """
    return Message(message="Logout successful")


@router.get("/me", response_model=TaiKhoanPublic)
def get_current_user_info(
    current_user: Annotated[TaiKhoan, Depends(get_current_user_vleague)]
) -> TaiKhoanPublic:
    """
    Get current user information (V-League)
    
    Returns public user data without password.
    Requires valid JWT token in Authorization header.
    """
    return TaiKhoanPublic(
        mataikhoan=current_user.mataikhoan,
        tendangnhap=current_user.tendangnhap,
        hoten=current_user.hoten,
        email=current_user.email,
        manhom=current_user.manhom,
        isactive=current_user.isactive
    )
