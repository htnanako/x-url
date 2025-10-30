# Multi-stage build: frontend static + Python 3.12 backend

# 1) Build frontend
FROM node:20-alpine AS frontend
WORKDIR /app/frontend

# Install deps
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm i; fi

# Copy sources and build
COPY frontend/ ./
RUN npm run build


# 2) Backend runtime (Python 3.12)
FROM python:3.12-slim AS backend
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TZ=Asia/Shanghai

WORKDIR /app

# Install system deps (optional, keep minimal)
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates tzdata && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
    rm -rf /var/lib/apt/lists/*

# Install python deps
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy backend code
COPY backend/app /app/app
COPY backend/run.py /app/run.py

# Copy frontend build to static dir expected by app
COPY --from=frontend /app/frontend/dist /app/app/static

# Create data dir (can be overridden via WORKDIR env at runtime)
RUN mkdir -p /app/data

EXPOSE 8000
CMD ["python", "run.py"]


