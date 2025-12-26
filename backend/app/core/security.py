from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
import bcrypt
# Monkey patch bcrypt to support passlib 1.7.4 with bcrypt >= 4.0.0
if not hasattr(bcrypt, "__about__"):
    class About:
        __version__ = bcrypt.__version__
    bcrypt.__about__ = About()

# Patch bcrypt.hashpw to handle long passwords (passlib < 1.7.5 issue with bcrypt >= 4.0)
_original_hashpw = bcrypt.hashpw

def _hashpw_patched(password: bytes, salt: bytes) -> bytes:
    # bcrypt 4.0+ raises ValueError for passwords > 72 bytes
    # passlib 1.7.4 relies on the old behavior of truncating
    if len(password) > 72:
        password = password[:72]
    return _original_hashpw(password, salt)

bcrypt.hashpw = _hashpw_patched

from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


ALGORITHM = "HS256"


def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
