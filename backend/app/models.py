import uuid
from datetime import datetime
from typing import Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


# =============================================
# V-LEAGUE MODELS (Database Tables)
# =============================================
# Note: PostgreSQL converts unquoted identifiers to lowercase
# So we use lowercase attribute names to match database columns

# Nhóm người dùng / Role
class NhomNguoiDung(SQLModel, table=True):
    __tablename__ = "nhomnguoidung"
    
    manhom: Optional[int] = Field(default=None, primary_key=True)
    tennhom: str = Field(max_length=50, unique=True, index=True)
    mota: Optional[str] = Field(default=None, max_length=255)
    
    # Relationship
    tai_khoans: list["TaiKhoan"] = Relationship(back_populates="nhom")


# Tài khoản người dùng  
class TaiKhoan(SQLModel, table=True):
    __tablename__ = "taikhoan"
    
    mataikhoan: Optional[int] = Field(default=None, primary_key=True)
    tendangnhap: str = Field(max_length=100, unique=True, index=True)
    matkhau: str = Field(max_length=255)  # Hashed password
    hoten: Optional[str] = Field(default=None, max_length=100)
    email: Optional[str] = Field(default=None, max_length=100)
    manhom: Optional[int] = Field(default=None, foreign_key="nhomnguoidung.manhom")
    isactive: bool = Field(default=True)
    createdat: datetime = Field(default_factory=datetime.utcnow)
    updatedat: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship
    nhom: Optional[NhomNguoiDung] = Relationship(back_populates="tai_khoans")


# Quy định
class QuyDinh(SQLModel, table=True):
    __tablename__ = "quydinh"
    
    maquydinh: Optional[int] = Field(default=None, primary_key=True)
    tenquydinh: str = Field(max_length=100, unique=True, index=True)
    giatri: int = Field()  # INTEGER in schema
    mota: Optional[str] = Field(default=None, max_length=255)
    updatedat: datetime = Field(default_factory=datetime.utcnow)


# Mùa giải
class MuaGiai(SQLModel, table=True):
    __tablename__ = "muagiai"
    
    mamuagiai: Optional[int] = Field(default=None, primary_key=True)
    tenmuagiai: str = Field(max_length=100)
    ngaybatdau: datetime = Field()  # DATE in schema
    ngayketthuc: datetime = Field()  # DATE in schema
    trangthai: str = Field(default="Active", max_length=20)
    createdat: datetime = Field(default_factory=datetime.utcnow)
    updatedat: datetime = Field(default_factory=datetime.utcnow)


# =============================================
# API RESPONSE SCHEMAS
# =============================================

# Public user data (excludes matkhau)
class TaiKhoanPublic(SQLModel):
    """Public user data (excludes matkhau)"""
    mataikhoan: int
    tendangnhap: str
    hoten: Optional[str] = None
    email: Optional[str] = None
    manhom: Optional[int] = None
    isactive: bool


# Quy định schemas
class QuyDinhPublic(SQLModel):
    """Public regulation data"""
    maquydinh: int
    tenquydinh: str
    giatri: int
    mota: Optional[str] = None
    updatedat: datetime


class QuyDinhCreate(SQLModel):
    """Create regulation request"""
    tenquydinh: str
    giatri: int
    mota: Optional[str] = None


class QuyDinhUpdate(SQLModel):
    """Update regulation request"""
    tenquydinh: Optional[str] = None
    giatri: Optional[int] = None
    mota: Optional[str] = None


# Mùa giải schemas
class MuaGiaiPublic(SQLModel):
    """Public season data"""
    mamuagiai: int
    tenmuagiai: str
    ngaybatdau: datetime
    ngayketthuc: datetime
    trangthai: str
    createdat: datetime
    updatedat: datetime


class MuaGiaiCreate(SQLModel):
    """Create season request"""
    tenmuagiai: str
    ngaybatdau: datetime
    ngayketthuc: datetime
    trangthai: Optional[str] = "Active"


class MuaGiaiUpdate(SQLModel):
    """Update season request"""
    tenmuagiai: Optional[str] = None
    ngaybatdau: Optional[datetime] = None
    ngayketthuc: Optional[datetime] = None
    trangthai: Optional[str] = None


# Response for login endpoint
class LoginResponse(SQLModel):
    """Response for login endpoint"""
    token: str
    token_type: str = "bearer"
    role: Optional[str] = None
    expiresIn: int  # in seconds


# Generic message
class Message(SQLModel):
    message: str


# JWT token payload
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None
