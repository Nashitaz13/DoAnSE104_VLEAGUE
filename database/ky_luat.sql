-- 19. BẢNG HÀNH VI KỶ LUẬT (DISCIPLINARY_ACTIONS)
CREATE TABLE ky_luat (
    ma_ky_luat INT PRIMARY KEY,
    mua_giai CHAR(9) NOT NULL,
    ma_cau_thu INT,
    ma_nhan_su INT,
    ma_clb INT NOT NULL,
    ma_tran INT, -- Có thể null nếu kỷ luật ngoài sân
    ngay_vi_pham TIMESTAMP NOT NULL,
    loai_vi_pham VARCHAR(50) NOT NULL, -- YELLOW_CARD, RED_CARD, MISCONDUCT, VIOLENT_CONDUCT, etc.
    mo_ta_vi_pham TEXT NOT NULL,
    trong_tai_bao_cao TEXT,
    quyet_dinh_cua_ban_ky_luat TEXT,
    hinh_thuc_ky_luat VARCHAR(50), -- Cấm thi đấu, Phạt tiền, Cảnh cáo, etc.
    so_tran_cam_thi_dau INT DEFAULT 0,
    phat_tien DECIMAL(12,0) DEFAULT 0,
    vong_duoc_thi_dau INT, -- Vòng được thi đấu trở lại
    trang_thai VARCHAR(20) DEFAULT 'Đang chấp hành', -- Đang chấp hành, Đã hoàn thành, Đã hủy
    ghi_chu TEXT,
    FOREIGN KEY (mua_giai) REFERENCES mua_giai(mua_giai),
    FOREIGN KEY (ma_cau_thu) REFERENCES cau_thu(ma_cau_thu),
    FOREIGN KEY (ma_nhan_su) REFERENCES nhan_su(ma_nhan_su),
    FOREIGN KEY (ma_clb) REFERENCES cau_lac_bo(ma_clb),
    FOREIGN KEY (ma_tran) REFERENCES tran_dau(ma_tran),
    CHECK ((ma_cau_thu IS NOT NULL AND ma_nhan_su IS NULL) OR (ma_cau_thu IS NULL AND ma_nhan_su IS NOT NULL))
);
