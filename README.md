# x-url 短链服务

本项目由 AI（Cursor + GPT-5）辅助编写，提供一个可直接部署的极简短链服务。

## 功能
- 将长链接生成 7 位 Base62 短链
- 访问短链自动跳转；不存在 404，过期 410
- 默认有效期 90 天；同一长链再次创建会续期并复用旧短码

## 技术栈
- 后端：Python 3.12 + FastAPI + SQLModel + SQLite
- 前端：React + Vite + Tailwind（构建为静态文件并由后端托管）
- 打包：多阶段 Docker（Node 20 构建前端，Python 3.12 运行后端）

## Docker 部署
- 直接使用 Docker
  ```bash
  docker build -t x-url:latest .
  mkdir -p ./data
  docker run -d --name x-url -p 8000:8000 \
    -v "$(pwd)/data:/app/data" \
    x-url:latest
  # 打开 http://localhost:8000
  ```

- 使用 Docker Compose（推荐）
  ```bash
  docker compose up -d
  # 打开 http://localhost:8000
  ```

说明：数据库默认位于容器内 `/app/data/xurl.db`，上面的卷映射会将数据持久化到本地 `./data/`。
