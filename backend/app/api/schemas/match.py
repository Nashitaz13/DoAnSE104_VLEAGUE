"""
Match Schemas - Trận đấu
"""

from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field


class MatchScheduleUpdate(BaseModel):
    """Update match schedule"""
    ngayThiDau: datetime = Field(..., example="2025-02-15T18:00:00")
    sanThiDau: Optional[str] = Field(None, example="San Hang Day")


class MatchResultUpdate(BaseModel):
    """Update match result"""
    soBanThangDoiNha: int = Field(..., example=2)
    soBanThangDoiKhach: int = Field(..., example=1)
    status: str = Field(default="Finished", example="Finished")


class MatchEventCreate(BaseModel):
    """Create match event (goal or card)"""
    playerId: int = Field(..., example=1)
    teamId: int = Field(..., example=1)
    loaiSuKien: str = Field(..., example="Goal")  # Goal, YellowCard, RedCard
    thoiDiem: int = Field(..., example=45)
    loaiBanThang: Optional[str] = Field(None, example="A")  # Only for goals


class MatchEventResponse(BaseModel):
    """Match event response"""
    id: int
    player_name: str
    team_name: str
    loai_su_kien: str
    thoi_diem: int
    loai_ban_thang: Optional[str] = None


class MatchResponse(BaseModel):
    """Match response"""
    ma_tran_dau: int
    vong_dau: Optional[str] = None
    doi_nha: str
    doi_khach: str
    san: Optional[str] = None
    ngay_thi_dau: Optional[datetime] = None
    trang_thai: str
    so_ban_thang_doi_nha: int
    so_ban_thang_doi_khach: int

    class Config:
        from_attributes = True


class MatchDetailResponse(MatchResponse):
    """Match detail with events"""
    events: List[MatchEventResponse] = []
