"""
Standings Router - Bảng xếp hạng và thống kê
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from tortoise.functions import Count

from app.db.models import BangXepHang, BanThang, CauThu, DoiBong, MuaGiai
from app.api.schemas import StandingsResponse, TopScorerResponse

router = APIRouter(tags=["Standings & Statistics"])


@router.get("/standings", response_model=List[StandingsResponse])
async def get_standings(
    seasonId: Optional[int] = Query(None, description="Filter by season ID")
):
    """
    Lấy Bảng xếp hạng
    """
    if not seasonId:
        # Get latest active season
        season = await MuaGiai.filter(trang_thai="Active").order_by("-ngay_bat_dau").first()
        if season:
            seasonId = season.ma_mua_giai
        else:
            return []
    
    standings = await BangXepHang.filter(
        mua_giai_id=seasonId
    ).prefetch_related("doi_bong").order_by("-diem", "-hieu_so", "-ban_thang")
    
    result = []
    for rank, s in enumerate(standings, 1):
        result.append(StandingsResponse(
            rank=rank,
            teamName=s.doi_bong.ten_doi if s.doi_bong else "",
            matchesPlayed=s.so_tran,
            won=s.thang,
            draw=s.hoa,
            lost=s.thua,
            goalsFor=s.ban_thang,
            goalsAgainst=s.ban_thua,
            difference=s.hieu_so,
            points=s.diem
        ))
    
    return result


@router.get("/stats/top-scorers", response_model=List[TopScorerResponse])
async def get_top_scorers(
    seasonId: Optional[int] = Query(None, description="Filter by season ID"),
    limit: int = Query(10, description="Number of top scorers to return")
):
    """
    Danh sách Vua phá lưới (Top Scorers)
    """
    if not seasonId:
        # Get latest active season
        season = await MuaGiai.filter(trang_thai="Active").order_by("-ngay_bat_dau").first()
        if season:
            seasonId = season.ma_mua_giai
        else:
            return []
    
    # Get all goals in this season
    goals = await BanThang.filter(
        tran_dau__mua_giai_id=seasonId
    ).prefetch_related("cau_thu", "doi_bong")
    
    # Count goals per player
    player_goals = {}
    for goal in goals:
        if goal.cau_thu:
            player_id = goal.cau_thu.ma_cau_thu
            if player_id not in player_goals:
                player_goals[player_id] = {
                    "player": goal.cau_thu,
                    "team": goal.doi_bong,
                    "goals": 0
                }
            player_goals[player_id]["goals"] += 1
    
    # Sort by goals
    sorted_scorers = sorted(
        player_goals.values(),
        key=lambda x: x["goals"],
        reverse=True
    )[:limit]
    
    result = []
    for rank, scorer in enumerate(sorted_scorers, 1):
        result.append(TopScorerResponse(
            rank=rank,
            playerName=scorer["player"].ten_cau_thu,
            teamName=scorer["team"].ten_doi if scorer["team"] else "",
            goals=scorer["goals"]
        ))
    
    return result
