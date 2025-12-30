import uuid
from datetime import datetime
from typing import Optional

from pydantic import EmailStr, ConfigDict
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
    quoctich: Optional[str] = Field(default=None, max_length=50)  # "Vietnam" for Vietnamese, "Brazil", etc.
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
    quoctich: Optional[str] = "Vietnam"  # Default Vietnamese (normalized)
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


class ChiTietDoiBongUpdate(SQLModel):
    """Update roster entry (shirt number only)"""
    soaothidau: Optional[int] = Field(default=None, ge=1, le=99, description="Shirt number (1-99)")


class RosterPlayerDetail(SQLModel):
    """Roster entry with player details"""
    macauthu: str
    tencauthu: str
    quoctich: Optional[str] = None
    vitrithidau: Optional[str] = None
    soaothidau: int  # NOT NULL required
    ngaysinh: Optional[datetime] = None
    chieucao: Optional[float] = None  # Height in cm
    cannang: Optional[float] = None   # Weight in kg


class RosterValidationResult(SQLModel):
    """Result of roster validation"""
    valid: bool
    violations: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    stats: dict[str, int | None] = Field(default_factory=dict)  # Values can be None (e.g., min_required from season)


# =============================================
# MATCHES (LichThiDau) - Database Table
# =============================================

class LichThiDau(SQLModel, table=True):
    __tablename__ = "lichthidau"
    
    # Primary Key
    matran: str = Field(primary_key=True, max_length=50)
    
    # Season & Round
    muagiai: str = Field(foreign_key="muagiai.muagiai", max_length=50, index=True)
    vong: int = Field(index=True)  # Round number
    
    # Match Info
    thoigianthidau: datetime
    
    # Teams - Composite FK to CauLacBo(maclb, muagiai)
    maclbnha: str = Field(max_length=50, index=True)  # Home club
    maclbkhach: str = Field(max_length=50, index=True)  # Away club
    
    # Stadium - Composite FK to SanVanDong(masanvandong, muagiai)
    masanvandong: Optional[str] = Field(default=None, max_length=50)
    
    # Match Stats
    sokhangia: Optional[int] = None
    nhietdo: Optional[float] = None  # Temperature (°C)
    bugiohiep1: Optional[int] = None  # First half added time (minutes)
    bugiohiep2: Optional[int] = None  # Second half added time (minutes)
    tiso: Optional[str] = Field(default=None, max_length=20)  # Final score "2-1"


# =============================================
# LINEUP (DoiHinhXuatPhat) - Database Table
# =============================================

class DoiHinhXuatPhat(SQLModel, table=True):
    __tablename__ = "doihinhxuatphat"
    
    # Composite Primary Key
    matran: str = Field(primary_key=True, foreign_key="lichthidau.matran", max_length=50)
    macauthu: str = Field(primary_key=True, foreign_key="cauthu.macauthu", max_length=50)
    
    # Lineup Info
    vitri: Optional[str] = Field(default=None, max_length=50)  # Formation position (e.g., "ST", "CM")
    duocxuatphat: bool = Field(default=True)  # True if starting XI, False if substitute
    ladoitruong: bool = Field(default=False)  # Team captain


# =============================================
# MATCH EVENTS (SuKienTranDau) - Database Table
# =============================================

class SuKienTranDau(SQLModel, table=True):
    __tablename__ = "sukientrandau"
    
    # Primary Key
    masukien: str = Field(primary_key=True, max_length=50)
    
    # Event Type (canonical format: no spaces)
    loaisukien: str = Field(max_length=50)  # "BanThang", "TheVang", "TheDo", "ThayNguoi"
    
    # Timing
    phutthidau: int  # Minute of event (1-90+)
    bugio: Optional[int] = None  # Added time minute (if phutthidau > 45 or > 90)
    
    # Description
    motasukien: Optional[str] = None  # TEXT
    cauthulienquan: Optional[str] = Field(default=None, max_length=100)  # Secondary player (assist, substituted out)
    
    # Relations
    matran: str = Field(foreign_key="lichthidau.matran", max_length=50, index=True)
    maclb: str = Field(max_length=50)  # Which team
    macauthu: str = Field(foreign_key="cauthu.macauthu", max_length=50, index=True)


# =============================================
# REFEREES (ChiTietTrongTai) - Database Table
# =============================================

class ChiTietTrongTai(SQLModel, table=True):
    __tablename__ = "chitiettrongtai"
    
    # Composite Primary Key
    matran: str = Field(primary_key=True, foreign_key="lichthidau.matran", max_length=50)
    tentrongtai: str = Field(primary_key=True, max_length=100)
    
    # Referee Position
    vitri: str = Field(max_length=50)  # "Trong Tai Chinh", "Trong Tai Phu", "Trong Tai Thu Tu"


# =============================================
# MATCHES SCHEMAS (API Request/Response)
# =============================================

class LichThiDauPublic(SQLModel):
    """Public match data"""
    matran: str
    muagiai: str
    vong: int
    thoigianthidau: datetime
    maclbnha: str
    maclbkhach: str
    masanvandong: Optional[str] = None
    sokhangia: Optional[int] = None
    nhietdo: Optional[float] = None
    bugiohiep1: Optional[int] = None
    bugiohiep2: Optional[int] = None
    tiso: Optional[str] = None
    ten_clb_nha: Optional[str] = None
    ten_clb_khach: Optional[str] = None
    ten_san: Optional[str] = None


class LichThiDauCreate(SQLModel):
    """Create match"""
    matran: str
    muagiai: str
    vong: int
    thoigianthidau: datetime
    maclbnha: str
    maclbkhach: str
    masanvandong: Optional[str] = None
    sokhangia: Optional[int] = None
    nhietdo: Optional[float] = None
    bugiohiep1: Optional[int] = None
    bugiohiep2: Optional[int] = None
    tiso: Optional[str] = None


class LichThiDauUpdate(SQLModel):
    """Update match (partial update)"""
    matran: Optional[str] = None  # Not allowed to update, but included for validation
    muagiai: Optional[str] = None  # Not allowed to update, but included for validation
    vong: Optional[int] = None
    thoigianthidau: Optional[datetime] = None
    maclbnha: Optional[str] = None  # Not allowed to update, validated in CRUD
    maclbkhach: Optional[str] = None  # Not allowed to update, validated in CRUD
    masanvandong: Optional[str] = None
    sokhangia: Optional[int] = None
    nhietdo: Optional[float] = None
    bugiohiep1: Optional[int] = None
    bugiohiep2: Optional[int] = None
    tiso: Optional[str] = None


class LichThiDauDetail(SQLModel):
    """Match with lineup, events, referees included"""
    matran: str
    muagiai: str
    vong: int
    thoigianthidau: datetime
    maclbnha: str
    maclbkhach: str
    masanvandong: Optional[str] = None
    sokhangia: Optional[int] = None
    nhietdo: Optional[float] = None
    bugiohiep1: Optional[int] = None
    bugiohiep2: Optional[int] = None
    tiso: Optional[str] = None
    # Embedded details (populated by CRUD)
    events: list["SuKienTranDauPublic"] = Field(default_factory=list)
    lineup_home: list["DoiHinhXuatPhatPublic"] = Field(default_factory=list)
    lineup_away: list["DoiHinhXuatPhatPublic"] = Field(default_factory=list)
    referees: list["ChiTietTrongTaiPublic"] = Field(default_factory=list)


# =============================================
# LINEUP SCHEMAS
# =============================================

class DoiHinhXuatPhatPublic(SQLModel):
    """Public lineup entry"""
    matran: str
    macauthu: str
    vitri: Optional[str] = None
    duocxuatphat: bool
    ladoitruong: bool


class DoiHinhXuatPhatCreate(SQLModel):
    """Add player to lineup"""
    matran: Optional[str] = None  # Will be set from path parameter
    macauthu: str
    vitri: Optional[str] = None
    duocxuatphat: bool = True
    ladoitruong: bool = False


class DoiHinhXuatPhatUpdate(SQLModel):
    """Update lineup position"""
    vitri: Optional[str] = None
    duocxuatphat: Optional[bool] = None
    ladoitruong: Optional[bool] = None


class LineupPlayerDetail(SQLModel):
    """Lineup entry with player details"""
    macauthu: str
    tencauthu: str
    maclb: str  # Club ID - needed for frontend filtering
    vitri: Optional[str] = None
    vitrithidau: Optional[str] = None  # Player's actual position
    duocxuatphat: bool
    ladoitruong: bool
    soaothidau: Optional[int] = None


class LineupResponse(SQLModel):
    """Lineup response with starting XI and substitutes"""
    starting_xi: list[LineupPlayerDetail] = Field(default_factory=list)
    substitutes: list[LineupPlayerDetail] = Field(default_factory=list)
    captain_home: Optional[LineupPlayerDetail] = None
    captain_away: Optional[LineupPlayerDetail] = None


# =============================================
# MATCH EVENTS SCHEMAS
# =============================================

class SuKienTranDauPublic(SQLModel):
    """Public match event data"""
    masukien: str
    loaisukien: str
    phutthidau: int
    bugio: Optional[int] = None
    motasukien: Optional[str] = None
    cauthulienquan: Optional[str] = None
    matran: str
    maclb: str
    macauthu: str


class SuKienTranDauCreate(SQLModel):
    """Create match event"""
    masukien: str
    loaisukien: str
    phutthidau: int
    bugio: Optional[int] = None
    motasukien: Optional[str] = None
    cauthulienquan: Optional[str] = None
    matran: Optional[str] = None  # Injected from path parameter, not required in body
    maclb: str
    macauthu: str


class SuKienTranDauUpdate(SQLModel):
    """Update match event - only allows updating specific fields"""
    model_config = ConfigDict(extra="forbid")  # Reject extra fields with 422
    
    loaisukien: Optional[str] = None
    phutthidau: Optional[int] = None
    bugio: Optional[int] = None
    motasukien: Optional[str] = None
    cauthulienquan: Optional[str] = None


# =============================================
# REFEREES SCHEMAS
# =============================================

class ChiTietTrongTaiPublic(SQLModel):
    """Public referee data"""
    matran: str
    tentrongtai: str
    vitri: str


class ChiTietTrongTaiCreate(SQLModel):
    """Assign referee to match"""
    matran: Optional[str] = None  # Will be set from path parameter
    tentrongtai: str
    vitri: str


# =============================================
# SCHEDULE GENERATION SCHEMAS
# =============================================

class ScheduleGenerateRequest(SQLModel):
    """Request to generate schedule"""
    muagiai: str
    ngaybatdau_lutdi: datetime
    ngaybatdau_lutve: datetime
    interval_days: int = 7  # Weekly matches by default


class ScheduleGenerationResult(SQLModel):
    """Result of schedule generation"""
    success: bool
    matches_created: int
    rounds_generated: int
    warnings: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)


class ScheduleValidateRequest(SQLModel):
    """Request to validate schedule"""
    muagiai: str


class ScheduleValidationResult(SQLModel):
    """Result of schedule validation"""
    is_valid: bool
    errors: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    stats: dict[str, int] = Field(default_factory=dict)


# =============================================
# STANDINGS SCHEMAS (Computed - no table)
# =============================================

class StandingsRow(SQLModel):
    """Team standings row (computed from matches)"""
    position: int
    maclb: str
    tenclb: str
    matches_played: int
    won: int
    drawn: int
    lost: int
    goals_for: int
    goals_against: int
    goal_difference: int
    points: int
    form: Optional[str] = None  # Last 5 matches: "WWDLW"


class StandingsResponse(SQLModel):
    """Standings table for a season"""
    muagiai: str
    last_updated: datetime
    standings: list[StandingsRow]


# =============================================
# STATISTICS SCHEMAS (Computed from events)
# =============================================

class PlayerStatsRow(SQLModel):
    """Player statistics for a season (computed from match events)"""
    macauthu: str
    tencauthu: str
    maclb: Optional[str] = None
    tenclb: Optional[str] = None
    matches_played: int
    goals: int
    assists: int
    yellow_cards: int
    red_cards: int


class PlayerStatsResponse(SQLModel):
    """Player statistics response"""
    muagiai: str
    total_players: int
    stats: list[PlayerStatsRow]


class AwardLeaderRow(SQLModel):
    """Award leader row (top scorer / top assist provider)"""
    macauthu: str
    tencauthu: str
    maclb: Optional[str] = None
    tenclb: Optional[str] = None
    value: int  # goals or assists count
    rank: int


class AwardsResponse(SQLModel):
    """Awards response for top scorers and assisters"""
    muagiai: str
    top_scorers: list[AwardLeaderRow] = Field(default_factory=list)
    top_assists: list[AwardLeaderRow] = Field(default_factory=list)
    generated_at: datetime


class DisciplineRow(SQLModel):
    """Discipline statistics row (cards)"""
    macauthu: str
    tencauthu: str
    maclb: Optional[str] = None
    tenclb: Optional[str] = None
    matches_played: Optional[int] = None
    yellow_cards: int
    second_yellows: int  # 2 yellows in same match
    red_cards: int
    discipline_points: int  # yellow=1, second_yellow=2, red=3
    rank: int


class DisciplineResponse(SQLModel):
    """Discipline statistics response"""
    muagiai: str
    leaderboard: list[DisciplineRow] = Field(default_factory=list)
    generated_at: datetime
    rules: str = "Discipline points: Yellow card = 1, Second yellow (2 yellows in same match) = 2, Red card = 3"


# =============================================
# MVP SCHEMAS (Most Valuable Player)
# =============================================

class MVPPlayerRow(SQLModel):
    """MVP candidate with calculated rating"""
    macauthu: str
    tencauthu: str
    maclb: Optional[str] = None
    tenclb: Optional[str] = None
    vitrithidau: Optional[str] = None  # Position: GK, DF, MF, FW
    goals: int
    assists: int
    man_of_match: int  # Number of matches as best player
    average_rating: float  # Calculated rating score
    matches_played: int
    rank: int


class MVPResponse(SQLModel):
    """MVP response with top candidates"""
    muagiai: str
    mvp_candidates: list[MVPPlayerRow] = Field(default_factory=list)
    generated_at: datetime


class MatchStatsRow(SQLModel):
    """Match statistics for one team"""
    maclb: str
    tenclb: str
    possession: Optional[float] = None  # Percent
    shots: int
    shots_on_target: int
    corners: int
    fouls: int
    yellow_cards: int
    red_cards: int


class MatchStatsResponse(SQLModel):
    """Match statistics response"""
    matran: str
    muagiai: str
    home_team: MatchStatsRow
    away_team: MatchStatsRow
    available: bool = True
    message: Optional[str] = None


# Export all models for easy import
__all__ = [
    # Auth
    "NhomNguoiDung", "TaiKhoan", "TaiKhoanPublic",
    "LoginResponse", "Message", "Token", "TokenPayload",
    # Seasons
    "MuaGiai", "MuaGiaiPublic", "MuaGiaiCreate", "MuaGiaiUpdate",
    # Player types
    "LoaiCauThu", "LoaiCauThuPublic", "LoaiCauThuCreate", "LoaiCauThuUpdate",
    # Stadiums
    "SanVanDong", "SanVanDongPublic", "SanVanDongCreate", "SanVanDongUpdate",
    # Clubs
    "CauLacBo", "CauLacBoPublic", "CauLacBoCreate", "CauLacBoUpdate",
    # Players
    "CauThu", "CauThuPublic", "CauThuCreate", "CauThuUpdate", "ViTriThiDau",
    # Rosters
    "ChiTietDoiBong", "ChiTietDoiBongPublic", "ChiTietDoiBongCreate", "ChiTietDoiBongUpdate",
    "RosterPlayerDetail", "RosterValidationResult",
    # Matches
    "LichThiDau", "LichThiDauPublic", "LichThiDauCreate", "LichThiDauUpdate", "LichThiDauDetail",
    # Lineup
    "DoiHinhXuatPhat", "DoiHinhXuatPhatPublic", "DoiHinhXuatPhatCreate", "DoiHinhXuatPhatUpdate",
    "LineupPlayerDetail", "LineupResponse",
    # Events
    "SuKienTranDau", "SuKienTranDauPublic", "SuKienTranDauCreate", "SuKienTranDauUpdate",
    # Referees
    "ChiTietTrongTai", "ChiTietTrongTaiPublic", "ChiTietTrongTaiCreate",
    # Schedule
    "ScheduleGenerateRequest", "ScheduleGenerationResult",
    "ScheduleValidateRequest", "ScheduleValidationResult",
    # Standings & Stats
    "StandingsRow", "StandingsResponse",
    "PlayerStatsRow", "PlayerStatsResponse",
    "MatchStatsRow", "MatchStatsResponse",
    # Awards & Discipline
    "AwardLeaderRow", "AwardsResponse",
    "DisciplineRow", "DisciplineResponse",
    # MVP
    "MVPPlayerRow", "MVPResponse",
]
