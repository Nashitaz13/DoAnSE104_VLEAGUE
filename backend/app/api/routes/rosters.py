from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app import crud
from app.api.deps import SessionDep, require_role, CurrentUserVLeague
from app.models import (
    ChiTietDoiBongPublic, ChiTietDoiBongCreate, 
    RosterPlayerDetail, RosterValidationResult, Message, TaiKhoan
)

router = APIRouter()


@router.post("/", response_model=ChiTietDoiBongPublic, status_code=status.HTTP_201_CREATED)
def add_player_to_roster(
    session: SessionDep,
    roster_in: ChiTietDoiBongCreate,
    current_user: Annotated[TaiKhoan, Depends(require_role("BTC"))]
) -> ChiTietDoiBongPublic:
    """
    Register player to club roster for a season
    
    **Requires BTC role** - Only Ban Tổ Chức can register players to rosters
    
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
    - 404: Player/Club/Season not found
    - 409: Player already registered to this club+season
    """
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
    
    # Build detailed roster from JOIN results
    roster_details = [
        RosterPlayerDetail(
            macauthu=roster.macauthu,
            tencauthu=player.tencauthu,
            quoctich=player.quoctich,
            vitrithidau=player.vitrithidau,
            soaothidau=roster.soaothidau,
            ngaysinh=player.ngaysinh
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
