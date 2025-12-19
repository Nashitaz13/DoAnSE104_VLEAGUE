import logging
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import emails  # type: ignore
import jwt
from jinja2 import Template
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
    
    Converts various Vietnamese nationality variants to standard "Vietnam":
    - "VN", "VNM" -> "Vietnam"
    - "Việt Nam", "Viet Nam", "việt nam", "viet nam" -> "Vietnam"
    - "Vietnam ", " Vietnam" -> "Vietnam" (trim spaces)
    
    For other nationalities, returns title-cased version with trimmed spaces:
    - "brazil" -> "Brazil"
    - "CAMEROON" -> "Cameroon"
    
    Args:
        nationality: Raw nationality string (may be None, empty, with spaces, various cases)
    
    Returns:
        Normalized nationality string, or None if input is None/empty
    
    Examples:
        >>> normalize_nationality("VN")
        'Vietnam'
        >>> normalize_nationality("Việt Nam")
        'Vietnam'
        >>> normalize_nationality("brazil")
        'Brazil'
        >>> normalize_nationality(None)
        None
        >>> normalize_nationality("  ")
        None
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
    
    Args:
        nationality: Player's nationality (can be None, various formats)
    
    Returns:
        True if player is Vietnamese, False otherwise
    
    Examples:
        >>> is_domestic("Vietnam")
        True
        >>> is_domestic("VN")
        True
        >>> is_domestic("Việt Nam")
        True
        >>> is_domestic("Brazil")
        False
        >>> is_domestic(None)
        False
        >>> is_domestic("")
        False
    """
    normalized = normalize_nationality(nationality)
    return normalized == "Vietnam"


def is_foreign(nationality: str | None) -> bool:
    """
    Check if player is foreign (non-Vietnamese).
    
    Args:
        nationality: Player's nationality (can be None, various formats)
    
    Returns:
        True if player is foreign (not Vietnamese), False if Vietnamese or None/empty
    
    Examples:
        >>> is_foreign("Brazil")
        True
        >>> is_foreign("Cameroon")
        True
        >>> is_foreign("Vietnam")
        False
        >>> is_foreign("VN")
        False
        >>> is_foreign(None)
        False
        >>> is_foreign("")
        False
    
    Note:
        Returns False for None/empty to avoid counting invalid data as foreign players
    """
    if not nationality or not nationality.strip():
        return False
    
    normalized = normalize_nationality(nationality)
    return normalized is not None and normalized != "Vietnam"


@dataclass
class EmailData:
    html_content: str
    subject: str


def render_email_template(*, template_name: str, context: dict[str, Any]) -> str:
    template_str = (
        Path(__file__).parent / "email-templates" / "build" / template_name
    ).read_text()
    html_content = Template(template_str).render(context)
    return html_content


def send_email(
    *,
    email_to: str,
    subject: str = "",
    html_content: str = "",
) -> None:
    assert settings.emails_enabled, "no provided configuration for email variables"
    message = emails.Message(
        subject=subject,
        html=html_content,
        mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
    )
    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
    if settings.SMTP_TLS:
        smtp_options["tls"] = True
    elif settings.SMTP_SSL:
        smtp_options["ssl"] = True
    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD
    response = message.send(to=email_to, smtp=smtp_options)
    logger.info(f"send email result: {response}")


def generate_test_email(email_to: str) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Test email"
    html_content = render_email_template(
        template_name="test_email.html",
        context={"project_name": settings.PROJECT_NAME, "email": email_to},
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_reset_password_email(email_to: str, email: str, token: str) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Password recovery for user {email}"
    link = f"{settings.FRONTEND_HOST}/reset-password?token={token}"
    html_content = render_email_template(
        template_name="reset_password.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "username": email,
            "email": email_to,
            "valid_hours": settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
            "link": link,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_new_account_email(
    email_to: str, username: str, password: str
) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - New account for user {username}"
    html_content = render_email_template(
        template_name="new_account.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "username": username,
            "password": password,
            "email": email_to,
            "link": settings.FRONTEND_HOST,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_password_reset_token(email: str) -> str:
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
    try:
        decoded_token = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        return str(decoded_token["sub"])
    except InvalidTokenError:
        return None
