from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from sqlmodel import SQLModel, Field


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class ShortURL(SQLModel, table=True):
    code: str = Field(primary_key=True, index=True)
    original_url: str = Field(index=True)
    created_at: datetime = Field(default_factory=utcnow)
    expires_at: datetime
    clicks: int = Field(default=0)
    is_active: bool = Field(default=True, index=True)


class CreateLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ip: str = Field(index=True)
    created_at: datetime = Field(default_factory=utcnow, index=True)


class ClickLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str = Field(index=True)
    created_at: datetime = Field(default_factory=utcnow, index=True)
    ip: Optional[str] = Field(default=None, index=True)
    user_agent: Optional[str] = None
    referer: Optional[str] = None
    accept_language: Optional[str] = None


