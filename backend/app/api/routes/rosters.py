from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
import uuid
from datetime import datetime

from app import crud
from app.api.deps import SessionDep, require_role, CurrentUserVLeague
from app.models import (
    ChiTietDoiBongPublic, ChiTietDoiBongCreate, ChiTietDoiBongUpdate,
    RosterPlayerDetail, RosterValidationResult, Message, TaiKhoan,
    RegisterPlayerRequest, RegisterPlayerResponse, CauThuCreate
)

router = APIRouter()


# =============================================
# USERNAME -> CLUB HEURISTIC MAPPING
# =============================================
# TODO (Technical Debt): Replace with proper DB mapping (user -> club)
# Currently using heuristic based on username patterns
# Proper solution: Add maclb field to TaiKhoan or create QuanLyDoiClub table
USERNAME_CLUB_MAPPING = {
    "hanoi": ["hanoi", "hn"],
    "viettel": ["viettel", "thecong"],
    "hcmc": ["tphcm", "hcm", "hcmc"],
    "binhdinh": ["binhdinh"],
    "slna": ["slna", "songlamnghe"],
    "hagl": ["hagl", "gialai"],
    "namdinh": ["namdinh"],
    "haiphong": ["haiphong"],
    "thanhhoa": ["thanhhoa"],
    "quangninh": ["quangninh"],
    "binhduong": ["binhduong"],
}


def _user_owns_club(username: str, maclb: str) -> bool:
    """
    Check if username matches club ID using heuristic.
    
    TODO (Technical Debt): Replace with DB lookup once user->club mapping exists.
    """
    username_lower = username.lower()
    club_id_lower = maclb.lower()
    
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
            if pattern in club_id_lower:
                return True
    
    return False


def _get_user_club_id(session: SessionDep, current_user: TaiKhoan, muagiai: str) -> Optional[str]:
    """
    Get club ID owned by user for a specific season.
    
    Returns maclb if found, None otherwise.
    
    TODO (Technical Debt): Currently uses heuristic. Should query DB mapping.
    """
    # Get all clubs for season
    clubs = crud.get_clubs(session=session, muagiai=muagiai, limit=100)
    
    username = current_user.tendangnhap
    for club in clubs:
        if _user_owns_club(username, club.maclb):
            return club.maclb
    
    return None


def _check_club_ownership(session: SessionDep, current_user: TaiKhoan, maclb: str, muagiai: str) -> None:
    """
    Check if user can manage this club.
    
    - BTC: Can manage any club
    - QuanLyDoi/CLB: Can only manage their own club (heuristic check)
    
    Raises HTTPException 403 if access denied.
    """
    user_role = current_user.nhom.tennhom if current_user.nhom else None
    
    if user_role == "BTC":
        return  # BTC can manage any club
    
    if user_role in ("QuanLyDoi", "CLB"):
        # Get user's club for this season
        user_club_id = _get_user_club_id(session, current_user, muagiai)
        
        if not user_club_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"No club found for user '{current_user.tendangnhap}' in season {muagiai}"
            )
        
        if user_club_id.lower() != maclb.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"You can only manage your own club's roster ({user_club_id})"
            )
        return
    
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Access denied. Required role: BTC, QuanLyDoi, or CLB"
    )


# =============================================
# ATOMIC PLAYER REGISTRATION ENDPOINT
# =============================================

@router.post("/register-player", response_model=RegisterPlayerResponse, status_code=status.HTTP_201_CREATED)
def register_player(
    session: SessionDep,
    request: RegisterPlayerRequest,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC", "QuanLyDoi", "CLB"))]
) -> RegisterPlayerResponse:
    """
    **ATOMIC** Create new player AND add to roster in one transaction.
    
    **Requires BTC, QuanLyDoi, or CLB role**
    - BTC: Can specify any maclb, or omit to require it
    - QuanLyDoi/CLB: maclb is auto-determined from username and forced (cannot specify other club)
    
    **Use case:** CLB managers registering new players to their squad.
    
    **Request Body:**
    ```json
    {
      "tencauthu": "Nguyễn Văn A",
      "ngaysinh": "1998-05-15",
      "quoctich": "Vietnam",
      "vitrithidau": "MF",
      "chieucao": 175.0,
      "cannang": 68.0,
      "soaothidau": 10,
      "muagiai": "2024-2025",
      "maclb": "CLB_HANOI"
    }
    ```
    
    **Notes:**
    - `macauthu` is auto-generated (UUID-based)
    - For CLB/QuanLyDoi: `maclb` is ignored and auto-assigned based on username
    - Transaction: If roster creation fails, player creation is rolled back
    
    **Error Responses:**
    - 400: Validation failed (age, quota, shirt number, height/weight)
    - 403: CLB/QuanLyDoi trying to specify another club
    - 404: Club/Season not found
    """
    user_role = current_user.nhom.tennhom if current_user.nhom else None
    
    # Determine target club
    if user_role in ("QuanLyDoi", "CLB"):
        # Force club based on username heuristic
        user_club_id = _get_user_club_id(session, current_user, request.muagiai)
        if not user_club_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"No club found for user '{current_user.tendangnhap}' in season {request.muagiai}"
            )
        target_club = user_club_id
        
        # If user tried to specify a different club, warn them
        if request.maclb and request.maclb.lower() != user_club_id.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"You can only register players to your own club ({user_club_id}), not '{request.maclb}'"
            )
    else:
        # BTC - must specify club or error
        if not request.maclb:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="BTC must specify maclb"
            )
        target_club = request.maclb
    
    # Validate club exists for season
    club = crud.get_club_by_id(session=session, maclb=target_club, muagiai=request.muagiai)
    if not club:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Club '{target_club}' not found for season {request.muagiai}"
        )
    
    # Generate unique player ID
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    short_uuid = str(uuid.uuid4())[:8].upper()
    macauthu = f"CT{timestamp}{short_uuid}"
    
    try:
        # Create player
        player_create = CauThuCreate(
            macauthu=macauthu,
            tencauthu=request.tencauthu,
            ngaysinh=request.ngaysinh,
            quoctich=request.quoctich,
            vitrithidau=request.vitrithidau,
            chieucao=request.chieucao,
            cannang=request.cannang,
        )
        
        # Validate height/weight before creating
        if request.chieucao is not None and (request.chieucao < 50 or request.chieucao > 250):
            raise ValueError("Height (chieucao) must be between 50 and 250 cm")
        if request.cannang is not None and (request.cannang < 20 or request.cannang > 200):
            raise ValueError("Weight (cannang) must be between 20 and 200 kg")
        
        new_player = crud.create_player(session=session, player_in=player_create)
        
        # Create roster entry
        roster_create = ChiTietDoiBongCreate(
            macauthu=macauthu,
            maclb=target_club,
            muagiai=request.muagiai,
            soaothidau=request.soaothidau
        )
        
        roster_entry = crud.add_player_to_roster(session=session, roster_in=roster_create)
        
        return RegisterPlayerResponse(
            macauthu=new_player.macauthu,
            tencauthu=new_player.tencauthu,
            ngaysinh=new_player.ngaysinh,
            quoctich=new_player.quoctich,
            vitrithidau=new_player.vitrithidau,
            chieucao=new_player.chieucao,
            cannang=new_player.cannang,
            maclb=roster_entry.maclb,
            muagiai=roster_entry.muagiai,
            soaothidau=roster_entry.soaothidau,
        )
        
    except ValueError as e:
        # Rollback: delete player if roster creation failed
        # (Session should auto-rollback on exception, but be explicit)
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# =============================================
# EXISTING ROSTER ENDPOINTS
# =============================================

@router.post("/", response_model=ChiTietDoiBongPublic, status_code=status.HTTP_201_CREATED)
def add_player_to_roster(
    session: SessionDep,
    roster_in: ChiTietDoiBongCreate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC", "QuanLyDoi", "CLB"))]
) -> ChiTietDoiBongPublic:
    """
    Register player to club roster for a season
    
    **Requires BTC, QuanLyDoi, or CLB role**
    - BTC can add to any club
    - QuanLyDoi/CLB can only add to their own club
    
    Validations performed:
    - Player exists
    - Club exists for that season
    - Season exists
    - Player age meets season requirements (TuoiCauThuToiThieu/ToiDa)
    - Shirt number unique within club+season (range 1-99, REQUIRED)
    - Foreign player quota not exceeded (based on LoaiCauThu rules)
    
    **Body:**
    ```json
    {
      "macauthu": "CT001",
      "maclb": "CLB001",
      "muagiai": "2024-2025",
      "soaothidau": 10
    }
    ```
    
    **Error Responses:**
    - 400: Validation failed (age, quota, shirt number)
    - 403: QuanLyDoi/CLB trying to add to another club
    - 404: Player/Club/Season not found
    - 409: Player already registered to this club+season
    """
    # Check ownership for QuanLyDoi/CLB
    _check_club_ownership(session, current_user, roster_in.maclb, roster_in.muagiai)
    
    # Check if already registered
    existing = crud.get_roster_player(
        session=session,
        macauthu=roster_in.macauthu,
        maclb=roster_in.maclb,
        muagiai=roster_in.muagiai
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Player {roster_in.macauthu} already registered to club {roster_in.maclb} for season {roster_in.muagiai}"
        )
    
    try:
        roster_entry = crud.add_player_to_roster(session=session, roster_in=roster_in)
        return roster_entry
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.patch("/{player_id}", response_model=ChiTietDoiBongPublic)
def update_roster_player(
    session: SessionDep,
    player_id: str,
    roster_in: ChiTietDoiBongUpdate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC", "QuanLyDoi", "CLB"))],
    maclb: str = Query(..., description="Club ID (required)"),
    muagiai: str = Query(..., description="Season ID (required)")
) -> ChiTietDoiBongPublic:
    """
    Update roster entry (e.g., change shirt number)
    
    **Requires BTC, QuanLyDoi, or CLB role**
    - BTC can update any club
    - QuanLyDoi/CLB can only update their own club
    
    **Path:** `PATCH /rosters/{player_id}?maclb=CLB001&muagiai=2024-2025`
    
    **Body:**
    ```json
    {"soaothidau": 99}
    ```
    """
    # Check ownership for QuanLyDoi/CLB
    _check_club_ownership(session, current_user, maclb, muagiai)
    
    # Get existing roster entry
    roster_entry = crud.get_roster_player(
        session=session,
        macauthu=player_id,
        maclb=maclb,
        muagiai=muagiai
    )
    if not roster_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player {player_id} not found in roster for club {maclb}, season {muagiai}"
        )
    
    # Update only provided fields
    update_data = roster_in.model_dump(exclude_unset=True)
    if update_data:
        # Check shirt number uniqueness if changing it
        if "soaothidau" in update_data:
            new_shirt = update_data["soaothidau"]
            if new_shirt != roster_entry.soaothidau:
                existing = crud.get_roster_by_shirt(
                    session=session,
                    maclb=maclb,
                    muagiai=muagiai,
                    soaothidau=new_shirt
                )
                if existing:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Shirt number {new_shirt} already taken by another player"
                    )
        
        for key, value in update_data.items():
            setattr(roster_entry, key, value)
        session.add(roster_entry)
        session.commit()
        session.refresh(roster_entry)
    
    return roster_entry


@router.get("/", response_model=list[RosterPlayerDetail])
def get_roster(
    session: SessionDep,
    current_user: CurrentUserVLeague,  # Auth required
    maclb: str = Query(..., description="Club ID (required)"),
    muagiai: str = Query(..., description="Season ID (required)"),
) -> list[RosterPlayerDetail]:
    """
    Get club roster for a season with player details
    
    **Authentication required** - Any authenticated user can view rosters
    
    **Required Query Parameters:**
    - maclb: Club ID (e.g., "CLB001")
    - muagiai: Season ID (e.g., "2024-2025")
    
    Returns list of players registered to the club for that season,
    including player details (name, nationality, position, shirt number)
    """
    # Validate club exists
    club = crud.get_club_by_id(session=session, maclb=maclb, muagiai=muagiai)
    if not club:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Club {maclb} not found for season {muagiai}"
        )
    
    # PERF: Avoid N+1 - JOIN ChiTietDoiBong with CauThu in single query
    from sqlmodel import select
    from app.models import ChiTietDoiBong, CauThu
    
    roster_stmt = (
        select(ChiTietDoiBong, CauThu)
        .join(CauThu, ChiTietDoiBong.macauthu == CauThu.macauthu)
        .where(
            ChiTietDoiBong.maclb == maclb,
            ChiTietDoiBong.muagiai == muagiai
        )
    )
    
    results = session.exec(roster_stmt).all()
    
    # Build detailed roster from JOIN results (including chieucao/cannang)
    roster_details = [
        RosterPlayerDetail(
            macauthu=roster.macauthu,
            tencauthu=player.tencauthu,
            quoctich=player.quoctich,
            vitrithidau=player.vitrithidau,
            soaothidau=roster.soaothidau,
            ngaysinh=player.ngaysinh,
            chieucao=player.chieucao,
            cannang=player.cannang
        )
        for roster, player in results
    ]
    
    return roster_details


@router.delete("/{player_id}", response_model=Message)
def remove_player_from_roster(
    session: SessionDep,
    player_id: str,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))],
    maclb: str = Query(..., description="Club ID (required)"),
    muagiai: str = Query(..., description="Season ID (required)")
) -> Message:
    """
    Remove player from club roster
    
    **Requires BTC role** - Only Ban Tổ Chức can remove players from rosters
    
    **Required Query Parameters:**
    - maclb: Club ID
    - muagiai: Season ID
    
    Example: `DELETE /api/rosters/CT001?maclb=CLB001&muagiai=2024-2025`
    """
    # Check if roster entry exists
    roster_entry = crud.get_roster_player(
        session=session,
        macauthu=player_id,
        maclb=maclb,
        muagiai=muagiai
    )
    if not roster_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Player {player_id} not found in roster for club {maclb}, season {muagiai}"
        )
    
    success = crud.remove_player_from_roster(
        session=session,
        macauthu=player_id,
        maclb=maclb,
        muagiai=muagiai
    )
    
    if success:
        return Message(message=f"Player {player_id} removed from roster successfully")
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to remove player from roster"
        )


@router.get("/validate", response_model=RosterValidationResult)
def validate_roster(
    session: SessionDep,
    current_user: CurrentUserVLeague,  # Auth required
    maclb: str = Query(..., description="Club ID (required)"),
    muagiai: str = Query(..., description="Season ID (required)"),
) -> RosterValidationResult:
    """
    Validate club roster against season regulations
    
    **Authentication required** - Any authenticated user can validate rosters
    
    **Required Query Parameters:**
    - maclb: Club ID
    - muagiai: Season ID
    
    Checks:
    - Roster size (min/max players)
    - Goalkeeper count (minimum required)
    - All validations already done during registration
    
    Returns:
    ```json
    {
      "valid": true,
      "violations": [],
      "warnings": ["Only 2 goalkeepers, minimum recommended is 3"],
      "stats": {
        "total_players": 25,
        "goalkeepers": 2,
        "foreign_players": 3
      }
    }
    ```
    
    **Use case:** Check roster compliance before finalizing registration
    """
    # Validate club and season exist
    club = crud.get_club_by_id(session=session, maclb=maclb, muagiai=muagiai)
    if not club:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Club {maclb} not found for season {muagiai}"
        )
    
    season = crud.get_season_by_id(session=session, id=muagiai)
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Season {muagiai} not found"
        )
    
    # Run validations
    violations = []
    warnings = []
    stats = {}
    
    # 1. Check roster size
    size_check = crud.validate_roster_size(
        session=session,
        maclb=maclb,
        muagiai=muagiai,
        min_players=season.socauthutoithieu,
        max_players=season.socauthutoida
    )
    violations.extend(size_check["violations"])
    warnings.extend(size_check["warnings"])
    stats["total_players"] = size_check["current_count"]
    stats["min_required"] = size_check["min_required"]
    stats["max_allowed"] = size_check["max_allowed"]
    
    # 2. Check goalkeeper count
    gk_check = crud.validate_goalkeeper_count(
        session=session,
        maclb=maclb,
        muagiai=muagiai,
        min_goalkeepers=season.sothumontoithieu
    )
    violations.extend(gk_check["violations"])
    stats["goalkeepers"] = gk_check["goalkeeper_count"]
    stats["min_goalkeepers"] = gk_check["min_required"]
    
    # 3. Count foreign players - PERF: Single JOIN query (avoid N+1)
    from sqlmodel import select
    from app.models import ChiTietDoiBong, CauThu
    from app.utils import is_foreign
    
    foreign_stmt = (
        select(CauThu.quoctich)
        .join(ChiTietDoiBong, ChiTietDoiBong.macauthu == CauThu.macauthu)
        .where(
            ChiTietDoiBong.maclb == maclb,
            ChiTietDoiBong.muagiai == muagiai
        )
    )
    nationalities = session.exec(foreign_stmt).all()
    foreign_count = sum(1 for nat in nationalities if is_foreign(nat))
    stats["foreign_players"] = foreign_count
    
    return RosterValidationResult(
        valid=len(violations) == 0,
        violations=violations,
        warnings=warnings,
        stats=stats
    )
