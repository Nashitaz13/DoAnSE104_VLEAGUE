language plpgsql;

CREATE DATABASE "vleague"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'vi-VN'
    LC_CTYPE = 'vi-VN'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

    -- 1. BẢNG MÙA GIẢI (SEASONS)
CREATE TABLE mua_giai (
    mua_giai CHAR(9) PRIMARY KEY, -- VD: '2024-2025'
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    clb_tham_du INT DEFAULT 10,
    le_phi_tham_gia DECIMAL(15,0) DEFAULT 1000000000, -- 1 tỷ VND
    trang_thai VARCHAR(20) DEFAULT 'ACTIVE'
);

-- 2. BẢNG SÂN VẬN ĐỘNG (STADIUMS)
CREATE TABLE san_van_dong (
    ma_san_van_dong INT PRIMARY KEY,
    ten_san_van_dong VARCHAR(100) NOT NULL,
    tinh_thanh_pho VARCHAR(50) NOT NULL,
    dia_chi VARCHAR(500),
    suc_chua INT NOT NULL CHECK (suc_chua >= 10000),
    danh_gia_fifa INT CHECK (danh_gia_fifa BETWEEN 1 AND 5),
    co_so_vat_chat TEXT,
    trang_thai VARCHAR(20) DEFAULT 'Hoạt động'
);

-- 3. BẢNG CÂU LẠC BỘ (CLB)
CREATE TABLE cau_lac_bo (
    ma_clb INT PRIMARY KEY,
    code_clb CHAR(3) UNIQUE NOT NULL, -- VD: 'HAN', 'HCM', dùng trong bảng xếp hạng, bảng tỉ số
    ten_clb VARCHAR(100) NOT NULL,
    nam_thanh_lap INT,
    ma_san_van_dong INT,
    trang_phuc_chu_nha VARCHAR(50), --VD: TRẮNG - TRẮNG - TRẮNG
    trang_phuc_khach VARCHAR(50), --VD: ĐỎ - ĐỎ - ĐỎ
    trang_phuc_thu_ba VARCHAR(50), --VD: XANH - XANH - XANH
    logo_url VARCHAR(500),
    dia_chi_tru_so VARCHAR(500),
    so_dien_thoai VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(200),
    co_quan_chu_quan VARCHAR(200),
    trang_thai VARCHAR(20) DEFAULT 'Hoạt động',
    FOREIGN KEY (ma_san_van_dong) REFERENCES san_van_dong(ma_san_van_dong)
);

-- 4. BẢNG ĐĂNG KÝ THAM GIA MÙA GIẢI (CLUB_SEASONS)
CREATE TABLE clb_tham_gia (
    mua_giai CHAR(9) NOT NULL,
    ma_clb INT NOT NULL,
    ngay_nop_ho_so DATE NOT NULL,
    trang_thai_thanh_toan VARCHAR(20) DEFAULT 'Đang chờ', -- Đang chờ, Đã hoàn thành, Chưa hoàn thành
    trang_thai_phe_duyet VARCHAR(20) DEFAULT 'Đang chờ', -- Đang chờ, Đã phê duyệt, Từ chối
    ngay_phe_duyet DATE,
    ghi_chu TEXT,
    FOREIGN KEY (mua_giai) REFERENCES mua_giai(mua_giai),
    FOREIGN KEY (ma_clb) REFERENCES cau_lac_bo(ma_clb),
    UNIQUE(mua_giai, ma_clb)
);

-- 5. BẢNG CẦU THỦ (PLAYERS)
CREATE TABLE cau_thu (
    ma_cau_thu INT  PRIMARY KEY,
    ho VARCHAR(20) NOT NULL,
    ten_dem VARCHAR(100),
    ten VARCHAR(20) NOT NULL,
    full_name VARCHAR(150) GENERATED ALWAYS AS (ho || ' ' || ten_dem || ' ' || ten) STORED,
    ngay_sinh DATE NOT NULL,
    noi_sinh VARCHAR(100),
    quoc_tich VARCHAR(50) NOT NULL,
    quoc_tich_phu VARCHAR(50),
    chieu_cao DECIMAL(5,2) CHECK (chieu_cao > 0),
    can_nang DECIMAL(5,2) CHECK (can_nang > 0),
    vi_tri_thi_dau VARCHAR(20) NOT NULL, -- TM, HV, TV, TĐ
    cau_thu_ngoai INT GENERATED ALWAYS AS (CASE WHEN quoc_tich != 'Việt Nam' THEN 1 ELSE 0 END) STORED,
    trang_thai VARCHAR(20) DEFAULT 'Hoạt động',
    CHECK ((EXTRACT(YEAR FROM AGE(CURRENT_DATE, ngay_sinh))) BETWEEN 16 AND 40)
);

-- Bảng đăng ký cầu thủ 
CREATE TABLE dang_ky_cau_thu (
    ma_cau_thu INT NOT NULL,
    ma_clb INT NOT NULL,
    mua_giai CHAR(9) NOT NULL,
    so_ao INT CHECK (so_ao BETWEEN 1 AND 99),
    ngay_dang_ky DATE NOT NULL,
    trang_thai_dang_ky VARCHAR(20),
    ghi_chu TEXT,
    FOREIGN KEY (ma_cau_thu) REFERENCES cau_thu(ma_cau_thu),
    FOREIGN KEY (ma_clb) REFERENCES cau_lac_bo(ma_clb),
    FOREIGN KEY (mua_giai) REFERENCES mua_giai(mua_giai),
    UNIQUE(ma_clb, mua_giai, so_ao),
    UNIQUE(ma_cau_thu, mua_giai)
);

-- 7. BẢNG NHÂN SỰ/HLV (STAFF)
CREATE TABLE nhan_su (
    ma_nhan_su INT  PRIMARY KEY,
    ho VARCHAR(20) NOT NULL,
    ten_dem VARCHAR(100),
    ten VARCHAR(20) NOT NULL,
    ho_ten_day_du VARCHAR(150) GENERATED ALWAYS AS (ho || ' ' || ten_dem || ' ' || ten) STORED,
    ngay_sinh DATE NOT NULL,
    quoc_tich VARCHAR(50) NOT NULL,
    trinh_do_bang_cap VARCHAR(20), -- AFC_PRO, AFC_A, AFC_B, etc.
    phone VARCHAR(20),
    email VARCHAR(100)
);

-- Bảng vị trí nhân sự 
CREATE TABLE dang_ky_nhan_su (
    ma_nhan_su INT NOT NULL,
    ma_clb INT NOT NULL,
    mua_giai CHAR(9) NOT NULL,
    vi_tri VARCHAR(30) NOT NULL, -- HLV, PT, HLVT, BHL, NVKT, NVYT, etc.
    trang_thai_dang_ky VARCHAR(20) DEFAULT 'Đang chờ',
    ghi_chu TEXT,
    FOREIGN KEY (ma_nhan_su) REFERENCES nhan_su(ma_nhan_su),
    FOREIGN KEY (ma_clb) REFERENCES cau_lac_bo(ma_clb),
    FOREIGN KEY (mua_giai) REFERENCES mua_giai(mua_giai),
    UNIQUE(ma_nhan_su, mua_giai)
);

