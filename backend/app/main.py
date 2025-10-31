from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from sqlmodel import Session, select

from .db import engine, init_db
from .models import ShortURL, CreateLog, ClickLog
from .utils import (
    EXPIRE_DAYS_DEFAULT,
    client_ip,
    generate_code,
    is_rate_limited,
)


app = FastAPI(title="x-url")

# Serve built frontend if present (Vite dist copied to app/static)
STATIC_DIR = Path(__file__).resolve().parent / "static"
ASSETS_DIR = STATIC_DIR / "assets"
IMG_DIR = STATIC_DIR / "img"
if ASSETS_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")
if IMG_DIR.exists():
    app.mount("/img", StaticFiles(directory=str(IMG_DIR)), name="img")


# Allow local dev frontend; adjust origins for your deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/healthz")
def healthz() -> dict:
    return {"ok": True}
@app.get("/")
def index():
    index_html = STATIC_DIR / "index.html"
    if index_html.exists():
        return FileResponse(str(index_html))
    # fallback minimal page
    return HTMLResponse("<html><body><h1>x-url</h1><p>前端未构建，接口可用。</p></body></html>")


@app.get("/status/{status_code}")
def status_page(status_code: str):
    # Serve SPA index for status pages; frontend decides content
    index_html = STATIC_DIR / "index.html"
    if index_html.exists():
        return FileResponse(str(index_html))
    return HTMLResponse(f"<html><body><h1>Status {status_code}</h1></body></html>")


@app.post("/api/shorten")
async def create_short(request: Request, payload: dict) -> JSONResponse:
    url = (payload or {}).get("url", "").strip()
    if not url or not (url.startswith("http://") or url.startswith("https://")):
        return JSONResponse({"error": "无效的 URL"}, status_code=400)

    ip = client_ip(request)
    with Session(engine) as session:
        if is_rate_limited(session, ip):
            return JSONResponse({"error": "创建过于频繁，请稍后再试"}, status_code=429)

        now = datetime.now(timezone.utc)
        # 先查是否已存在相同长链
        existing = session.exec(select(ShortURL).where(ShortURL.original_url == url)).first()
        if existing:
            # 续期并激活，不重新生成短码
            existing.expires_at = now + timedelta(days=EXPIRE_DAYS_DEFAULT)
            existing.is_active = True
            session.add(existing)
            session.add(CreateLog(ip=ip))
            session.commit()
            code = existing.code
            item = existing
        else:
            code = generate_code(session)
            item = ShortURL(
                code=code,
                original_url=url,
                expires_at=now + timedelta(days=EXPIRE_DAYS_DEFAULT),
                is_active=True,
            )
            session.add(item)
            session.add(CreateLog(ip=ip))
            session.commit()

        base = str(request.base_url).rstrip("/")
        expires = item.expires_at
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        expires_iso = expires.isoformat().replace("+00:00", "Z")
        return JSONResponse(
            {
                "code": code,
                "short_url": f"{base}/{code}",
                "expires_at": expires_iso,  # UTC ISO8601 with Z
                "renewed": bool(existing),
            },
            status_code=201,
        )


## legacy server-rendered status page removed (now handled by frontend)


@app.get("/{code}")
async def resolve(code: str, request: Request):
    with Session(engine) as session:
        item = session.get(ShortURL, code)
        if not item:
            return RedirectResponse(url="/status/404", status_code=302)

        now = datetime.now(timezone.utc)
        expires_at = item.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if not item.is_active or now >= expires_at:
            if item.is_active:
                item.is_active = False
                session.add(item)
                session.commit()
            return RedirectResponse(url="/status/410", status_code=302)

        # Valid: record click with additional dimensions, then redirect
        headers = request.headers
        click = ClickLog(
            code=code,
            ip=client_ip(request),
            user_agent=headers.get("user-agent"),
            referer=headers.get("referer"),
            accept_language=headers.get("accept-language"),
        )
        item.clicks += 1
        session.add(item)
        session.add(click)
        session.commit()
        return RedirectResponse(item.original_url, status_code=302)


