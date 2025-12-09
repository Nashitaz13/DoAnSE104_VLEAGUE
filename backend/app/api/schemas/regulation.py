"""
Regulation Schemas - Quy định
"""

from typing import Optional, List

from pydantic import BaseModel, Field


class RegulationBase(BaseModel):
    """Base regulation schema"""
    code: str = Field(..., example="TuoiToiThieu")
    value: int = Field(..., example=16)


class RegulationUpdate(BaseModel):
    """Single regulation update item"""
    code: str
    value: int


class RegulationBulkUpdate(BaseModel):
    """Bulk update regulations"""
    regulations: List[RegulationUpdate]


class RegulationResponse(BaseModel):
    """Regulation response"""
    ma_quy_dinh: int
    ten_quy_dinh: str
    gia_tri: int
    mo_ta: Optional[str] = None

    class Config:
        from_attributes = True
