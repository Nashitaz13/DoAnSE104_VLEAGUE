import logging
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import jwt
from jwt.exceptions import InvalidTokenError

from app.core import security
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# =============================================
# EVENT TYPE NORMALIZATION
# =============================================

def normalize_event_type(event_type: str) -> str:
    """
    Normalize event type to canonical format (no spaces).
    
    Handles backward compatibility with old space-separated format:
    - "Ban Thang" -> "BanThang"
    - "The Vang" -> "TheVang"
    - "The Do" -> "TheDo"
    - "Thay Nguoi" -> "ThayNguoi"
    
    Also accepts already-normalized input (case-insensitive):
    - "banthang" -> "BanThang"
    - "BANTHANG" -> "BanThang"
    
    Raises:
        ValueError: If event type doesn't match any valid pattern
    """
    if not event_type:
        raise ValueError("Event type cannot be empty")
    
    # Strip and remove all whitespace, convert to lowercase for matching
    normalized = event_type.strip().replace(" ", "").lower()
    
    # Map to canonical forms
    event_map = {
        "banthang": "BanThang",
        "thevang": "TheVang",
        "thedo": "TheDo",
        "thaynguoi": "ThayNguoi",
    }
    
    canonical = event_map.get(normalized)
    if not canonical:
        valid_types = ", ".join(event_map.values())
        raise ValueError(
            f"Invalid event type '{event_type}'. "
            f"Must be one of: {valid_types}"
        )
    
    return canonical



# =============================================
# NATIONALITY NORMALIZATION & VALIDATION
# =============================================

def normalize_nationality(nationality: str | None) -> str | None:
    """
    Normalize nationality to canonical English format.
    """
    if not nationality or not nationality.strip():
        return None

    # Normalize input for matching:
    # - trim spaces
    # - lowercase to match
    # - replace '.' and '-' with spaces (e.g. "u.s.a" -> "u s a", "viet-nam" -> "viet nam")
    # - collapse repeated whitespace
    raw = nationality.strip()
    normalized = raw.lower().replace(".", " ").replace("-", " ")
    normalized = " ".join(normalized.split())

    # Map Vietnamese variants to canonical "Vietnam" (keep existing behavior)
    vietnam_variants = {
        "vn",
        "vnm",
        "vietnam",
        "viet nam",
        "việt nam",
        "viêtnam",
        "việtnam",
    }
    if normalized in vietnam_variants or normalized.replace(" ", "") in {"vietnam", "việtnam", "viêtnam"}:
        return "Vietnam"

    # Special-case common abbreviations/aliases to avoid .title() breaking acronyms.
    # Keep outputs consistent.
    special_map = {
        # USA
        "usa": "USA",
        "us": "USA",
        "u s a": "USA",
        # UK
        "uk": "UK",
        "u k": "UK",
        # UAE
        "uae": "UAE",
        # Korea (canonical chosen: "Korea")
        "korea": "Korea",
        "south korea": "Korea",
        "korea republic": "Korea",
        "republic of korea": "Korea",
        # DR Congo
        "dr congo": "DR Congo",
        "drc": "DR Congo",
        "democratic republic of the congo": "DR Congo",
    }
    mapped = special_map.get(normalized)
    if mapped:
        return mapped

    # Fallback: title-case, but keep known acronyms in all-caps.
    titled = normalized.title()
    tokens = []
    for t in titled.split(" "):
        if t == "Usa":
            tokens.append("USA")
        elif t == "Uk":
            tokens.append("UK")
        elif t == "Uae":
            tokens.append("UAE")
        else:
            tokens.append(t)
    return " ".join(tokens)


def is_domestic(nationality: str | None) -> bool:
    """
    Check if player is domestic (Vietnamese).
    """
    normalized = normalize_nationality(nationality)
    return normalized == "Vietnam"


def is_foreign(nationality: str | None) -> bool:
    """
    Check if player is foreign (non-Vietnamese).
    """
    if not nationality or not nationality.strip():
        return False
    
    normalized = normalize_nationality(nationality)
    return normalized is not None and normalized != "Vietnam"


def generate_password_reset_token(email: str) -> str:
    from datetime import datetime, timedelta, timezone
    import jwt
    from app.core import security
    from app.core.config import settings
    
    delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
    now = datetime.now(timezone.utc)
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email},
        settings.SECRET_KEY,
        algorithm=security.ALGORITHM,
    )
    return encoded_jwt


def verify_password_reset_token(token: str) -> str | None:
    from app.core import security
    from app.core.config import settings
    import jwt
    from jwt.exceptions import InvalidTokenError
    
    try:
        decoded_token = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        return str(decoded_token["sub"])
    except InvalidTokenError:
        return None
