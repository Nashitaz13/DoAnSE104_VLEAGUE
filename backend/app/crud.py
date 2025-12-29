from sqlmodel import Session, select
from typing import Optional
from datetime import datetime
from sqlalchemy import or_
from sqlalchemy.orm import aliased

from app.core.security import get_password_hash, verify_password
from app.models import (
    TaiKhoan, NhomNguoiDung,
    MuaGiai, MuaGiaiCreate, MuaGiaiUpdate,
    LoaiCauThu, LoaiCauThuCreate, LoaiCauThuUpdate,
    SanVanDong, SanVanDongCreate, SanVanDongUpdate,
    CauLacBo, CauLacBoCreate, CauLacBoUpdate,
    CauThu, CauThuCreate, CauThuUpdate,
    ChiTietDoiBong, ChiTietDoiBongCreate,
    ViTriThiDau,
    LichThiDau, LichThiDauCreate, LichThiDauUpdate, LichThiDauDetail,
    DoiHinhXuatPhat, DoiHinhXuatPhatCreate, DoiHinhXuatPhatUpdate, LineupResponse, LineupPlayerDetail,
    SuKienTranDau, SuKienTranDauCreate, SuKienTranDauUpdate,
    ChiTietTrongTai, ChiTietTrongTaiCreate,
    ScheduleGenerateRequest, ScheduleGenerationResult,
    ScheduleValidateRequest, ScheduleValidationResult,
    StandingsRow, StandingsResponse,
    PlayerStatsRow, PlayerStatsResponse,
    MatchStatsResponse, MatchStatsRow,
    AwardLeaderRow, AwardsResponse,
    DisciplineRow, DisciplineResponse,
)


# =============================================
# V-LEAGUE AUTHENTICATION CRUD
# =============================================

def get_user_by_username(*, session: Session, username: str) -> Optional[TaiKhoan]:
    """
    Get TaiKhoan by tendangnhap (username)
    """
    statement = select(TaiKhoan).where(TaiKhoan.tendangnhap == username)
    return session.exec(statement).first()


def get_user_by_email(*, session: Session, email: str) -> Optional[TaiKhoan]:
    """
    Get TaiKhoan by email
    """
    statement = select(TaiKhoan).where(TaiKhoan.email == email)
    return session.exec(statement).first()


def authenticate(*, session: Session, username: str, password: str) -> Optional[TaiKhoan]:
    """
    Authenticate user with username and password
    Returns TaiKhoan if credentials are valid, None otherwise
    """
    import logging
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    # Add file handler to capture logs
    fh = logging.FileHandler('auth_debug.log')
    fh.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    fh.setFormatter(formatter)
    logger.addHandler(fh)
    
    logger.info(f"Authenticating user: '{username}'")

    user = get_user_by_username(session=session, username=username)
    if not user:
        logger.warning(f"User '{username}' not found in database.")
        logger.removeHandler(fh)
        return None
    if not verify_password(password, user.matkhau):
        logger.warning(f"Password verification failed for '{username}'.")
        logger.removeHandler(fh)
        return None
    
    logger.info(f"User '{username}' authenticated successfully.")
    logger.removeHandler(fh)
    return user


def get_user_role(*, session: Session, user: TaiKhoan) -> Optional[str]:
    """
    Get role name (tennhom) for a given user
    Returns role name like 'BTC', 'QuanLyDoi', 'Viewer'
    """
    if user.manhom is None:
        return None
    statement = select(NhomNguoiDung).where(NhomNguoiDung.manhom == user.manhom)
    nhom = session.exec(statement).first()
    return nhom.tennhom if nhom else None


# =============================================
# SEASONS (with integrated regulations) CRUD
# =============================================

def get_seasons(*, session: Session, skip: int = 0, limit: int = 100) -> list[MuaGiai]:
    """Get all seasons with pagination"""
    statement = select(MuaGiai).offset(skip).limit(limit)
    return list(session.exec(statement).all())


def get_season_by_id(*, session: Session, id: str) -> Optional[MuaGiai]:
    """Get season by ID (VARCHAR primary key)"""
    return session.get(MuaGiai, id)


def create_season(*, session: Session, season_in: MuaGiaiCreate) -> MuaGiai:
    """Create new season with regulations"""
    season = MuaGiai.model_validate(season_in)
    session.add(season)
    session.commit()
    session.refresh(season)
    return season


def update_season(
    *, session: Session, db_season: MuaGiai, season_in: MuaGiaiUpdate
) -> MuaGiai:
    """Update existing season regulations"""
    update_data = season_in.model_dump(exclude_unset=True)
    db_season.sqlmodel_update(update_data)
    session.add(db_season)
    session.commit()
    session.refresh(db_season)
    return db_season


def delete_season(*, session: Session, id: str) -> bool:
    """Delete season by ID"""
    season = session.get(MuaGiai, id)
    if season:
        session.delete(season)
        session.commit()
        return True
    return False


# =============================================
# PLAYER TYPE REGULATIONS CRUD
# =============================================

def get_player_types(
    *, session: Session, muagiai: Optional[str] = None, skip: int = 0, limit: int = 100
) -> list[LoaiCauThu]:
    """Get player types, optionally filtered by season"""
    statement = select(LoaiCauThu)
    if muagiai:
        statement = statement.where(LoaiCauThu.muagiai == muagiai)
    statement = statement.offset(skip).limit(limit)
    return list(session.exec(statement).all())


def get_player_type_by_id(*, session: Session, id: str) -> Optional[LoaiCauThu]:
    """Get player type by ID"""
    return session.get(LoaiCauThu, id)


def create_player_type(*, session: Session, player_type_in: LoaiCauThuCreate) -> LoaiCauThu:
    """Create new player type regulation"""
    player_type = LoaiCauThu.model_validate(player_type_in)
    session.add(player_type)
    session.commit()
    session.refresh(player_type)
    return player_type


def update_player_type(
    *, session: Session, db_player_type: LoaiCauThu, player_type_in: LoaiCauThuUpdate
) -> LoaiCauThu:
    """Update existing player type regulation"""
    update_data = player_type_in.model_dump(exclude_unset=True)
    db_player_type.sqlmodel_update(update_data)
    session.add(db_player_type)
    session.commit()
    session.refresh(db_player_type)
    return db_player_type


def delete_player_type(*, session: Session, id: str) -> bool:
    """Delete player type by ID"""
    player_type = session.get(LoaiCauThu, id)
    if player_type:
        session.delete(player_type)
        session.commit()
        return True
    return False


# =============================================
# STADIUMS CRUD - Composite PK (masanvandong, muagiai)
# =============================================

def get_stadiums(
    *, session: Session, muagiai: Optional[str] = None, skip: int = 0, limit: int = 100
) -> list[SanVanDong]:
    """Get stadiums, optionally filtered by season"""
    statement = select(SanVanDong)
    if muagiai:
        statement = statement.where(SanVanDong.muagiai == muagiai)
    statement = statement.offset(skip).limit(limit)
    return list(session.exec(statement).all())


def get_stadium_by_id(*, session: Session, masanvandong: str, muagiai: str) -> Optional[SanVanDong]:
    """Get stadium by composite PK (masanvandong, muagiai)"""
    statement = select(SanVanDong).where(
        SanVanDong.masanvandong == masanvandong,
        SanVanDong.muagiai == muagiai
    )
    return session.exec(statement).first()


def create_stadium(*, session: Session, stadium_in: SanVanDongCreate) -> SanVanDong:
    """Create new stadium"""
    stadium = SanVanDong.model_validate(stadium_in)
    session.add(stadium)
    session.commit()
    session.refresh(stadium)
    return stadium


def update_stadium(
    *, session: Session, db_stadium: SanVanDong, stadium_in: SanVanDongUpdate
) -> SanVanDong:
    """Update existing stadium"""
    update_data = stadium_in.model_dump(exclude_unset=True)
    db_stadium.sqlmodel_update(update_data)
    session.add(db_stadium)
    session.commit()
    session.refresh(db_stadium)
    return db_stadium


def delete_stadium(*, session: Session, masanvandong: str, muagiai: str) -> bool:
    """Delete stadium by composite PK"""
    stadium = get_stadium_by_id(session=session, masanvandong=masanvandong, muagiai=muagiai)
    if stadium:
        session.delete(stadium)
        session.commit()
        return True
    return False


# =============================================
# CLUBS CRUD - Composite PK (maclb, muagiai)
# =============================================

def get_clubs(
    *, session: Session, muagiai: Optional[str] = None, skip: int = 0, limit: int = 100
) -> list[CauLacBo]:
    """Get clubs, optionally filtered by season"""
    statement = select(CauLacBo)
    if muagiai:
        statement = statement.where(CauLacBo.muagiai == muagiai)
    statement = statement.offset(skip).limit(limit)
    return list(session.exec(statement).all())


def get_club_by_id(*, session: Session, maclb: str, muagiai: str) -> Optional[CauLacBo]:
    """Get club by composite PK (maclb, muagiai)"""
    statement = select(CauLacBo).where(
        CauLacBo.maclb == maclb,
        CauLacBo.muagiai == muagiai
    )
    return session.exec(statement).first()


def create_club(*, session: Session, club_in: CauLacBoCreate) -> CauLacBo:
    """Create new club"""
    club = CauLacBo.model_validate(club_in)
    session.add(club)
    session.commit()
    session.refresh(club)
    return club


def update_club(
    *, session: Session, db_club: CauLacBo, club_in: CauLacBoUpdate
) -> CauLacBo:
    """Update existing club"""
    update_data = club_in.model_dump(exclude_unset=True)
    db_club.sqlmodel_update(update_data)
    session.add(db_club)
    session.commit()
    session.refresh(db_club)
    return db_club


def delete_club(*, session: Session, maclb: str, muagiai: str) -> bool:
    """Delete club by composite PK"""
    club = get_club_by_id(session=session, maclb=maclb, muagiai=muagiai)
    if club:
        session.delete(club)
        session.commit()
        return True
    return False


# =============================================
# PLAYERS CRUD
# =============================================

def get_players(
    *,
    session: Session,
    keyword: Optional[str] = None,
    quoctich: Optional[str] = None,
    vitrithidau: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> list[CauThu]:
    """
    Get players with optional filters
    
    Args:
        keyword: Search in player name (case-insensitive)
        quoctich: Filter by nationality
        vitrithidau: Filter by position
    """
    statement = select(CauThu)
    
    # Apply filters
    if keyword:
        statement = statement.where(CauThu.tencauthu.ilike(f"%{keyword}%"))
    if quoctich:
        statement = statement.where(CauThu.quoctich == quoctich)
    if vitrithidau:
        statement = statement.where(CauThu.vitrithidau == vitrithidau)
    
    statement = statement.offset(skip).limit(limit)
    return list(session.exec(statement).all())


def get_player_by_id(*, session: Session, macauthu: str) -> Optional[CauThu]:
    """Get player by ID"""
    return session.get(CauThu, macauthu)


def create_player(*, session: Session, player_in: CauThuCreate) -> CauThu:
    """Create new player"""
    from app.utils import normalize_nationality
    
    # Validate position if provided
    if player_in.vitrithidau and player_in.vitrithidau not in ViTriThiDau.all_positions():
        raise ValueError(
            f"Invalid position '{player_in.vitrithidau}'. "
            f"Must be one of: {', '.join(ViTriThiDau.all_positions())}"
        )
    
    player = CauThu.model_validate(player_in)
    
    # Normalize nationality before saving to ensure consistent format
    # Converts "VN", "Việt Nam", "Viet Nam" -> "Vietnam"
    # Converts "brazil" -> "Brazil", etc.
    player.quoctich = normalize_nationality(player.quoctich)
    
    session.add(player)
    session.commit()
    session.refresh(player)
    return player


def update_player(
    *, session: Session, db_player: CauThu, player_in: CauThuUpdate
) -> CauThu:
    """Update existing player"""
    from app.utils import normalize_nationality
    
    update_data = player_in.model_dump(exclude_unset=True)
    
    # Validate position if being updated
    if 'vitrithidau' in update_data and update_data['vitrithidau']:
        if update_data['vitrithidau'] not in ViTriThiDau.all_positions():
            raise ValueError(
                f"Invalid position '{update_data['vitrithidau']}'. "
                f"Must be one of: {', '.join(ViTriThiDau.all_positions())}"
            )
    
    # Normalize nationality if being updated
    if 'quoctich' in update_data:
        update_data['quoctich'] = normalize_nationality(update_data['quoctich'])
    
    db_player.sqlmodel_update(update_data)
    session.add(db_player)
    session.commit()
    session.refresh(db_player)
    return db_player


def delete_player(*, session: Session, macauthu: str) -> bool:
    """Delete player by ID"""
    player = session.get(CauThu, macauthu)
    if player:
        session.delete(player)
        session.commit()
        return True
    return False


# =============================================
# ROSTER (ChiTietDoiBong) CRUD
# =============================================

def get_roster(
    *,
    session: Session,
    maclb: Optional[str] = None,
    muagiai: Optional[str] = None,
    macauthu: Optional[str] = None
) -> list[ChiTietDoiBong]:
    """
    Get roster entries with optional filters
    
    Typically used with (maclb, muagiai) to get club's roster for a season
    """
    statement = select(ChiTietDoiBong)
    
    if maclb:
        statement = statement.where(ChiTietDoiBong.maclb == maclb)
    if muagiai:
        statement = statement.where(ChiTietDoiBong.muagiai == muagiai)
    if macauthu:
        statement = statement.where(ChiTietDoiBong.macauthu == macauthu)
    
    return list(session.exec(statement).all())


def get_roster_player(
    *, session: Session, macauthu: str, maclb: str, muagiai: str
) -> Optional[ChiTietDoiBong]:
    """Get specific roster entry by composite PK"""
    statement = select(ChiTietDoiBong).where(
        ChiTietDoiBong.macauthu == macauthu,
        ChiTietDoiBong.maclb == maclb,
        ChiTietDoiBong.muagiai == muagiai
    )
    return session.exec(statement).first()


def add_player_to_roster(
    *, session: Session, roster_in: ChiTietDoiBongCreate
) -> ChiTietDoiBong:
    """
    Add player to club roster for a season
    
    Validates:
    - Player exists
    - Club exists for that season
    - Season exists
    - Player age meets requirements
    - Shirt number unique within club+season
    - Foreign player quota not exceeded
    - Goalkeeper minimum count (warning only)
    - Roster size limits (warning only)
    """
    # 1. Validate player exists
    player = get_player_by_id(session=session, macauthu=roster_in.macauthu)
    if not player:
        raise ValueError(f"Player {roster_in.macauthu} not found")
    
    # 1b. Validate player position if set
    if player.vitrithidau and player.vitrithidau not in ViTriThiDau.all_positions():
        raise ValueError(
            f"Player {roster_in.macauthu} has invalid position '{player.vitrithidau}'. "
            f"Must be one of: {', '.join(ViTriThiDau.all_positions())}"
        )
    
    # 1c. Validate player not already registered for another club in same season
    existing_registration = session.exec(
        select(ChiTietDoiBong).where(
            ChiTietDoiBong.macauthu == roster_in.macauthu,
            ChiTietDoiBong.muagiai == roster_in.muagiai
        )
    ).first()
    if existing_registration:
        if existing_registration.maclb == roster_in.maclb:
            raise ValueError(f"Player {roster_in.macauthu} is already registered for {roster_in.maclb} in season {roster_in.muagiai}")
        else:
            raise ValueError(f"Player {roster_in.macauthu} is already registered for {existing_registration.maclb} in season {roster_in.muagiai}")
    
    # 2. Validate club exists for season
    club = get_club_by_id(session=session, maclb=roster_in.maclb, muagiai=roster_in.muagiai)
    if not club:
        raise ValueError(f"Club {roster_in.maclb} not found for season {roster_in.muagiai}")
    
    # 3. Validate season exists and get regulations
    season = get_season_by_id(session=session, id=roster_in.muagiai)
    if not season:
        raise ValueError(f"Season {roster_in.muagiai} not found")
    
    # 4. Validate player age
    if player.ngaysinh and season.ngaybatdau:
        validate_player_age(
            ngaysinh=player.ngaysinh,
            season_start=season.ngaybatdau,
            min_age=season.tuoicauthutoithieu,
            max_age=season.tuoicauthutoida
        )
    
    # 5. Validate shirt number unique (now REQUIRED)
    if roster_in.soaothidau is not None:
        validate_shirt_number_unique(
            session=session,
            maclb=roster_in.maclb,
            muagiai=roster_in.muagiai,
            soaothidau=roster_in.soaothidau,
            exclude_player=None
        )
    else:
        raise ValueError("Shirt number (soaothidau) is required")
    
    # 6. Validate foreign player quota
    validate_foreign_player_quota(
        session=session,
        maclb=roster_in.maclb,
        muagiai=roster_in.muagiai,
        new_player_nationality=player.quoctich
    )
    
    # 7. Create roster entry
    roster_entry = ChiTietDoiBong.model_validate(roster_in)
    session.add(roster_entry)
    session.commit()
    session.refresh(roster_entry)
    return roster_entry


def remove_player_from_roster(
    *, session: Session, macauthu: str, maclb: str, muagiai: str
) -> bool:
    """Remove player from club roster"""
    roster_entry = get_roster_player(
        session=session, macauthu=macauthu, maclb=maclb, muagiai=muagiai
    )
    if roster_entry:
        session.delete(roster_entry)
        session.commit()
        return True
    return False


# =============================================
# VALIDATORS
# =============================================

def validate_player_age(
    *,
    ngaysinh: datetime,
    season_start: datetime,
    min_age: Optional[int],
    max_age: Optional[int]
) -> None:
    """
    Validate player age against season regulations
    
    Age is calculated at season start date.
    Raises ValueError if age is outside allowed range.
    """
    # Calculate age at season start
    age_at_season_start = (
        season_start.year - ngaysinh.year
        - ((season_start.month, season_start.day) < (ngaysinh.month, ngaysinh.day))
    )
    
    if min_age and age_at_season_start < min_age:
        raise ValueError(
            f"Player age ({age_at_season_start}) is below minimum ({min_age})"
        )
    
    if max_age and age_at_season_start > max_age:
        raise ValueError(
            f"Player age ({age_at_season_start}) exceeds maximum ({max_age})"
        )


def validate_shirt_number_unique(
    *,
    session: Session,
    maclb: str,
    muagiai: str,
    soaothidau: int,
    exclude_player: Optional[str] = None
) -> None:
    """
    Validate shirt number is unique within club+season
    
    Args:
        exclude_player: Player ID to exclude (for updates)
    
    Raises ValueError if shirt number already used
    """
    if not (1 <= soaothidau <= 99):
        raise ValueError(f"Shirt number must be between 1 and 99, got {soaothidau}")
    
    statement = select(ChiTietDoiBong).where(
        ChiTietDoiBong.maclb == maclb,
        ChiTietDoiBong.muagiai == muagiai,
        ChiTietDoiBong.soaothidau == soaothidau
    )
    
    if exclude_player:
        statement = statement.where(ChiTietDoiBong.macauthu != exclude_player)
    
    existing = session.exec(statement).first()
    if existing:
        raise ValueError(
            f"Shirt number {soaothidau} already used by player {existing.macauthu} "
            f"in club {maclb} for season {muagiai}"
        )


def validate_foreign_player_quota(
    *,
    session: Session,
    maclb: str,
    muagiai: str,
    new_player_nationality: Optional[str]
) -> None:
    """
    Validate foreign player quota not exceeded
    
    Uses is_foreign() helper to identify foreign players (any nationality except "Vietnam").
    Gets quota from LoaiCauThu where tenloaicauthu contains "ngoại", "ngoai", "foreign", etc.
    
    Args:
        session: Database session
        maclb: Club ID
        muagiai: Season ID
        new_player_nationality: Nationality of player being added (raw format, will be normalized)
    
    Raises:
        ValueError: If adding this player would exceed the foreign player quota
    """
    from app.utils import is_foreign
    
    # Only check if player is foreign (not Vietnamese)
    if not is_foreign(new_player_nationality):
        return
    
    # Get current foreign players in roster (single query, avoid N+1)
    # ChiTietDoiBong JOIN CauThu to fetch all nationalities at once
    roster_nationalities_stmt = (
        select(CauThu.quoctich)
        .join(ChiTietDoiBong, ChiTietDoiBong.macauthu == CauThu.macauthu)
        .where(
            ChiTietDoiBong.maclb == maclb,
            ChiTietDoiBong.muagiai == muagiai,
        )
    )
    roster_nationalities = session.exec(roster_nationalities_stmt).all()
    foreign_count = sum(1 for nat in roster_nationalities if is_foreign(nat))
    
    # Get foreign player quota from LoaiCauThu
    # Look for player type with "ngoại", "ngoai", "foreign", "nước ngoài", "nuoc ngoai" in name
    statement = select(LoaiCauThu).where(
        LoaiCauThu.muagiai == muagiai,
        or_(
            LoaiCauThu.tenloaicauthu.ilike("%ngoại%"),
            LoaiCauThu.tenloaicauthu.ilike("%ngoai%"),
            LoaiCauThu.tenloaicauthu.ilike("%foreign%"),
            LoaiCauThu.tenloaicauthu.ilike("%nước ngoài%"),
            LoaiCauThu.tenloaicauthu.ilike("%nuoc ngoai%")
        )
    )
    foreign_type = session.exec(statement).first()
    
    if foreign_type and foreign_count >= foreign_type.socauthutoida:
        raise ValueError(
            f"Foreign player quota ({foreign_type.socauthutoida}) exceeded. "
            f"Current foreign players: {foreign_count}"
        )


def validate_roster_size(
    *,
    session: Session,
    maclb: str,
    muagiai: str,
    min_players: Optional[int],
    max_players: Optional[int]
) -> dict:
    """
    Check roster size against season limits
    
    Returns dict with validation result and stats
    This is typically used for finalization checks, not hard enforcement
    """
    current_roster = get_roster(session=session, maclb=maclb, muagiai=muagiai)
    current_count = len(current_roster)
    
    violations = []
    warnings = []
    
    if min_players and current_count < min_players:
        violations.append(
            f"Roster size ({current_count}) below minimum ({min_players})"
        )
    
    if max_players and current_count > max_players:
        violations.append(
            f"Roster size ({current_count}) exceeds maximum ({max_players})"
        )
    
    return {
        "valid": len(violations) == 0,
        "violations": violations,
        "warnings": warnings,
        "current_count": current_count,
        "min_required": min_players,
        "max_allowed": max_players
    }


def validate_goalkeeper_count(
    *,
    session: Session,
    maclb: str,
    muagiai: str,
    min_goalkeepers: Optional[int]
) -> dict:
    """
    Check minimum goalkeeper count
    
    Returns dict with validation result
    """
    # Avoid N+1: count goalkeepers with a single JOIN query
    goalkeepers_stmt = (
        select(CauThu.macauthu)
        .join(ChiTietDoiBong, ChiTietDoiBong.macauthu == CauThu.macauthu)
        .where(
            ChiTietDoiBong.maclb == maclb,
            ChiTietDoiBong.muagiai == muagiai,
            CauThu.vitrithidau == ViTriThiDau.THU_MON,
        )
    )
    goalkeeper_count = len(session.exec(goalkeepers_stmt).all())
    
    violations = []
    
    if min_goalkeepers and goalkeeper_count < min_goalkeepers:
        violations.append(
            f"Goalkeeper count ({goalkeeper_count}) below minimum ({min_goalkeepers})"
        )
    
    return {
        "valid": len(violations) == 0,
        "violations": violations,
        "goalkeeper_count": goalkeeper_count,
        "min_required": min_goalkeepers
    }


# =============================================
# MATCHES (LichThiDau) CRUD
# =============================================

def get_matches(
    *,
    session: Session,
    muagiai: Optional[str] = None,
    vong: Optional[int] = None,
    maclb: Optional[str] = None,  # Filter by club (home OR away)
    tungay: Optional[datetime] = None,  # Date from
    denngay: Optional[datetime] = None,  # Date to
    skip: int = 0,
    limit: int = 100
) -> list["LichThiDau"]:
    """
    Get matches with optional filters
    maclb: Get matches where club is home OR away
    """
    from app.models import LichThiDau, CauLacBo, SanVanDong
    
    CLB1 = aliased(CauLacBo)
    CLB2 = aliased(CauLacBo)

    statement = (
        select(
            LichThiDau,
            CLB1.tenclb.label("ten_clb_nha"),
            CLB2.tenclb.label("ten_clb_khach"),
            SanVanDong.tensanvandong.label("ten_san")
        )
        .join(CLB1, (LichThiDau.maclbnha == CLB1.maclb) & (LichThiDau.muagiai == CLB1.muagiai))
        .join(CLB2, (LichThiDau.maclbkhach == CLB2.maclb) & (LichThiDau.muagiai == CLB2.muagiai))
        .outerjoin(SanVanDong, (LichThiDau.masanvandong == SanVanDong.masanvandong) & (LichThiDau.muagiai == SanVanDong.muagiai))
    )
    
    if muagiai:
        statement = statement.where(LichThiDau.muagiai == muagiai)
    if vong is not None:
        statement = statement.where(LichThiDau.vong == vong)
    if maclb:
        statement = statement.where(
            (LichThiDau.maclbnha == maclb) | (LichThiDau.maclbkhach == maclb)
        )
    if tungay:
        statement = statement.where(LichThiDau.thoigianthidau >= tungay)
    if denngay:
        statement = statement.where(LichThiDau.thoigianthidau <= denngay)
    
    statement = statement.order_by(LichThiDau.thoigianthidau).offset(skip).limit(limit)
    
    results = session.exec(statement).all()
    
    # Map results to LichThiDauPublic
    return [
        {
            **match.model_dump(),
            "ten_clb_nha": ten_nha,
            "ten_clb_khach": ten_khach,
            "ten_san": ten_san
        }
        for match, ten_nha, ten_khach, ten_san in results
    ]


def get_match_by_id(*, session: Session, matran: str) -> Optional["LichThiDau"]:
    """Get match by ID"""
    from app.models import LichThiDau
    return session.get(LichThiDau, matran)


def get_match_detail(*, session: Session, matran: str) -> Optional["LichThiDauDetail"]:
    """
    Get match details with lineup, events, and referees embedded
    """
    from app.models import LichThiDau, LichThiDauDetail
    
    match = session.get(LichThiDau, matran)
    if not match:
        return None
    
    # Build LichThiDauDetail with embedded data
    match_detail = LichThiDauDetail(**match.model_dump())
    
    # Get events
    match_detail.events = get_match_events(session=session, matran=matran)
    
    # Get lineup (home and away)
    lineup_all = get_match_lineup(session=session, matran=matran)
    match_detail.lineup_home = [
        entry for entry in lineup_all 
        if get_player_club(session, entry.macauthu, match.muagiai) == match.maclbnha
    ]
    match_detail.lineup_away = [
        entry for entry in lineup_all 
        if get_player_club(session, entry.macauthu, match.muagiai) == match.maclbkhach
    ]
    
    # Get referees
    match_detail.referees = get_match_referees(session=session, matran=matran)
    
    return match_detail


def get_player_club(session: Session, macauthu: str, muagiai: str) -> Optional[str]:
    """Helper: Get club for player in season (from ChiTietDoiBong)"""
    from app.models import ChiTietDoiBong
    statement = select(ChiTietDoiBong).where(
        ChiTietDoiBong.macauthu == macauthu,
        ChiTietDoiBong.muagiai == muagiai
    )
    entry = session.exec(statement).first()
    return entry.maclb if entry else None


def create_match(*, session: Session, match_in: "LichThiDauCreate") -> "LichThiDau":
    """
    Create new match with validation
    
    Validates:
    - Season exists
    - Home != away clubs
    - Both clubs exist in season
    - Stadium exists in season (if provided)
    - Match time within season dates
    - Round number > 0
    - Match ID does not already exist
    """
    from app.models import LichThiDau
    
    # Check if match already exists
    existing_match = session.get(LichThiDau, match_in.matran)
    if existing_match:
        raise ValueError(f"Match with ID {match_in.matran} already exists")
    
    # Validate match creation
    validate_match_creation(session=session, match_in=match_in)
    
    match = LichThiDau.model_validate(match_in)
    session.add(match)
    session.commit()
    session.refresh(match)
    return match


def update_match(
    *, session: Session, db_match: "LichThiDau", match_in: "LichThiDauUpdate"
) -> "LichThiDau":
    """Update existing match"""
    update_data = match_in.model_dump(exclude_unset=True)
    
    # Prevent updating primary key
    if 'matran' in update_data:
        raise ValueError("Cannot update primary key field 'matran'")
    
    # Prevent updating season
    if 'muagiai' in update_data:
        raise ValueError("Cannot update season field 'muagiai'")
    
    # Prevent updating team assignments after creation
    if 'maclbnha' in update_data or 'maclbkhach' in update_data:
        raise ValueError("Cannot update team assignments after match creation")
    
    # If updating time or stadium, re-validate
    if any(k in update_data for k in ['thoigianthidau', 'masanvandong']):
        # Create temp object for validation
        from app.models import LichThiDauCreate
        temp_data = db_match.model_dump()
        temp_data.update(update_data)
        temp_match = LichThiDauCreate(**temp_data)
        validate_match_creation(session=session, match_in=temp_match)
    
    db_match.sqlmodel_update(update_data)
    session.add(db_match)
    session.commit()
    session.refresh(db_match)
    return db_match


def delete_match(*, session: Session, matran: str) -> bool:
    """Delete match (cascades to events, lineup, referees)"""
    from app.models import LichThiDau
    match = session.get(LichThiDau, matran)
    if match:
        session.delete(match)
        session.commit()
        return True
    return False


def validate_match_creation(
    *, session: Session, match_in: "LichThiDauCreate"
) -> None:
    """
    Validate match creation
    Raises ValueError with specific messages
    """
    # 1. Validate season exists
    season = get_season_by_id(session=session, id=match_in.muagiai)
    if not season:
        raise ValueError(f"Season {match_in.muagiai} not found")
    
    # 2. Validate home != away
    if match_in.maclbnha == match_in.maclbkhach:
        raise ValueError("Home and away clubs cannot be the same")
    
    # 3. Validate home club exists in season
    club_home = get_club_by_id(session=session, maclb=match_in.maclbnha, muagiai=match_in.muagiai)
    if not club_home:
        raise ValueError(f"Home club {match_in.maclbnha} not found for season {match_in.muagiai}")
    
    # 4. Validate away club exists in season
    club_away = get_club_by_id(session=session, maclb=match_in.maclbkhach, muagiai=match_in.muagiai)
    if not club_away:
        raise ValueError(f"Away club {match_in.maclbkhach} not found for season {match_in.muagiai}")
    
    # 5. Validate stadium exists in season (if provided)
    if match_in.masanvandong:
        stadium = get_stadium_by_id(session=session, masanvandong=match_in.masanvandong, muagiai=match_in.muagiai)
        if not stadium:
            raise ValueError(f"Stadium {match_in.masanvandong} not found for season {match_in.muagiai}")
    
    # 6. Validate match time within season
    # Convert datetime to date for comparison
    match_date = match_in.thoigianthidau.date()
    
    if season.ngaybatdau and match_date < season.ngaybatdau:
        raise ValueError(f"Match time before season start date ({season.ngaybatdau})")
    
    if season.ngayketthuc and match_date > season.ngayketthuc:
        raise ValueError(f"Match time after season end date ({season.ngayketthuc})")
    
    # 7. Validate round number > 0
    if match_in.vong <= 0:
        raise ValueError("Round number must be greater than 0")


# =============================================
# MATCH EVENTS (SuKienTranDau) CRUD
# =============================================

def get_match_events(
    *,
    session: Session,
    matran: str,
    loaisukien: Optional[str] = None
) -> list["SuKienTranDau"]:
    """Get events for match, ordered by time"""
    from app.models import SuKienTranDau
    
    statement = select(SuKienTranDau).where(SuKienTranDau.matran == matran)
    
    if loaisukien:
        statement = statement.where(SuKienTranDau.loaisukien == loaisukien)
    
    statement = statement.order_by(SuKienTranDau.phutthidau, SuKienTranDau.bugio)
    return list(session.exec(statement).all())


def get_event_by_id(*, session: Session, masukien: str) -> Optional["SuKienTranDau"]:
    """Get event by ID"""
    from app.models import SuKienTranDau
    return session.get(SuKienTranDau, masukien)


def create_match_event(
    *, session: Session, event_in: "SuKienTranDauCreate"
) -> "SuKienTranDau":
    """
    Create match event with validation
    
    Validates:
    - Match exists
    - Player exists
    - Player in roster for club in that season
    - Club is one of the two teams playing
    - Event time within limits
    - Event type valid
    """
    from app.models import SuKienTranDau
    
    validate_match_event(session=session, event_in=event_in)
    
    event = SuKienTranDau.model_validate(event_in)
    session.add(event)
    session.commit()
    session.refresh(event)
    return event


def update_match_event(
    *, session: Session, db_event: "SuKienTranDau", event_in: "SuKienTranDauUpdate"
) -> "SuKienTranDau":
    """Update match event - only updates fields specified in request"""
    update_data = event_in.model_dump(exclude_unset=True)
    
    # Empty body {} => return unchanged (idempotent)
    if not update_data:
        return db_event
    
    # Normalize event type if being updated
    if 'loaisukien' in update_data:
        from app.utils import normalize_event_type
        try:
            update_data['loaisukien'] = normalize_event_type(update_data['loaisukien'])
        except ValueError as e:
            raise ValueError(str(e))
    
    # Re-validate if critical fields changed
    # IMPORTANT: bugio must be re-validated even when updating bugio only.
    # Also re-validate when changing any field that affects event integrity.
    critical_fields = {
        "phutthidau",
        "bugio",
        "loaisukien",
        "maclb",
        "macauthu",
        "cauthulienquan",
    }
    if any(k in update_data for k in critical_fields):
        from app.models import SuKienTranDauCreate
        temp_data = db_event.model_dump()
        temp_data.update(update_data)
        temp_event = SuKienTranDauCreate(**temp_data)
        validate_match_event(session=session, event_in=temp_event)
    
    db_event.sqlmodel_update(update_data)
    session.add(db_event)
    session.commit()
    session.refresh(db_event)
    return db_event


def delete_match_event(*, session: Session, masukien: str) -> bool:
    """Delete match event"""
    from app.models import SuKienTranDau
    event = session.get(SuKienTranDau, masukien)
    if event:
        session.delete(event)
        session.commit()
        return True
    return False


def validate_match_event(
    *, session: Session, event_in: "SuKienTranDauCreate"
) -> None:
    """
    Validate match event
    Raises ValueError with specific messages
    """
    # 1. Match exists
    match = get_match_by_id(session=session, matran=event_in.matran)
    if not match:
        raise ValueError(f"Match {event_in.matran} not found")
    
    # 2. Player exists
    player = get_player_by_id(session=session, macauthu=event_in.macauthu)
    if not player:
        raise ValueError(f"Player {event_in.macauthu} not found")
    
    # 3. Validate club is one of the two teams
    if event_in.maclb not in [match.maclbnha, match.maclbkhach]:
        raise ValueError(f"Club {event_in.maclb} is not playing in match {event_in.matran}")
    
    # 4. Validate player in roster for club in that season
    roster_entry = get_roster_player(
        session=session,
        macauthu=event_in.macauthu,
        maclb=event_in.maclb,
        muagiai=match.muagiai
    )
    if not roster_entry:
        raise ValueError(
            f"Player {event_in.macauthu} not in roster for {event_in.maclb} "
            f"in season {match.muagiai}"
        )
    
    # 5. Validate event time (1-130 minutes, allowing overtime)
    if event_in.phutthidau < 1 or event_in.phutthidau > 130:
        raise ValueError(f"Event time must be between 1 and 130 minutes, got {event_in.phutthidau}")
    
    # 5b. Validate bugio (added time) with strict rules
    if event_in.bugio is not None:
        # bugio must be non-negative integer (and must NOT be bool)
        # NOTE: isinstance(True, int) is True in Python, so use type(...) is int.
        if type(event_in.bugio) is not int or event_in.bugio < 0:
            raise ValueError(f"Added time (bugio) must be a non-negative integer, got {event_in.bugio}")
        
        # bugio maximum limit: 15 minutes (reasonable upper bound for added time)
        # Rationale: Most added time in real matches is 1-10 minutes, 15 is generous safety margin
        if event_in.bugio > 15:
            raise ValueError(f"Added time (bugio) cannot exceed 15 minutes, got {event_in.bugio}")
        
        # bugio only allowed at end of half-time periods
        # Standard: 45 (end of 1st half), 90 (end of 2nd half)
        # Extra time: 105 (end of 1st extra), 120 (end of 2nd extra)
        ALLOWED_BUGIO_MINUTES = {45, 90, 105, 120}
        
        if event_in.phutthidau not in ALLOWED_BUGIO_MINUTES:
            raise ValueError(
                f"Added time (bugio) can only be specified at minutes 45, 90, 105, or 120. "
                f"Got phutthidau={event_in.phutthidau} with bugio={event_in.bugio}. "
                f"For events during normal play (e.g., minute 67), set bugio=None and use phutthidau only."
            )
    else:
        # bugio is None - this is valid for any phutthidau
        # No additional validation needed
        pass
    
    # 6. Validate and normalize event type
    from app.utils import normalize_event_type
    try:
        # Normalize to canonical format (handles backward compatibility)
        event_in.loaisukien = normalize_event_type(event_in.loaisukien)
    except ValueError as e:
        # Re-raise with same message from normalize_event_type
        raise ValueError(str(e))


# =============================================
# MATCH LINEUP (DoiHinhXuatPhat) CRUD
# =============================================

def get_match_lineup(
    *, session: Session, matran: str, maclb: Optional[str] = None
) -> list["DoiHinhXuatPhat"]:
    """Get lineup for match, optionally filtered by team"""
    from app.models import DoiHinhXuatPhat
    
    statement = select(DoiHinhXuatPhat).where(DoiHinhXuatPhat.matran == matran)
    
    # Filter by club if specified
    if maclb:
        # Get match to determine season
        match = get_match_by_id(session=session, matran=matran)
        if match:
            # Get all players in this club's roster for this season
            from app.models import ChiTietDoiBong
            roster_statement = select(ChiTietDoiBong.macauthu).where(
                ChiTietDoiBong.maclb == maclb,
                ChiTietDoiBong.muagiai == match.muagiai
            )
            player_ids = [row for row in session.exec(roster_statement).all()]
            statement = statement.where(DoiHinhXuatPhat.macauthu.in_(player_ids))
    
    return list(session.exec(statement).all())


def get_match_lineup_detailed(
    *, session: Session, matran: str, maclb: Optional[str] = None
) -> "LineupResponse":
    """
    Get lineup with starting XI, substitutes, and captains detailed
    """
    from app.models import LineupResponse, LineupPlayerDetail, CauThu
    
    # Get match
    match = get_match_by_id(session=session, matran=matran)
    if not match:
        return LineupResponse()
    
    # Get all lineup entries
    lineup_entries = get_match_lineup(session=session, matran=matran)
    
    # Build detailed lineup with player info
    starting_xi = []
    substitutes = []
    captain_home = None
    captain_away = None
    
    for entry in lineup_entries:
        # Get player details
        player = session.get(CauThu, entry.macauthu)
        if not player:
            continue
        
        # Determine which club this player belongs to
        player_club = get_player_club(session, entry.macauthu, match.muagiai)
        
        # Filter by maclb if specified
        if maclb and player_club != maclb:
            continue
        
        # Get shirt number from roster (ChiTietDoiBong)
        shirt_no = None
        if player_club:
            roster = get_roster_player(
                session=session,
                macauthu=entry.macauthu,
                maclb=player_club,
                muagiai=match.muagiai,
            )
            shirt_no = roster.soaothidau if roster else None
        
        # Build detailed entry
        detail = LineupPlayerDetail(
            macauthu=entry.macauthu,
            tencauthu=player.tencauthu,
            vitri=entry.vitri,
            vitrithidau=player.vitrithidau,
            duocxuatphat=entry.duocxuatphat,
            ladoitruong=entry.ladoitruong,
            soaothidau=shirt_no,
        )
        
        # Categorize
        if entry.duocxuatphat:
            starting_xi.append(detail)
        else:
            substitutes.append(detail)
        
        # Set captains
        if entry.ladoitruong:
            if player_club == match.maclbnha:
                captain_home = detail
            elif player_club == match.maclbkhach:
                captain_away = detail
    
    return LineupResponse(
        starting_xi=starting_xi,
        substitutes=substitutes,
        captain_home=captain_home,
        captain_away=captain_away,
    )


def get_lineup_entry(
    *, session: Session, matran: str, macauthu: str
) -> Optional["DoiHinhXuatPhat"]:
    """Get specific lineup entry"""
    from app.models import DoiHinhXuatPhat
    statement = select(DoiHinhXuatPhat).where(
        DoiHinhXuatPhat.matran == matran,
        DoiHinhXuatPhat.macauthu == macauthu
    )
    return session.exec(statement).first()


def add_player_to_lineup(
    *, session: Session, lineup_in: "DoiHinhXuatPhatCreate"
) -> "DoiHinhXuatPhat":
    """
    Add player to match lineup
    
    Validates:
    - Match exists
    - Player in roster for one of the teams in that season
    - Not already in lineup
    - Max 11 starting players per team
    - Max 1 captain per team
    """
    from app.models import DoiHinhXuatPhat
    
    validate_lineup_addition(session=session, lineup_in=lineup_in)
    
    lineup = DoiHinhXuatPhat.model_validate(lineup_in)
    session.add(lineup)
    session.commit()
    session.refresh(lineup)
    return lineup


def update_lineup_player(
    *, session: Session, db_lineup: "DoiHinhXuatPhat", lineup_in: "DoiHinhXuatPhatUpdate"
) -> "DoiHinhXuatPhat":
    """Update lineup entry"""
    update_data = lineup_in.model_dump(exclude_unset=True)
    
    # If setting captain, validate only 1 captain per team
    if update_data.get('ladoitruong') is True:
        match = get_match_by_id(session=session, matran=db_lineup.matran)
        if match:
            # Get player's club from roster
            roster_home = get_roster_player(session=session, macauthu=db_lineup.macauthu, 
                                           maclb=match.maclbnha, muagiai=match.muagiai)
            roster_away = get_roster_player(session=session, macauthu=db_lineup.macauthu,
                                           maclb=match.maclbkhach, muagiai=match.muagiai)
            
            player_club = match.maclbnha if roster_home else match.maclbkhach
            
            # Check for existing captain in same team
            from app.models import DoiHinhXuatPhat
            existing_captains = session.exec(
                select(DoiHinhXuatPhat).where(
                    DoiHinhXuatPhat.matran == db_lineup.matran,
                    DoiHinhXuatPhat.ladoitruong == True,
                    DoiHinhXuatPhat.macauthu != db_lineup.macauthu
                )
            ).all()
            
            # Filter captains by club
            for captain in existing_captains:
                cap_roster_home = get_roster_player(session=session, macauthu=captain.macauthu,
                                                   maclb=match.maclbnha, muagiai=match.muagiai)
                cap_club = match.maclbnha if cap_roster_home else match.maclbkhach
                
                if cap_club == player_club:
                    raise ValueError(f"Team {player_club} already has a captain: {captain.macauthu}")
    
    db_lineup.sqlmodel_update(update_data)
    session.add(db_lineup)
    session.commit()
    session.refresh(db_lineup)
    return db_lineup


def remove_player_from_lineup(*, session: Session, matran: str, macauthu: str) -> bool:
    """Remove player from lineup"""
    lineup = get_lineup_entry(session=session, matran=matran, macauthu=macauthu)
    if lineup:
        session.delete(lineup)
        session.commit()
        return True
    return False


def validate_lineup_addition(
    *, session: Session, lineup_in: "DoiHinhXuatPhatCreate"
) -> None:
    """Validate adding player to lineup"""
    # 1. Match exists
    match = get_match_by_id(session=session, matran=lineup_in.matran)
    if not match:
        raise ValueError(f"Match {lineup_in.matran} not found")
    
    # 2. Player exists
    player = get_player_by_id(session=session, macauthu=lineup_in.macauthu)
    if not player:
        raise ValueError(f"Player {lineup_in.macauthu} not found")
    
    # 3. Player in roster for one of the teams
    roster_home = get_roster_player(
        session=session,
        macauthu=lineup_in.macauthu,
        maclb=match.maclbnha,
        muagiai=match.muagiai
    )
    roster_away = get_roster_player(
        session=session,
        macauthu=lineup_in.macauthu,
        maclb=match.maclbkhach,
        muagiai=match.muagiai
    )
    
    if not roster_home and not roster_away:
        raise ValueError(
            f"Player {lineup_in.macauthu} not in roster for either "
            f"{match.maclbnha} or {match.maclbkhach} in season {match.muagiai}"
        )
    
    # Determine which team this player belongs to
    player_club = match.maclbnha if roster_home else match.maclbkhach
    
    # 4. Check not already in lineup
    existing = get_lineup_entry(session=session, matran=lineup_in.matran, macauthu=lineup_in.macauthu)
    if existing:
        raise ValueError(f"Player {lineup_in.macauthu} already in lineup for match {lineup_in.matran}")
    
    # 5. If starting XI, check max 11 per team
    if lineup_in.duocxuatphat:
        from app.models import DoiHinhXuatPhat
        current_starters = session.exec(
            select(DoiHinhXuatPhat).where(
                DoiHinhXuatPhat.matran == lineup_in.matran,
                DoiHinhXuatPhat.duocxuatphat == True
            )
        ).all()
        
        # Count starters from same team
        team_starters = 0
        for starter in current_starters:
            starter_roster_home = get_roster_player(session=session, macauthu=starter.macauthu,
                                                   maclb=match.maclbnha, muagiai=match.muagiai)
            starter_club = match.maclbnha if starter_roster_home else match.maclbkhach
            if starter_club == player_club:
                team_starters += 1
        
        if team_starters >= 11:
            raise ValueError(f"Team {player_club} already has 11 starting players")
    
    # 6. If captain, check only 1 per team
    if lineup_in.ladoitruong:
        from app.models import DoiHinhXuatPhat
        existing_captains = session.exec(
            select(DoiHinhXuatPhat).where(
                DoiHinhXuatPhat.matran == lineup_in.matran,
                DoiHinhXuatPhat.ladoitruong == True
            )
        ).all()
        
        for captain in existing_captains:
            cap_roster_home = get_roster_player(session=session, macauthu=captain.macauthu,
                                               maclb=match.maclbnha, muagiai=match.muagiai)
            cap_club = match.maclbnha if cap_roster_home else match.maclbkhach
            
            if cap_club == player_club:
                raise ValueError(f"Team {player_club} already has a captain: {captain.macauthu}")


# =============================================
# MATCH REFEREES (ChiTietTrongTai) CRUD
# =============================================

def get_match_referees(*, session: Session, matran: str) -> list["ChiTietTrongTai"]:
    """Get referees for match"""
    from app.models import ChiTietTrongTai
    statement = select(ChiTietTrongTai).where(ChiTietTrongTai.matran == matran)
    return list(session.exec(statement).all())


def get_referee_entry(
    *, session: Session, matran: str, tentrongtai: str
) -> Optional["ChiTietTrongTai"]:
    """Get specific referee entry"""
    from app.models import ChiTietTrongTai
    statement = select(ChiTietTrongTai).where(
        ChiTietTrongTai.matran == matran,
        ChiTietTrongTai.tentrongtai == tentrongtai
    )
    return session.exec(statement).first()


def assign_referee(
    *, session: Session, referee_in: "ChiTietTrongTaiCreate"
) -> "ChiTietTrongTai":
    """
    Assign referee to match
    
    Validates:
    - Match exists
    - Not duplicate (matran, tentrongtai)
    - Valid position
    """
    from app.models import ChiTietTrongTai
    
    # 1. Match exists
    match = get_match_by_id(session=session, matran=referee_in.matran)
    if not match:
        raise ValueError(f"Match {referee_in.matran} not found")
    
    # 2. Check duplicate
    existing = get_referee_entry(session=session, matran=referee_in.matran, 
                                tentrongtai=referee_in.tentrongtai)
    if existing:
        raise ValueError(f"Referee {referee_in.tentrongtai} already assigned to match {referee_in.matran}")
    
    # 3. Validate position (optional, but recommended)
    valid_positions = ["MAIN", "ASSISTANT_1", "ASSISTANT_2", "FOURTH", "VAR", "AVAR",
                      "Trong Tai Chinh", "Trong Tai Phu 1", "Trong Tai Phu 2", "Trong Tai Thu Tu"]
    if referee_in.vitri and referee_in.vitri not in valid_positions:
        # Just a warning, don't block
        pass
    
    referee = ChiTietTrongTai.model_validate(referee_in)
    session.add(referee)
    session.commit()
    session.refresh(referee)
    return referee


def remove_referee(*, session: Session, matran: str, tentrongtai: str) -> bool:
    """Remove referee from match"""
    referee = get_referee_entry(session=session, matran=matran, tentrongtai=tentrongtai)
    if referee:
        session.delete(referee)
        session.commit()
        return True
    return False


# =============================================
# SCHEDULE GENERATION & VALIDATION
# =============================================

def generate_round_robin_schedule(
    *, session: Session, request_in: "ScheduleGenerateRequest"
) -> "ScheduleGenerationResult":
    """
    Generate round-robin schedule for season
    
    Algorithm:
    - Get all clubs in season
    - Generate n-1 rounds per leg (for n teams)
    - First leg: home/away assigned
    - Second leg: swap home/away
    - Assign match times with interval
    """
    from app.models import ScheduleGenerationResult, LichThiDauCreate
    from datetime import timedelta
    
    # Get all clubs in season
    clubs = get_clubs(session=session, muagiai=request_in.muagiai)
    n = len(clubs)
    
    if n < 2:
        return ScheduleGenerationResult(
            success=False,
            matches_created=0,
            rounds_generated=0,
            errors=[f"Need at least 2 clubs in season {request_in.muagiai}, found {n}"]
        )
    
    warnings = []
    if n % 2 != 0:
        warnings.append(f"Odd number of clubs ({n}). Adding bye for round-robin.")
        clubs.append(None)  # Dummy club for bye
        n += 1
    
    rounds_per_leg = n - 1
    expected_total_rounds = rounds_per_leg * 2
    matches_created = 0
    errors = []
    
    # Circle method for round-robin
    # First leg
    for round_num in range(1, rounds_per_leg + 1):
        round_date = request_in.ngaybatdau_lutdi + timedelta(days=(round_num - 1) * request_in.interval_days)
        
        # Generate pairings for this round using circle method
        pairings = generate_round_pairings(clubs, round_num, is_return_leg=False)
        
        for home_club, away_club in pairings:
            if home_club is None or away_club is None:
                continue  # Skip bye
            
            try:
                match_in = LichThiDauCreate(
                    matran=f"M_{request_in.muagiai}_R{round_num}_{home_club.maclb}_{away_club.maclb}",
                    muagiai=request_in.muagiai,
                    vong=round_num,
                    thoigianthidau=round_date,
                    maclbnha=home_club.maclb,
                    maclbkhach=away_club.maclb,
                    masanvandong=home_club.masanvandong  # Use home stadium
                )
                create_match(session=session, match_in=match_in)
                matches_created += 1
            except Exception as e:
                errors.append(f"Round {round_num}: {str(e)}")
    
    # Return leg (swap home/away)
    for round_num in range(1, rounds_per_leg + 1):
        return_round_num = round_num + rounds_per_leg
        round_date = request_in.ngaybatdau_lutve + timedelta(days=(round_num - 1) * request_in.interval_days)
        
        pairings = generate_round_pairings(clubs, round_num, is_return_leg=True)
        
        for home_club, away_club in pairings:
            if home_club is None or away_club is None:
                continue
            
            try:
                match_in = LichThiDauCreate(
                    matran=f"M_{request_in.muagiai}_R{return_round_num}_{home_club.maclb}_{away_club.maclb}",
                    muagiai=request_in.muagiai,
                    vong=return_round_num,
                    thoigianthidau=round_date,
                    maclbnha=home_club.maclb,
                    maclbkhach=away_club.maclb,
                    masanvandong=home_club.masanvandong
                )
                create_match(session=session, match_in=match_in)
                matches_created += 1
            except Exception as e:
                errors.append(f"Round {return_round_num}: {str(e)}")
    
    return ScheduleGenerationResult(
        success=len(errors) == 0,
        matches_created=matches_created,
        rounds_generated=expected_total_rounds,
        warnings=warnings,
        errors=errors
    )


def generate_round_pairings(clubs: list, round_num: int, is_return_leg: bool) -> list[tuple]:
    """
    Generate pairings for one round using circle method
    
    For n teams (even), arrange in circle, rotate, generate pairings
    """
    n = len(clubs)
    if n < 2:
        return []
    
    # Circle method: fix first team, rotate others
    fixed = clubs[0]
    rotating = clubs[1:]
    
    # Rotate based on round number
    rotation = (round_num - 1) % (n - 1)
    rotated = rotating[rotation:] + rotating[:rotation]
    
    # Generate pairings
    pairings = []
    teams = [fixed] + rotated
    
    for i in range(n // 2):
        home = teams[i]
        away = teams[n - 1 - i]
        
        # Alternate home/away based on round parity
        if round_num % 2 == 0:
            home, away = away, home
        
        # Swap if return leg
        if is_return_leg:
            home, away = away, home
        
        pairings.append((home, away))
    
    return pairings


def validate_schedule(
    *, session: Session, request_in: "ScheduleValidateRequest"
) -> "ScheduleValidationResult":
    """
    Validate schedule for season
    
    Checks:
    - Each club plays (n-1) * 2 matches
    - Each pair plays exactly 2 times (home & away)
    - No duplicate rounds for same clubs
    - All matches within season dates
    """
    from app.models import ScheduleValidationResult
    
    # Validate input
    if not request_in.muagiai or not request_in.muagiai.strip():
        raise ValueError("Season ID (muagiai) is required")
    
    season = get_season_by_id(session=session, id=request_in.muagiai)
    if not season:
        raise ValueError(f"Mùa giải {request_in.muagiai} không tồn tại")
    
    matches = get_matches(session=session, muagiai=request_in.muagiai, limit=1000)
    clubs = get_clubs(session=session, muagiai=request_in.muagiai)
    
    errors = []
    warnings = []
    
    n_clubs = len(clubs)
    
    if not matches:
        errors.append(f"No matches found for season {request_in.muagiai}")
        stats = {
            "total_matches": 0,
            "total_clubs": n_clubs,
            "expected_total_matches": n_clubs * (n_clubs - 1) if n_clubs > 0 else 0,
            "rounds_detected": 0
        }
        return ScheduleValidationResult(
            is_valid=False,
            errors=errors,
            warnings=warnings,
            stats=stats
        )
    
    expected_matches_per_club = (n_clubs - 1) * 2  # Each club plays all others twice
    
    # Count matches per club
    club_match_counts = {}
    for club in clubs:
        club_matches = [m for m in matches if m.maclbnha == club.maclb or m.maclbkhach == club.maclb]
        club_match_counts[club.maclb] = len(club_matches)
        
        if len(club_matches) != expected_matches_per_club:
            errors.append(
                f"Club {club.maclb} has {len(club_matches)} matches, "
                f"expected {expected_matches_per_club}"
            )
    
    # Check each pair plays exactly twice (home & away)
    for i, club1 in enumerate(clubs):
        for club2 in clubs[i+1:]:
            club1_vs_club2 = [
                m for m in matches
                if (m.maclbnha == club1.maclb and m.maclbkhach == club2.maclb) or
                   (m.maclbnha == club2.maclb and m.maclbkhach == club1.maclb)
            ]
            
            if len(club1_vs_club2) != 2:
                errors.append(
                    f"Clubs {club1.maclb} vs {club2.maclb} have {len(club1_vs_club2)} matches, expected 2"
                )
            
            # Check one home, one away
            if len(club1_vs_club2) == 2:
                home_counts = sum(1 for m in club1_vs_club2 if m.maclbnha == club1.maclb)
                if home_counts != 1:
                    errors.append(
                        f"Clubs {club1.maclb} vs {club2.maclb} don't have balanced home/away"
                    )
    
    # Check all matches within season dates
    if season.ngaybatdau or season.ngayketthuc:
        for match in matches:
            if not match.thoigianthidau:
                errors.append(f"Match {match.matran} has no scheduled time")
                continue
            
            # Convert datetime to date for comparison if needed
            match_date = match.thoigianthidau.date() if hasattr(match.thoigianthidau, 'date') else match.thoigianthidau
            
            if season.ngaybatdau:
                season_start = season.ngaybatdau.date() if hasattr(season.ngaybatdau, 'date') else season.ngaybatdau
                if match_date < season_start:
                    errors.append(f"Match {match.matran} before season start")
            
            if season.ngayketthuc:
                season_end = season.ngayketthuc.date() if hasattr(season.ngayketthuc, 'date') else season.ngayketthuc
                if match_date > season_end:
                    errors.append(f"Match {match.matran} after season end")
    
    stats = {
        "total_matches": len(matches),
        "total_clubs": n_clubs,
        "expected_total_matches": n_clubs * (n_clubs - 1),  # n * (n-1)
        "rounds_detected": max([m.vong for m in matches]) if matches else 0
    }
    
    return ScheduleValidationResult(
        is_valid=len(errors) == 0,
        errors=errors,
        warnings=warnings,
        stats=stats
    )


# =============================================
# STANDINGS & STATISTICS CRUD (Computed)
# =============================================

def compute_standings(
    *,
    session: Session,
    muagiai: str
) -> StandingsResponse:
    """
    Compute standings table from match results (lichthidau.tiso).
    
    Rules:
    - Win = 3 points
    - Draw = 1 point  
    - Loss = 0 points
    - Sort by: points DESC, goal_difference DESC, goals_for DESC
    
    Handles:
    - Null/invalid tiso gracefully (skip match)
    - Returns empty standings if season not found
    """
    from collections import defaultdict
    
    # Verify season exists
    season = get_season_by_id(session=session, id=muagiai)
    if not season:
        return StandingsResponse(
            muagiai=muagiai,
            last_updated=datetime.utcnow(),
            standings=[]
        )
    
    # Get all matches with results, ordered by date
    matches = session.exec(
        select(LichThiDau)
        .where(LichThiDau.muagiai == muagiai)
        .order_by(LichThiDau.thoigianthidau)
    ).all()
    
    # Get all clubs in season
    clubs_stmt = select(CauLacBo).where(CauLacBo.muagiai == muagiai)
    clubs = {c.maclb: c.tenclb for c in session.exec(clubs_stmt).all()}
    
    if not clubs:
        return StandingsResponse(
            muagiai=muagiai,
            last_updated=datetime.utcnow(),
            standings=[]
        )
    
    # Initialize stats for all clubs
    stats = defaultdict(lambda: {
        "matches_played": 0,
        "won": 0,
        "drawn": 0,
        "lost": 0,
        "goals_for": 0,
        "goals_against": 0,
        "points": 0,
        "form": []  # Last 5 matches
    })
    
    # Process each match
    for match in matches:
        if not match.tiso or not match.tiso.strip():
            continue  # Skip matches without result
        
        # Parse score: "2-1", "0-0", etc.
        try:
            parts = match.tiso.split("-")
            if len(parts) != 2:
                continue  # Invalid format
            
            home_goals = int(parts[0].strip())
            away_goals = int(parts[1].strip())
        except (ValueError, AttributeError):
            continue  # Invalid score format
        
        home_club = match.maclbnha
        away_club = match.maclbkhach
        
        # Update matches played
        stats[home_club]["matches_played"] += 1
        stats[away_club]["matches_played"] += 1
        
        # Update goals
        stats[home_club]["goals_for"] += home_goals
        stats[home_club]["goals_against"] += away_goals
        stats[away_club]["goals_for"] += away_goals
        stats[away_club]["goals_against"] += home_goals
        
        # Determine result
        if home_goals > away_goals:
            # Home win
            stats[home_club]["won"] += 1
            stats[home_club]["points"] += 3
            stats[home_club]["form"].append("W")
            stats[away_club]["lost"] += 1
            stats[away_club]["form"].append("L")
        elif home_goals < away_goals:
            # Away win
            stats[away_club]["won"] += 1
            stats[away_club]["points"] += 3
            stats[away_club]["form"].append("W")
            stats[home_club]["lost"] += 1
            stats[home_club]["form"].append("L")
        else:
            # Draw
            stats[home_club]["drawn"] += 1
            stats[home_club]["points"] += 1
            stats[home_club]["form"].append("D")
            stats[away_club]["drawn"] += 1
            stats[away_club]["points"] += 1
            stats[away_club]["form"].append("D")
    
    # Build standings rows
    standings_rows = []
    for maclb in clubs.keys():
        club_stats = stats[maclb]
        
        # Last 5 matches form (reverse chronological)
        form_str = "".join(club_stats["form"][-5:]) if club_stats["form"] else None
        
        standings_rows.append(StandingsRow(
            position=0,  # Will be set after sorting
            maclb=maclb,
            tenclb=clubs[maclb],
            matches_played=club_stats["matches_played"],
            won=club_stats["won"],
            drawn=club_stats["drawn"],
            lost=club_stats["lost"],
            goals_for=club_stats["goals_for"],
            goals_against=club_stats["goals_against"],
            goal_difference=club_stats["goals_for"] - club_stats["goals_against"],
            points=club_stats["points"],
            form=form_str
        ))
    
    # Sort by points DESC, goal_difference DESC, goals_for DESC
    standings_rows.sort(
        key=lambda x: (-x.points, -x.goal_difference, -x.goals_for, x.tenclb)
    )
    
    # Assign positions
    for idx, row in enumerate(standings_rows, start=1):
        row.position = idx
    
    return StandingsResponse(
        muagiai=muagiai,
        last_updated=datetime.utcnow(),
        standings=standings_rows
    )


def compute_player_stats(
    *,
    session: Session,
    muagiai: str
) -> PlayerStatsResponse:
    """
    Compute player statistics from match events (sukientrandau).
    
    Aggregates:
    - Goals: loaisukien = "BanThang"
    - Assists: Count as cauthulienquan in goal events (if applicable)
    - Yellow cards: loaisukien = "TheVang"
    - Red cards: loaisukien = "TheDo"
    - Matches played: Distinct matran from doihinhxuatphat
    
    Returns empty list if season not found.
    """
    from collections import defaultdict
    
    # Verify season exists
    season = get_season_by_id(session=session, id=muagiai)
    if not season:
        return PlayerStatsResponse(
            muagiai=muagiai,
            total_players=0,
            stats=[]
        )
    
    # Get all matches in season
    matches_stmt = select(LichThiDau.matran).where(LichThiDau.muagiai == muagiai)
    match_ids = [m for m in session.exec(matches_stmt).all()]
    
    if not match_ids:
        return PlayerStatsResponse(
            muagiai=muagiai,
            total_players=0,
            stats=[]
        )
    
    # Initialize player stats
    player_stats = defaultdict(lambda: {
        "goals": 0,
        "assists": 0,
        "yellow_cards": 0,
        "red_cards": 0,
        "matches_played": set(),  # Use set for DISTINCT match count
        "clubs": set()
    })
    
    # Get all events in season
    events_stmt = select(SuKienTranDau).where(SuKienTranDau.matran.in_(match_ids))
    events = session.exec(events_stmt).all()
    
    # Import normalize function
    from app.utils import normalize_event_type
    
    # Process events
    for event in events:
        macauthu = event.macauthu
        # Normalize event type to handle old data with spaces
        try:
            loaisukien = normalize_event_type(event.loaisukien)
        except ValueError:
            # Skip invalid event types
            continue
        
        if loaisukien == "BanThang":
            player_stats[macauthu]["goals"] += 1
            player_stats[macauthu]["clubs"].add(event.maclb)
            
            # Count assist if cauthulienquan exists
            if event.cauthulienquan:
                player_stats[event.cauthulienquan]["assists"] += 1
                player_stats[event.cauthulienquan]["clubs"].add(event.maclb)
        
        elif loaisukien == "TheVang":
            player_stats[macauthu]["yellow_cards"] += 1
            player_stats[macauthu]["clubs"].add(event.maclb)
        
        elif loaisukien == "TheDo":
            player_stats[macauthu]["red_cards"] += 1
            player_stats[macauthu]["clubs"].add(event.maclb)
    
    # Count matches played from lineup (DISTINCT matches)
    lineup_stmt = select(
        DoiHinhXuatPhat.macauthu,
        DoiHinhXuatPhat.matran
    ).where(DoiHinhXuatPhat.matran.in_(match_ids))
    
    for macauthu, matran in session.exec(lineup_stmt).all():
        player_stats[macauthu]["matches_played"].add(matran)  # Add to set for DISTINCT
    
    # Get player info (single query)
    player_ids = list(player_stats.keys())
    players_stmt = select(CauThu.macauthu, CauThu.tencauthu).where(CauThu.macauthu.in_(player_ids))
    players_map = {macauthu: tencauthu for macauthu, tencauthu in session.exec(players_stmt).all()}
    
    # Get club from roster + club name in ONE query (JOIN ChiTietDoiBong -> CauLacBo)
    # This is more reliable than event.maclb for mapping player -> club.
    club_map: dict[str, tuple[Optional[str], Optional[str]]] = {}
    roster_club_stmt = (
        select(
            ChiTietDoiBong.macauthu,
            ChiTietDoiBong.maclb,
            CauLacBo.tenclb,
        )
        .join(
            CauLacBo,
            (CauLacBo.maclb == ChiTietDoiBong.maclb) & (CauLacBo.muagiai == ChiTietDoiBong.muagiai),
        )
        .where(
            ChiTietDoiBong.muagiai == muagiai,
            ChiTietDoiBong.macauthu.in_(player_ids),
        )
    )
    for macauthu, maclb, tenclb in session.exec(roster_club_stmt).all():
        club_map[macauthu] = (maclb, tenclb)
    
    # Fallback: for players without roster entry, use club from events
    # Avoid per-player club queries by fetching all needed club names in one query.
    fallback_club_by_player: dict[str, str] = {}
    fallback_club_ids: set[str] = set()
    for macauthu in player_ids:
        if macauthu in club_map:
            continue
        clubs = list(player_stats[macauthu]["clubs"])
        if clubs:
            fallback_club_by_player[macauthu] = clubs[0]
            fallback_club_ids.add(clubs[0])
    
    if fallback_club_ids:
        fallback_clubs_stmt = select(CauLacBo.maclb, CauLacBo.tenclb).where(
            CauLacBo.muagiai == muagiai,
            CauLacBo.maclb.in_(list(fallback_club_ids)),
        )
        fallback_club_names = {maclb: tenclb for maclb, tenclb in session.exec(fallback_clubs_stmt).all()}
        for macauthu, maclb in fallback_club_by_player.items():
            tenclb = fallback_club_names.get(maclb)
            if tenclb:
                club_map[macauthu] = (maclb, tenclb)
    
    # Build response
    stats_rows = []
    for macauthu, stats in player_stats.items():
        # Skip players with no activity
        if stats["goals"] == 0 and stats["assists"] == 0 and stats["yellow_cards"] == 0 and stats["red_cards"] == 0:
            continue
        
        club_info = club_map.get(macauthu, (None, None))
        
        stats_rows.append(PlayerStatsRow(
            macauthu=macauthu,
            tencauthu=players_map.get(macauthu, "Unknown"),
            maclb=club_info[0],
            tenclb=club_info[1],
            matches_played=len(stats["matches_played"]),  # Convert set to count
            goals=stats["goals"],
            assists=stats["assists"],
            yellow_cards=stats["yellow_cards"],
            red_cards=stats["red_cards"]
        ))
    
    # Sort by goals DESC, assists DESC
    stats_rows.sort(key=lambda x: (-x.goals, -x.assists, x.tencauthu))
    
    return PlayerStatsResponse(
        muagiai=muagiai,
        total_players=len(stats_rows),
        stats=stats_rows
    )


def get_match_stats(
    *,
    session: Session,
    matran: str
) -> MatchStatsResponse:
    """
    Get match statistics. Since thong_ke_tran_dau table doesn't exist,
    compute basic stats from match events.
    
    Returns:
    - Shots, fouls, cards aggregated from sukientrandau
    - available=False if no data
    """
    # Get match
    match = session.get(LichThiDau, matran)
    if not match:
        raise ValueError(f"Match {matran} not found")
    
    # Get all events for this match
    events_stmt = select(SuKienTranDau).where(SuKienTranDau.matran == matran)
    events = session.exec(events_stmt).all()
    
    if not events:
        # No statistics available
        home_club_stmt = select(CauLacBo).where(
            CauLacBo.maclb == match.maclbnha,
            CauLacBo.muagiai == match.muagiai
        )
        away_club_stmt = select(CauLacBo).where(
            CauLacBo.maclb == match.maclbkhach,
            CauLacBo.muagiai == match.muagiai
        )
        
        home_club = session.exec(home_club_stmt).first()
        away_club = session.exec(away_club_stmt).first()
        
        return MatchStatsResponse(
            matran=matran,
            muagiai=match.muagiai,
            home_team=MatchStatsRow(
                maclb=match.maclbnha,
                tenclb=home_club.tenclb if home_club else match.maclbnha,
                shots=0,
                shots_on_target=0,
                corners=0,
                fouls=0,
                yellow_cards=0,
                red_cards=0
            ),
            away_team=MatchStatsRow(
                maclb=match.maclbkhach,
                tenclb=away_club.tenclb if away_club else match.maclbkhach,
                shots=0,
                shots_on_target=0,
                corners=0,
                fouls=0,
                yellow_cards=0,
                red_cards=0
            ),
            available=False,
            message="Match statistics not available - thong_ke_tran_dau table not implemented"
        )
    
    # Aggregate stats from events
    home_stats = {"yellow_cards": 0, "red_cards": 0}
    away_stats = {"yellow_cards": 0, "red_cards": 0}
    
    from app.utils import normalize_event_type
    
    for event in events:
        # Validate event belongs to one of the match teams
        if event.maclb not in [match.maclbnha, match.maclbkhach]:
            continue  # Skip invalid events
        
        target_stats = home_stats if event.maclb == match.maclbnha else away_stats
        
        # Normalize event type to handle old data
        try:
            loaisukien = normalize_event_type(event.loaisukien)
        except ValueError:
            continue
        
        if loaisukien == "TheVang":
            target_stats["yellow_cards"] += 1
        elif loaisukien == "TheDo":
            target_stats["red_cards"] += 1
    
    # Get club names
    home_club_stmt = select(CauLacBo).where(
        CauLacBo.maclb == match.maclbnha,
        CauLacBo.muagiai == match.muagiai
    )
    away_club_stmt = select(CauLacBo).where(
        CauLacBo.maclb == match.maclbkhach,
        CauLacBo.muagiai == match.muagiai
    )
    
    home_club = session.exec(home_club_stmt).first()
    away_club = session.exec(away_club_stmt).first()
    
    return MatchStatsResponse(
        matran=matran,
        muagiai=match.muagiai,
        home_team=MatchStatsRow(
            maclb=match.maclbnha,
            tenclb=home_club.tenclb if home_club else match.maclbnha,
            shots=0,  # Not tracked in events
            shots_on_target=0,
            corners=0,
            fouls=0,
            yellow_cards=home_stats["yellow_cards"],
            red_cards=home_stats["red_cards"]
        ),
        away_team=MatchStatsRow(
            maclb=match.maclbkhach,
            tenclb=away_club.tenclb if away_club else match.maclbkhach,
            shots=0,
            shots_on_target=0,
            corners=0,
            fouls=0,
            yellow_cards=away_stats["yellow_cards"],
            red_cards=away_stats["red_cards"]
        ),
        available=True,
        message="Limited statistics from match events only (cards)"
    )


# =============================================
# AWARDS COMPUTATION (Top Scorers & Assisters)
# =============================================

def compute_awards(
    *,
    session: Session,
    muagiai: str,
    limit: int = 10
) -> AwardsResponse:
    """
    Compute awards for top scorers and top assist providers.
    """
    from collections import defaultdict
    from app.utils import normalize_event_type, logger
    import traceback
    
    try:
        # Verify season exists
        season = get_season_by_id(session=session, id=muagiai)
        if not season:
            return AwardsResponse(
                muagiai=muagiai,
                top_scorers=[],
                top_assists=[],
                generated_at=datetime.utcnow()
            )
        
        # Get all matches in season
        matches_stmt = select(LichThiDau.matran).where(LichThiDau.muagiai == muagiai)
        match_ids = list(session.exec(matches_stmt).all())
        
        if not match_ids:
            return AwardsResponse(
                muagiai=muagiai,
                top_scorers=[],
                top_assists=[],
                generated_at=datetime.utcnow()
            )
        
        # Initialize stats
        goals_count = defaultdict(int)
        assists_count = defaultdict(int)
        player_clubs = {}  # macauthu -> maclb
        player_matches = defaultdict(int) # Just to sanity check activity
        
        # Get all events in season
        events_stmt = select(SuKienTranDau).where(SuKienTranDau.matran.in_(match_ids))
        events = session.exec(events_stmt).all()
        
        # Process events
        for event in events:
            # Normalize event type
            try:
                loaisukien = normalize_event_type(event.loaisukien)
            except ValueError:
                continue
            
            # Only process goal events
            if loaisukien == "BanThang":
                # Count goal
                if event.macauthu:
                    goals_count[event.macauthu] += 1
                    # Track player club
                    if event.macauthu not in player_clubs and event.maclb:
                        player_clubs[event.macauthu] = event.maclb
                
                # Count assist
                if event.cauthulienquan:
                    assists_count[event.cauthulienquan] += 1
                    if event.cauthulienquan not in player_clubs and event.maclb:
                        player_clubs[event.cauthulienquan] = event.maclb
        
        # Get player names
        all_player_ids = set(k for k in goals_count.keys() if k) | set(k for k in assists_count.keys() if k)
        
        if not all_player_ids:
            return AwardsResponse(
                muagiai=muagiai,
                top_scorers=[],
                top_assists=[],
                generated_at=datetime.utcnow()
            )
        
        players_stmt = select(CauThu).where(CauThu.macauthu.in_(list(all_player_ids)))
        players_map = {p.macauthu: p.tencauthu for p in session.exec(players_stmt).all()}
        
        # Get club names
        club_ids = {val for val in player_clubs.values() if val}
        club_names = {}
        if club_ids:
            clubs_stmt = select(CauLacBo.maclb, CauLacBo.tenclb).where(
                CauLacBo.muagiai == muagiai,
                CauLacBo.maclb.in_(list(club_ids)),
            )
            club_names = {maclb: tenclb for maclb, tenclb in session.exec(clubs_stmt).all()}
        
        # Build top scorers list
        scorer_rows = []
        for macauthu, goals in goals_count.items():
            if goals > 0 and macauthu:
                maclb = player_clubs.get(macauthu)
                scorer_rows.append({
                    "macauthu": macauthu,
                    "tencauthu": players_map.get(macauthu, "Unknown"),
                    "maclb": maclb,
                    "tenclb": club_names.get(maclb) if maclb else None,
                    "value": goals
                })
        
        # Sort: value DESC, name ASC
        scorer_rows.sort(key=lambda x: (-x["value"], x["tencauthu"]))
        
        # Assign ranks
        top_scorers = []
        if scorer_rows:
            current_rank = 1
            prev_value = None
            cutoff_value = None
            if len(scorer_rows) > limit:
                cutoff_value = scorer_rows[limit - 1]["value"]
            
            for idx, row in enumerate(scorer_rows):
                if prev_value is not None and row["value"] < prev_value:
                    current_rank = idx + 1
                
                if idx < limit or (cutoff_value is not None and row["value"] >= cutoff_value):
                    top_scorers.append(AwardLeaderRow(
                        macauthu=row["macauthu"],
                        tencauthu=row["tencauthu"],
                        maclb=row["maclb"],
                        tenclb=row["tenclb"],
                        value=row["value"],
                        rank=current_rank
                    ))
                else:
                    break
                prev_value = row["value"]
        
        # Build top assists list
        assister_rows = []
        for macauthu, assists in assists_count.items():
            if assists > 0 and macauthu:
                maclb = player_clubs.get(macauthu)
                assister_rows.append({
                    "macauthu": macauthu,
                    "tencauthu": players_map.get(macauthu, "Unknown"),
                    "maclb": maclb,
                    "tenclb": club_names.get(maclb) if maclb else None,
                    "value": assists
                })
        
        # Sort
        assister_rows.sort(key=lambda x: (-x["value"], x["tencauthu"]))
        
        # Assign ranks
        top_assists = []
        if assister_rows:
            current_rank = 1
            prev_value = None
            cutoff_value = None
            if len(assister_rows) > limit:
                cutoff_value = assister_rows[limit - 1]["value"]
            
            for idx, row in enumerate(assister_rows):
                if prev_value is not None and row["value"] < prev_value:
                    current_rank = idx + 1
                
                if idx < limit or (cutoff_value is not None and row["value"] >= cutoff_value):
                    top_assists.append(AwardLeaderRow(
                        macauthu=row["macauthu"],
                        tencauthu=row["tencauthu"],
                        maclb=row["maclb"],
                        tenclb=row["tenclb"],
                        value=row["value"],
                        rank=current_rank
                    ))
                else:
                    break
                prev_value = row["value"]
        
        return AwardsResponse(
            muagiai=muagiai,
            top_scorers=top_scorers,
            top_assists=top_assists,
            generated_at=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Error computing awards: {str(e)}")
        traceback.print_exc() 
        # Return empty response on error to prevent 500
        return AwardsResponse(
            muagiai=muagiai,
            top_scorers=[],
            top_assists=[],
            generated_at=datetime.utcnow()
        )


# =============================================
# DISCIPLINE COMPUTATION (Cards Statistics)
# =============================================

def compute_discipline(
    *,
    session: Session,
    muagiai: str,
    limit: int = 50
) -> DisciplineResponse:
    """
    Compute discipline statistics (yellow/red cards).
    """
    from collections import defaultdict
    from app.utils import normalize_event_type, logger
    import traceback
    
    try:
        # Verify season exists
        season = get_season_by_id(session=session, id=muagiai)
        if not season:
            return DisciplineResponse(
                muagiai=muagiai,
                leaderboard=[],
                generated_at=datetime.utcnow()
            )
        
        # Get all matches in season
        matches_stmt = select(LichThiDau.matran).where(LichThiDau.muagiai == muagiai)
        match_ids = list(session.exec(matches_stmt).all())
        
        if not match_ids:
            return DisciplineResponse(
                muagiai=muagiai,
                leaderboard=[],
                generated_at=datetime.utcnow()
            )
        
        # Initialize stats
        total_yellows = defaultdict(int)
        total_reds = defaultdict(int)
        second_yellows_count = defaultdict(int)
        match_yellows = defaultdict(lambda: defaultdict(int))  # (matran, macauthu) -> count
        player_clubs = {}  # macauthu -> maclb
        
        # Get all card events in season
        events_stmt = select(SuKienTranDau).where(SuKienTranDau.matran.in_(match_ids))
        events = session.exec(events_stmt).all()
        
        # Process events
        for event in events:
            macauthu = event.macauthu
            if not macauthu:
                continue

            # Track player club
            if macauthu not in player_clubs and event.maclb:
                player_clubs[macauthu] = event.maclb
            
            # Normalize event type
            try:
                loaisukien = normalize_event_type(event.loaisukien)
            except ValueError:
                continue
            
            if loaisukien == "TheVang":
                total_yellows[macauthu] += 1
                match_yellows[event.matran][macauthu] += 1
            
            elif loaisukien == "TheDo":
                total_reds[macauthu] += 1
        
        # Calculate second yellows
        for matran, players in match_yellows.items():
            for macauthu, yellow_count in players.items():
                if yellow_count >= 2:
                    second_yellows_count[macauthu] += (yellow_count - 1)
        
        # Get all players with cards
        all_player_ids = set(k for k in total_yellows.keys() if k) | set(k for k in total_reds.keys() if k)
        
        if not all_player_ids:
            return DisciplineResponse(
                muagiai=muagiai,
                leaderboard=[],
                generated_at=datetime.utcnow()
            )
        
        # Get player names
        players_stmt = select(CauThu).where(CauThu.macauthu.in_(list(all_player_ids)))
        players_map = {p.macauthu: p.tencauthu for p in session.exec(players_stmt).all()}
        
        # Get club names
        club_names: dict[str, str] = {}
        club_ids = {maclb for maclb in player_clubs.values() if maclb}
        if club_ids:
            clubs_stmt = select(CauLacBo.maclb, CauLacBo.tenclb).where(
                CauLacBo.muagiai == muagiai,
                CauLacBo.maclb.in_(list(club_ids)),
            )
            club_names = {maclb: tenclb for maclb, tenclb in session.exec(clubs_stmt).all()}
        
        # Get matches played
        matches_played = defaultdict(set)
        # Using separate query might be safer or JOIN
        lineup_stmt = select(
            DoiHinhXuatPhat.macauthu,
            DoiHinhXuatPhat.matran
        ).where(DoiHinhXuatPhat.matran.in_(match_ids))
        
        for macauthu, matran in session.exec(lineup_stmt).all():
            if macauthu in all_player_ids:
                matches_played[macauthu].add(matran)
        
        # Build discipline rows
        discipline_rows = []
        for macauthu in all_player_ids:
            yellows = total_yellows[macauthu]
            second_yellows = second_yellows_count[macauthu]
            reds = total_reds[macauthu]
            
            discipline_points = yellows + second_yellows + (reds * 3)
            
            maclb = player_clubs.get(macauthu)
            
            discipline_rows.append({
                "macauthu": macauthu,
                "tencauthu": players_map.get(macauthu, "Unknown"),
                "maclb": maclb,
                "tenclb": club_names.get(maclb) if maclb else None,
                "matches_played": len(matches_played[macauthu]),
                "yellow_cards": yellows,
                "second_yellows": second_yellows,
                "red_cards": reds,
                "discipline_points": discipline_points
            })
        
        # Sort
        discipline_rows.sort(
            key=lambda x: (-x["discipline_points"], -x["red_cards"], -x["yellow_cards"], x["tencauthu"])
        )
        
        # Assign ranks
        leaderboard = []
        current_rank = 1
        prev_points = None
        cutoff_points = None
        
        if len(discipline_rows) > limit:
            cutoff_points = discipline_rows[limit - 1]["discipline_points"]
        
        for idx, row in enumerate(discipline_rows):
            if prev_points is not None and row["discipline_points"] < prev_points:
                current_rank = idx + 1
            
            if idx < limit or (cutoff_points is not None and row["discipline_points"] >= cutoff_points):
                leaderboard.append(DisciplineRow(
                    macauthu=row["macauthu"],
                    tencauthu=row["tencauthu"],
                    maclb=row["maclb"],
                    tenclb=row["tenclb"],
                    matches_played=row["matches_played"],
                    yellow_cards=row["yellow_cards"],
                    second_yellows=row["second_yellows"],
                    red_cards=row["red_cards"],
                    discipline_points=row["discipline_points"],
                    rank=current_rank
                ))
            else:
                break
            prev_points = row["discipline_points"]
        
        return DisciplineResponse(
            muagiai=muagiai,
            leaderboard=leaderboard,
            generated_at=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Error computing discipline: {str(e)}")
        traceback.print_exc()
        return DisciplineResponse(
            muagiai=muagiai,
            leaderboard=[],
            generated_at=datetime.utcnow()
        )

