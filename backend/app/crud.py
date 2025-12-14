from sqlmodel import Session, select
from typing import Optional
from datetime import datetime

from app.core.security import get_password_hash, verify_password
from app.models import (
    TaiKhoan, NhomNguoiDung,
    QuyDinh, QuyDinhCreate, QuyDinhUpdate,
    MuaGiai, MuaGiaiCreate, MuaGiaiUpdate
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
# REGULATIONS CRUD
# =============================================

def get_regulations(*, session: Session, skip: int = 0, limit: int = 100) -> list[QuyDinh]:
    """Get all regulations with pagination"""
    statement = select(QuyDinh).offset(skip).limit(limit)
    return list(session.exec(statement).all())


def get_regulation_by_id(*, session: Session, id: int) -> Optional[QuyDinh]:
    """Get regulation by ID"""
    return session.get(QuyDinh, id)


def create_regulation(*, session: Session, regulation_in: QuyDinhCreate) -> QuyDinh:
    """Create new regulation"""
    regulation = QuyDinh.model_validate(regulation_in)
    session.add(regulation)
    session.commit()
    session.refresh(regulation)
    return regulation


def update_regulation(
    *, session: Session, db_regulation: QuyDinh, regulation_in: QuyDinhUpdate
) -> QuyDinh:
    """Update existing regulation"""
    update_data = regulation_in.model_dump(exclude_unset=True)
    db_regulation.sqlmodel_update(update_data)
    db_regulation.updatedat = datetime.utcnow()
    session.add(db_regulation)
    session.commit()
    session.refresh(db_regulation)
    return db_regulation


def delete_regulation(*, session: Session, id: int) -> bool:
    """Delete regulation by ID"""
    regulation = session.get(QuyDinh, id)
    if regulation:
        session.delete(regulation)
        session.commit()
        return True
    return False


# =============================================
# SEASONS CRUD
# =============================================

def get_seasons(
    *, session: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None
) -> list[MuaGiai]:
    """Get all seasons with pagination and optional status filter"""
    statement = select(MuaGiai)
    if status:
        statement = statement.where(MuaGiai.trangthai == status)
    statement = statement.offset(skip).limit(limit)
    return list(session.exec(statement).all())


def get_season_by_id(*, session: Session, id: int) -> Optional[MuaGiai]:
    """Get season by ID"""
    return session.get(MuaGiai, id)


def create_season(*, session: Session, season_in: MuaGiaiCreate) -> MuaGiai:
    """Create new season"""
    season = MuaGiai.model_validate(season_in)
    session.add(season)
    session.commit()
    session.refresh(season)
    return season


def update_season(
    *, session: Session, db_season: MuaGiai, season_in: MuaGiaiUpdate
) -> MuaGiai:
    """Update existing season"""
    update_data = season_in.model_dump(exclude_unset=True)
    db_season.sqlmodel_update(update_data)
    db_season.updatedat = datetime.utcnow()
    session.add(db_season)
    session.commit()
    session.refresh(db_season)
    return db_season


def delete_season(*, session: Session, id: int) -> bool:
    """Delete season by ID"""
    season = session.get(MuaGiai, id)
    if season:
        session.delete(season)
        session.commit()
        return True
    return False
