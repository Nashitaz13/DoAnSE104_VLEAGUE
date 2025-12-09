"""
V-League Database Models
Base models and enums for the application
"""

from enum import Enum


class LoaiCauThuEnum(str, Enum):
    """Loại cầu thủ - Player Type"""
    TRONG_NUOC = "Trong nước"
    NUOC_NGOAI = "Nước ngoài"


class LoaiBanThangEnum(str, Enum):
    """Loại bàn thắng - Goal Type"""
    A = "A"  # Bàn thắng thông thường
    B = "B"  # Bàn thắng từ phạt đền
    C = "C"  # Bàn thắng phản lưới nhà


class TrangThaiMuaGiaiEnum(str, Enum):
    """Trạng thái mùa giải - Season Status"""
    ACTIVE = "Active"
    FINISHED = "Finished"
    CANCELLED = "Cancelled"


class TrangThaiTranDauEnum(str, Enum):
    """Trạng thái trận đấu - Match Status"""
    SCHEDULED = "Scheduled"
    FINISHED = "Finished"
    CANCELLED = "Cancelled"
    POSTPONED = "Postponed"


class LoaiTheEnum(str, Enum):
    """Loại thẻ phạt - Card Type"""
    YELLOW = "Yellow"
    RED = "Red"
