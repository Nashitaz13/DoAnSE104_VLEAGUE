# ⚽ VLEAGUE Management System

Hệ thống quản lý giải bóng đá V.League 1, bao gồm quản lý cầu thủ, đội bóng, lịch thi đấu và kết quả. Dự án được xây dựng với kiến trúc hiện đại, tách biệt Frontend và Backend, hỗ trợ deploy dễ dàng với Docker.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **State/Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12)
- **Database**: PostgreSQL 17
- **ORM**: [SQLModel](https://sqlmodel.tiangolo.com/)
- **Migration**: Alembic
- **Auth**: JWT (JSON Web Tokens)

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Package Manager**: `npm` (Frontend) & `uv`/`pip` (Backend)
- **Linting/Formatting**: Biome (Frontend), Ruff (Backend)

---

## ✨ Tính năng chính

- **Quản lý Cầu thủ**: Thêm, sửa, xóa, tra cứu thông tin cầu thủ.
- **Quản lý Đội bóng**: Đăng ký đội hình, quản lý danh sách cầu thủ trong đội.
- **Quản lý Lịch thi đấu**: Xếp lịch, cập nhật kết quả trận đấu.
- **Bảng xếp hạng**: Tự động tính toán và cập nhật bảng xếp hạng sau mỗi vòng đấu.
- **Báo cáo**: Xuất báo cáo giải đấu.

---

## 🛠️ Cài đặt và Chạy dự án (Quick Start)

Cách đơn giản và khuyến nghị nhất để chạy toàn bộ dự án là sử dụng **Docker**.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### 1. Clone repository
```bash
git clone https://github.com/Nashitaz13/DoAnSE104_VLEAGUE
cd DoAnSE104_VLEAGUE
```

### 2. Cấu hình biến môi trường
Dự án cần các biến môi trường để hoạt động. Bạn có thể sử dụng file `.env` mẫu.

**Backend**:
```bash
cd backend
cp .env.example .env
# Chỉnh sửa file .env nếu cần thiết (DB credentials, Secret key...)
```

**Root (cho Docker)**:
Tạo file `.env` ở thư mục gốc nếu cần chỉnh sửa cấu hình production, nhưng với môi trường dev mặc định, `docker-compose.yml` đã có cấu hình cơ bản.

### 3. Khởi chạy với Docker Compose
Tại thư mục gốc của dự án:

```bash
docker compose up -d
```

Sau khi chạy xong:
- **Frontend**: http://localhost:5173
- **Backend API Docs**: http://localhost/docs (qua Traefik/Proxy) hoặc http://localhost:8000/docs (direct)
- **Adminer** (Quản lý DB): http://localhost:8080

---

## 💻 Development Workflow (Thủ công)

Nếu bạn muốn chạy từng phần riêng lẻ để phát triển (không dùng Docker cho toàn bộ):

### Backend
Xem hướng dẫn chi tiết tại [backend/README.md](./backend/README.md).

```bash
cd backend
# Cài đặt dependency với uv hoặc pip
uv sync
# Active virtual environment
source .venv/bin/activate
# Chạy migration
alembic upgrade head
# Chạy server
fastapi run --reload app/main.py
```

### Frontend
Xem hướng dẫn chi tiết tại [frontend/README.md](./frontend/README.md).

```bash
cd frontend
npm install
npm run dev
```

## 📂 Cấu trúc thư mục

```
DoAnSE104_VLEAGUE/
├── backend/            # Source code Backend (FastAPI)
├── frontend/           # Source code Frontend (React)
├── database/           # Script database, SQL
├── docker-compose.yml  # Cấu hình Docker cho toàn bộ dự án
├── scripts/            # Các script tiện ích
└── README.md           # Tài liệu chính
```
