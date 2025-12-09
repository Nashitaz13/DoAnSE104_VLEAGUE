"""
Players Router - Cầu thủ
"""

from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.db.models import CauThu, DoiBong, LoaiCauThu, QuyDinh, TaiKhoan
from app.api.schemas import PlayerCreate, PlayerResponse
from app.api.routers.auth import get_admin_user

router = APIRouter(prefix="/players", tags=["Players"])


async def validate_player_rules(
    player_data: PlayerCreate,
    team: DoiBong
) -> None:
    """
    Validate player against regulations
    """
    # Get regulations
    tuoi_toi_thieu = await QuyDinh.get_or_none(ten_quy_dinh="TuoiToiThieu")
    tuoi_toi_da = await QuyDinh.get_or_none(ten_quy_dinh="TuoiToiDa")
    so_ngoai_binh_toi_da = await QuyDinh.get_or_none(ten_quy_dinh="SoLuongCauThuNuocNgoai")
    so_cau_thu_toi_da = await QuyDinh.get_or_none(ten_quy_dinh="SoCauThuToiDa")
    
    # Calculate age
    today = date.today()
    age = today.year - player_data.ngaySinh.year
    if (today.month, today.day) < (player_data.ngaySinh.month, player_data.ngaySinh.day):
        age -= 1
    
    # Validate age
    if tuoi_toi_thieu and age < tuoi_toi_thieu.gia_tri:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "ERR_RULE_VIOLATION",
                "message": f"Cầu thủ không đủ tuổi quy định (Tối thiểu {tuoi_toi_thieu.gia_tri} tuổi)."
            }
        )
    
    if tuoi_toi_da and age > tuoi_toi_da.gia_tri:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "ERR_RULE_VIOLATION",
                "message": f"Cầu thủ vượt quá tuổi quy định (Tối đa {tuoi_toi_da.gia_tri} tuổi)."
            }
        )
    
    # Check max players in team
    current_players = await CauThu.filter(doi_bong_id=team.ma_doi).count()
    if so_cau_thu_toi_da and current_players >= so_cau_thu_toi_da.gia_tri:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "ERR_RULE_VIOLATION",
                "message": f"Đội đã đủ số lượng cầu thủ tối đa ({so_cau_thu_toi_da.gia_tri})."
            }
        )
    
    # Check foreign player limit
    if player_data.loaiCauThu == "Nước ngoài":
        loai_nuoc_ngoai = await LoaiCauThu.get_or_none(ten_loai="Nước ngoài")
        if loai_nuoc_ngoai:
            foreign_count = await CauThu.filter(
                doi_bong_id=team.ma_doi,
                loai_cau_thu_id=loai_nuoc_ngoai.ma_loai_cau_thu
            ).count()
            
            if so_ngoai_binh_toi_da and foreign_count >= so_ngoai_binh_toi_da.gia_tri:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail={
                        "code": "ERR_RULE_VIOLATION",
                        "message": f"Đội đã đủ số lượng cầu thủ nước ngoài tối đa ({so_ngoai_binh_toi_da.gia_tri})."
                    }
                )


@router.get("", response_model=List[PlayerResponse])
async def search_players(
    keyword: Optional[str] = Query(None, description="Search by player name"),
    teamId: Optional[int] = Query(None, description="Filter by team ID"),
    loaiCauThu: Optional[str] = Query(None, description="Filter by player type")
):
    """
    Tra cứu cầu thủ
    """
    query = CauThu.all().prefetch_related("loai_cau_thu", "doi_bong")
    
    if keyword:
        query = query.filter(ten_cau_thu__icontains=keyword)
    
    if teamId:
        query = query.filter(doi_bong_id=teamId)
    
    if loaiCauThu:
        loai = await LoaiCauThu.get_or_none(ten_loai=loaiCauThu)
        if loai:
            query = query.filter(loai_cau_thu_id=loai.ma_loai_cau_thu)
    
    players = await query.order_by("ten_cau_thu")
    
    return [
        PlayerResponse(
            ma_cau_thu=p.ma_cau_thu,
            ten_cau_thu=p.ten_cau_thu,
            ngay_sinh=p.ngay_sinh,
            loai_cau_thu=p.loai_cau_thu.ten_loai if p.loai_cau_thu else None,
            vi_tri=p.vi_tri,
            so_ao=p.so_ao,
            ma_doi=p.doi_bong_id,
            ten_doi=p.doi_bong.ten_doi if p.doi_bong else None
        )
        for p in players
    ]


@router.post("", response_model=PlayerResponse, status_code=status.HTTP_201_CREATED)
async def create_player(
    data: PlayerCreate,
    admin: TaiKhoan = Depends(get_admin_user)
):
    """
    Thêm cầu thủ mới (Đăng ký hồ sơ)
    Validate quy định: Tuổi, số lượng ngoại binh
    """
    # Check team exists
    team = await DoiBong.get_or_none(ma_doi=data.teamId)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy đội bóng với ID: {data.teamId}"
        )
    
    # Validate regulations
    await validate_player_rules(data, team)
    
    # Get or validate player type
    loai_cau_thu = await LoaiCauThu.get_or_none(ten_loai=data.loaiCauThu)
    if not loai_cau_thu:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Loại cầu thủ không hợp lệ: {data.loaiCauThu}"
        )
    
    # Check jersey number uniqueness
    if data.soAo:
        existing = await CauThu.filter(
            doi_bong_id=data.teamId,
            so_ao=data.soAo
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Số áo {data.soAo} đã được sử dụng trong đội"
            )
    
    # Create player
    player = await CauThu.create(
        ten_cau_thu=data.tenCauThu,
        ngay_sinh=data.ngaySinh,
        loai_cau_thu=loai_cau_thu,
        vi_tri=data.viTri,
        so_ao=data.soAo,
        doi_bong=team
    )
    
    return PlayerResponse(
        ma_cau_thu=player.ma_cau_thu,
        ten_cau_thu=player.ten_cau_thu,
        ngay_sinh=player.ngay_sinh,
        loai_cau_thu=loai_cau_thu.ten_loai,
        vi_tri=player.vi_tri,
        so_ao=player.so_ao,
        ma_doi=team.ma_doi,
        ten_doi=team.ten_doi
    )


@router.get("/{player_id}", response_model=PlayerResponse)
async def get_player(player_id: int):
    """
    Lấy thông tin chi tiết cầu thủ
    """
    player = await CauThu.get_or_none(ma_cau_thu=player_id).prefetch_related(
        "loai_cau_thu", "doi_bong"
    )
    
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy cầu thủ với ID: {player_id}"
        )
    
    return PlayerResponse(
        ma_cau_thu=player.ma_cau_thu,
        ten_cau_thu=player.ten_cau_thu,
        ngay_sinh=player.ngay_sinh,
        loai_cau_thu=player.loai_cau_thu.ten_loai if player.loai_cau_thu else None,
        vi_tri=player.vi_tri,
        so_ao=player.so_ao,
        ma_doi=player.doi_bong_id,
        ten_doi=player.doi_bong.ten_doi if player.doi_bong else None
    )
