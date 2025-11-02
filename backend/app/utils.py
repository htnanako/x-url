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
CUSTOM_CODE_MIN_LENGTH = 1
CUSTOM_CODE_MAX_LENGTH = 20
_RESERVED_PATHS = {"api", "status", "healthz", "assets", "img"}


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


def validate_custom_code(code: str) -> tuple[bool, str]:
    """
    验证自定义短码格式
    返回: (是否有效, 错误消息)
    """
    code = code.strip()
    if not code:
        return False, "短码不能为空"
    
    if len(code) < CUSTOM_CODE_MIN_LENGTH or len(code) > CUSTOM_CODE_MAX_LENGTH:
        return False, f"短码长度必须在 {CUSTOM_CODE_MIN_LENGTH}-{CUSTOM_CODE_MAX_LENGTH} 个字符之间"
    
    if not all(c in BASE62 for c in code):
        return False, "短码只能包含字母和数字"
    
    if code.lower() in _RESERVED_PATHS:
        return False, f"短码 '{code}' 是保留路径，不能使用"
    
    return True, ""


