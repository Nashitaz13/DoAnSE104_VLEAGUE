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
-- 1. Bảng MuaGiai (Bảng gốc)
-- Tên khóa chính trong ảnh là: MuaGiai
CREATE TABLE MuaGiai (
    MuaGiai VARCHAR(50) PRIMARY KEY,
    NgayBatDau DATE,
    NgayKetThuc DATE,
    SoClbThamDuToiDa INT,
    LePhiThamGia DECIMAL(18, 2),
    SoCauThuToiThieu INT,
    SoCauThuToiDa INT,
    SoThuMonToiThieu INT,
    TuoiCauThuToiThieu INT,
    TuoiCauThuToiDa INT,
    SucChuaToiThieu INT,
    YeuCauSVD TEXT,
    ChungChiHLV VARCHAR(100),
    SoCauThuDangKyThiDauToiDa INT,
    ThoiDiemGhiBanToiDa INT,
    TrangThai VARCHAR(50)
);

-- 2. Bảng SanVanDong
-- Khóa chính: MaSanVanDong, MuaGiai (theo ảnh)
CREATE TABLE SanVanDong (
    MaSanVanDong VARCHAR(50),
    MuaGiai VARCHAR(50), -- Tên cột này trong ảnh là MuaGiai
    TenSanVanDong VARCHAR(100),
    DiaChiSvd TEXT,
    SucChua INT,
    DanhGiaFifa VARCHAR(50),
    
    PRIMARY KEY (MaSanVanDong, MuaGiai),
    FOREIGN KEY (MuaGiai) REFERENCES MuaGiai(MuaGiai)
);

-- 3. Bảng CauLacBo
-- Khóa chính: MaClb, MuaGiai (theo ảnh)
CREATE TABLE CauLacBo (
    MaClb VARCHAR(50),
    MuaGiai VARCHAR(50), 
    TenClb VARCHAR(100),
    DiaChiTruSo TEXT,
    DonViChuQuan VARCHAR(100),
    TrangPhucChuNha VARCHAR(100),
    TrangPhucKhach VARCHAR(100),
    TrangPhucDuPhong VARCHAR(100),
    MaSanVanDong VARCHAR(50),
    
    PRIMARY KEY (MaClb, MuaGiai),
    FOREIGN KEY (MuaGiai) REFERENCES MuaGiai(MuaGiai),
    -- Liên kết FK tới SanVanDong: Cần khớp MaSanVanDong và MuaGiai
    FOREIGN KEY (MaSanVanDong, MuaGiai) REFERENCES SanVanDong(MaSanVanDong, MuaGiai)
);

-- 4. Bảng CauThu
CREATE TABLE CauThu (
    MaCauThu VARCHAR(50) PRIMARY KEY,
    TenCauThu VARCHAR(100),
    NgaySinh DATE,
    NoiSinh VARCHAR(100),
    -- Trong ảnh có 2 dòng NoiSinh, tôi chỉ tạo 1 cột để tránh lỗi cú pháp SQL
    QuocTich VARCHAR(50),
    QuocTichKhac VARCHAR(50),
    ViTriThiDau VARCHAR(50),
    ChieuCao FLOAT,
    CanNang FLOAT
);

-- 5. Bảng LoaiCauThu
CREATE TABLE LoaiCauThu (
    MaLoaiCauThu VARCHAR(50) PRIMARY KEY,
    TenLoaiCauThu VARCHAR(100),
    SoCauThuToiDa INT,
    MuaGiai VARCHAR(50), -- Trong ảnh là MuaGiai
    FOREIGN KEY (MuaGiai) REFERENCES MuaGiai(MuaGiai)
);

-- 6. Bảng ChiTietDoiBong
-- PK: MaCauThu, MaClb, MuaGiai
CREATE TABLE ChiTietDoiBong (
    MaCauThu VARCHAR(50),
    MaClb VARCHAR(50),
    MuaGiai VARCHAR(50), -- Trong ảnh là MuaGiai
    SoAoThiDau INT,
    
    PRIMARY KEY (MaCauThu, MaClb, MuaGiai),
    FOREIGN KEY (MaCauThu) REFERENCES CauThu(MaCauThu),
    -- Map FK tới CauLacBo: (MaClb, MuaGiai) -> (MaClb, MuaGiai)
    FOREIGN KEY (MaClb, MuaGiai) REFERENCES CauLacBo(MaClb, MuaGiai)
);

-- 7. Bảng LichThiDau
CREATE TABLE LichThiDau (
    MaTran VARCHAR(50) PRIMARY KEY,
    MuaGiai VARCHAR(50), -- Trong ảnh là MuaGiai
    Vong INT,
    ThoiGianThiDau TIMESTAMP,
    MaClbNha VARCHAR(50),
    MaClbKhach VARCHAR(50),
    MaSanVanDong VARCHAR(50),
    SoKhanGia INT,
    NhietDo FLOAT,
    BuGioHiep1 INT,
    BuGioHiep2 INT,
    TiSo VARCHAR(20),
    
    FOREIGN KEY (MuaGiai) REFERENCES MuaGiai(MuaGiai),
    FOREIGN KEY (MaClbNha, MuaGiai) REFERENCES CauLacBo(MaClb, MuaGiai),
    FOREIGN KEY (MaClbKhach, MuaGiai) REFERENCES CauLacBo(MaClb, MuaGiai),
    FOREIGN KEY (MaSanVanDong, MuaGiai) REFERENCES SanVanDong(MaSanVanDong, MuaGiai)
);

-- 8. Bảng SuKienTranDau
CREATE TABLE SuKienTranDau (
    MaSuKien VARCHAR(50) PRIMARY KEY,
    LoaiSuKien VARCHAR(50),
    PhutThiDau INT,
    BuGio INT,
    MoTaSuKien TEXT,
    CauThuLienQuan VARCHAR(50),
    MaTran VARCHAR(50),
    MaClb VARCHAR(50),
    MaCauThu VARCHAR(50),
    
    FOREIGN KEY (MaTran) REFERENCES LichThiDau(MaTran),
    FOREIGN KEY (MaCauThu) REFERENCES CauThu(MaCauThu)
);

-- 9. Bảng DoiHinhXuatPhat
CREATE TABLE DoiHinhXuatPhat (
    MaTran VARCHAR(50),
    MaCauThu VARCHAR(50),
    ViTri VARCHAR(50),
    DuocXuatPhat BOOLEAN,
    LaDoiTruong BOOLEAN,
    
    PRIMARY KEY (MaTran, MaCauThu),
    FOREIGN KEY (MaTran) REFERENCES LichThiDau(MaTran),
    FOREIGN KEY (MaCauThu) REFERENCES CauThu(MaCauThu)
);

-- 10. Bảng ChiTietTrongTai
-- Đã chỉnh PK thành (MaTran, TenTrongTai) theo yêu cầu của bạn
CREATE TABLE ChiTietTrongTai (
    MaTran VARCHAR(50),
    TenTrongTai VARCHAR(100),
    ViTri VARCHAR(50),
    
    PRIMARY KEY (MaTran, TenTrongTai),
    FOREIGN KEY (MaTran) REFERENCES LichThiDau(MaTran)
);

-- 11. Bảng Diem
CREATE TABLE Diem (
    MuaGiai VARCHAR(50) PRIMARY KEY, -- Trong ảnh là MuaGiai
    DiemThang INT,
    DiemHoa INT,
    DiemThua INT,
    FOREIGN KEY (MuaGiai) REFERENCES MuaGiai(MuaGiai)
);

-- 12. Bảng ThongKeCauThu
CREATE TABLE ThongKeCauThu (
    MaCauThu VARCHAR(50) PRIMARY KEY,
    SoTranDaChoi INT DEFAULT 0,
    SoPhutDaChoi INT DEFAULT 0,
    KienTao INT DEFAULT 0,
    BanThang INT DEFAULT 0,
    TheVang INT DEFAULT 0,
    TheVangThu2 INT DEFAULT 0,
    TheDo INT DEFAULT 0,
    GiuSachLuoi INT DEFAULT 0,
    ThungLuoi INT DEFAULT 0,
    FOREIGN KEY (MaCauThu) REFERENCES CauThu(MaCauThu)
);

-- 13. Bảng BXH_DoiBong
CREATE TABLE BXH_DoiBong (
    MuaGiai VARCHAR(50), -- Trong ảnh là MuaGiai (FK1)
    MaClb VARCHAR(50),   -- FK2
    SoTran INT DEFAULT 0,
    Thang INT DEFAULT 0,
    Hoa INT DEFAULT 0,
    Thua INT DEFAULT 0,
    BanThang INT DEFAULT 0,
    BanThua INT DEFAULT 0,
    Diem INT DEFAULT 0,
    ThuHang INT,
    
    PRIMARY KEY (MuaGiai, MaClb),

    FOREIGN KEY (MaClb, MuaGiai) REFERENCES CauLacBo(MaClb, MuaGiai)
);

-- 14. Bảng ThongKeTranDau
CREATE TABLE ThongKeTranDau (
    MaTran VARCHAR(50),
    MaClb VARCHAR(50),
    KiemSoatBong FLOAT,
    Sut INT,
    SutTrungDich INT,
    PhatGoc INT,
    PhamLoi INT,
    VietVi INT,
    CauThuXuatSac varchar(50),    
    PRIMARY KEY (MaTran, MaClb),
    FOREIGN KEY (MaTran) REFERENCES LichThiDau(MaTran)
);

