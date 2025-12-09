"""
Standings Schemas - Bảng xếp hạng
"""

from typing import Optional

from pydantic import BaseModel


class StandingsResponse(BaseModel):
    """Standings/League table response"""
    rank: int
    teamName: str
    matchesPlayed: int
    won: int
    draw: int
    lost: int
    goalsFor: int
    goalsAgainst: int
    difference: int
    points: int

    class Config:
        from_attributes = True


class TopScorerResponse(BaseModel):
    """Top scorer response"""
    rank: int
    playerName: str
    teamName: str
    goals: int

    class Config:
        from_attributes = True
