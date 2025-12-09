"""
Auth Schemas - Xác thực
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    """Login request body"""
    username: str = Field(..., example="admin")
    password: str = Field(..., example="password123")


class LoginResponse(BaseModel):
    """Login response with token"""
    token: str
    role: str
    expiresIn: int = 3600


class UserBase(BaseModel):
    """Base user info"""
    ten_dang_nhap: str
    ho_ten: Optional[str] = None
    email: Optional[str] = None


class UserResponse(UserBase):
    """User response with role"""
    ma_tai_khoan: int
    nhom: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    """Create user request"""
    username: str
    password: str
    ho_ten: Optional[str] = None
    email: Optional[str] = None
    ma_nhom: Optional[int] = None
