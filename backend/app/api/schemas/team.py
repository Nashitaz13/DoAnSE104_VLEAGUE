"""
Team Schemas - Đội bóng
"""

from typing import Optional

from pydantic import BaseModel, Field


class StadiumResponse(BaseModel):
    """Stadium info"""
    ma_san: int
    ten_san: str
    dia_chi: Optional[str] = None
    suc_chua: Optional[int] = None

    class Config:
        from_attributes = True


class TeamCreate(BaseModel):
    """Create team request"""
    tenDoi: str = Field(..., example="Ha Noi FC")
    tenSan: str = Field(..., example="San Hang Day")
    seasonId: int = Field(..., example=1)


class TeamUpdate(BaseModel):
    """Update team request"""
    tenSan: Optional[str] = Field(None, example="San My Dinh")


class TeamResponse(BaseModel):
    """Team response with stadium"""
    ma_doi: int
    ten_doi: str
    san: Optional[StadiumResponse] = None
    ma_mua_giai: int

    class Config:
        from_attributes = True


class TeamWithPlayersResponse(TeamResponse):
    """Team with player count"""
    so_cau_thu: int = 0
