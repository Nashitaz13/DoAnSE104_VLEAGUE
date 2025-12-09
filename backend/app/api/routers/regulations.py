"""
Regulations Router - Quy định
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.db.models import QuyDinh, TaiKhoan
from app.api.schemas import RegulationResponse, RegulationUpdate
from app.api.routers.auth import get_current_user, get_admin_user

router = APIRouter(prefix="/regulations", tags=["Regulations"])


@router.get("", response_model=List[RegulationResponse])
async def get_regulations():
    """
    Lấy danh sách tất cả quy định hiện hành
    """
    regulations = await QuyDinh.all()
    return [
        RegulationResponse(
            ma_quy_dinh=r.ma_quy_dinh,
            ten_quy_dinh=r.ten_quy_dinh,
            gia_tri=r.gia_tri,
            mo_ta=r.mo_ta
        )
        for r in regulations
    ]


@router.put("", response_model=List[RegulationResponse])
async def update_regulations(
    updates: List[RegulationUpdate],
    admin: TaiKhoan = Depends(get_admin_user)
):
    """
    Cập nhật quy định (Chỉ Admin/BTC)
    """
    updated = []
    
    for update in updates:
        regulation = await QuyDinh.get_or_none(ten_quy_dinh=update.code)
        if not regulation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Regulation '{update.code}' not found"
            )
        
        regulation.gia_tri = update.value
        await regulation.save()
        
        updated.append(RegulationResponse(
            ma_quy_dinh=regulation.ma_quy_dinh,
            ten_quy_dinh=regulation.ten_quy_dinh,
            gia_tri=regulation.gia_tri,
            mo_ta=regulation.mo_ta
        ))
    
    return updated
