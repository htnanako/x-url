import os
from pathlib import Path
from sqlmodel import SQLModel, create_engine


def _compute_sqlite_url() -> str:
    # WORKDIR env takes precedence; default to project_root/data
    workdir_env = os.getenv("WORKDIR") or os.getenv("XURL_WORKDIR")
    if workdir_env:
        workdir = Path(workdir_env).expanduser().resolve()
    else:
        here = Path(__file__).resolve()
        parents = here.parents
        # Try to detect repo root (has 'frontend' or 'backend') else fall back to parent of 'app'
        candidate = None
        for i in (2, 1):
            if i < len(parents):
                pr = parents[i]
                if (pr / "frontend").exists() or (pr / "backend").exists():
                    candidate = pr
                    break
        if candidate is None:
            # db.py at .../app/db.py → repo root likely parent of 'app'
            candidate = parents[1] if len(parents) > 1 else here.parent
        workdir = candidate / "data"
    workdir.mkdir(parents=True, exist_ok=True)
    db_path = workdir / "xurl.db"
    return f"sqlite:///{db_path}"


SQLITE_URL = _compute_sqlite_url()


engine = create_engine(
    SQLITE_URL,
    connect_args={"check_same_thread": False},
    pool_pre_ping=True,
)


def init_db() -> None:
    """Create database tables if they do not exist."""
    SQLModel.metadata.create_all(engine)


