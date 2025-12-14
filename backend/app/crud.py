from sqlmodel import Session, select
from typing import Optional
from datetime import datetime

from app.core.security import get_password_hash, verify_password
from app.models import (
    TaiKhoan, NhomNguoiDung,
    MuaGiai, MuaGiaiCreate, MuaGiaiUpdate,
    LoaiCauThu, LoaiCauThuCreate, LoaiCauThuUpdate,
    SanVanDong, SanVanDongCreate, SanVanDongUpdate,
    CauLacBo, CauLacBoCreate, CauLacBoUpdate
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
