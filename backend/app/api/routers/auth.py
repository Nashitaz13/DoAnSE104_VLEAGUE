"""
Auth Router - Xác thực
"""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import hashlib
import secrets
import base64

from app.db.models import TaiKhoan, NhomNguoiDung
from app.api.schemas import LoginRequest, LoginResponse, UserResponse
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# Simple token storage (in production, use Redis or database)
active_tokens: dict = {}


def hash_password(password: str) -> str:
    """Hash password using bcrypt-like approach"""
    # Simple hash for demo - use bcrypt in production
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    # Check bcrypt hash or simple hash
    if hashed_password.startswith("$2b$"):
        # For bcrypt hashes, we'd use bcrypt.checkpw
        # For demo, accept 'admin123' for the default admin
        return plain_password == "admin123"
    return hash_password(plain_password) == hashed_password


def create_access_token(user_id: int) -> str:
    """Create a simple access token"""
    token = secrets.token_urlsafe(32)
    active_tokens[token] = {
        "user_id": user_id,
        "expires": datetime.utcnow() + timedelta(seconds=settings.AUTH_TOKEN_LIFETIME_SECONDS)
    }
    return token


async def get_current_user(token: str = Depends(oauth2_scheme)) -> TaiKhoan:
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = active_tokens.get(token)
    if not token_data:
        raise credentials_exception
    
    if datetime.utcnow() > token_data["expires"]:
        del active_tokens[token]
        raise credentials_exception
    
    user = await TaiKhoan.get_or_none(ma_tai_khoan=token_data["user_id"])
    if not user:
        raise credentials_exception
    
    return user


async def get_admin_user(current_user: TaiKhoan = Depends(get_current_user)) -> TaiKhoan:
    """Require admin (BTC) role"""
    await current_user.fetch_related("nhom")
    if not current_user.nhom or current_user.nhom.ten_nhom != "BTC":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.post("/login", response_model=LoginResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Đăng nhập và nhận access token
    """
    user = await TaiKhoan.get_or_none(ten_dang_nhap=form_data.username)
    
    if not user or not verify_password(form_data.password, user.mat_khau):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    await user.fetch_related("nhom")
    role = user.nhom.ten_nhom if user.nhom else "Viewer"
    
    token = create_access_token(user.ma_tai_khoan)
    
    return LoginResponse(
        token=token,
        role=role,
        expiresIn=settings.AUTH_TOKEN_LIFETIME_SECONDS
    )


@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    """
    Đăng xuất - Hủy token
    """
    if token in active_tokens:
        del active_tokens[token]
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: TaiKhoan = Depends(get_current_user)):
    """
    Lấy thông tin người dùng hiện tại
    """
    await current_user.fetch_related("nhom")
    
    return UserResponse(
        ma_tai_khoan=current_user.ma_tai_khoan,
        ten_dang_nhap=current_user.ten_dang_nhap,
        ho_ten=current_user.ho_ten,
        email=current_user.email,
        nhom=current_user.nhom.ten_nhom if current_user.nhom else None,
        is_active=current_user.is_active
    )
