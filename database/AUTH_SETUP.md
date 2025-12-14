# Setup V-League Authentication

Để setup authentication system với bcrypt password hashing:

## 1. Chạy SQL Migration



## 2. Tài khoản đã tạo sẵn

Script sẽ tạo 3 tài khoản test:

| Username | Password | Role | Email |
|----------|----------|------|-------|
| `admin` | `admin123` | BTC (Admin) | admin@vleague.vn |
| `quanlydoi1` | `manager123` | QuanLyDoi | qldoi1@vleague.vn |
| `viewer1` | `viewer123` | Viewer | viewer@vleague.vn |

## 3. Test API

Sau khi chạy migration, test login:

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Expected response:
```json
{
  "token": "eyJ...",
  "token_type": "bearer",
  "role": "BTC",
  "expiresIn": 3600
}
```

## 4. Swagger UI

1. Mở `http://localhost:8000/docs`
2. Test endpoint `POST /api/auth/login`:
   - username: `admin`
   - password: `admin123`
3. Copy token từ response
4. Click "Authorize" → paste token
5. Test `GET /api/auth/me`

## 5. Tạo user mới (trong PostgreSQL)

```sql
-- Tạo user mới với password hash
SELECT vleague_create_account(
    'username',
    'password123', 
    'Họ và tên',
    'email@example.com',
    1  -- manhom (1=BTC, 2=QuanLyDoi, 3=Viewer)
);

-- Đổi password
SELECT vleague_change_password('username', 'new_password');
```

## Lưu ý bảo mật

- ✅ Passwords được hash với bcrypt (cost=12)
- ✅ API verify password tự động
- ⚠️ Đổi password admin sau khi deploy production
- ⚠️ Không commit passwords vào git
