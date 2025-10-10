language plpgsql;


-- 9. BẢNG TRẬN ĐẤU (MATCHES)
CREATE TABLE tran_dau (
    ma_tran INT PRIMARY KEY,
    mua_giai CHAR(9) NOT NULL,
    ma_vong INT NOT NULL,
    thoi_gian TIMESTAMP NOT NULL,
    ma_clb_nha INT NOT NULL,
    ma_clb_khach INT NOT NULL,
    ma_san_van_dong INT NOT NULL,
    ti_so_clb_nha INT DEFAULT 0 CHECK (ti_so_clb_nha >= 0),
    ti_so_clb_khach INT DEFAULT 0 CHECK (ti_so_clb_khach >= 0),
    trang_thai_tran VARCHAR(20) DEFAULT 'SCHEDULED', -- SCHEDULED, LIVE, FINISHED, POSTPONED, CANCELLED
    khan_gia INT CHECK (khan_gia >= 0),
    nhiet_do DECIMAL(4,1),
    trong_tai_chinh VARCHAR(100),
    tro_ly_trong_tai_1 VARCHAR(100),
    tro_ly_trong_tai_2 VARCHAR(100),
    trong_tai_thu_4 VARCHAR(100),
    trong_tai_video VARCHAR(100),
    tro_ly_var VARCHAR(100),
    giam_sat_thi_dau VARCHAR(100),
    giam_sat_trong_tai VARCHAR(100),
    bu_gio_hiep_1 INT DEFAULT 0,
    bu_gio_hiep_2 INT DEFAULT 0,
    FOREIGN KEY (mua_giai) REFERENCES mua_giai(mua_giai),
    FOREIGN KEY (ma_clb_nha) REFERENCES cau_lac_bo(ma_clb),
    FOREIGN KEY (ma_clb_khach) REFERENCES cau_lac_bo(ma_clb),
    FOREIGN KEY (ma_san_van_dong) REFERENCES san_van_dong(ma_san_van_dong),
    CHECK (ma_clb_nha != ma_clb_khach)
);

-- 11. BẢNG ĐỘI HÌNH XUẤT PHÁT (MATCH_LINEUPS)
CREATE TABLE match_lineups (
    ma_tran INT NOT NULL,
    ma_clb INT NOT NULL,
    ma_cau_thu INT NOT NULL,
    so_ao INT NOT NULL CHECK (so_ao BETWEEN 1 AND 99),
    vi_tri VARCHAR(20) NOT NULL,
    cau_thu_xuat_phat INT NOT NULL DEFAULT 1 , -- 1: Xuất phát, 0: Dự bị
    vi_tri_thi_dau VARCHAR(10), -- VD: 'CB1', 'CM2', 'ST'
    doi_truong INT DEFAULT 0,
    thu_mon INT DEFAULT 0,
    phut_thay INT CHECK (phut_thay BETWEEN 1 AND 90),
    bu_gio_thay INT DEFAULT 0,
    cau_thu_thay INT, -- player_id của cầu thủ thay vào
    FOREIGN KEY (ma_tran) REFERENCES tran_dau(ma_tran),
    FOREIGN KEY (ma_clb) REFERENCES cau_lac_bo(ma_clb),
    FOREIGN KEY (ma_cau_thu) REFERENCES cau_thu(ma_cau_thu),
    FOREIGN KEY (cau_thu_thay) REFERENCES cau_thu(ma_cau_thu),
    UNIQUE(ma_tran, ma_clb, ma_cau_thu)
);

-- 12. BẢNG SỰ KIỆN TRẬN ĐẤU (MATCH_EVENTS)
CREATE TABLE su_kien_tran_dau (
    ma_su_kien INT PRIMARY KEY,
    ma_tran INT NOT NULL,
    ma_clb INT NOT NULL,
    ma_cau_thu INT,
    loai_su_kien VARCHAR(30) NOT NULL, -- bàn thắng, thẻ vàng, thẻ đỏ, thay người, bàn thắng phạt đền, bàn thắng phản lưới nhà, v.v.
    phut_thi_dau INT NOT NULL CHECK (phut_thi_dau BETWEEN 1 AND 90),
    bu_gio INT DEFAULT 0,
    mo_ta_su_kien VARCHAR(500),
    cau_thu_kien_tao INT, -- Cầu thủ kiến tạo (nếu có)
    cau_thu_lien_quan INT, -- Cầu thủ liên quan (VD: bị thay)
    FOREIGN KEY (ma_tran) REFERENCES tran_dau(ma_tran),
    FOREIGN KEY (ma_clb) REFERENCES cau_lac_bo(ma_clb),
    FOREIGN KEY (ma_cau_thu) REFERENCES cau_thu(ma_cau_thu),
    FOREIGN KEY (cau_thu_kien_tao) REFERENCES cau_thu(ma_cau_thu),
    FOREIGN KEY (cau_thu_lien_quan) REFERENCES cau_thu(ma_cau_thu)
);

-- 13. BẢNG THỐNG KÊ TRẬN ĐẤU (MATCH_STATS)
CREATE TABLE thong_ke_tran_dau (
    ma_tran INT NOT NULL,
    ma_clb INT NOT NULL,
    kiem_soat_bong DECIMAL(5,2) CHECK (kiem_soat_bong BETWEEN 0 AND 100),
    sut INT DEFAULT 0,
    sut_trung_dich INT DEFAULT 0,
    phat_goc INT DEFAULT 0,
    viet_vi INT DEFAULT 0,
    pham_loi INT DEFAULT 0,
    the_vang INT DEFAULT 0,
    the_do INT DEFAULT 0,
    FOREIGN KEY (ma_tran) REFERENCES tran_dau(ma_tran),
    FOREIGN KEY (ma_clb) REFERENCES cau_lac_bo(ma_clb),
    UNIQUE(ma_tran, ma_clb)
);

-- 14. BẢNG THỐNG KÊ CÁ NHÂN TRẬN ĐẤU (PLAYER_MATCH_STATS)
CREATE TABLE thong_ke_ca_nhan (
    ma_tran INT NOT NULL,
    ma_cau_thu INT NOT NULL,
    so_phut_thi_dau INT DEFAULT 0 CHECK (so_phut_thi_dau BETWEEN 0 AND 120),
    ban_thang INT DEFAULT 0,
    kien_tao INT DEFAULT 0,
    sut INT DEFAULT 0,
    sut_trung_dich INT DEFAULT 0,
    the_vang INT DEFAULT 0,
    the_do INT DEFAULT 0,
    pham_loi INT DEFAULT 0,
    bi_pham_loi INT DEFAULT 0,
    cham_diem DECIMAL(3,1) NOT NULL CHECK (cham_diem BETWEEN 1.0 AND 10.0),
    cau_thu_xuat_sac_nhat_tran_dau INT DEFAULT 0, --Cầu thủ xuất sắc nhất trận
    FOREIGN KEY (ma_tran) REFERENCES tran_dau(ma_tran),
    FOREIGN KEY (ma_cau_thu) REFERENCES cau_thu(ma_cau_thu),
    UNIQUE(ma_tran, ma_cau_thu)
);