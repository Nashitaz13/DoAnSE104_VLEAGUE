-- =============================================
-- V-LEAGUE Database Schema
-- Hệ thống quản lý giải bóng đá Vô địch Quốc Gia
-- =============================================

-- Drop existing tables if exist (for clean setup)
DROP TABLE IF EXISTS BanThang CASCADE;
DROP TABLE IF EXISTS ThePhat CASCADE;
DROP TABLE IF EXISTS BangXepHang CASCADE;
DROP TABLE IF EXISTS TranDau CASCADE;
DROP TABLE IF EXISTS CauThu CASCADE;
DROP TABLE IF EXISTS DoiBong CASCADE;
DROP TABLE IF EXISTS San CASCADE;
DROP TABLE IF EXISTS MuaGiai CASCADE;
DROP TABLE IF EXISTS QuyDinh CASCADE;
DROP TABLE IF EXISTS TaiKhoan CASCADE;
DROP TABLE IF EXISTS NhomNguoiDung CASCADE;
DROP TABLE IF EXISTS LoaiBanThang CASCADE;
DROP TABLE IF EXISTS LoaiCauThu CASCADE;

-- =============================================
-- 1. LOOKUP TABLES (Bảng tra cứu)
-- =============================================

-- Loại cầu thủ: Nội binh / Ngoại binh
CREATE TABLE LoaiCauThu (
    MaLoaiCauThu SERIAL PRIMARY KEY,
    TenLoai VARCHAR(50) NOT NULL UNIQUE
);

-- Loại bàn thắng: A, B, C
CREATE TABLE LoaiBanThang (
    MaLoaiBanThang SERIAL PRIMARY KEY,
    TenLoai VARCHAR(10) NOT NULL UNIQUE,
    MoTa VARCHAR(100)
);

-- =============================================
-- 2. USER MANAGEMENT (Quản lý người dùng)
-- =============================================

-- Nhóm người dùng / Vai trò
CREATE TABLE NhomNguoiDung (
    MaNhom SERIAL PRIMARY KEY,
    TenNhom VARCHAR(50) NOT NULL UNIQUE,
    MoTa VARCHAR(255)
);

-- Tài khoản người dùng
CREATE TABLE TaiKhoan (
    MaTaiKhoan SERIAL PRIMARY KEY,
    TenDangNhap VARCHAR(100) NOT NULL UNIQUE,
    MatKhau VARCHAR(255) NOT NULL,
    HoTen VARCHAR(100),
    Email VARCHAR(100),
    MaNhom INTEGER REFERENCES NhomNguoiDung(MaNhom),
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 3. REGULATIONS (Quy định giải đấu)
-- =============================================

CREATE TABLE QuyDinh (
    MaQuyDinh SERIAL PRIMARY KEY,
    TenQuyDinh VARCHAR(100) NOT NULL UNIQUE,
    GiaTri INTEGER NOT NULL,
    MoTa VARCHAR(255),
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 4. SEASON MANAGEMENT (Quản lý mùa giải)
-- =============================================

CREATE TABLE MuaGiai (
    MaMuaGiai SERIAL PRIMARY KEY,
    TenMuaGiai VARCHAR(100) NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    TrangThai VARCHAR(20) DEFAULT 'Active' CHECK (TrangThai IN ('Active', 'Finished', 'Cancelled')),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 5. STADIUM & TEAM (Sân vận động & Đội bóng)
-- =============================================

-- Sân vận động
CREATE TABLE San (
    MaSan SERIAL PRIMARY KEY,
    TenSan VARCHAR(100) NOT NULL,
    DiaChi VARCHAR(255),
    SucChua INTEGER
);

-- Đội bóng
CREATE TABLE DoiBong (
    MaDoi SERIAL PRIMARY KEY,
    TenDoi VARCHAR(100) NOT NULL,
    MaSan INTEGER REFERENCES San(MaSan),
    MaMuaGiai INTEGER REFERENCES MuaGiai(MaMuaGiai),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(TenDoi, MaMuaGiai)
);

-- =============================================
-- 6. PLAYER (Cầu thủ)
-- =============================================

CREATE TABLE CauThu (
    MaCauThu SERIAL PRIMARY KEY,
    TenCauThu VARCHAR(100) NOT NULL,
    NgaySinh DATE NOT NULL,
    MaLoaiCauThu INTEGER REFERENCES LoaiCauThu(MaLoaiCauThu),
    ViTri VARCHAR(50),
    SoAo INTEGER,
    MaDoi INTEGER REFERENCES DoiBong(MaDoi),
    GhiChu VARCHAR(255),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(SoAo, MaDoi)
);

-- =============================================
-- 7. MATCH (Trận đấu)
-- =============================================

CREATE TABLE TranDau (
    MaTranDau SERIAL PRIMARY KEY,
    MaMuaGiai INTEGER REFERENCES MuaGiai(MaMuaGiai),
    VongDau VARCHAR(50),
    MaDoiNha INTEGER REFERENCES DoiBong(MaDoi),
    MaDoiKhach INTEGER REFERENCES DoiBong(MaDoi),
    MaSan INTEGER REFERENCES San(MaSan),
    NgayThiDau TIMESTAMP,
    TrangThai VARCHAR(20) DEFAULT 'Scheduled' CHECK (TrangThai IN ('Scheduled', 'Finished', 'Cancelled', 'Postponed')),
    SoBanThangDoiNha INTEGER DEFAULT 0,
    SoBanThangDoiKhach INTEGER DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (MaDoiNha != MaDoiKhach)
);

-- =============================================
-- 8. MATCH EVENTS (Sự kiện trận đấu)
-- =============================================

-- Bàn thắng
CREATE TABLE BanThang (
    MaBanThang SERIAL PRIMARY KEY,
    MaTranDau INTEGER REFERENCES TranDau(MaTranDau) ON DELETE CASCADE,
    MaCauThu INTEGER REFERENCES CauThu(MaCauThu),
    MaDoi INTEGER REFERENCES DoiBong(MaDoi),
    ThoiDiem INTEGER NOT NULL, -- Phút ghi bàn
    MaLoaiBanThang INTEGER REFERENCES LoaiBanThang(MaLoaiBanThang),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thẻ phạt
CREATE TABLE ThePhat (
    MaThePhat SERIAL PRIMARY KEY,
    MaTranDau INTEGER REFERENCES TranDau(MaTranDau) ON DELETE CASCADE,
    MaCauThu INTEGER REFERENCES CauThu(MaCauThu),
    MaDoi INTEGER REFERENCES DoiBong(MaDoi),
    ThoiDiem INTEGER NOT NULL, -- Phút nhận thẻ
    LoaiThe VARCHAR(20) NOT NULL CHECK (LoaiThe IN ('Yellow', 'Red')),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 9. STANDINGS (Bảng xếp hạng)
-- =============================================

CREATE TABLE BangXepHang (
    MaBXH SERIAL PRIMARY KEY,
    MaMuaGiai INTEGER REFERENCES MuaGiai(MaMuaGiai),
    MaDoi INTEGER REFERENCES DoiBong(MaDoi),
    SoTran INTEGER DEFAULT 0,
    Thang INTEGER DEFAULT 0,
    Hoa INTEGER DEFAULT 0,
    Thua INTEGER DEFAULT 0,
    BanThang INTEGER DEFAULT 0,
    BanThua INTEGER DEFAULT 0,
    HieuSo INTEGER DEFAULT 0,
    Diem INTEGER DEFAULT 0,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(MaMuaGiai, MaDoi)
);

-- =============================================
-- INDEXES (Chỉ mục tối ưu hiệu suất)
-- =============================================

CREATE INDEX idx_doibong_muagiai ON DoiBong(MaMuaGiai);
CREATE INDEX idx_cauthu_doi ON CauThu(MaDoi);
CREATE INDEX idx_cauthu_loai ON CauThu(MaLoaiCauThu);
CREATE INDEX idx_trandau_muagiai ON TranDau(MaMuaGiai);
CREATE INDEX idx_trandau_doinha ON TranDau(MaDoiNha);
CREATE INDEX idx_trandau_doikhach ON TranDau(MaDoiKhach);
CREATE INDEX idx_trandau_ngay ON TranDau(NgayThiDau);
CREATE INDEX idx_banthang_trandau ON BanThang(MaTranDau);
CREATE INDEX idx_banthang_cauthu ON BanThang(MaCauThu);
CREATE INDEX idx_thephat_trandau ON ThePhat(MaTranDau);
CREATE INDEX idx_bangxephang_muagiai ON BangXepHang(MaMuaGiai);

-- =============================================
-- INITIAL DATA (Dữ liệu khởi tạo)
-- =============================================

-- Loại cầu thủ mặc định
INSERT INTO LoaiCauThu (TenLoai) VALUES 
    ('Trong nước'),
    ('Nước ngoài');

-- Loại bàn thắng mặc định
INSERT INTO LoaiBanThang (TenLoai, MoTa) VALUES 
    ('A', 'Bàn thắng thông thường'),
    ('B', 'Bàn thắng từ phạt đền'),
    ('C', 'Bàn thắng phản lưới nhà');

-- Nhóm người dùng mặc định
INSERT INTO NhomNguoiDung (TenNhom, MoTa) VALUES 
    ('BTC', 'Ban Tổ Chức - Quản trị viên hệ thống'),
    ('QuanLyDoi', 'Quản lý đội bóng'),
    ('Viewer', 'Người xem - Chỉ có quyền xem');

-- Quy định mặc định
INSERT INTO QuyDinh (TenQuyDinh, GiaTri, MoTa) VALUES 
    ('TuoiToiThieu', 16, 'Tuổi tối thiểu của cầu thủ'),
    ('TuoiToiDa', 40, 'Tuổi tối đa của cầu thủ'),
    ('SoLuongCauThuNuocNgoai', 3, 'Số lượng cầu thủ nước ngoài tối đa mỗi đội'),
    ('SoCauThuToiThieu', 15, 'Số cầu thủ tối thiểu mỗi đội'),
    ('SoCauThuToiDa', 22, 'Số cầu thủ tối đa mỗi đội'),
    ('DiemThang', 3, 'Điểm khi thắng trận'),
    ('DiemHoa', 1, 'Điểm khi hòa trận'),
    ('DiemThua', 0, 'Điểm khi thua trận'),
    ('ThoiDiemGhiBanToiDa', 90, 'Thời điểm ghi bàn tối đa (phút)');

-- Tài khoản admin mặc định (password: admin123 - cần hash khi dùng thực tế)
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, HoTen, Email, MaNhom) VALUES 
    ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.lSqz.nnxQq8vWG', 'Administrator', 'admin@vleague.vn', 1);
