"""
Standings Service - Tính toán bảng xếp hạng
"""

from app.db.models import BangXepHang, TranDau, QuyDinh, DoiBong
from app.db.models.enums import TrangThaiTranDauEnum


async def get_points_config():
    """Get points configuration from regulations"""
    diem_thang = await QuyDinh.get_or_none(ten_quy_dinh="DiemThang")
    diem_hoa = await QuyDinh.get_or_none(ten_quy_dinh="DiemHoa")
    diem_thua = await QuyDinh.get_or_none(ten_quy_dinh="DiemThua")
    
    return {
        "win": diem_thang.gia_tri if diem_thang else 3,
        "draw": diem_hoa.gia_tri if diem_hoa else 1,
        "loss": diem_thua.gia_tri if diem_thua else 0
    }


async def update_standings_after_match(match: TranDau) -> None:
    """
    Update standings after a match is finished
    """
    if match.trang_thai != TrangThaiTranDauEnum.FINISHED:
        return
    
    points = await get_points_config()
    
    # Get home team standings
    home_standing = await BangXepHang.get_or_none(
        mua_giai_id=match.mua_giai_id,
        doi_bong_id=match.doi_nha_id
    )
    
    # Get away team standings
    away_standing = await BangXepHang.get_or_none(
        mua_giai_id=match.mua_giai_id,
        doi_bong_id=match.doi_khach_id
    )
    
    if not home_standing or not away_standing:
        return
    
    home_goals = match.so_ban_thang_doi_nha
    away_goals = match.so_ban_thang_doi_khach
    
    # Update home team
    home_standing.so_tran += 1
    home_standing.ban_thang += home_goals
    home_standing.ban_thua += away_goals
    
    # Update away team
    away_standing.so_tran += 1
    away_standing.ban_thang += away_goals
    away_standing.ban_thua += home_goals
    
    # Determine winner
    if home_goals > away_goals:
        # Home wins
        home_standing.thang += 1
        home_standing.diem += points["win"]
        away_standing.thua += 1
        away_standing.diem += points["loss"]
    elif away_goals > home_goals:
        # Away wins
        away_standing.thang += 1
        away_standing.diem += points["win"]
        home_standing.thua += 1
        home_standing.diem += points["loss"]
    else:
        # Draw
        home_standing.hoa += 1
        home_standing.diem += points["draw"]
        away_standing.hoa += 1
        away_standing.diem += points["draw"]
    
    # Update goal difference
    home_standing.hieu_so = home_standing.ban_thang - home_standing.ban_thua
    away_standing.hieu_so = away_standing.ban_thang - away_standing.ban_thua
    
    await home_standing.save()
    await away_standing.save()


async def recalculate_standings(season_id: int) -> None:
    """
    Recalculate all standings from scratch for a season
    """
    points = await get_points_config()
    
    # Reset all standings for this season
    standings = await BangXepHang.filter(mua_giai_id=season_id)
    for s in standings:
        s.so_tran = 0
        s.thang = 0
        s.hoa = 0
        s.thua = 0
        s.ban_thang = 0
        s.ban_thua = 0
        s.hieu_so = 0
        s.diem = 0
        await s.save()
    
    # Get all finished matches
    matches = await TranDau.filter(
        mua_giai_id=season_id,
        trang_thai=TrangThaiTranDauEnum.FINISHED
    )
    
    # Process each match
    for match in matches:
        await update_standings_after_match(match)
