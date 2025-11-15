# vleague_api

API for Vleague management system - FastAPI + PostgreSQL


## Prerequisites

- `Docker 20.10+`
- `Docker Compose 1.29+`
- (hoặc) `Python 3.10+` + `PostgreSQL 15+` để chạy locally


## Quick Start với Docker (Khuyến nghị)

### 1. Chuẩn bị file `.env`

Tạo file `.env` tại thư mục `backend/` với nội dung:

```shell
DEBUG=True
SERVER_HOST=http://localhost:8000
SECRET_KEY=your-secret-key-here-change-this
ENVIRONMENT=dev
BACKEND_CORS_ORIGINS=["http://localhost","http://localhost:3000"]
DATABASE_URI=postgresql://postgres:password@db:5432/vleague
```

**Lưu ý:** 
- `db` là tên service PostgreSQL trong docker-compose
- Thay đổi `SECRET_KEY` thành một chuỗi ngẫu nhiên an toàn
- `DATABASE_URI` không nên đổi host nếu chạy trong Docker

### 2. Build và chạy ứng dụng

```bash
# Build image và khởi động tất cả services
docker compose up -d --build

# Kiểm tra trạng thái services
docker compose ps

# Xem logs của API
docker compose logs -f api

# Xem logs của Database
docker compose logs -f db
```

### 3. Truy cập ứng dụng

- **API Root**: http://localhost:8000
- **Swagger API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 4. Các lệnh Docker hữu ích

```bash
# Dừng tất cả services
docker compose down

# Dừng services nhưng giữ lại data
docker compose down -v

# Xem logs realtime
docker compose logs -f

# Chạy lệnh trong container API
docker compose exec api python manage.py --help

# Kiểm tra database connection
docker compose exec db psql -U postgres -d vleague -c "SELECT 1"
```

---

## Development Setup (Chạy locally)

### Prerequisites (Local)

- `Python 3.10+`
- `PostgreSQL 15+`

### Installation

```bash
# 1. Tạo virtual environment
python -m venv venv

# 2. Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Cài dependencies
pip install -r requirements.txt

# 4. Tạo file .env
cp .env.template .env
# Chỉnh sửa .env với database URI của máy local
```

### `.env` example (Local Development)

```shell
DEBUG=True
SERVER_HOST=http://localhost:8000
SECRET_KEY=qwtqwubYA0pN1GMmKsFKHMw_WCbboJvdTAgM9Fq-UyM
ENVIRONMENT=dev
BACKEND_CORS_ORIGINS=["http://localhost","http://localhost:3000"]
DATABASE_URI=postgresql://postgres:password@localhost:5432/vleague
```
### Database setup (Local)

Create your first migration

```shell
aerich init-db
```

Adding new migrations.

```shell
aerich migrate --name <migration_name>
```

Upgrading the database when new migrations are created.

```shell
aerich upgrade
```

### Run the fastapi app (Local)

```shell
python manage.py run-server
```

Server sẽ chạy tại: http://localhost:8000

### CLI Commands

```shell
# Xem tất cả các lệnh có sẵn
python manage.py --help

# Chạy migration
python manage.py migrate-db

# Chạy server development
python manage.py run-server

# Tạo SECRET_KEY mới
python manage.py secret-key
```

---

## Docker Compose Architecture

File `docker-compose.yml` bao gồm 2 services:

### 1. **PostgreSQL Database** (`db`)
- Image: `postgres:15-alpine`
- Port: `5432` (không expose ra ngoài)
- Volume: `pgdata` (persistence data)
- Healthcheck: Kiểm tra database sẵn sàng trước khi API khởi động
- Environment: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`

### 2. **FastAPI API** (`api`)
- Build từ `Dockerfile` (Alpine Linux + Python 3.10)
- Port: `8000:8000` (expose ra host)
- Depends on: `db` (chờ database healthy)
- Environment: Từ `.env` file
- Auto-reload: Enabled cho development

---

## Troubleshooting

### 1. Port 8000 đã được sử dụng

```bash
# Tìm process sử dụng port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # macOS/Linux

# Hoặc sử dụng port khác trong docker-compose.yml
# Thay "8000:8000" thành "8001:8000"
```

### 2. Database connection error

```bash
# Kiểm tra database logs
docker compose logs db

# Kiểm tra connection
docker compose exec db psql -U postgres -c "SELECT 1"
```

### 3. Container không start

```bash
# Xem full logs
docker compose logs api

# Rebuild image
docker compose down
docker compose up -d --build --no-cache
```

### 4. Xóa toàn bộ data và start lại fresh

```bash
# Stop services
docker compose down

# Remove volumes (xóa database data)
docker volume prune

# Start lại
docker compose up -d --build
```

---

## Credits

This package was created with [Cookiecutter](https://github.com/cookiecutter/cookiecutter) and the [cookiecutter-fastapi](https://github.com/tobi-de/cookiecutter-fastapi) project template.
