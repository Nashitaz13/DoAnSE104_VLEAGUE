language plpgsql;

-- 15. BẢNG XẾP HẠNG (STANDINGS) 
CREATE TABLE bang_xep_hang (
    mua_giai CHAR(9) NOT NULL,
    ma_clb INT NOT NULL,
    so_vong INT NOT NULL, -- Xếp hạng sau vòng nào
    vi_tri INT NOT NULL CHECK (vi_tri > 0),
    so_tran_da_choi INT DEFAULT 0,
    thang INT DEFAULT 0,
    hoa INT DEFAULT 0,
    thua INT DEFAULT 0,
    so_ban_thang INT DEFAULT 0,
    so_ban_thua INT DEFAULT 0,
    hieu_so INT DEFAULT 0,
    points INT DEFAULT 0,
    phong_do_5_tran_gan_nhat VARCHAR(5), -- VD: 'WWDLW'
    tong_so_the_vang INT DEFAULT 0,
    tong_so_the_do INT DEFAULT 0,
    ghi_chu TEXT,
    FOREIGN KEY (mua_giai) REFERENCES mua_giai(mua_giai),
    FOREIGN KEY (ma_clb) REFERENCES cau_lac_bo(ma_clb),
    UNIQUE(mua_giai, ma_clb, so_vong)
);

CREATE TABLE thong_ke_cau_thu (
    ma_cau_thu INT NOT NULL,
    ma_clb INT NOT NULL,
    mua_giai CHAR(9) NOT NULL,
    so INT DEFAULT 0,
    so_tran_da_choi INT DEFAULT 0,
    so_phut_da_choi INT DEFAULT 0,
    ban_thang INT DEFAULT 0,
    kien_tao INT DEFAULT 0,
    the_vang INT DEFAULT 0, --Lưu ý: Cứ mỗi 3 thẻ vàng sẽ bị treo giò 1 trận - quy định của V-League
    the_vang_thu_2 INT DEFAULT 0,
    the_do INT DEFAULT 0,
    cau_thu_xuat_sac_nhat_tran_dau INT DEFAULT 0,
    diem_trung_binh DECIMAL(3,1),
    giu_sach_luoi INT DEFAULT 0, -- Chỉ áp dụng cho thủ môn
    thung_luoi INT DEFAULT 0, -- Chỉ áp dụng cho thủ môn
    FOREIGN KEY (ma_cau_thu) REFERENCES cau_thu(ma_cau_thu),
    FOREIGN KEY (ma_clb) REFERENCES cau_lac_bo(ma_clb),
    FOREIGN KEY (mua_giai) REFERENCES mua_giai(mua_giai),
    UNIQUE(ma_cau_thu, mua_giai)
);


