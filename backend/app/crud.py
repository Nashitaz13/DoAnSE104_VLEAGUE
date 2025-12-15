from sqlmodel import Session, select
from typing import Optional
from datetime import datetime

from app.core.security import get_password_hash, verify_password
from app.models import (
    TaiKhoan, NhomNguoiDung,
    MuaGiai, MuaGiaiCreate, MuaGiaiUpdate,
    LoaiCauThu, LoaiCauThuCreate, LoaiCauThuUpdate,
    SanVanDong, SanVanDongCreate, SanVanDongUpdate,
    CauLacBo, CauLacBoCreate, CauLacBoUpdate,
    CauThu, CauThuCreate, CauThuUpdate,
    ChiTietDoiBong, ChiTietDoiBongCreate,
    ViTriThiDau
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


def authenticate(*, session: Session, username: str, password: str) -> Optional[TaiKhoan]:
    """
    Authenticate user with username and password
    Returns TaiKhoan if credentials are valid, None otherwise
    """
    user = get_user_by_username(session=session, username=username)
    if not user:
        return None
    if not verify_password(password, user.matkhau):
        return None
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
    # Validate position if provided
    if player_in.vitrithidau and player_in.vitrithidau not in ViTriThiDau.all_positions():
        raise ValueError(
            f"Invalid position '{player_in.vitrithidau}'. "
            f"Must be one of: {', '.join(ViTriThiDau.all_positions())}"
        )
    
    player = CauThu.model_validate(player_in)
    session.add(player)
    session.commit()
    session.refresh(player)
    return player


def update_player(
    *, session: Session, db_player: CauThu, player_in: CauThuUpdate
) -> CauThu:
    """Update existing player"""
    update_data = player_in.model_dump(exclude_unset=True)
    
    # Validate position if being updated
    if 'vitrithidau' in update_data and update_data['vitrithidau']:
        if update_data['vitrithidau'] not in ViTriThiDau.all_positions():
            raise ValueError(
                f"Invalid position '{update_data['vitrithidau']}'. "
                f"Must be one of: {', '.join(ViTriThiDau.all_positions())}"
            )
    
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
    
    Assumes foreign players have quoctich != "Việt Nam"
    Gets quota from LoaiCauThu where tenloaicauthu contains "ngoại binh" or similar
    """
    # Only check if player is foreign
    if not new_player_nationality or new_player_nationality == "Việt Nam":
        return
    
    # Get current foreign players in roster
    current_roster = get_roster(session=session, maclb=maclb, muagiai=muagiai)
    foreign_count = 0
    
    for entry in current_roster:
        player = get_player_by_id(session=session, macauthu=entry.macauthu)
        if player and player.quoctich and player.quoctich != "Việt Nam":
            foreign_count += 1
    
    # Get foreign player quota from LoaiCauThu
    # Look for player type with "nước ngoài" or "ngoại" in name for this season
    statement = select(LoaiCauThu).where(
        LoaiCauThu.muagiai == muagiai,
        LoaiCauThu.tenloaicauthu.ilike("%ngo%")
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
    current_roster = get_roster(session=session, maclb=maclb, muagiai=muagiai)
    goalkeeper_count = 0
    
    for entry in current_roster:
        player = get_player_by_id(session=session, macauthu=entry.macauthu)
        if player and player.vitrithidau == ViTriThiDau.THU_MON:
            goalkeeper_count += 1
    
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
