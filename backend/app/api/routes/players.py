from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app import crud
from app.api.deps import SessionDep, require_role, CurrentUserVLeague
from app.models import CauThuPublic, CauThuCreate, CauThuUpdate, Message, TaiKhoan

router = APIRouter()


# Same mapping as rosters.py for username->club heuristic
# Username (lowercase) -> list of patterns to match against club ID (lowercase)
USERNAME_CLUB_MAPPING = {
    "hanoi": ["hanoi", "hn", "clb_hanoi", "ha_noi"],
    "viettel": ["viettel", "thecong", "clb_viettel"],
    "hcmc": ["tphcm", "hcm", "hcmc", "clb_hcmc", "clb_tphcm"],
    "binhdinh": ["binhdinh", "binh_dinh", "clb_binhdinh", "clb_binh_dinh"],
    "slna": ["slna", "songlamnghe", "clb_slna"],
    "hagl": ["hagl", "gialai", "gia_lai", "clb_hagl"],
    "namdinh": ["namdinh", "nam_dinh", "clb_namdinh"],
    "haiphong": ["haiphong", "hai_phong", "clb_haiphong"],
    "thanhhoa": ["thanhhoa", "thanh_hoa", "clb_thanhhoa"],
    "quangninh": ["quangninh", "quang_ninh", "clb_quangninh"],
    "binhduong": ["binhduong", "binh_duong", "clb_binhduong"],
}


def _user_owns_club(username: str, maclb: str) -> bool:
    """Check if username matches club ID using heuristic"""
    username_lower = username.lower().strip()
    club_id_lower = maclb.lower().strip()
    
    # Direct match
    if club_id_lower == username_lower:
        return True
    
    # Remove common prefix like "clb_" or "clb-" or "clb"
    club_id_normalized = club_id_lower
    for prefix in ["clb_", "clb-", "clb"]:
        if club_id_normalized.startswith(prefix):
            club_id_normalized = club_id_normalized[len(prefix):]
            break
    
    # Match after removing prefix: "hanoi" matches "clb_hanoi"
    if club_id_normalized == username_lower:
        return True
    
    # Also try removing underscores: "binhdinh" matches "binh_dinh"
    if club_id_normalized.replace("_", "") == username_lower.replace("_", ""):
        return True
    
    # Check mapping patterns
    if username_lower in USERNAME_CLUB_MAPPING:
        patterns = USERNAME_CLUB_MAPPING[username_lower]
        for pattern in patterns:
            # Exact match with club_id_lower or normalized
            if pattern == club_id_lower or pattern == club_id_normalized:
                return True
            # Pattern contained in club_id
            if pattern in club_id_lower:
                return True
    
    return False


def _check_player_in_user_roster(session, current_user: TaiKhoan, player_id: str) -> bool:
    """Check if player is in any roster managed by QuanLyDoi user"""
    # Get all rosters this player is in
    from sqlmodel import select
    from app.models import ChiTietDoiBong
    
    stmt = select(ChiTietDoiBong).where(ChiTietDoiBong.macauthu == player_id)
    roster_entries = session.exec(stmt).all()
    
    username = current_user.tendangnhap
    for entry in roster_entries:
        if _user_owns_club(username, entry.maclb):
            return True
    return False


@router.get("/", response_model=list[CauThuPublic])
def get_players(
    session: SessionDep,
    current_user: CurrentUserVLeague,  # Auth required
    keyword: Optional[str] = Query(None, description="Search by player name"),
    quoctich: Optional[str] = Query(None, description="Filter by nationality (e.g., 'VN')"),
    vitrithidau: Optional[str] = Query(None, description="Filter by position (GK, DF, MF, FW)"),
    skip: int = 0,
    limit: int = 100
) -> list[CauThuPublic]:
    """
    Get all players with optional filters
    
    **Authentication required** - Any authenticated user can view players
    
    **Query Parameters:**
    - keyword: Search in player name (case-insensitive)
    - quoctich: Filter by nationality
    - vitrithidau: Filter by position (GK, DF, MF, FW)
    """
    players = crud.get_players(
        session=session,
        keyword=keyword,
        quoctich=quoctich,
        vitrithidau=vitrithidau,
        skip=skip,
        limit=limit
    )
    return players


@router.get("/{player_id}", response_model=CauThuPublic)
def get_player(
    session: SessionDep,
    current_user: CurrentUserVLeague,  # Auth required
    player_id: str
) -> CauThuPublic:
    """
    Get player by ID
    
    **Authentication required** - Any authenticated user can view player details
    """
    player = crud.get_player_by_id(session=session, macauthu=player_id)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player {player_id} not found"
        )
    return player


@router.post("/", response_model=CauThuPublic, status_code=status.HTTP_201_CREATED)
def create_player(
    session: SessionDep,
    player_in: CauThuCreate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))]
) -> CauThuPublic:
    """
    Create new player
    
    **Requires BTC role** - Only Ban Tổ Chức can create players
    
    Player fields:
    - macauthu: Unique player ID (e.g., "CT001")
    - tencauthu: Full name
    - ngaysinh: Date of birth
    - quoctich: Nationality ("VN" for Vietnamese)
    - vitrithidau: Position (GK, DF, MF, FW)
    - chieucao: Height in cm
    - cannang: Weight in kg
    """
    # Check if player already exists
    existing = crud.get_player_by_id(session=session, macauthu=player_in.macauthu)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Player {player_in.macauthu} already exists"
        )
    
    try:
        return crud.create_player(session=session, player_in=player_in)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.patch("/{player_id}", response_model=CauThuPublic)
def update_player(
    session: SessionDep,
    player_id: str,
    player_in: CauThuUpdate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC", "QuanLyDoi", "CLB"))]
) -> CauThuPublic:
    """
    Partially update player information (PATCH)
    
    **Requires BTC, QuanLyDoi or CLB role**
    - BTC can update any player
    - QuanLyDoi/CLB can only update players in their own club's roster
    
    **PATCH semantics:** Only fields provided in request body will be updated.
    Omitted fields remain unchanged. Empty body ({}) returns 200 with no changes.
    
    **Restrictions:**
    - Cannot change player ID (macauthu) - must delete and recreate
    
    **Example:**
    ```json
    {"quoctich": "BR", "chieucao": 180.0}
    ```
    Only nationality and height will be updated.
    """
    player = crud.get_player_by_id(session=session, macauthu=player_id)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player {player_id} not found"
        )
    
    # Check ownership for QuanLyDoi/CLB - they can only update players in their roster
    user_role = current_user.nhom.tennhom if current_user.nhom else None
    if user_role in ("QuanLyDoi", "CLB"):
        if not _check_player_in_user_roster(session, current_user, player_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update players in your own club's roster"
            )
    
    try:
        return crud.update_player(session=session, db_player=player, player_in=player_in)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{player_id}", response_model=Message)
def delete_player(
    session: SessionDep,
    player_id: str,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))]
) -> Message:
    """
    Delete player
    
    **Requires BTC role** - Only Ban Tổ Chức can delete players
    
    **Warning:** This will also remove player from all rosters (cascade delete)
    """
    player = crud.get_player_by_id(session=session, macauthu=player_id)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player {player_id} not found"
        )
    
    success = crud.delete_player(session=session, macauthu=player_id)
    if success:
        return Message(message=f"Player {player_id} deleted successfully")
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete player"
        )
