import random
import string
from datetime import datetime, timedelta, timezone

from fastapi import Request
from sqlmodel import Session, select

from .models import ShortURL, CreateLog


BASE62 = string.ascii_letters + string.digits
CODE_LENGTH = 7
EXPIRE_DAYS_DEFAULT = 90
CREATE_LIMIT_PER_MINUTE = 10


def generate_code(session: Session) -> str:
    for _ in range(16):
        code = "".join(random.choice(BASE62) for _ in range(CODE_LENGTH))
        if not session.get(ShortURL, code):
            return code
    raise RuntimeError("短码生成失败，请重试")


def is_rate_limited(session: Session, ip: str, limit: int = CREATE_LIMIT_PER_MINUTE, window_seconds: int = 60) -> bool:
    since = datetime.now(timezone.utc) - timedelta(seconds=window_seconds)
    stmt = select(CreateLog).where(CreateLog.ip == ip, CreateLog.created_at >= since)
    count = len(session.exec(stmt).all())
    return count >= limit


def client_ip(request: Request) -> str:
    # Honor common proxy headers first if present; fall back to connection info
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip
    return request.client.host if request.client else ""


