"""
Seasons Router - Mùa giải
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.db.models import MuaGiai, TaiKhoan
from app.db.models.enums import TrangThaiMuaGiaiEnum
from app.api.schemas import SeasonCreate, SeasonResponse, SeasonStatusUpdate
from app.api.routers.auth import get_admin_user

router = APIRouter(prefix="/seasons", tags=["Seasons"])


@router.get("", response_model=List[SeasonResponse])
async def get_seasons(
    status: Optional[str] = Query(None, description="Filter by status: active, finished, cancelled")
):
    """
    Lấy danh sách mùa giải
    """
    query = MuaGiai.all()
    
    if status:
        try:
            status_enum = TrangThaiMuaGiaiEnum(status.capitalize())
            query = query.filter(trang_thai=status_enum)
        except ValueError:
            pass
    
    seasons = await query.order_by("-ngay_bat_dau")
    
    return [
        SeasonResponse(
            ma_mua_giai=s.ma_mua_giai,
            ten_mua_giai=s.ten_mua_giai,
            ngay_bat_dau=s.ngay_bat_dau,
            ngay_ket_thuc=s.ngay_ket_thuc,
            trang_thai=s.trang_thai.value
        )
        for s in seasons
    ]


@router.post("", response_model=SeasonResponse, status_code=status.HTTP_201_CREATED)
async def create_season(
    data: SeasonCreate,
    admin: TaiKhoan = Depends(get_admin_user)
):
    """
    Tạo mùa giải mới (Chỉ Admin/BTC)
    """
    # Validate dates
    if data.ngayBatDau >= data.ngayKetThuc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ngày kết thúc phải sau ngày bắt đầu"
        )
    
    # Check for overlapping seasons
    existing = await MuaGiai.filter(
        trang_thai=TrangThaiMuaGiaiEnum.ACTIVE
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Đã có mùa giải đang hoạt động: {existing.ten_mua_giai}"
        )
    
    season = await MuaGiai.create(
        ten_mua_giai=data.tenMuaGiai,
        ngay_bat_dau=data.ngayBatDau,
        ngay_ket_thuc=data.ngayKetThuc,
        trang_thai=TrangThaiMuaGiaiEnum.ACTIVE
    )
    
    return SeasonResponse(
        ma_mua_giai=season.ma_mua_giai,
        ten_mua_giai=season.ten_mua_giai,
        ngay_bat_dau=season.ngay_bat_dau,
        ngay_ket_thuc=season.ngay_ket_thuc,
        trang_thai=season.trang_thai.value
    )


@router.patch("/{season_id}/status", response_model=SeasonResponse)
async def update_season_status(
    season_id: int,
    data: SeasonStatusUpdate,
    admin: TaiKhoan = Depends(get_admin_user)
):
    """
    Cập nhật trạng thái mùa giải (Chỉ Admin/BTC)
    """
    season = await MuaGiai.get_or_none(ma_mua_giai=season_id)
    
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy mùa giải với ID: {season_id}"
        )
    
    try:
        new_status = TrangThaiMuaGiaiEnum(data.status)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trạng thái không hợp lệ: {data.status}"
        )
    
    season.trang_thai = new_status
    await season.save()
    
    return SeasonResponse(
        ma_mua_giai=season.ma_mua_giai,
        ten_mua_giai=season.ten_mua_giai,
        ngay_bat_dau=season.ngay_bat_dau,
        ngay_ket_thuc=season.ngay_ket_thuc,
        trang_thai=season.trang_thai.value
    )


@router.get("/{season_id}", response_model=SeasonResponse)
async def get_season(season_id: int):
    """
    Lấy thông tin chi tiết mùa giải
    """
    season = await MuaGiai.get_or_none(ma_mua_giai=season_id)
    
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy mùa giải với ID: {season_id}"
        )
    
    return SeasonResponse(
        ma_mua_giai=season.ma_mua_giai,
        ten_mua_giai=season.ten_mua_giai,
        ngay_bat_dau=season.ngay_bat_dau,
        ngay_ket_thuc=season.ngay_ket_thuc,
        trang_thai=season.trang_thai.value
    )
