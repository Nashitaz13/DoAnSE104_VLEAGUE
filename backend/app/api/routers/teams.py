"""
Teams Router - Đội bóng
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.db.models import DoiBong, San, MuaGiai, CauThu, BangXepHang, TaiKhoan
from app.api.schemas import (
    TeamCreate, TeamUpdate, TeamResponse, TeamWithPlayersResponse,
    StadiumResponse, PlayerResponse
)
from app.api.routers.auth import get_admin_user

router = APIRouter(prefix="/teams", tags=["Teams"])


@router.get("", response_model=List[TeamWithPlayersResponse])
async def get_teams(
    seasonId: Optional[int] = Query(None, description="Filter by season ID")
):
    """
    Lấy danh sách đội bóng
    """
    query = DoiBong.all().prefetch_related("san", "cau_thu")
    
    if seasonId:
        query = query.filter(mua_giai_id=seasonId)
    
    teams = await query.order_by("ten_doi")
    
    result = []
    for team in teams:
        san_response = None
        if team.san:
            san_response = StadiumResponse(
                ma_san=team.san.ma_san,
                ten_san=team.san.ten_san,
                dia_chi=team.san.dia_chi,
                suc_chua=team.san.suc_chua
            )
        
        result.append(TeamWithPlayersResponse(
            ma_doi=team.ma_doi,
            ten_doi=team.ten_doi,
            san=san_response,
            ma_mua_giai=team.mua_giai_id,
            so_cau_thu=len(team.cau_thu) if hasattr(team, 'cau_thu') else 0
        ))
    
    return result


@router.post("", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    data: TeamCreate,
    admin: TaiKhoan = Depends(get_admin_user)
):
    """
    Đăng ký đội bóng vào mùa giải (Chỉ Admin/BTC)
    """
    # Check season exists
    season = await MuaGiai.get_or_none(ma_mua_giai=data.seasonId)
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy mùa giải với ID: {data.seasonId}"
        )
    
    # Check if team name already exists in this season
    existing = await DoiBong.filter(ten_doi=data.tenDoi, mua_giai_id=data.seasonId).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Đội bóng '{data.tenDoi}' đã tồn tại trong mùa giải này"
        )
    
    # Create or get stadium
    stadium = await San.get_or_none(ten_san=data.tenSan)
    if not stadium:
        stadium = await San.create(ten_san=data.tenSan)
    
    # Create team
    team = await DoiBong.create(
        ten_doi=data.tenDoi,
        san=stadium,
        mua_giai=season
    )
    
    # Initialize standings for this team
    await BangXepHang.create(
        mua_giai=season,
        doi_bong=team
    )
    
    return TeamResponse(
        ma_doi=team.ma_doi,
        ten_doi=team.ten_doi,
        san=StadiumResponse(
            ma_san=stadium.ma_san,
            ten_san=stadium.ten_san,
            dia_chi=stadium.dia_chi,
            suc_chua=stadium.suc_chua
        ),
        ma_mua_giai=team.mua_giai_id
    )


@router.put("/{team_id}", response_model=TeamResponse)
async def update_team(
    team_id: int,
    data: TeamUpdate,
    admin: TaiKhoan = Depends(get_admin_user)
):
    """
    Cập nhật thông tin đội bóng (Chỉ Admin/BTC)
    """
    team = await DoiBong.get_or_none(ma_doi=team_id).prefetch_related("san")
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy đội bóng với ID: {team_id}"
        )
    
    if data.tenSan:
        # Create or get stadium
        stadium = await San.get_or_none(ten_san=data.tenSan)
        if not stadium:
            stadium = await San.create(ten_san=data.tenSan)
        team.san = stadium
        await team.save()
    
    await team.fetch_related("san")
    
    san_response = None
    if team.san:
        san_response = StadiumResponse(
            ma_san=team.san.ma_san,
            ten_san=team.san.ten_san,
            dia_chi=team.san.dia_chi,
            suc_chua=team.san.suc_chua
        )
    
    return TeamResponse(
        ma_doi=team.ma_doi,
        ten_doi=team.ten_doi,
        san=san_response,
        ma_mua_giai=team.mua_giai_id
    )


@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(team_id: int):
    """
    Lấy thông tin chi tiết đội bóng
    """
    team = await DoiBong.get_or_none(ma_doi=team_id).prefetch_related("san")
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy đội bóng với ID: {team_id}"
        )
    
    san_response = None
    if team.san:
        san_response = StadiumResponse(
            ma_san=team.san.ma_san,
            ten_san=team.san.ten_san,
            dia_chi=team.san.dia_chi,
            suc_chua=team.san.suc_chua
        )
    
    return TeamResponse(
        ma_doi=team.ma_doi,
        ten_doi=team.ten_doi,
        san=san_response,
        ma_mua_giai=team.mua_giai_id
    )


@router.get("/{team_id}/players", response_model=List[PlayerResponse])
async def get_team_players(team_id: int):
    """
    Lấy danh sách cầu thủ của đội
    """
    team = await DoiBong.get_or_none(ma_doi=team_id)
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy đội bóng với ID: {team_id}"
        )
    
    players = await CauThu.filter(doi_bong_id=team_id).prefetch_related("loai_cau_thu", "doi_bong")
    
    return [
        PlayerResponse(
            ma_cau_thu=p.ma_cau_thu,
            ten_cau_thu=p.ten_cau_thu,
            ngay_sinh=p.ngay_sinh,
            loai_cau_thu=p.loai_cau_thu.ten_loai if p.loai_cau_thu else None,
            vi_tri=p.vi_tri,
            so_ao=p.so_ao,
            ma_doi=p.doi_bong_id,
            ten_doi=team.ten_doi
        )
        for p in players
    ]
