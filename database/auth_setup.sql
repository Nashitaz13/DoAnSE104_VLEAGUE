-- ====================================================
-- V-League Authentication Helper Functions
-- Sử dụng pgcrypto extension để hash password với bcrypt
-- ====================================================

-- Kích hoạt extension pgcrypto (cần quyền SUPERUSER lần đầu)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ====================================================
-- Hàm hash password với bcrypt (tương tự AUTH_example.sql)
-- ====================================================
CREATE OR REPLACE FUNCTION vleague_hash_password(p_password text)
RETURNS text
LANGUAGE sql
AS $$
    SELECT crypt(p_password, gen_salt('bf', 12));
$$;

-- ====================================================
-- Hàm tạo tài khoản an toàn với password hash
-- ====================================================
CREATE OR REPLACE FUNCTION vleague_create_account(
    p_tendangnhap text, 
    p_password text, 
    p_hoten text DEFAULT NULL,
    p_email text DEFAULT NULL,
    p_manhom int DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validate password length
    IF p_password IS NULL OR length(trim(p_password)) < 8 THEN
        RAISE EXCEPTION 'Mật khẩu quá ngắn (cần >= 8 ký tự)';
    END IF;
    
    -- Check if username already exists
    IF EXISTS (SELECT 1 FROM taikhoan WHERE tendangnhap = p_tendangnhap) THEN
        RAISE EXCEPTION 'Tên đăng nhập % đã tồn tại', p_tendangnhap;
    END IF;
    
    -- Insert with hashed password
    INSERT INTO taikhoan (tendangnhap, matkhau, hoten, email, manhom, isactive, createdat, updatedat)
    VALUES (
        p_tendangnhap, 
        vleague_hash_password(p_password), 
        p_hoten, 
        p_email, 
        p_manhom,
        true,
        NOW(),
        NOW()
    );
END;
$$;

-- ====================================================
-- Hàm thay đổi password
-- ====================================================
CREATE OR REPLACE FUNCTION vleague_change_password(
    p_tendangnhap text,
    p_new_password text
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_new_password IS NULL OR length(trim(p_new_password)) < 8 THEN
        RAISE EXCEPTION 'Mật khẩu quá ngắn (cần >= 8 ký tự)';
    END IF;
    
    UPDATE taikhoan 
    SET matkhau = vleague_hash_password(p_new_password),
        updatedat = NOW()
    WHERE tendangnhap = p_tendangnhap;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không tìm thấy tài khoản %', p_tendangnhap;
    END IF;
END;
$$;

-- ====================================================
-- Tạo các nhóm người dùng (roles) mặc định
-- ==================================================== 
INSERT INTO NhomNguoiDung (TenNhom, MoTa) VALUES 
('Admin', 'Quản trị viên hệ thống'),
('BTC', 'Ban tổ chức giải đấu'),
('TrongTai', 'Tổ trọng tài'),
('CLB', 'Đại diện câu lạc bộ');

INSERT INTO nhomnguoidung (tennhom, mota) 
VALUES ('Viewer', 'Người xem - Chỉ đọc')
ON CONFLICT (tennhom) DO NOTHING;

-- ====================================================
-- Tạo tài khoản admin mặc định
-- Password: admin123 (đã được hash với bcrypt)
-- ====================================================
SELECT vleague_create_account(
    'admin',              -- tendangnhap
    'admin123',           -- password (sẽ được hash)
    'Administrator',      -- hoten
    'admin@vleague.vn',  -- email
    (SELECT manhom FROM nhomnguoidung WHERE tennhom = 'BTC' LIMIT 1)  -- manhom
);

-- ====================================================
-- Tạo thêm một số tài khoản test (optional)
-- ====================================================
-- Tài khoản quản lý đội
SELECT vleague_create_account(
    'quanlydoi1',
    'manager123',
    'Quản lý Hà Nội FC',
    'qldoi1@vleague.vn',
    (SELECT manhom FROM nhomnguoidung WHERE tennhom = 'QuanLyDoi' LIMIT 1)
);

-- Tài khoản viewer
SELECT vleague_create_account(
    'viewer1',
    'viewer123',
    'Người xem',
    'viewer@vleague.vn',
    (SELECT manhom FROM nhomnguoidung WHERE tennhom = 'Viewer' LIMIT 1)
);

-- ====================================================
-- THÔNG TIN QUAN TRỌNG
-- ====================================================
/*
CÁC TÀI KHOẢN ĐÃ TẠO:

1. Admin (BTC):
   - Username: admin
   - Password: admin123
   
2. Quản lý đội:
   - Username: quanlydoi1
   - Password: manager123
   
3. Viewer:
   - Username: viewer1
   - Password: viewer123

LƯU Ý:
- Tất cả passwords đã được hash với bcrypt
- API Python sẽ tự động verify được vì đều dùng bcrypt
- Để tạo user mới, dùng function: 
  SELECT vleague_create_account('username', 'password', 'Họ tên', 'email@example.com', manhom_id);
- Để đổi password:
  SELECT vleague_change_password('username', 'new_password');
*/
