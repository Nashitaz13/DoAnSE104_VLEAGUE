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


# Mùa giải - Integrated with Regulations (lowercase for PostgreSQL)
class MuaGiai(SQLModel, table=True):
    __tablename__ = "muagiai"
    
    # Primary key
    muagiai: str = Field(primary_key=True, max_length=50)  # e.g., "2024-2025"
    
    # Season dates
    ngaybatdau: Optional[datetime] = None
    ngayketthuc: Optional[datetime] = None
    
    # Club regulations
    soclbthamdutoida: Optional[int] = None
    lephithamgia: Optional[float] = None
    
    # Player regulations
    socauthutoithieu: Optional[int] = None
    socauthutoida: Optional[int] = None
    sothumontoithieu: Optional[int] = None
    tuoicauthutoithieu: Optional[int] = None
    tuoicauthutoida: Optional[int] = None
    
    # Stadium regulations
    succhuatoithieu: Optional[int] = None
    yeucausvd: Optional[str] = None
    
    # Coach regulations
    chungchihlv: Optional[str] = Field(default=None, max_length=100)
    
    # Match regulations
    socauthudangkythidautoida: Optional[int] = None
    thoidiemghibantoida: Optional[int] = None
    
    # Status
    trangthai: Optional[str] = Field(default="Active", max_length=50)


# Loại cầu thủ - Player type regulations per season
class LoaiCauThu(SQLModel, table=True):
    __tablename__ = "loaicauthu"
    
    maloaicauthu: str = Field(primary_key=True, max_length=50)
    tenloaicauthu: str = Field(max_length=100)
    socauthutoida: int
    muagiai: str = Field(foreign_key="muagiai.muagiai", max_length=50)


# Sân vận động - Composite PK (masanvandong, muagiai)
class SanVanDong(SQLModel, table=True):
    __tablename__ = "sanvandong"
    
    # Composite primary key
    masanvandong: str = Field(primary_key=True, max_length=50)
    muagiai: str = Field(primary_key=True, foreign_key="muagiai.muagiai", max_length=50)
    
    # Stadium info
    tensanvandong: str = Field(max_length=100)
    diachisvd: Optional[str] = None  # TEXT in schema
    succhua: Optional[int] = None
    danhgiafifa: Optional[str] = Field(default=None, max_length=50)


# Câu lạc bộ - Composite PK (maclb, muagiai)
class CauLacBo(SQLModel, table=True):
    __tablename__ = "caulacbo"
    
    # Composite primary key
    maclb: str = Field(primary_key=True, max_length=50)
    muagiai: str = Field(primary_key=True, foreign_key="muagiai.muagiai", max_length=50)
    
    # Club info
    tenclb: str = Field(max_length=100)
    diachitruso: Optional[str] = None  # TEXT in schema (DiaChiTruSo)
    donvichuquan: Optional[str] = Field(default=None, max_length=100)
    
    # Uniforms
    trangphucchunha: Optional[str] = Field(default=None, max_length=100)
    trangphuckhach: Optional[str] = Field(default=None, max_length=100)
    trangphucduphong: Optional[str] = Field(default=None, max_length=100)
    
    # Home stadium - composite FK to SanVanDong(masanvandong, muagiai)
    # Note: SQLModel doesn't directly support composite FK declaration
    # Database constraint handles this
    masanvandong: Optional[str] = Field(default=None, max_length=50)


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


# Mùa giải schemas - Integrated with regulations
class MuaGiaiPublic(SQLModel):
    """Public season data with all regulations"""
    muagiai: str
    ngaybatdau: Optional[datetime] = None
    ngayketthuc: Optional[datetime] = None
    soclbthamdutoida: Optional[int] = None
    lephithamgia: Optional[float] = None
    socauthutoithieu: Optional[int] = None
    socauthutoida: Optional[int] = None
    sothumontoithieu: Optional[int] = None
    tuoicauthutoithieu: Optional[int] = None
    tuoicauthutoida: Optional[int] = None
    succhuatoithieu: Optional[int] = None
    yeucausvd: Optional[str] = None
    chungchihlv: Optional[str] = None
    socauthudangkythidautoida: Optional[int] = None
    thoidiemghibantoida: Optional[int] = None
    trangthai: Optional[str] = None


class MuaGiaiCreate(SQLModel):
    """Create season with regulations"""
    muagiai: str
    ngaybatdau: Optional[datetime] = None
    ngayketthuc: Optional[datetime] = None
    soclbthamdutoida: Optional[int] = None
    lephithamgia: Optional[float] = None
    socauthutoithieu: Optional[int] = None
    socauthutoida: Optional[int] = None
    sothumontoithieu: Optional[int] = None
    tuoicauthutoithieu: Optional[int] = None
    tuoicauthutoida: Optional[int] = None
    succhuatoithieu: Optional[int] = None
    yeucausvd: Optional[str] = None
    chungchihlv: Optional[str] = None
    socauthudangkythidautoida: Optional[int] = None
    thoidiemghibantoida: Optional[int] = None
    trangthai: Optional[str] = "Active"


class MuaGiaiUpdate(SQLModel):
    """Update season regulations"""
    ngaybatdau: Optional[datetime] = None
    ngayketthuc: Optional[datetime] = None
    soclbthamdutoida: Optional[int] = None
    lephithamgia: Optional[float] = None
    socauthutoithieu: Optional[int] = None
    socauthutoida: Optional[int] = None
    sothumontoithieu: Optional[int] = None
    tuoicauthutoithieu: Optional[int] = None
    tuoicauthutoida: Optional[int] = None
    succhuatoithieu: Optional[int] = None
    yeucausvd: Optional[str] = None
    chungchihlv: Optional[str] = None
    socauthudangkythidautoida: Optional[int] = None
    thoidiemghibantoida: Optional[int] = None
    trangthai: Optional[str] = None


# Loại cầu thủ schemas
class LoaiCauThuPublic(SQLModel):
    """Public player type data"""
    maloaicauthu: str
    tenloaicauthu: str
    socauthutoida: int
    muagiai: str


class LoaiCauThuCreate(SQLModel):
    """Create player type regulation"""
    maloaicauthu: str
    tenloaicauthu: str
    socauthutoida: int
    muagiai: str


class LoaiCauThuUpdate(SQLModel):
    """Update player type regulation"""
    tenloaicauthu: Optional[str] = None
    socauthutoida: Optional[int] = None


# Sân vận động schemas
class SanVanDongPublic(SQLModel):
    """Public stadium data"""
    masanvandong: str
    muagiai: str
    tensanvandong: str
    diachisvd: Optional[str] = None
    succhua: Optional[int] = None
    danhgiafifa: Optional[str] = None


class SanVanDongCreate(SQLModel):
    """Create stadium"""
    masanvandong: str
    muagiai: str
    tensanvandong: str
    diachisvd: Optional[str] = None
    succhua: Optional[int] = None
    danhgiafifa: Optional[str] = None


class SanVanDongUpdate(SQLModel):
    """Update stadium (cannot change PK fields)"""
    tensanvandong: Optional[str] = None
    diachisvd: Optional[str] = None
    succhua: Optional[int] = None
    danhgiafifa: Optional[str] = None


# Câu lạc bộ schemas
class CauLacBoPublic(SQLModel):
    """Public club data"""
    maclb: str
    muagiai: str
    tenclb: str
    diachitruso: Optional[str] = None
    donvichuquan: Optional[str] = None
    trangphucchunha: Optional[str] = None
    trangphuckhach: Optional[str] = None
    trangphucduphong: Optional[str] = None
    masanvandong: Optional[str] = None


class CauLacBoCreate(SQLModel):
    """Create club"""
    maclb: str
    muagiai: str
    tenclb: str
    diachitruso: Optional[str] = None
    donvichuquan: Optional[str] = None
    trangphucchunha: Optional[str] = None
    trangphuckhach: Optional[str] = None
    trangphucduphong: Optional[str] = None
    masanvandong: Optional[str] = None


class CauLacBoUpdate(SQLModel):
    """Update club (cannot change PK fields)"""
    tenclb: Optional[str] = None
    diachitruso: Optional[str] = None
    donvichuquan: Optional[str] = None
    trangphucchunha: Optional[str] = None
    trangphuckhach: Optional[str] = None
    trangphucduphong: Optional[str] = None
    masanvandong: Optional[str] = None


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


# =============================================
# PLAYER POSITION ENUM
# =============================================
class ViTriThiDau:
    """Player positions - Constants for position validation"""
    THU_MON = "GK"  # Goalkeeper
    HAU_VE = "DF"  # Defender
    TIEN_VE = "MF"  # Midfielder
    TIEN_DAO = "FW"  # Forward
    
    @classmethod
    def all_positions(cls):
        return [cls.THU_MON, cls.HAU_VE, cls.TIEN_VE, cls.TIEN_DAO]


# =============================================
# PLAYER (CauThu) - Database Table
# =============================================
class CauThu(SQLModel, table=True):
    __tablename__ = "cauthu"
    
    macauthu: str = Field(primary_key=True, max_length=50)
    tencauthu: str = Field(max_length=100)
    ngaysinh: Optional[datetime] = None
    noisinh: Optional[str] = Field(default=None, max_length=100)
    quoctich: Optional[str] = Field(default=None, max_length=50)  # "VN" for Vietnamese
    quoctichkhac: Optional[str] = Field(default=None, max_length=50)
    vitrithidau: Optional[str] = Field(default=None, max_length=50)  # GK, DF, MF, FW
    chieucao: Optional[float] = None  # in cm
    cannang: Optional[float] = None  # in kg


# Player registration to club (ChiTietDoiBong) - Composite PK
class ChiTietDoiBong(SQLModel, table=True):
    __tablename__ = "chitietdoibong"
    
    # Composite primary key
    macauthu: str = Field(primary_key=True, foreign_key="cauthu.macauthu", max_length=50)
    maclb: str = Field(primary_key=True, max_length=50)
    muagiai: str = Field(primary_key=True, foreign_key="muagiai.muagiai", max_length=50)
    
    # Shirt number (1-99, unique within club+season, NOT NULL required)
    soaothidau: int = Field(ge=1, le=99)
    
    # ⚠️ COMPOSITE FK: (maclb, muagiai) → CauLacBo(maclb, muagiai)
    # ⚠️ UNIQUE CONSTRAINT: (maclb, muagiai, soaothidau)
    # Database constraint exists but SQLModel doesn't support composite FK declaration
    # Validation must be done manually in CRUD layer


# =============================================
# PLAYER SCHEMAS (API Request/Response)
# =============================================

class CauThuPublic(SQLModel):
    """Public player data"""
    macauthu: str
    tencauthu: str
    ngaysinh: Optional[datetime] = None
    noisinh: Optional[str] = None
    quoctich: Optional[str] = None
    quoctichkhac: Optional[str] = None
    vitrithidau: Optional[str] = None
    chieucao: Optional[float] = None
    cannang: Optional[float] = None


class CauThuCreate(SQLModel):
    """Create player"""
    macauthu: str
    tencauthu: str
    ngaysinh: Optional[datetime] = None
    noisinh: Optional[str] = None
    quoctich: Optional[str] = "VN"  # Default Vietnamese
    quoctichkhac: Optional[str] = None
    vitrithidau: Optional[str] = None
    chieucao: Optional[float] = None
    cannang: Optional[float] = None


class CauThuUpdate(SQLModel):
    """Update player (partial update)"""
    tencauthu: Optional[str] = None
    ngaysinh: Optional[datetime] = None
    noisinh: Optional[str] = None
    quoctich: Optional[str] = None
    quoctichkhac: Optional[str] = None
    vitrithidau: Optional[str] = None
    chieucao: Optional[float] = None
    cannang: Optional[float] = None


# =============================================
# ROSTER (ChiTietDoiBong) SCHEMAS
# =============================================

class ChiTietDoiBongPublic(SQLModel):
    """Public roster entry"""
    macauthu: str
    maclb: str
    muagiai: str
    soaothidau: int  # NOT NULL required


class ChiTietDoiBongCreate(SQLModel):
    """Register player to club roster"""
    macauthu: str
    maclb: str
    muagiai: str
    soaothidau: int = Field(ge=1, le=99, description="Shirt number (1-99, required)")


class RosterPlayerDetail(SQLModel):
    """Roster entry with player details"""
    macauthu: str
    tencauthu: str
    quoctich: Optional[str] = None
    vitrithidau: Optional[str] = None
    soaothidau: int  # NOT NULL required
    ngaysinh: Optional[datetime] = None


class RosterValidationResult(SQLModel):
    """Result of roster validation"""
    valid: bool
    violations: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    stats: dict[str, int | None] = Field(default_factory=dict)  # Values can be None (e.g., min_required from season)
