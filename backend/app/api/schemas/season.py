"""
Season Schemas - Mùa giải
"""

from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class SeasonCreate(BaseModel):
    """Create season request"""
    tenMuaGiai: str = Field(..., example="V-League 2025")
    ngayBatDau: date = Field(..., example="2025-01-01")
    ngayKetThuc: date = Field(..., example="2025-12-31")


class SeasonStatusUpdate(BaseModel):
    """Update season status"""
    status: str = Field(..., example="Finished")


class SeasonResponse(BaseModel):
    """Season response"""
    ma_mua_giai: int
    ten_mua_giai: str
    ngay_bat_dau: date
    ngay_ket_thuc: date
    trang_thai: str

    class Config:
        from_attributes = True
