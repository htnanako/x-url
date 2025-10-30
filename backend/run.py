import os

import uvicorn
from dotenv import load_dotenv


def main() -> None:
    load_dotenv()
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "1") not in {"0", "false", "False"}
    log_level = os.getenv("LOG_LEVEL", "info")

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload,
        log_level=log_level,
    )


if __name__ == "__main__":
    main()


