# API Specification - Hệ Thống Quản Lý Giải Bóng Đá Vô Địch Quốc Gia (V-League)

## 1. Tổng Quan
* **Base URL:** `/api`
* **Format:** JSON
* **Authentication:** Bearer Token (JWT)

---

## 2. Authentication & Authorization (Xác thực & Phân quyền)
Dựa trên bảng `TaiKhoan` và `NhomNguoiDung` (hoặc vai trò người dùng) trong thiết kế CSDL.

### 2.1. Đăng nhập
* **Endpoint:** `POST /auth/login`
* **Mô tả:** Xác thực người dùng và trả về Access Token.
* **Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```
* **Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "role": "BTC",
  "expiresIn": 3600
}
```

### 2.2. Đăng xuất
* **Endpoint:** `POST /auth/logout`
* **Auth:** Required (Bearer Token)

### 2.3. Lấy thông tin người dùng hiện tại
* **Endpoint:** `GET /auth/me`
* **Auth:** Required

---

## 3. Quản Lý Quy Định (QuyDinh)
Quản lý các tham số ràng buộc của giải đấu (Tuổi tối thiểu/tối đa, Số lượng cầu thủ ngoại, v.v.).

### 3.1. Lấy danh sách quy định
* **Endpoint:** `GET /regulations`
* **Mô tả:** Lấy tất cả các quy định hiện hành.
* **Auth:** Public hoặc Authenticated

### 3.2. Cập nhật quy định
* **Endpoint:** `PUT /regulations`
* **Auth:** Admin (Ban Tổ Chức)
* **Body:**
```json
[
  { "code": "TuoiToiThieu", "value": 16 },
  { "code": "TuoiToiDa", "value": 40 },
  { "code": "SoLuongCauThuNuocNgoai", "value": 3 },
  { "code": "DiemThang", "value": 3 },
  { "code": "DiemHoa", "value": 1 },
  { "code": "DiemThua", "value": 0 }
]
```

---

## 4. Quản Lý Mùa Giải (MuaGiai)

### 4.1. Lấy danh sách mùa giải
* **Endpoint:** `GET /seasons`
* **Params:** `?status=active` (Lọc theo trạng thái)

### 4.2. Tạo mùa giải mới
* **Endpoint:** `POST /seasons`
* **Auth:** Admin
* **Body:**
```json
{
  "tenMuaGiai": "V-League 2025",
  "ngayBatDau": "2025-01-01",
  "ngayKetThuc": "2025-12-31"
}
```

### 4.3. Đóng/Kết thúc mùa giải
* **Endpoint:** `PATCH /seasons/{seasonId}/status`
* **Body:**
```json
{ 
  "status": "Finished" 
}
```

---

## 5. Quản Lý Đội Bóng (DoiBong) & Sân Vận Động (San)
Liên kết Đội bóng với Mùa giải cụ thể.

### 5.1. Lấy danh sách đội bóng
* **Endpoint:** `GET /teams`
* **Params:** `?seasonId={id}` (Lọc theo mùa giải)
* **Response:** Danh sách đội bóng kèm thông tin sân nhà.

### 5.2. Đăng ký đội bóng vào mùa giải
* **Endpoint:** `POST /teams`
* **Auth:** Admin
* **Mô tả:** Tạo đội bóng và liên kết với sân nhà.
* **Body:**
```json
{
  "tenDoi": "Ha Noi FC",
  "tenSan": "San Hang Day",
  "seasonId": "mua-giai-01"
}
```

### 5.3. Cập nhật thông tin đội bóng
* **Endpoint:** `PUT /teams/{teamId}`
* **Body:**
```json
{ 
  "tenSan": "San My Dinh" 
}
```

---

## 6. Quản Lý Cầu Thủ (CauThu)
Thực hiện các nghiệp vụ kiểm tra quy định (tuổi, số lượng ngoại binh) ngay tại đây.

### 6.1. Lấy danh sách cầu thủ của đội
* **Endpoint:** `GET /teams/{teamId}/players`
* **Response:** Danh sách cầu thủ, loại cầu thủ (nội/ngoại).

### 6.2. Thêm cầu thủ mới (Đăng ký hồ sơ)
* **Endpoint:** `POST /players`
* **Auth:** Admin / Quản lý đội
* **Mô tả:** Hệ thống sẽ validate quy định (Tuổi, số lượng ngoại binh tối đa của đội) trước khi insert vào CSDL.
* **Body:**
```json
{
  "teamId": "doi-bong-01",
  "tenCauThu": "Nguyen Van A",
  "ngaySinh": "2000-05-20",
  "loaiCauThu": "NoiBinh", 
  "viTri": "TienDao",
  "soAo": 10
}
```
* **Error Response (400 Bad Request):**
```json
{
  "code": "ERR_RULE_VIOLATION",
  "message": "Cầu thủ không đủ tuổi quy định (Tối thiểu 16 tuổi)."
}
```

### 6.3. Tra cứu cầu thủ
* **Endpoint:** `GET /players`
* **Params:** `?keyword=Nguyen` (Tìm kiếm theo tên)

---

## 7. Quản Lý Lịch Thi Đấu & Trận Đấu (TranDau)

### 7.1. Tạo lịch thi đấu tự động (Sinh vòng đấu)
* **Endpoint:** `POST /seasons/{seasonId}/schedule/generate`
* **Auth:** Admin
* **Mô tả:** Thuật toán tự động sinh các cặp đấu (Vòng tròn 2 lượt) và lưu vào bảng `TranDau`.

### 7.2. Lấy danh sách trận đấu (Lịch thi đấu)
* **Endpoint:** `GET /matches`
* **Params:**
  * `seasonId`: ID mùa giải
  * `round`: Vòng đấu (Vong 1, Vong 2...)
  * `teamId`: Lọc theo đội
  * `status`: `Scheduled` (Chưa đá) / `Finished` (Đã đá)

### 7.3. Cập nhật thời gian/địa điểm trận đấu
* **Endpoint:** `PUT /matches/{matchId}/schedule`
* **Body:**
```json
{
  "ngayThiDau": "2025-02-15T18:00:00",
  "sanThiDau": "San Hang Day"
}
```

---

## 8. Quản Lý Kết Quả Trận Đấu (KetQua)
Đây là phần quan trọng nhất, cập nhật tỉ số và các sự kiện chi tiết.

### 8.1. Cập nhật kết quả chung cuộc
* **Endpoint:** `PUT /matches/{matchId}/result`
* **Auth:** Admin / Trọng tài
* **Body:**
```json
{
  "soBanThangDoiNha": 2,
  "soBanThangDoiKhach": 1,
  "status": "Finished"
}
```

### 8.2. Ghi nhận chi tiết trận đấu (Bàn thắng, Thẻ phạt)
Dựa trên bảng `ChiTietTranDau` (hoặc `BanThang`, `ThePhat` trong thiết kế chi tiết).

* **Endpoint:** `POST /matches/{matchId}/events`
* **Auth:** Admin / Trọng tài
* **Mô tả:** Thêm một sự kiện (ghi bàn, thẻ vàng, thẻ đỏ).
* **Body (Ví dụ ghi bàn):**
```json
{
  "playerId": "cau-thu-10",
  "teamId": "doi-bong-01",
  "loaiSuKien": "Goal", 
  "thoiDiem": 45, 
  "loaiBanThang": "A" 
}
```
* **Body (Ví dụ thẻ phạt):**
```json
{
  "playerId": "cau-thu-05",
  "teamId": "doi-bong-02",
  "loaiSuKien": "YellowCard",
  "thoiDiem": 60
}
```

### 8.3. Lấy chi tiết sự kiện trận đấu
* **Endpoint:** `GET /matches/{matchId}/events`
* **Response:** Danh sách bàn thắng, thẻ phạt, cầu thủ ra sân.

---

## 9. Báo Cáo & Thống Kê (BangXepHang)

### 9.1. Lấy Bảng xếp hạng
* **Endpoint:** `GET /standings`
* **Params:** `?seasonId={id}`
* **Mô tả:** Trả về bảng xếp hạng tính toán dựa trên `Thang`, `Hoa`, `Thua`, `HieuSo`, `Diem`.
* **Response:**
```json
[
  {
    "rank": 1,
    "teamName": "Ha Noi FC",
    "matchesPlayed": 10,
    "won": 8,
    "draw": 1,
    "lost": 1,
    "goalsFor": 20,
    "goalsAgainst": 5,
    "difference": 15,
    "points": 25
  },
  ...
]
```

### 9.2. Danh sách Vua phá lưới (Top Scorers)
* **Endpoint:** `GET /stats/top-scorers`
* **Params:** `?seasonId={id}`
* **Mô tả:** Thống kê số bàn thắng của từng cầu thủ từ bảng chi tiết trận đấu.

---

## 10. Mã lỗi (Error Codes) tham khảo
* `400 Bad Request`: Dữ liệu không hợp lệ (Vi phạm quy định tuổi, quá số lượng ngoại binh).
* `401 Unauthorized`: Chưa đăng nhập hoặc Token hết hạn.
* `403 Forbidden`: Không có quyền truy cập tài nguyên.
* `404 Not Found`: Không tìm thấy đối tượng (Đội bóng, Cầu thủ, Trận đấu).
* `409 Conflict`: Xung đột dữ liệu (Trùng lịch thi đấu, trùng mã cầu thủ).
