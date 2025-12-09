"""
Matches Router - Trận đấu và lịch thi đấu
"""

from datetime import datetime
from typing import List, Optional
from itertools import combinations

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.db.models import (
    TranDau, DoiBong, San, MuaGiai, BanThang, ThePhat, 
    CauThu, LoaiBanThang, TaiKhoan
)
from app.db.models.enums import TrangThaiTranDauEnum, LoaiTheEnum
from app.api.schemas import (
    MatchResponse, MatchDetailResponse, MatchScheduleUpdate,
    MatchResultUpdate, MatchEventCreate, MatchEventResponse
)
from app.api.routers.auth import get_admin_user
from app.services.standings_service import update_standings_after_match

router = APIRouter(prefix="/matches", tags=["Matches"])


@router.get("", response_model=List[MatchResponse])
async def get_matches(
    seasonId: Optional[int] = Query(None, description="Filter by season ID"),
    round: Optional[str] = Query(None, description="Filter by round (Vong 1, Vong 2...)"),
    teamId: Optional[int] = Query(None, description="Filter by team ID"),
    status: Optional[str] = Query(None, description="Filter by status: Scheduled, Finished")
):
    """
    Lấy danh sách trận đấu (Lịch thi đấu)
    """
    query = TranDau.all().prefetch_related("doi_nha", "doi_khach", "san")
    
    if seasonId:
        query = query.filter(mua_giai_id=seasonId)
    
    if round:
        query = query.filter(vong_dau=round)
    
    if teamId:
        query = query.filter(doi_nha_id=teamId) | query.filter(doi_khach_id=teamId)
    
    if status:
        try:
            status_enum = TrangThaiTranDauEnum(status)
            query = query.filter(trang_thai=status_enum)
        except ValueError:
            pass
    
    matches = await query.order_by("ngay_thi_dau")
    
    return [
        MatchResponse(
            ma_tran_dau=m.ma_tran_dau,
            vong_dau=m.vong_dau,
            doi_nha=m.doi_nha.ten_doi if m.doi_nha else "",
            doi_khach=m.doi_khach.ten_doi if m.doi_khach else "",
            san=m.san.ten_san if m.san else None,
            ngay_thi_dau=m.ngay_thi_dau,
            trang_thai=m.trang_thai.value,
            so_ban_thang_doi_nha=m.so_ban_thang_doi_nha,
            so_ban_thang_doi_khach=m.so_ban_thang_doi_khach
        )
        for m in matches
    ]


@router.put("/{match_id}/schedule", response_model=MatchResponse)
async def update_match_schedule(
    match_id: int,
    data: MatchScheduleUpdate,
    admin: TaiKhoan = Depends(get_admin_user)
):
    """
    Cập nhật thời gian/địa điểm trận đấu
    """
    match = await TranDau.get_or_none(ma_tran_dau=match_id).prefetch_related(
        "doi_nha", "doi_khach", "san"
    )
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy trận đấu với ID: {match_id}"
        )
    
    match.ngay_thi_dau = data.ngayThiDau
    
    if data.sanThiDau:
        stadium = await San.get_or_none(ten_san=data.sanThiDau)
        if not stadium:
            stadium = await San.create(ten_san=data.sanThiDau)
        match.san = stadium
    
    await match.save()
    await match.fetch_related("doi_nha", "doi_khach", "san")
    
    return MatchResponse(
        ma_tran_dau=match.ma_tran_dau,
        vong_dau=match.vong_dau,
        doi_nha=match.doi_nha.ten_doi if match.doi_nha else "",
        doi_khach=match.doi_khach.ten_doi if match.doi_khach else "",
        san=match.san.ten_san if match.san else None,
        ngay_thi_dau=match.ngay_thi_dau,
        trang_thai=match.trang_thai.value,
        so_ban_thang_doi_nha=match.so_ban_thang_doi_nha,
        so_ban_thang_doi_khach=match.so_ban_thang_doi_khach
    )


@router.put("/{match_id}/result", response_model=MatchResponse)
async def update_match_result(
    match_id: int,
    data: MatchResultUpdate,
    admin: TaiKhoan = Depends(get_admin_user)
):
    """
    Cập nhật kết quả chung cuộc
    """
    match = await TranDau.get_or_none(ma_tran_dau=match_id).prefetch_related(
        "doi_nha", "doi_khach", "san", "mua_giai"
    )
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy trận đấu với ID: {match_id}"
        )
    
    match.so_ban_thang_doi_nha = data.soBanThangDoiNha
    match.so_ban_thang_doi_khach = data.soBanThangDoiKhach
    
    try:
        match.trang_thai = TrangThaiTranDauEnum(data.status)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trạng thái không hợp lệ: {data.status}"
        )
    
    await match.save()
    
    # Update standings if match is finished
    if match.trang_thai == TrangThaiTranDauEnum.FINISHED:
        await update_standings_after_match(match)
    
    await match.fetch_related("doi_nha", "doi_khach", "san")
    
    return MatchResponse(
        ma_tran_dau=match.ma_tran_dau,
        vong_dau=match.vong_dau,
        doi_nha=match.doi_nha.ten_doi if match.doi_nha else "",
        doi_khach=match.doi_khach.ten_doi if match.doi_khach else "",
        san=match.san.ten_san if match.san else None,
        ngay_thi_dau=match.ngay_thi_dau,
        trang_thai=match.trang_thai.value,
        so_ban_thang_doi_nha=match.so_ban_thang_doi_nha,
        so_ban_thang_doi_khach=match.so_ban_thang_doi_khach
    )


@router.post("/{match_id}/events", response_model=MatchEventResponse)
async def create_match_event(
    match_id: int,
    data: MatchEventCreate,
    admin: TaiKhoan = Depends(get_admin_user)
):
    """
    Ghi nhận chi tiết trận đấu (Bàn thắng, Thẻ phạt)
    """
    match = await TranDau.get_or_none(ma_tran_dau=match_id)
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy trận đấu với ID: {match_id}"
        )
    
    player = await CauThu.get_or_none(ma_cau_thu=data.playerId)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy cầu thủ với ID: {data.playerId}"
        )
    
    team = await DoiBong.get_or_none(ma_doi=data.teamId)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy đội bóng với ID: {data.teamId}"
        )
    
    event_id = 0
    loai_su_kien = data.loaiSuKien
    loai_ban_thang_str = None
    
    if data.loaiSuKien == "Goal":
        # Create goal event
        loai_ban_thang = None
        if data.loaiBanThang:
            loai_ban_thang = await LoaiBanThang.get_or_none(ten_loai=data.loaiBanThang)
        
        goal = await BanThang.create(
            tran_dau=match,
            cau_thu=player,
            doi_bong=team,
            thoi_diem=data.thoiDiem,
            loai_ban_thang=loai_ban_thang
        )
        event_id = goal.ma_ban_thang
        loai_ban_thang_str = data.loaiBanThang
        
    elif data.loaiSuKien in ["YellowCard", "RedCard"]:
        # Create card event
        loai_the = LoaiTheEnum.YELLOW if data.loaiSuKien == "YellowCard" else LoaiTheEnum.RED
        
        card = await ThePhat.create(
            tran_dau=match,
            cau_thu=player,
            doi_bong=team,
            thoi_diem=data.thoiDiem,
            loai_the=loai_the
        )
        event_id = card.ma_the_phat
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Loại sự kiện không hợp lệ: {data.loaiSuKien}"
        )
    
    return MatchEventResponse(
        id=event_id,
        player_name=player.ten_cau_thu,
        team_name=team.ten_doi,
        loai_su_kien=loai_su_kien,
        thoi_diem=data.thoiDiem,
        loai_ban_thang=loai_ban_thang_str
    )


@router.get("/{match_id}/events", response_model=List[MatchEventResponse])
async def get_match_events(match_id: int):
    """
    Lấy chi tiết sự kiện trận đấu
    """
    match = await TranDau.get_or_none(ma_tran_dau=match_id)
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy trận đấu với ID: {match_id}"
        )
    
    events = []
    
    # Get goals
    goals = await BanThang.filter(tran_dau_id=match_id).prefetch_related(
        "cau_thu", "doi_bong", "loai_ban_thang"
    )
    for goal in goals:
        events.append(MatchEventResponse(
            id=goal.ma_ban_thang,
            player_name=goal.cau_thu.ten_cau_thu if goal.cau_thu else "",
            team_name=goal.doi_bong.ten_doi if goal.doi_bong else "",
            loai_su_kien="Goal",
            thoi_diem=goal.thoi_diem,
            loai_ban_thang=goal.loai_ban_thang.ten_loai if goal.loai_ban_thang else None
        ))
    
    # Get cards
    cards = await ThePhat.filter(tran_dau_id=match_id).prefetch_related(
        "cau_thu", "doi_bong"
    )
    for card in cards:
        loai_su_kien = "YellowCard" if card.loai_the == LoaiTheEnum.YELLOW else "RedCard"
        events.append(MatchEventResponse(
            id=card.ma_the_phat,
            player_name=card.cau_thu.ten_cau_thu if card.cau_thu else "",
            team_name=card.doi_bong.ten_doi if card.doi_bong else "",
            loai_su_kien=loai_su_kien,
            thoi_diem=card.thoi_diem,
            loai_ban_thang=None
        ))
    
    # Sort by time
    events.sort(key=lambda x: x.thoi_diem)
    
    return events


# Schedule Generation Endpoint
schedule_router = APIRouter(prefix="/seasons", tags=["Schedule"])


@schedule_router.post("/{season_id}/schedule/generate")
async def generate_schedule(
    season_id: int,
    admin: TaiKhoan = Depends(get_admin_user)
):
    """
    Tạo lịch thi đấu tự động (Sinh vòng đấu - Round Robin 2 lượt)
    """
    season = await MuaGiai.get_or_none(ma_mua_giai=season_id)
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy mùa giải với ID: {season_id}"
        )
    
    # Check if schedule already exists
    existing_matches = await TranDau.filter(mua_giai_id=season_id).count()
    if existing_matches > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Lịch thi đấu đã được tạo cho mùa giải này"
        )
    
    # Get all teams in this season
    teams = await DoiBong.filter(mua_giai_id=season_id).prefetch_related("san")
    
    if len(teams) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cần ít nhất 2 đội bóng để tạo lịch thi đấu"
        )
    
    # Generate round-robin schedule (2 legs)
    matches_created = []
    team_list = list(teams)
    n = len(team_list)
    
    # First leg - home
    round_num = 1
    for i in range(n):
        for j in range(i + 1, n):
            home_team = team_list[i]
            away_team = team_list[j]
            
            match = await TranDau.create(
                mua_giai=season,
                vong_dau=f"Vòng {round_num}",
                doi_nha=home_team,
                doi_khach=away_team,
                san=home_team.san,
                trang_thai=TrangThaiTranDauEnum.SCHEDULED
            )
            matches_created.append(match)
            round_num += 1
    
    # Second leg - reverse fixtures
    for i in range(n):
        for j in range(i + 1, n):
            home_team = team_list[j]  # Reversed
            away_team = team_list[i]
            
            match = await TranDau.create(
                mua_giai=season,
                vong_dau=f"Vòng {round_num}",
                doi_nha=home_team,
                doi_khach=away_team,
                san=home_team.san,
                trang_thai=TrangThaiTranDauEnum.SCHEDULED
            )
            matches_created.append(match)
            round_num += 1
    
    return {
        "message": f"Đã tạo {len(matches_created)} trận đấu cho mùa giải",
        "total_matches": len(matches_created),
        "season_id": season_id
    }
