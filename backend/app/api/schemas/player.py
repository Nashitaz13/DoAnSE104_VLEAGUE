"""
Player Schemas - Cầu thủ
"""

from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class PlayerCreate(BaseModel):
    """Create player request"""
    teamId: int = Field(..., example=1)
    tenCauThu: str = Field(..., example="Nguyen Van A")
    ngaySinh: date = Field(..., example="2000-05-20")
    loaiCauThu: str = Field(..., example="Trong nước")
    viTri: Optional[str] = Field(None, example="Tiền đạo")
    soAo: Optional[int] = Field(None, example=10)


class PlayerResponse(BaseModel):
    """Player response"""
    ma_cau_thu: int
    ten_cau_thu: str
    ngay_sinh: date
    loai_cau_thu: str
    vi_tri: Optional[str] = None
    so_ao: Optional[int] = None
    ma_doi: int
    ten_doi: Optional[str] = None

    class Config:
        from_attributes = True


class PlayerSearchParams(BaseModel):
    """Player search parameters"""
    keyword: Optional[str] = None
    team_id: Optional[int] = None
    loai_cau_thu: Optional[str] = None
