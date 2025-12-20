-- ============================================================
-- DATA SAMPLE FOR V-LEAGUE DATABASE (POSTGRESQL)
-- Mùa giải: 2025-2026
-- Số lượng đội: 10
-- ============================================================

-- 1. DỮ LIỆU NHÓM NGƯỜI DÙNG & TÀI KHOẢN
-- (Commented out to avoid conflict with auth_setup.sql)
-- INSERT INTO NhomNguoiDung (TenNhom, MoTa) VALUES 
-- ('Admin', 'Quản trị viên hệ thống'),
-- ('BTC', 'Ban tổ chức giải đấu'),
-- ('TrongTai', 'Tổ trọng tài'),
-- ('CLB', 'Đại diện câu lạc bộ');

-- INSERT INTO TaiKhoan (TenDangNhap, MatKhau, HoTen, Email, MaNhom, IsActive) VALUES
-- ('admin', 'admin123', 'Nguyen Van Admin', 'admin@vleague.vn', 1, TRUE),
-- ('btc_user', 'btc123', 'Tran Van BTC', 'btc@vleague.vn', 2, TRUE);


-- 2. DỮ LIỆU MÙA GIẢI
-- Dữ liệu Mùa giải 2023-2024 (Đang diễn ra/Vừa kết thúc)
INSERT INTO MuaGiai (
    MuaGiai, NgayBatDau, NgayKetThuc, SoClbThamDuToiDa, LePhiThamGia, 
    SoCauThuToiThieu, SoCauThuToiDa, SoThuMonToiThieu, TuoiCauThuToiThieu, TuoiCauThuToiDa, 
    SucChuaToiThieu, YeuCauSVD, ChungChiHLV, SoCauThuDangKyThiDauToiDa, ThoiDiemGhiBanToiDa, TrangThai
) VALUES (
    '2023-2024', '2023-10-20', '2024-06-30', 10, 1000000000, 
    16, 22, 3, 16, 40, 
    12000, '2 sao', 'Bằng Pro AFC', 16, 90, 'DaKetThuc'
);

-- Dữ liệu Mùa giải 2024-2025 (Tương lai)
INSERT INTO MuaGiai (
    MuaGiai, NgayBatDau, NgayKetThuc, SoClbThamDuToiDa, LePhiThamGia, 
    SoCauThuToiThieu, SoCauThuToiDa, SoThuMonToiThieu, TuoiCauThuToiThieu, TuoiCauThuToiDa, 
    SucChuaToiThieu, YeuCauSVD, ChungChiHLV, SoCauThuDangKyThiDauToiDa, ThoiDiemGhiBanToiDa, TrangThai
) VALUES (
    '2024-2025', '2024-09-14', '2025-06-21', 10, 1000000000, 
    16, 22, 3, 16, 40, 
    10000, '2 sao', 'Bằng Pro AFC', 17, 90, 'DaKetThuc'
);

-- Dữ liệu Mùa giải 2025-2026 (Tương lai)
INSERT INTO MuaGiai (
    MuaGiai, NgayBatDau, NgayKetThuc, SoClbThamDuToiDa, LePhiThamGia, 
    SoCauThuToiThieu, SoCauThuToiDa, SoThuMonToiThieu, TuoiCauThuToiThieu, TuoiCauThuToiDa, 
    SucChuaToiThieu, YeuCauSVD, ChungChiHLV, SoCauThuDangKyThiDauToiDa, ThoiDiemGhiBanToiDa, TrangThai
) VALUES (
    '2025-2026', '2025-09-20', '2026-06-25', 10, 1000000000, 
    16, 22, 3, 16, 40, 
    10000, '2 sao', 'Bằng Pro AFC', 16, 90, 'DangDienRa'
);

-- Quy định điểm cho V-League 2023
INSERT INTO Diem VALUES ('2023-2024', 3, 1, 0);
INSERT INTO Diem VALUES ('2024-2025', 3, 2, 0);
INSERT INTO Diem VALUES ('2025-2026', 3, 1, 0);


-- === Mùa 2023 ===
-- Cầu thủ Nội: Không giới hạn (hoặc giới hạn bằng max đội hình)
INSERT INTO LoaiCauThu (MaLoaiCauThu, TenLoaiCauThu, SoCauThuToiDa, MuaGiai)
VALUES ('LCT23_NOI', 'Cầu thủ nội', 30, '2023-2024');

-- Cầu thủ Ngoại: Tối đa 3
INSERT INTO LoaiCauThu (MaLoaiCauThu, TenLoaiCauThu, SoCauThuToiDa, MuaGiai)
VALUES ('LCT23_NGOAI', 'Cầu thủ nước ngoài', 3, '2023-2024');
-- Cầu thủ Nhập tịch: Tối đa 1
INSERT INTO LoaiCauThu (MaLoaiCauThu, TenLoaiCauThu, SoCauThuToiDa, MuaGiai)
VALUES ('LCT23_NHAPTICH', 'Cầu thủ gốc VN/Nhập tịch', 1, '2023-2024');

-- === Mùa 2023-2024 (Tăng suất ngoại binh) ===
INSERT INTO LoaiCauThu (MaLoaiCauThu, TenLoaiCauThu, SoCauThuToiDa, MuaGiai)
VALUES ('LCT2324_NOI', 'Cầu thủ nội', 35, '2024-2025');

INSERT INTO LoaiCauThu (MaLoaiCauThu, TenLoaiCauThu, SoCauThuToiDa, MuaGiai)
VALUES ('LCT2324_NGOAI', 'Cầu thủ nước ngoài', 4, '2024-2025'); -- Tăng suất ngoại binh lên 4

INSERT INTO LoaiCauThu (MaLoaiCauThu, TenLoaiCauThu, SoCauThuToiDa, MuaGiai)
VALUES ('LCT2324_TRE', 'Cầu thủ trẻ (U23)', 10, '2024-2025'); -- Thêm loại cầu thủ trẻ U23

-- === Mùa 2024-2025 ===
INSERT INTO LoaiCauThu (MaLoaiCauThu, TenLoaiCauThu, SoCauThuToiDa, MuaGiai)
VALUES ('LCT2425_NOI', 'Cầu thủ nội', 11, '2025-2026');

INSERT INTO LoaiCauThu (MaLoaiCauThu, TenLoaiCauThu, SoCauThuToiDa, MuaGiai)
VALUES ('LCT2425_NGOAI', 'Cầu thủ nước ngoài', 5, '2025-2026'); -- Tăng tính cạnh tranh

INSERT INTO LoaiCauThu (MaLoaiCauThu, TenLoaiCauThu, SoCauThuToiDa, MuaGiai)
VALUES ('LCT2425_NHAPTICH', 'Cầu thủ nhập tịch', 2, '2025-2026');


-- ==========================================================
-- DỮ LIỆU SÂN VẬN ĐỘNG (Cho 3 mùa giải)
-- ==========================================================

-- 1. Sân Hàng Đẫy (Hà Nội) - Sân nhà của nhiều CLB
INSERT INTO SanVanDong (MaSanVanDong, MuaGiai, TenSanVanDong, DiaChiSvd, SucChua, DanhGiaFifa) VALUES
('SVD_HANGDAY', '2023-2024', 'Sân vận động Hàng Đẫy', '9 Trịnh Hoài Đức, Hà Nội', 22500, '2 Sao'),
('SVD_HANGDAY', '2024-2025', 'Sân vận động Hàng Đẫy', '9 Trịnh Hoài Đức, Hà Nội', 22500, '2 Sao'),
('SVD_HANGDAY', '2025-2026', 'Sân vận động Hàng Đẫy', '9 Trịnh Hoài Đức, Hà Nội', 22500, '3 Sao'); -- Nâng cấp tiêu chuẩn

-- 2. Sân Lạch Tray (Hải Phòng)
INSERT INTO SanVanDong (MaSanVanDong, MuaGiai, TenSanVanDong, DiaChiSvd, SucChua, DanhGiaFifa) VALUES
('SVD_LACHTRAY', '2023-2024', 'Sân vận động Lạch Tray', 'Lạch Tray, Ngô Quyền, Hải Phòng', 30000, '2 Sao'),
('SVD_LACHTRAY', '2024-2025', 'Sân vận động Lạch Tray', 'Lạch Tray, Ngô Quyền, Hải Phòng', 30000, '2 Sao'),
('SVD_LACHTRAY', '2025-2026', 'Sân vận động Lạch Tray', 'Lạch Tray, Ngô Quyền, Hải Phòng', 32000, '3 Sao');

-- 3. Sân Thiên Trường (Nam Định)
INSERT INTO SanVanDong (MaSanVanDong, MuaGiai, TenSanVanDong, DiaChiSvd, SucChua, DanhGiaFifa) VALUES
('SVD_THIENTRUONG', '2023-2024', 'Sân vận động Thiên Trường', 'Đặng Xuân Bảng, Nam Định', 30000, '2 Sao'),
('SVD_THIENTRUONG', '2024-2025', 'Sân vận động Thiên Trường', 'Đặng Xuân Bảng, Nam Định', 30000, '2 Sao'),
('SVD_THIENTRUONG', '2025-2026', 'Sân vận động Thiên Trường', 'Đặng Xuân Bảng, Nam Định', 30000, '2 Sao');

-- 4. Sân Gò Đậu (Bình Dương)
INSERT INTO SanVanDong (MaSanVanDong, MuaGiai, TenSanVanDong, DiaChiSvd, SucChua, DanhGiaFifa) VALUES
('SVD_GODAU', '2023-2024', 'Sân vận động Gò Đậu', '30/4, Thủ Dầu Một, Bình Dương', 18250, '2 Sao'),
('SVD_GODAU', '2024-2025', 'Sân vận động Gò Đậu', '30/4, Thủ Dầu Một, Bình Dương', 18250, '2 Sao'),
('SVD_GODAU', '2025-2026', 'Sân vận động Gò Đậu', '30/4, Thủ Dầu Một, Bình Dương', 20000, '3 Sao');

-- 5. Sân Pleiku (Gia Lai)
INSERT INTO SanVanDong (MaSanVanDong, MuaGiai, TenSanVanDong, DiaChiSvd, SucChua, DanhGiaFifa) VALUES
('SVD_PLEIKU', '2023-2024', 'Sân vận động Pleiku', 'Quang Trung, Pleiku, Gia Lai', 12000, '1 Sao'),
('SVD_PLEIKU', '2024-2025', 'Sân vận động Pleiku', 'Quang Trung, Pleiku, Gia Lai', 12000, '2 Sao'),
('SVD_PLEIKU', '2025-2026', 'Sân vận động Pleiku', 'Quang Trung, Pleiku, Gia Lai', 12000, '2 Sao');

-- 6. Sân Vinh (Nghệ An)
INSERT INTO SanVanDong (MaSanVanDong, MuaGiai, TenSanVanDong, DiaChiSvd, SucChua, DanhGiaFifa) VALUES
('SVD_VINH', '2023-2024', 'Sân vận động Vinh', 'Lê Nin, Vinh, Nghệ An', 18000, '2 Sao'),
('SVD_VINH', '2024-2025', 'Sân vận động Vinh', 'Lê Nin, Vinh, Nghệ An', 18000, '2 Sao'),
('SVD_VINH', '2025-2026', 'Sân vận động Vinh', 'Lê Nin, Vinh, Nghệ An', 20000, '3 Sao');

--7. Sân Thống Nhất (TP.HCM)
INSERT INTO SanVanDong (MaSanVanDong, MuaGiai, TenSanVanDong, DiaChiSvd, SucChua, DanhGiaFifa) VALUES
('SVD_THONGNHAT', '2023-2024', 'Sân vận động Thống Nhất', 'Lý Thường Kiệt, Quận 10, TP.HCM', 25000, '2 Sao'),
('SVD_THONGNHAT', '2024-2025', 'Sân vận động Thống Nhất', 'Lý Thường Kiệt, Quận 10, TP.HCM', 25000, '2 Sao'),
('SVD_THONGNHAT', '2025-2026', 'Sân vận động Thống Nhất', 'Lý Thường Kiệt, Quận 10, TP.HCM', 30000, '3 Sao');

--8. Sân Cẩm Phả (Quảng Ninh)
INSERT INTO SanVanDong (MaSanVanDong, MuaGiai, TenSanVanDong, DiaChiSvd, SucChua, DanhGiaFifa) VALUES
('SVD_CAMPHA', '2023-2024', 'Sân vận động Cẩm Phả', 'Hạ Long, Quảng Ninh', 20000, '2 Sao'),
('SVD_CAMPHA', '2024-2025', 'Sân vận động Cẩm Phả', 'Hạ Long, Quảng Ninh', 20000, '2 Sao'),
('SVD_CAMPHA', '2025-2026', 'Sân vận động Cẩm Phả', 'Hạ Long, Quảng Ninh', 22000, '3 Sao');

-- 9. Sân Vũ Trọng Phụng (Thanh Hóa)
INSERT INTO SanVanDong (MaSanVanDong, MuaGiai, TenSanVanDong, DiaChiSvd, SucChua, DanhGiaFifa) VALUES
('SVD_VUTRONGPHUNG', '2023-2024', 'Sân vận động Vũ Trọng Phụng', 'Lê Lợi, Thanh Hóa', 18000, '1 Sao'),
('SVD_VUTRONGPHUNG', '2024-2025', 'Sân vận động Vũ Trọng Phụng', 'Lê Lợi, Thanh Hóa', 18000, '2 Sao'),
('SVD_VUTRONGPHUNG', '2025-2026', 'Sân vận động Vũ Trọng Phụng', 'Lê Lợi, Thanh Hóa', 20000, '2 Sao');

-- 10. Sân Quy Nhơn (Bình Định)
INSERT INTO SanVanDong (MaSanVanDong, MuaGiai, TenSanVanDong, DiaChiSvd, SucChua, DanhGiaFifa) VALUES
('SVD_QUYNHON', '2023-2024', 'Sân vận động Quy Nhơn', 'Trần Hưng Đạo, Quy Nhơn, Bình Định', 15000, '1 Sao'),
('SVD_QUYNHON', '2024-2025', 'Sân vận động Quy Nhơn', 'Trần Hưng Đạo, Quy Nhơn, Bình Định', 15000, '2 Sao'),
('SVD_QUYNHON', '2025-2026', 'Sân vận động Quy Nhơn', 'Trần Hưng Đạo, Quy Nhơn, Bình Định', 18000, '2 Sao');

-- ==========================================================
-- DỮ LIỆU CÂU LẠC BỘ (Cho 3 mùa giải)
-- ==========================================================

-- 1. Hà Nội FC (Sân nhà: Hàng Đẫy)
INSERT INTO CauLacBo (MaClb, MuaGiai, TenClb, DiaChiTruSo, DonViChuQuan, TrangPhucChuNha, TrangPhucKhach, TrangPhucDuPhong, MaSanVanDong) VALUES
('CLB_HANOI', '2023-2024', 'Hà Nội FC', 'Mỹ Đình, Hà Nội', 'Tập đoàn T&T', 'Tím', 'Vàng', 'Trắng', 'SVD_HANGDAY'),
('CLB_HANOI', '2024-2025', 'Hà Nội FC', 'Mỹ Đình, Hà Nội', 'Tập đoàn T&T', 'Tím', 'Trắng', 'Đen', 'SVD_HANGDAY'),
('CLB_HANOI', '2025-2026', 'Hà Nội FC', 'Mỹ Đình, Hà Nội', 'Tập đoàn T&T', 'Tím', 'Vàng', 'Xanh', 'SVD_HANGDAY');

-- 2. Hải Phòng FC (Sân nhà: Lạch Tray)
INSERT INTO CauLacBo (MaClb, MuaGiai, TenClb, DiaChiTruSo, DonViChuQuan, TrangPhucChuNha, TrangPhucKhach, TrangPhucDuPhong, MaSanVanDong) VALUES
('CLB_HAIPHONG', '2023-2024', 'Hải Phòng FC', 'Lạch Tray, Hải Phòng', 'Công ty CP TT Hải Phòng', 'Đỏ', 'Trắng', 'Vàng', 'SVD_LACHTRAY'),
('CLB_HAIPHONG', '2024-2025', 'Hải Phòng FC', 'Lạch Tray, Hải Phòng', 'Công ty CP TT Hải Phòng', 'Đỏ', 'Trắng', 'Xám', 'SVD_LACHTRAY'),
('CLB_HAIPHONG', '2025-2026', 'Hải Phòng FC', 'Lạch Tray, Hải Phòng', 'Công ty CP TT Hải Phòng', 'Đỏ', 'Xanh', 'Trắng', 'SVD_LACHTRAY');

-- 3. Thép Xanh Nam Định (Sân nhà: Thiên Trường)
INSERT INTO CauLacBo (MaClb, MuaGiai, TenClb, DiaChiTruSo, DonViChuQuan, TrangPhucChuNha, TrangPhucKhach, TrangPhucDuPhong, MaSanVanDong) VALUES
('CLB_NAMDINH', '2023-2024', 'Thép Xanh Nam Định', 'TP Nam Định', 'Tập đoàn Xuân Thiện', 'Trắng', 'Xanh Dương', 'Vàng', 'SVD_THIENTRUONG'),
('CLB_NAMDINH', '2024-2025', 'Thép Xanh Nam Định', 'TP Nam Định', 'Tập đoàn Xuân Thiện', 'Trắng', 'Xanh', 'Đỏ', 'SVD_THIENTRUONG'),
('CLB_NAMDINH', '2025-2026', 'Thép Xanh Nam Định', 'TP Nam Định', 'Tập đoàn Xuân Thiện', 'Trắng', 'Đỏ', 'Xanh', 'SVD_THIENTRUONG');

-- 4. Becamex Bình Dương (Sân nhà: Gò Đậu)
INSERT INTO CauLacBo (MaClb, MuaGiai, TenClb, DiaChiTruSo, DonViChuQuan, TrangPhucChuNha, TrangPhucKhach, TrangPhucDuPhong, MaSanVanDong) VALUES
('CLB_BINHDUONG', '2023-2024', 'Becamex Bình Dương', 'Thủ Dầu Một', 'Becamex IDC', 'Xanh Đậm', 'Đỏ', 'Trắng', 'SVD_GODAU'),
('CLB_BINHDUONG', '2024-2025', 'Becamex Bình Dương', 'Thủ Dầu Một', 'Becamex IDC', 'Xanh Đậm', 'Tím', 'Trắng', 'SVD_GODAU'),
('CLB_BINHDUONG', '2025-2026', 'Becamex Bình Dương', 'Thủ Dầu Một', 'Becamex IDC', 'Xanh Đậm', 'Vàng', 'Trắng', 'SVD_GODAU');

-- 5. LPBank HAGL (Sân nhà: Pleiku)
INSERT INTO CauLacBo (MaClb, MuaGiai, TenClb, DiaChiTruSo, DonViChuQuan, TrangPhucChuNha, TrangPhucKhach, TrangPhucDuPhong, MaSanVanDong) VALUES
('CLB_HAGL', '2023-2024', 'LPBank HAGL', 'Pleiku, Gia Lai', 'Học viện HAGL', 'Trắng', 'Xanh', 'Vàng', 'SVD_PLEIKU'),
('CLB_HAGL', '2024-2025', 'LPBank HAGL', 'Pleiku, Gia Lai', 'Học viện HAGL', 'Trắng', 'Xanh', 'Đỏ', 'SVD_PLEIKU'),
('CLB_HAGL', '2025-2026', 'LPBank HAGL', 'Pleiku, Gia Lai', 'Học viện HAGL', 'Trắng', 'Vàng', 'Xanh', 'SVD_PLEIKU');

-- 6. SLNA (Sân nhà: Vinh)
INSERT INTO CauLacBo (MaClb, MuaGiai, TenClb, DiaChiTruSo, DonViChuQuan, TrangPhucChuNha, TrangPhucKhach, TrangPhucDuPhong, MaSanVanDong) VALUES
('CLB_SLNA', '2023-2024', 'SLNA', 'Vinh, Nghệ An', 'Tập đoàn SLNA', 'Đỏ Đậm', 'Trắng', 'Xanh', 'SVD_VINH'),
('CLB_SLNA', '2024-2025', 'SLNA', 'Vinh, Nghệ An', 'Tập đoàn SLNA', 'Đỏ Đậm', 'Xanh', 'Trắng', 'SVD_VINH'),
('CLB_SLNA', '2025-2026', 'SLNA', 'Vinh, Nghệ An', 'Tập đoàn SLNA', 'Đỏ Đậm', 'Vàng', 'Trắng', 'SVD_VINH');
-- 7. TP.HCM FC (Sân nhà: Thống Nhất)
INSERT INTO CauLacBo (MaClb, MuaGiai, TenClb, DiaChiTruSo, DonViChuQuan, TrangPhucChuNha, TrangPhucKhach, TrangPhucDuPhong, MaSanVanDong) VALUES
('CLB_TPHCM', '2023-2024', 'TP.HCM FC', 'TP.HCM', 'Công ty CP Thể Thao TP.HCM', 'Đỏ', 'Trắng', 'Xanh', 'SVD_THONGNHAT'),
('CLB_TPHCM', '2024-2025', 'TP.HCM FC', 'TP.HCM', 'Công ty CP Thể Thao TP.HCM', 'Đỏ', 'Xanh', 'Trắng', 'SVD_THONGNHAT'),
('CLB_TPHCM', '2025-2026', 'TP.HCM FC', 'TP.HCM', 'Công ty CP Thể Thao TP.HCM', 'Đỏ', 'Vàng', 'Trắng', 'SVD_THONGNHAT');
-- 8. Quảng Ninh FC (Sân nhà: Cẩm Phả)
INSERT INTO CauLacBo (MaClb, MuaGiai, TenClb, DiaChiTruSo, DonViChuQuan, TrangPhucChuNha, TrangPhucKhach, TrangPhucDuPhong, MaSanVanDong) VALUES
('CLB_QUANGNINH', '2023-2024', 'Quảng Ninh FC', 'Hạ Long, Quảng Ninh', 'Tập đoàn Sun Group', 'Vàng', 'Xanh Dương', 'Trắng', 'SVD_CAMPHA'),
('CLB_QUANGNINH', '2024-2025', 'Quảng Ninh FC', 'Hạ Long, Quảng Ninh', 'Tập đoàn Sun Group', 'Vàng', 'Trắng', 'Xanh Dương', 'SVD_CAMPHA'),
('CLB_QUANGNINH', '2025-2026', 'Quảng Ninh FC', 'Hạ Long, Quảng Ninh', 'Tập đoàn Sun Group', 'Vàng', 'Xanh Lá', 'Trắng', 'SVD_CAMPHA');
-- 9. Thanh Hóa FC (Sân nhà: Vũ Trọng Phụng)
INSERT INTO CauLacBo (MaClb, MuaGiai, TenClb, DiaChiTruSo, DonViChuQuan, TrangPhucChuNha, TrangPhucKhach, TrangPhucDuPhong, MaSanVanDong) VALUES
('CLB_THANHHOA', '2023-2024', 'Thanh Hóa FC', 'Thanh Hóa', 'Tập đoàn FLC', 'Xanh Dương', 'Trắng', 'Đỏ', 'SVD_VUTRONGPHUNG'),
('CLB_THANHHOA', '2024-2025', 'Thanh Hóa FC', 'Thanh Hóa', 'Tập đoàn FLC', 'Xanh Dương', 'Đỏ', 'Trắng', 'SVD_VUTRONGPHUNG'),
('CLB_THANHHOA', '2025-2026', 'Thanh Hóa FC', 'Thanh Hóa', 'Tập đoàn FLC', 'Xanh Dương', 'Vàng', 'Trắng', 'SVD_VUTRONGPHUNG');
-- 10. Bình Định FC (Sân nhà: Quy Nhơn)
INSERT INTO CauLacBo (MaClb, MuaGiai, TenClb, DiaChiTruSo, DonViChuQuan, TrangPhucChuNha, TrangPhucKhach, TrangPhucDuPhong, MaSanVanDong) VALUES
('CLB_BINHDINH', '2023-2024', 'Bình Định FC', 'Quy Nhơn, Bình Định', 'Công ty CP Bình Định', 'Đỏ', 'Trắng', 'Xanh', 'SVD_QUYNHON'),
('CLB_BINHDINH', '2024-2025', 'Bình Định FC', 'Quy Nhơn, Bình Định', 'Công ty CP Bình Định', 'Đỏ', 'Xanh', 'Trắng', 'SVD_QUYNHON'),
('CLB_BINHDINH', '2025-2026', 'Bình Định FC', 'Quy Nhơn, Bình Định', 'Công ty CP Bình Định', 'Đỏ', 'Vàng', 'Trắng', 'SVD_QUYNHON'); 

-- ==========================================================
-- 1. CLB HÀ NỘI 
-- ==========================================================
INSERT INTO CauThu (MaCauThu, TenCauThu, NgaySinh, NoiSinh, QuocTich, ViTriThiDau, ChieuCao, CanNang) VALUES
('49', 'Nguyễn Văn Quyết', '1991-07-01', 'Hà Tây', 'Vietnam', 'FW', 172, 65),
('50', 'Đỗ Hùng Dũng', '1993-09-08', 'Hà Nội', 'Vietnam', 'MF', 170, 64),
('51', 'Đỗ Duy Mạnh', '1996-09-29', 'Hà Nội', 'Vietnam', 'DF', 180, 70),
('52', 'Phạm Tuấn Hải', '1998-05-19', 'Hà Nam', 'Vietnam', 'FW', 172, 66),
('53', 'Nguyễn Thành Chung', '1997-09-08', 'Tuyên Quang', 'Vietnam', 'DF', 182, 75),
('54', 'Quan Văn Chuẩn', '2001-01-07', 'Tuyên Quang', 'Vietnam', 'GK', 181, 73),
('55', 'Phạm Xuân Mạnh', '1996-02-09', 'Nghệ An', 'Vietnam', 'DF', 175, 70),
('56', 'Nguyễn Hai Long', '2000-08-27', 'Quảng Ninh', 'Vietnam', 'MF', 168, 62),
('57', 'Tagueu Joel', '1993-11-06', 'Cameroon', 'Cameroon', 'FW', 180, 78), -- Ngoại binh
('58', 'Brandon Wilson', '1997-01-28', 'Australia', 'Australia', 'MF', 185, 76), -- Ngoại binh
('59', 'Nguyễn Văn Trường', '2003-09-10', 'Hưng Yên', 'Vietnam', 'MF', 182, 73),
('60', 'Vũ Minh Tuấn', '1990-09-19', 'Quảng Ninh', 'Vietnam', 'MF', 178, 69),
('61', 'Đậu Văn Toàn', '1997-04-07', 'Hà Nội', 'Vietnam', 'MF', 170, 65),
('62', 'Lê Văn Xuân', '1999-02-27', 'Thanh Hóa', 'Vietnam', 'DF', 168, 63),
('63', 'Nguyễn Văn Hoàng', '1995-02-17', 'Nghệ An', 'Vietnam', 'GK', 186, 80),
('64', 'Trương Văn Thái Quý', '1997-08-22', 'Quảng Trị', 'Vietnam', 'MF', 172, 66);

-- ==========================================================
-- 2. CLB HẢI PHÒNG 
-- ==========================================================
INSERT INTO CauThu (MaCauThu, TenCauThu, NgaySinh, NoiSinh, QuocTich, ViTriThiDau, ChieuCao, CanNang) VALUES
('1', 'Nguyễn Đình Triệu', '1991-11-04', 'Thái Bình', 'Vietnam', 'GK', 180, 74),
('2', 'Joseph Mpande', '1994-03-23', 'Uganda', 'Uganda', 'MF', 183, 80), -- Đa năng
('3', 'Triệu Việt Hưng', '1997-01-19', 'Hải Dương', 'Vietnam', 'MF', 170, 64),
('4', 'Đặng Văn Tới', '1999-01-12', 'Thái Bình', 'Vietnam', 'DF', 178, 72),
('5', 'Bicou Bissainthe', '1999-03-15', 'Haiti', 'Haiti', 'DF', 186, 82),
('6', 'Lucao do Break', '1991-09-04', 'Brazil', 'Brazil', 'FW', 184, 85),
('7', 'Lê Mạnh Dũng', '1994-04-12', 'Hà Nội', 'Vietnam', 'DF', 174, 68),
('8', 'Phạm Trung Hiếu', '1998-09-28', 'Hải Phòng', 'Vietnam', 'DF', 172, 65),
('9', 'Hồ Minh Dĩ', '1998-02-17', 'Quảng Trị', 'Vietnam', 'MF', 160, 58),
('10', 'Martin Lo', '1997-09-03', 'Australia', 'Vietnam', 'MF', 165, 62),
('11', 'Nguyễn Văn Minh', '1999-02-08', 'Hải Phòng', 'Vietnam', 'MF', 170, 66),
('12', 'Đàm Tiến Dũng', '1996-03-20', 'Thanh Hóa', 'Vietnam', 'DF', 170, 64),
('13', 'Nguyễn Hữu Sơn', '1996-09-27', 'Nghệ An', 'Vietnam', 'MF', 174, 69),
('14', 'Phạm Hoài Dương', '2002-05-15', 'Hải Phòng', 'Vietnam', 'DF', 182, 75),
('15', 'Nguyễn Văn Toản', '1999-11-26', 'Hải Phòng', 'Vietnam', 'GK', 186, 82),
('16', 'Lương Hoàng Nam', '1997-03-02', 'Đắk Lắk', 'Vietnam', 'MF', 163, 60);
-- ==========================================================
-- 3. THÉP XANH NAM ĐỊNH 
-- ==========================================================
INSERT INTO CauThu (MaCauThu, TenCauThu, NgaySinh, NoiSinh, QuocTich, ViTriThiDau, ChieuCao, CanNang) VALUES
('17', 'Trần Nguyên Mạnh', '1991-12-20', 'Nghệ An', 'Vietnam', 'GK', 178, 72),
('18', 'Nguyễn Phong Hồng Duy', '1996-06-13', 'Bình Phước', 'Vietnam', 'DF', 168, 66),
('19', 'Dương Thanh Hào', '1991-06-23', 'Bình Định', 'Vietnam', 'DF', 180, 74),
('20', 'Hồ Khắc Ngọc', '1992-08-02', 'Nghệ An', 'Vietnam', 'MF', 169, 63),
('21', 'Nguyễn Tuấn Anh', '1995-05-16', 'Thái Bình', 'Vietnam', 'MF', 176, 68),
('22', 'Hendrio Araujo', '1994-05-16', 'Brazil', 'Brazil', 'MF', 181, 75),
('23', 'Rafaelson Bezerra', '1997-03-30', 'Brazil', 'Brazil', 'FW', 185, 85),
('24', 'Nguyễn Văn Toàn', '1996-04-12', 'Hải Dương', 'Vietnam', 'FW', 169, 61),
('25', 'Tô Văn Vũ', '1993-10-20', 'Thanh Hóa', 'Vietnam', 'MF', 173, 68),
('26', 'Trần Văn Kiên', '1996-05-13', 'Nghệ An', 'Vietnam', 'DF', 170, 65),
('27', 'Lý Công Hoàng Anh', '1999-09-01', 'Hòa Bình', 'Vietnam', 'MF', 170, 67),
('28', 'Lucas Alves', '1992-07-22', 'Brazil', 'Brazil', 'DF', 190, 88),
('29', 'Nguyễn Văn Vĩ', '1998-02-12', 'Bắc Ninh', 'Vietnam', 'DF', 168, 62),
('30', 'Hoàng Minh Tuấn', '1995-08-26', 'Nam Định', 'Vietnam', 'FW', 175, 70),
('31', 'Trần Văn Công', '1999-02-15', 'Nghệ An', 'Vietnam', 'MF', 178, 74),
('32', 'Trần Liêm Điều', '2001-02-19', 'Nam Định', 'Vietnam', 'GK', 186, 76);

-- ==========================================================
-- 4. BECAMEX BÌNH DƯƠNG 
-- ==========================================================
INSERT INTO CauThu (MaCauThu, TenCauThu, NgaySinh, NoiSinh, QuocTich, ViTriThiDau, ChieuCao, CanNang) VALUES
('33', 'Trần Minh Toàn', '1996-01-21', 'Tây Ninh', 'Vietnam', 'GK', 186, 80),
('34', 'Quế Ngọc Hải', '1993-05-15', 'Nghệ An', 'Vietnam', 'DF', 180, 74),
('35', 'Nguyễn Tiến Linh', '1997-10-20', 'Hải Dương', 'Vietnam', 'FW', 180, 76),
('36', 'Hồ Tấn Tài', '1997-11-06', 'Bình Định', 'Vietnam', 'DF', 180, 75),
('37', 'Nguyễn Hải Huy', '1991-06-18', 'Quảng Ninh', 'Vietnam', 'MF', 170, 68),
('38', 'Bùi Vĩ Hào', '2003-02-24', 'An Giang', 'Vietnam', 'FW', 180, 72),
('39', 'Võ Minh Trọng', '2001-10-24', 'Cần Thơ', 'Vietnam', 'DF', 170, 64),
('40', 'Janclesio Almeida', '1993-08-28', 'Brazil', 'Brazil', 'DF', 190, 85),
('41', 'Prince Ibara', '1996-02-07', 'Congo', 'Congo', 'FW', 192, 88),
('42', 'Trương Dũ Đạt', '1997-07-25', 'Bình Dương', 'Vietnam', 'DF', 174, 69),
('43', 'Đoàn Hải Quân', '1997-02-12', 'Đồng Tháp', 'Vietnam', 'MF', 172, 65),
('44', 'Tống Anh Tỷ', '1997-01-24', 'Bình Dương', 'Vietnam', 'MF', 176, 70),
('45', 'Nguyễn Thành Nhân', '2000-06-28', 'An Giang', 'Vietnam', 'DF', 170, 64),
('46', 'Lê Quang Hùng', '1992-06-07', 'Ninh Bình', 'Vietnam', 'DF', 170, 65),
('47', 'Trần Đình Khương', '1996-01-10', 'Khánh Hòa', 'Vietnam', 'DF', 175, 72),
('48', 'Lại Tuấn Vũ', '1993-08-05', 'Bình Dương', 'Vietnam', 'GK', 180, 75);

-- ==========================================================
-- 5. LPBANK HAGL 
-- ==========================================================
INSERT INTO CauThu (MaCauThu, TenCauThu, NgaySinh, NoiSinh, QuocTich, ViTriThiDau, ChieuCao, CanNang) VALUES
('65', 'Trần Trung Kiên', '2003-07-09', 'Hưng Yên', 'Vietnam', 'GK', 191, 80),
('66', 'Jairo Filho', '1993-05-15', 'Brazil', 'Brazil', 'DF', 190, 82),
('67', 'Châu Ngọc Quang', '1996-02-01', 'Quảng Nam', 'Vietnam', 'MF', 169, 65),
('68', 'Trần Minh Vương', '1995-03-28', 'Thái Bình', 'Vietnam', 'MF', 167, 63),
('69', 'Dụng Quang Nho', '2000-01-01', 'Bình Thuận', 'Vietnam', 'MF', 171, 68),
('70', 'Nguyễn Quốc Việt', '2003-05-04', 'Hải Phòng', 'Vietnam', 'FW', 170, 62),
('71', 'Lê Văn Sơn', '1996-12-20', 'Hải Dương', 'Vietnam', 'DF', 171, 66),
('72', 'Trần Bảo Toàn', '2000-07-14', 'Quảng Ngãi', 'Vietnam', 'MF', 170, 65),
('73', 'Gabriel Ferreira', '1997-06-18', 'Brazil', 'Brazil', 'DF', 188, 80),
('74', 'Joao Veras', '2000-10-26', 'Brazil', 'Brazil', 'FW', 185, 78),
('75', 'Phan Du Học', '2001-11-01', 'Gia Lai', 'Vietnam', 'DF', 172, 67),
('76', 'Nguyễn Thanh Nhân', '2000-10-25', 'An Giang', 'Vietnam', 'DF', 170, 64),
('77', 'Võ Đình Lâm', '2000-01-11', 'Bình Định', 'Vietnam', 'MF', 172, 68),
('78', 'Nguyễn Đức Việt', '2004-01-01', 'TP.HCM', 'Vietnam', 'MF', 170, 63),
('79', 'Trần Thanh Sơn', '1997-12-30', 'TP.HCM', 'Vietnam', 'MF', 173, 69),
('80', 'Dương Văn Lợi', '2000-05-20', 'Bình Phước', 'Vietnam', 'GK', 178, 72);
-- ==========================================================
-- 6. SLNA (Sông Lam Nghệ An) 
-- ==========================================================
INSERT INTO CauThu (MaCauThu, TenCauThu, NgaySinh, NoiSinh, QuocTich, ViTriThiDau, ChieuCao, CanNang) VALUES
('81', 'Nguyễn Văn Việt', '2002-07-12', 'Nghệ An', 'Vietnam', 'GK', 181, 75),
('82', 'Trần Đình Hoàng', '1991-12-08', 'Nghệ An', 'Vietnam', 'DF', 173, 70),
('83', 'Michael Olaha', '1997-01-04', 'Nigeria', 'Nigeria', 'FW', 186, 85),
('84', 'Mario Zebic', '1995-12-17', 'Croatia', 'Croatia', 'DF', 187, 81),
('85', 'Phan Bá Quyền', '2002-08-30', 'Nghệ An', 'Vietnam', 'MF', 170, 65),
('86', 'Đinh Xuân Tiến', '2003-01-10', 'Nghệ An', 'Vietnam', 'MF', 171, 64),
('87', 'Trần Mạnh Quỳnh', '2001-01-18', 'Nghệ An', 'Vietnam', 'MF', 170, 66),
('88', 'Lê Văn Thành', '2001-05-02', 'Nghệ An', 'Vietnam', 'DF', 178, 72),
('89', 'Vương Văn Huy', '2001-09-07', 'Nghệ An', 'Vietnam', 'DF', 175, 70),
('90', 'Trần Nam Hải', '2004-02-05', 'Nghệ An', 'Vietnam', 'MF', 182, 76),
('91', 'Ngô Văn Lương', '2001-06-03', 'Nghệ An', 'Vietnam', 'FW', 172, 67),
('92', 'Nguyễn Quang Vinh', '2005-01-27', 'Nghệ An', 'Vietnam', 'MF', 170, 62),
('93', 'Benjamin Kuku', '1995-03-08', 'Nigeria', 'Nigeria', 'FW', 180, 80),
('94', 'Hồ Văn Cường', '2003-01-15', 'Nghệ An', 'Vietnam', 'DF', 168, 60),
('95', 'Lê Nguyên Hoàng', '2005-04-14', 'Nghệ An', 'Vietnam', 'DF', 177, 70),
('96', 'Cao Văn Bình', '2005-07-08', 'Nghệ An', 'Vietnam', 'GK', 183, 75);

-- ==========================================================
-- 7. ĐÔNG Á THANH HÓA 
-- ==========================================================
INSERT INTO CauThu (MaCauThu, TenCauThu, NgaySinh, NoiSinh, QuocTich, ViTriThiDau, ChieuCao, CanNang) VALUES
('97', 'Nguyễn Thanh Diệp', '1991-09-06', 'Đồng Nai', 'Vietnam', 'GK', 178, 75),
('98', 'Gustavo Santos', '1995-06-25', 'Brazil', 'Brazil', 'DF', 193, 88),
('99', 'Trịnh Văn Lợi', '1995-05-26', 'Thanh Hóa', 'Vietnam', 'DF', 174, 70),
('100', 'Nguyễn Thái Sơn', '2003-07-13', 'Thanh Hóa', 'Vietnam', 'MF', 171, 65),
('101', 'Lâm Ti Phông', '1996-02-01', 'Quảng Ngãi', 'Vietnam', 'MF', 168, 64),
('102', 'Hoàng Thái Bình', '1998-01-22', 'Thanh Hóa', 'Vietnam', 'DF', 170, 66),
('103', 'Rimario Gordon', '1994-07-06', 'Jamaica', 'Jamaica', 'FW', 180, 82),
('104', 'A Mít', '1997-06-07', 'Kon Tum', 'Vietnam', 'MF', 168, 65),
('105', 'Đinh Viết Tú', '1992-08-16', 'Nam Định', 'Vietnam', 'DF', 176, 73),
('106', 'Lê Quốc Phương', '1991-05-19', 'Thanh Hóa', 'Vietnam', 'MF', 165, 62),
('107', 'Luiz Antonio', '1991-03-11', 'Brazil', 'Brazil', 'MF', 180, 75),
('108', 'Võ Nguyên Hoàng', '2002-02-07', 'Đồng Tháp', 'Vietnam', 'FW', 180, 78),
('109', 'Trịnh Xuân Hoàng', '2000-11-06', 'Thanh Hóa', 'Vietnam', 'GK', 183, 76),
('110', 'Doãn Ngọc Tân', '1994-08-15', 'Hưng Yên', 'Vietnam', 'MF', 172, 68),
('111', 'Đoàn Ngọc Hà', '2004-03-25', 'Thanh Hóa', 'Vietnam', 'DF', 175, 70),
('112', 'Lê Thanh Bình', '1995-08-08', 'Thanh Hóa', 'Vietnam', 'FW', 176, 72);

-- ==========================================================
-- 8. TP.HCM FC
-- ==========================================================
INSERT INTO CauThu (MaCauThu, TenCauThu, NgaySinh, NoiSinh, QuocTich, ViTriThiDau, ChieuCao, CanNang) VALUES
('113', 'Patrik Lê Giang', '1992-09-08', 'Slovakia', 'Vietnam', 'GK', 188, 82),
('114', 'Ngô Tùng Quốc', '1998-01-27', 'Khánh Hòa', 'Vietnam', 'DF', 172, 65),
('115', 'Brendon Lucas', '1995-05-29', 'Brazil', 'Brazil', 'DF', 188, 85),
('116', 'Sầm Ngọc Đức', '1992-05-18', 'Nghệ An', 'Vietnam', 'DF', 170, 68),
('117', 'Võ Huy Toàn', '1993-03-15', 'Lâm Đồng', 'Vietnam', 'MF', 168, 63),
('118', 'Nguyễn Hạ Long', '1994-03-09', 'Nam Định', 'Vietnam', 'MF', 175, 70),
('119', 'Cheick Timité', '1997-11-20', 'Ivory Coast', 'Ivory Coast', 'FW', 185, 80),
('120', 'Hồ Tuấn Tài', '1995-06-16', 'Nghệ An', 'Vietnam', 'FW', 174, 71),
('121', 'Nguyễn Minh Tùng', '1992-08-09', 'Thanh Hóa', 'Vietnam', 'DF', 184, 76),
('122', 'Chu Văn Kiên', '1998-05-15', 'Hà Nội', 'Vietnam', 'MF', 170, 64),
('123', 'Phạm Hữu Nghĩa', '1992-07-20', 'Đồng Tháp', 'Vietnam', 'GK', 180, 75),
('124', 'Đặng Ngọc Tuấn', '1995-05-06', 'An Giang', 'Vietnam', 'GK', 182, 77),
('125', 'Lê Cao Hoài An', '1993-09-19', 'Khánh Hòa', 'Vietnam', 'DF', 176, 70),
('126', 'Nguyễn Thanh Thảo', '1995-04-12', 'An Giang', 'Vietnam', 'DF', 170, 65),
('127', 'Hoàng Vũ Samson', '1988-10-06', 'Nigeria', 'Vietnam', 'FW', 180, 80),
('128', 'Uông Ngọc Tiến', '2000-02-15', 'Thanh Hóa', 'Vietnam', 'MF', 172, 66);

-- ==========================================================
-- 9. QUẢNG NINH FC 
-- ==========================================================
INSERT INTO CauThu (MaCauThu, TenCauThu, NgaySinh, NoiSinh, QuocTich, ViTriThiDau, ChieuCao, CanNang) VALUES
('165', 'Huỳnh Tuấn Linh', '1991-04-17', 'Quảng Ninh', 'Vietnam', 'GK', 178, 74),
('166', 'Mạc Hồng Quân', '1992-01-01', 'Hải Dương', 'Vietnam', 'MF', 180, 78),
('167', 'Nghiêm Xuân Tú', '1988-08-28', 'Hà Nội', 'Vietnam', 'MF', 174, 68),
('168', 'Dương Văn Khoa', '1994-05-06', 'Quảng Ninh', 'Vietnam', 'DF', 170, 65),
('169', 'Đào Duy Khánh', '1994-01-30', 'Bắc Giang', 'Vietnam', 'DF', 182, 76),
('170', 'Nguyễn Xuân Hùng', '1991-02-01', 'Hà Nội', 'Vietnam', 'DF', 172, 68),
('171', 'Phạm Nguyên Sa', '1989-12-15', 'Đà Nẵng', 'Vietnam', 'MF', 174, 70),
('172', 'Kizito Trung Hiếu', '1993-10-21', 'Uganda', 'Vietnam', 'MF', 180, 75),
('173', 'Eydison Teofilo', '1988-05-30', 'Brazil', 'Brazil', 'FW', 178, 77),
('174', 'Nguyễn Văn Khoa', '1999-09-02', 'Quảng Ninh', 'Vietnam', 'MF', 170, 64),
('175', 'Trịnh Hoa Hùng', '1991-11-07', 'Quảng Ninh', 'Vietnam', 'DF', 168, 63),
('176', 'Nguyễn Tiến Duy', '1991-04-29', 'Quảng Ninh', 'Vietnam', 'DF', 176, 72),
('177', 'Vũ Hồng Quân', '1999-10-03', 'Quảng Ninh', 'Vietnam', 'MF', 172, 66),
('178', 'Bùi Văn Hiếu', '1989-10-02', 'Quảng Ninh', 'Vietnam', 'MF', 175, 71),
('179', 'Giang Trần Quách Tân', '1992-03-08', 'Đà Nẵng', 'Vietnam', 'MF', 168, 62),
('180', 'Phan Minh Thành', '1998-05-12', 'Quảng Ninh', 'Vietnam', 'GK', 190, 80);

-- ==========================================================
-- 10. BÌNH ĐỊNH FC 
-- ==========================================================
INSERT INTO CauThu (MaCauThu, TenCauThu, NgaySinh, NoiSinh, QuocTich, ViTriThiDau, ChieuCao, CanNang) VALUES
('181', 'Đặng Văn Lâm', '1993-08-13', 'Russia', 'Vietnam', 'GK', 188, 85),
('182', 'Đỗ Văn Thuận', '1992-05-25', 'Hà Nội', 'Vietnam', 'MF', 172, 68),
('183', 'Cao Văn Triền', '1993-06-18', 'Bình Định', 'Vietnam', 'MF', 170, 67),
('184', 'Lê Ngọc Bảo', '1998-03-29', 'Phú Yên', 'Vietnam', 'DF', 177, 72),
('185', 'Marlon Rangel', '1996-09-17', 'Brazil', 'Brazil', 'DF', 185, 80),
('186', 'Leonardo Artur', '1995-05-23', 'Brazil', 'Brazil', 'FW', 176, 70),
('187', 'Alan Grafite', '1998-02-08', 'Brazil', 'Brazil', 'FW', 189, 88),
('188', 'Nghiêm Thành Chí', '1998-08-20', 'Bình Định', 'Vietnam', 'MF', 170, 65),
('189', 'Phạm Văn Thành', '1994-03-16', 'Thái Bình', 'Vietnam', 'DF', 176, 70),
('190', 'Vũ Tuyên Quang', '1995-07-05', 'Hà Nội', 'Vietnam', 'GK', 185, 82),
('191', 'Trần Đình Trọng', '1997-04-25', 'Hà Nội', 'Vietnam', 'DF', 174, 70),
('192', 'Mạc Đức Việt Anh', '1997-01-16', 'Hải Dương', 'Vietnam', 'DF', 175, 71),
('193', 'Huỳnh Tiến Đạt', '2000-01-26', 'Bình Định', 'Vietnam', 'FW', 172, 66),
('194', 'Ngô Hồng Phước', '1998-07-28', 'An Giang', 'Vietnam', 'MF', 172, 68),
('195', 'Nguyễn Văn Đức', '1997-08-01', 'Thái Bình', 'Vietnam', 'MF', 170, 65),
('196', 'Adriano Schmidt', '1994-05-31', 'Germany', 'Vietnam', 'DF', 185, 82);


-- Adjust MaClb codes to match your CauLacBo data before running.
-- Prereq: CauLacBo entries already exist for MuaGiai = '2025-2026'.

INSERT INTO ChiTietDoiBong (MaCauThu, MaClb, MuaGiai, SoAoThiDau) VALUES
('49', 'CLB_HANOI', '2024-2025', 10),  -- Nguyễn Văn Quyết
('50', 'CLB_HANOI', '2024-2025', 8),   -- Đỗ Hùng Dũng
('51', 'CLB_HANOI', '2024-2025', 3),   -- Đỗ Duy Mạnh
('52', 'CLB_HANOI', '2024-2025', 9),   -- Phạm Tuấn Hải
('53', 'CLB_HANOI', '2024-2025', 4),   -- Nguyễn Thành Chung
('54', 'CLB_HANOI', '2024-2025', 1),   -- Quan Văn Chuẩn
('55', 'CLB_HANOI', '2024-2025', 5),   -- Phạm Xuân Mạnh
('56', 'CLB_HANOI', '2024-2025', 18),  -- Nguyễn Hai Long
('57', 'CLB_HANOI', '2024-2025', 99),  -- Tagueu Joel (Ngoại binh)
('58', 'CLB_HANOI', '2024-2025', 77),  -- Brandon Wilson (Ngoại binh)
('59', 'CLB_HANOI', '2024-2025', 11),  -- Nguyễn Văn Trường
('60', 'CLB_HANOI', '2024-2025', 7),   -- Vũ Minh Tuấn
('61', 'CLB_HANOI', '2024-2025', 19),  -- Đậu Văn Toàn
('62', 'CLB_HANOI', '2024-2025', 15),  -- Lê Văn Xuân
('63', 'CLB_HANOI', '2024-2025', 21),  -- Nguyễn Văn Hoàng
('64', 'CLB_HANOI', '2024-2025', 6);   -- Trương Văn Thái Quý

-- ==========================================================
-- 2. CLB HẢI PHÒNG (CLB_HAIPHONG) - Cầu thủ 1-16
-- ==========================================================
INSERT INTO ChiTietDoiBong (MaCauThu, MaClb, MuaGiai, SoAoThiDau) VALUES
('1', 'CLB_HAIPHONG', '2024-2025', 1),   -- Nguyễn Đình Triệu
('2', 'CLB_HAIPHONG', '2024-2025', 8),   -- Joseph Mpande (Ngoại binh)
('3', 'CLB_HAIPHONG', '2024-2025', 10),  -- Triệu Việt Hưng
('4', 'CLB_HAIPHONG', '2024-2025', 4),   -- Đặng Văn Tới
('5', 'CLB_HAIPHONG', '2024-2025', 5),   -- Bicou Bissainthe (Ngoại binh)
('6', 'CLB_HAIPHONG', '2024-2025', 9),   -- Lucao do Break (Ngoại binh)
('7', 'CLB_HAIPHONG', '2024-2025', 2),   -- Lê Mạnh Dũng
('8', 'CLB_HAIPHONG', '2024-2025', 3),   -- Phạm Trung Hiếu
('9', 'CLB_HAIPHONG', '2024-2025', 7),   -- Hồ Minh Dĩ
('10', 'CLB_HAIPHONG', '2024-2025', 11), -- Martin Lo
('11', 'CLB_HAIPHONG', '2024-2025', 15), -- Nguyễn Văn Minh
('12', 'CLB_HAIPHONG', '2024-2025', 13), -- Đàm Tiến Dũng
('13', 'CLB_HAIPHONG', '2024-2025', 18), -- Nguyễn Hữu Sơn
('14', 'CLB_HAIPHONG', '2024-2025', 6),  -- Phạm Hoài Dương
('15', 'CLB_HAIPHONG', '2024-2025', 22), -- Nguyễn Văn Toản
('16', 'CLB_HAIPHONG', '2024-2025', 14); -- Lương Hoàng Nam

-- ==========================================================
-- 3. THÉP XANH NAM ĐỊNH (CLB_NAMDINH) - Cầu thủ 17-32
-- ==========================================================
INSERT INTO ChiTietDoiBong (MaCauThu, MaClb, MuaGiai, SoAoThiDau) VALUES
('17', 'CLB_NAMDINH', '2024-2025', 1),   -- Trần Nguyên Mạnh
('18', 'CLB_NAMDINH', '2024-2025', 12),  -- Nguyễn Phong Hồng Duy
('19', 'CLB_NAMDINH', '2024-2025', 5),   -- Dương Thanh Hào
('20', 'CLB_NAMDINH', '2024-2025', 6),   -- Hồ Khắc Ngọc
('21', 'CLB_NAMDINH', '2024-2025', 8),   -- Nguyễn Tuấn Anh
('22', 'CLB_NAMDINH', '2024-2025', 77),  -- Hendrio Araujo (Ngoại binh)
('23', 'CLB_NAMDINH', '2024-2025', 9),   -- Rafaelson Bezerra (Ngoại binh)
('24', 'CLB_NAMDINH', '2024-2025', 10),  -- Nguyễn Văn Toàn
('25', 'CLB_NAMDINH', '2024-2025', 15),  -- Tô Văn Vũ
('26', 'CLB_NAMDINH', '2024-2025', 3),   -- Trần Văn Kiên
('27', 'CLB_NAMDINH', '2024-2025', 18),  -- Lý Công Hoàng Anh
('28', 'CLB_NAMDINH', '2024-2025', 4),   -- Lucas Alves (Ngoại binh)
('29', 'CLB_NAMDINH', '2024-2025', 2),   -- Nguyễn Văn Vĩ
('30', 'CLB_NAMDINH', '2024-2025', 11),  -- Hoàng Minh Tuấn
('31', 'CLB_NAMDINH', '2024-2025', 7),   -- Trần Văn Công
('32', 'CLB_NAMDINH', '2024-2025', 21);  -- Trần Liêm Điều

-- ==========================================================
-- 4. BECAMEX BÌNH DƯƠNG (CLB_BINHDUONG) - Cầu thủ 33-48
-- ==========================================================
INSERT INTO ChiTietDoiBong (MaCauThu, MaClb, MuaGiai, SoAoThiDau) VALUES
('33', 'CLB_BINHDUONG', '2024-2025', 1),   -- Trần Minh Toàn
('34', 'CLB_BINHDUONG', '2024-2025', 4),   -- Quế Ngọc Hải
('35', 'CLB_BINHDUONG', '2024-2025', 9),   -- Nguyễn Tiến Linh
('36', 'CLB_BINHDUONG', '2024-2025', 3),   -- Hồ Tấn Tài
('37', 'CLB_BINHDUONG', '2024-2025', 8),   -- Nguyễn Hải Huy
('38', 'CLB_BINHDUONG', '2024-2025', 11),  -- Bùi Vĩ Hão
('39', 'CLB_BINHDUONG', '2024-2025', 2),   -- Võ Minh Trọng
('40', 'CLB_BINHDUONG', '2024-2025', 5),   -- Janclesio Almeida (Ngoại binh)
('41', 'CLB_BINHDUONG', '2024-2025', 99),  -- Prince Ibara (Ngoại binh)
('42', 'CLB_BINHDUONG', '2024-2025', 15),  -- Trương Dũ Đạt
('43', 'CLB_BINHDUONG', '2024-2025', 7),   -- Đoàn Hải Quân
('44', 'CLB_BINHDUONG', '2024-2025', 10),  -- Tống Anh Tỷ
('45', 'CLB_BINHDUONG', '2024-2025', 12),  -- Nguyễn Thành Nhân
('46', 'CLB_BINHDUONG', '2024-2025', 6),   -- Lê Quang Hùng
('47', 'CLB_BINHDUONG', '2024-2025', 13),  -- Trần Đình Khương
('48', 'CLB_BINHDUONG', '2024-2025', 22);  -- Lại Tuấn Vũ

-- ==========================================================
-- 5. LPBANK HAGL (CLB_HAGL) - Cầu thủ 65-80
-- ==========================================================
INSERT INTO ChiTietDoiBong (MaCauThu, MaClb, MuaGiai, SoAoThiDau) VALUES
('65', 'CLB_HAGL', '2024-2025', 1),   -- Trần Trung Kiên
('66', 'CLB_HAGL', '2024-2025', 3),   -- Jairo Filho (Ngoại binh)
('67', 'CLB_HAGL', '2024-2025', 10),  -- Châu Ngọc Quang
('68', 'CLB_HAGL', '2024-2025', 8),   -- Trần Minh Vương
('69', 'CLB_HAGL', '2024-2025', 6),   -- Dụng Quang Nho
('70', 'CLB_HAGL', '2024-2025', 9),   -- Nguyễn Quốc Việt
('71', 'CLB_HAGL', '2024-2025', 5),   -- Lê Văn Sơn
('72', 'CLB_HAGL', '2024-2025', 7),   -- Trần Bảo Toàn
('73', 'CLB_HAGL', '2024-2025', 4),   -- Gabriel Ferreira (Ngoại binh)
('74', 'CLB_HAGL', '2024-2025', 11),  -- Joao Veras (Ngoại binh)
('75', 'CLB_HAGL', '2024-2025', 2),   -- Phan Du Học
('76', 'CLB_HAGL', '2024-2025', 13),  -- Nguyễn Thanh Nhân
('77', 'CLB_HAGL', '2024-2025', 15),  -- Võ Đình Lâm
('78', 'CLB_HAGL', '2024-2025', 18),  -- Nguyễn Đức Việt
('79', 'CLB_HAGL', '2024-2025', 14),  -- Trần Thanh Sơn
('80', 'CLB_HAGL', '2024-2025', 21);  -- Dương Văn Lợi

-- ==========================================================
-- 6. SLNA (CLB_SLNA) - Cầu thủ 81-96
-- ==========================================================
INSERT INTO ChiTietDoiBong (MaCauThu, MaClb, MuaGiai, SoAoThiDau) VALUES
('81', 'CLB_SLNA', '2024-2025', 1),   -- Nguyễn Văn Việt
('82', 'CLB_SLNA', '2024-2025', 5),   -- Trần Đình Hoàng
('83', 'CLB_SLNA', '2024-2025', 9),   -- Michael Olaha (Ngoại binh)
('84', 'CLB_SLNA', '2024-2025', 3),   -- Mario Zebic (Ngoại binh)
('85', 'CLB_SLNA', '2024-2025', 8),   -- Phan Bá Quyền
('86', 'CLB_SLNA', '2024-2025', 7),   -- Đinh Xuân Tiến
('87', 'CLB_SLNA', '2024-2025', 10),  -- Trần Mạnh Quỳnh
('88', 'CLB_SLNA', '2024-2025', 2),   -- Lê Văn Thành
('89', 'CLB_SLNA', '2024-2025', 4),   -- Vương Văn Huy
('90', 'CLB_SLNA', '2024-2025', 6),   -- Trần Nam Hải
('91', 'CLB_SLNA', '2024-2025', 11),  -- Ngô Văn Lương
('92', 'CLB_SLNA', '2024-2025', 15),  -- Nguyễn Quang Vinh
('93', 'CLB_SLNA', '2024-2025', 99),  -- Benjamin Kuku (Ngoại binh)
('94', 'CLB_SLNA', '2024-2025', 13),  -- Hồ Văn Cường
('95', 'CLB_SLNA', '2024-2025', 14),  -- Lê Nguyên Hoàng
('96', 'CLB_SLNA', '2024-2025', 22);  -- Cao Văn Bình

-- ==========================================================
-- 7. ĐÔNG Á THANH HÓA (CLB_THANHHOA) - Cầu thủ 97-112
-- ==========================================================
INSERT INTO ChiTietDoiBong (MaCauThu, MaClb, MuaGiai, SoAoThiDau) VALUES
('97', 'CLB_THANHHOA', '2024-2025', 1),   -- Nguyễn Thanh Diệp
('98', 'CLB_THANHHOA', '2024-2025', 5),   -- Gustavo Santos (Ngoại binh)
('99', 'CLB_THANHHOA', '2024-2025', 3),   -- Trịnh Văn Lợi
('100', 'CLB_THANHHOA', '2024-2025', 8),  -- Nguyễn Thái Sơn
('101', 'CLB_THANHHOA', '2024-2025', 6),  -- Lâm Ti Phông
('102', 'CLB_THANHHOA', '2024-2025', 2),  -- Hoàng Thái Bình
('103', 'CLB_THANHHOA', '2024-2025', 9),  -- Rimario Gordon (Ngoại binh)
('104', 'CLB_THANHHOA', '2024-2025', 7),  -- A Mít
('105', 'CLB_THANHHOA', '2024-2025', 4),  -- Đinh Viết Tú
('106', 'CLB_THANHHOA', '2024-2025', 10), -- Lê Quốc Phương
('107', 'CLB_THANHHOA', '2024-2025', 15), -- Luiz Antonio (Ngoại binh)
('108', 'CLB_THANHHOA', '2024-2025', 11), -- Võ Nguyên Hoàng
('109', 'CLB_THANHHOA', '2024-2025', 21), -- Trịnh Xuân Hoàng
('110', 'CLB_THANHHOA', '2024-2025', 18), -- Doãn Ngọc Tân
('111', 'CLB_THANHHOA', '2024-2025', 12), -- Đoàn Ngọc Hà
('112', 'CLB_THANHHOA', '2024-2025', 13); -- Lê Thanh Bình

-- ==========================================================
-- 8. TP.HCM FC (CLB_TPHCM) - Cầu thủ 113-128
-- ==========================================================
INSERT INTO ChiTietDoiBong (MaCauThu, MaClb, MuaGiai, SoAoThiDau) VALUES
('113', 'CLB_TPHCM', '2024-2025', 1),   -- Patrik Lê Giang
('114', 'CLB_TPHCM', '2024-2025', 2),   -- Ngô Tùng Quốc
('115', 'CLB_TPHCM', '2024-2025', 5),   -- Brendon Lucas (Ngoại binh)
('116', 'CLB_TPHCM', '2024-2025', 4),   -- Sầm Ngọc Đức
('117', 'CLB_TPHCM', '2024-2025', 8),   -- Võ Huy Toàn
('118', 'CLB_TPHCM', '2024-2025', 6),   -- Nguyễn Hạ Long
('119', 'CLB_TPHCM', '2024-2025', 9),   -- Cheick Timité (Ngoại binh)
('120', 'CLB_TPHCM', '2024-2025', 10),  -- Hồ Tuấn Tài
('121', 'CLB_TPHCM', '2024-2025', 3),   -- Nguyễn Minh Tùng
('122', 'CLB_TPHCM', '2024-2025', 7),   -- Chu Văn Kiên
('123', 'CLB_TPHCM', '2024-2025', 22),  -- Phạm Hữu Nghĩa
('124', 'CLB_TPHCM', '2024-2025', 21),  -- Đặng Ngọc Tuấn
('125', 'CLB_TPHCM', '2024-2025', 15),  -- Lê Cao Hoài An
('126', 'CLB_TPHCM', '2024-2025', 13),  -- Nguyễn Thanh Thảo
('127', 'CLB_TPHCM', '2024-2025', 11),  -- Hoàng Vũ Samson (Ngoại binh)
('128', 'CLB_TPHCM', '2024-2025', 18);  -- Uông Ngọc Tiến

-- ==========================================================
-- 9. QUẢNG NINH FC (CLB_QUANGNINH) - Cầu thủ 165-180
-- ==========================================================
INSERT INTO ChiTietDoiBong (MaCauThu, MaClb, MuaGiai, SoAoThiDau) VALUES
('165', 'CLB_QUANGNINH', '2024-2025', 1),   -- Huỳnh Tuấn Linh
('166', 'CLB_QUANGNINH', '2024-2025', 9),   -- Mạc Hồng Quân
('167', 'CLB_QUANGNINH', '2024-2025', 10),  -- Nghiêm Xuân Tú
('168', 'CLB_QUANGNINH', '2024-2025', 4),   -- Dương Văn Khoa
('169', 'CLB_QUANGNINH', '2024-2025', 3),   -- Đào Duy Khánh
('170', 'CLB_QUANGNINH', '2024-2025', 5),   -- Nguyễn Xuân Hùng
('171', 'CLB_QUANGNINH', '2024-2025', 8),   -- Phạm Nguyên Sa
('172', 'CLB_QUANGNINH', '2024-2025', 7),   -- Kizito Trung Hiếu (Ngoại binh)
('173', 'CLB_QUANGNINH', '2024-2025', 11),  -- Eydison Teofilo (Ngoại binh)
('174', 'CLB_QUANGNINH', '2024-2025', 15),  -- Nguyễn Văn Khoa
('175', 'CLB_QUANGNINH', '2024-2025', 2),   -- Trịnh Hoa Hùng
('176', 'CLB_QUANGNINH', '2024-2025', 6),   -- Nguyễn Tiến Duy
('177', 'CLB_QUANGNINH', '2024-2025', 13),  -- Vũ Hồng Quân
('178', 'CLB_QUANGNINH', '2024-2025', 14),  -- Bùi Văn Hiếu
('179', 'CLB_QUANGNINH', '2024-2025', 18),  -- Giang Trần Quách Tân
('180', 'CLB_QUANGNINH', '2024-2025', 21);  -- Phan Minh Thành

-- ==========================================================
-- 10. BÌNH ĐỊNH FC (CLB_BINHDINH) - Cầu thủ 181-196
-- ==========================================================
INSERT INTO ChiTietDoiBong (MaCauThu, MaClb, MuaGiai, SoAoThiDau) VALUES
('181', 'CLB_BINHDINH', '2024-2025', 1),   -- Đặng Văn Lâm
('182', 'CLB_BINHDINH', '2024-2025', 8),   -- Đỗ Văn Thuận
('183', 'CLB_BINHDINH', '2024-2025', 6),   -- Cao Văn Triền
('184', 'CLB_BINHDINH', '2024-2025', 3),   -- Lê Ngọc Bảo
('185', 'CLB_BINHDINH', '2024-2025', 4),   -- Marlon Rangel (Ngoại binh)
('186', 'CLB_BINHDINH', '2024-2025', 10),  -- Leonardo Artur (Ngoại binh)
('187', 'CLB_BINHDINH', '2024-2025', 9),   -- Alan Grafite (Ngoại binh)
('188', 'CLB_BINHDINH', '2024-2025', 7),   -- Nghiêm Thành Chí
('189', 'CLB_BINHDINH', '2024-2025', 2),   -- Phạm Văn Thành
('190', 'CLB_BINHDINH', '2024-2025', 22),  -- Vũ Tuyên Quang
('191', 'CLB_BINHDINH', '2024-2025', 5),   -- Trần Đình Trọng
('192', 'CLB_BINHDINH', '2024-2025', 13),  -- Mạc Đức Việt Anh
('193', 'CLB_BINHDINH', '2024-2025', 11),  -- Huỳnh Tiến Đạt
('194', 'CLB_BINHDINH', '2024-2025', 15),  -- Ngô Hồng Phước
('195', 'CLB_BINHDINH', '2024-2025', 18),  -- Nguyễn Văn Đức
('196', 'CLB_BINHDINH', '2024-2025', 14);  -- Adriano Schmidt (Ngoại binh)

-- ==========================================================
-- VÒNG 1 (Ngày 14/09/2024 & 15/09/2024)
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Hà Nội vs Bình Định (Hàng Đẫy) - Trận cầu tâm điểm
('MT_V1_01', '2024-2025', 1, '2024-09-14 19:15:00', 'CLB_HANOI', 'CLB_BINHDINH', 'SVD_HANGDAY', 12000, '2-1'),
-- Trận 2: Hải Phòng vs HAGL (Lạch Tray)
('MT_V1_02', '2024-2025', 1, '2024-09-14 18:00:00', 'CLB_HAIPHONG', 'CLB_HAGL', 'SVD_LACHTRAY', 15000, '1-1'),
-- Trận 3: Nam Định vs Quảng Ninh (Thiên Trường)
('MT_V1_03', '2024-2025', 1, '2024-09-15 18:00:00', 'CLB_NAMDINH', 'CLB_QUANGNINH', 'SVD_THIENTRUONG', 18000, '3-0'),
-- Trận 4: SLNA vs Thanh Hóa (Derby Bắc Trung Bộ - Sân Vinh)
('MT_V1_04', '2024-2025', 1, '2024-09-15 17:00:00', 'CLB_SLNA', 'CLB_THANHHOA', 'SVD_VINH', 10500, '0-0'),
-- Trận 5: TP.HCM vs Bình Dương (Thống Nhất)
('MT_V1_05', '2024-2025', 1, '2024-09-15 19:15:00', 'CLB_TPHCM', 'CLB_BINHDUONG', 'SVD_THONGNHAT', 7000, '1-2');

-- ==========================================================
-- CHI TIẾT SỰ KIỆN TRẬN ĐẤU VÒNG 1
-- ==========================================================
-- Bàn thắng Hà Nội 1-0 (Văn Quyết)
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) 
VALUES ('SK_V1_01_01', 'BanThang', 15, 'Văn Quyết sút xa đẹp mắt', 'MT_V1_01', 'CLB_HANOI', '49');

-- Bàn thắng Bình Định 1-1 (Alan Grafite - Mã số 87)
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) 
VALUES ('SK_V1_01_02', 'BanThang', 42, 'Alan Grafite đánh đầu gỡ hòa', 'MT_V1_01', 'CLB_BINHDINH', '187');

-- Thẻ vàng Văn Lâm (Mã số 81) - Câu giờ
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) 
VALUES ('SK_V1_01_03', 'TheVang', 70, 'Câu giờ', 'MT_V1_01', 'CLB_BINHDINH', '181');

-- Bàn thắng Hà Nội 2-1 (Tuấn Hải) - Phút cuối
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) 
VALUES ('SK_V1_01_04', 'BanThang', 88, 'Tuấn Hải đệm bóng cận thành', 'MT_V1_01', 'CLB_HANOI', '52');

-- ===========================================================
-- Chi tiết trận đấu Nam Định vs Quảng Ninh (Vòng 1)
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V1_03_01', 'BanThang', 10, 'Rafaelson Bezerra mở tỷ số cho Nam Định', 'MT_V1_03', 'CLB_NAMDINH', '23'),
('SK_V1_03_03', 'BanThang', 60, 'Hendrio Araujo đưa Nam Định vượt lên', 'MT_V1_03', 'CLB_NAMDINH', '22'),
('SK_V1_03_04', 'BanThang', 75, 'Trần Liêm Điều ấn định chiến thắng 3-0 cho Nam Định', 'MT_V1_03', 'CLB_NAMDINH', '32');

-- ==========================================================
-- Chi tiết trận đấu SLNA vs Thanh Hóa (Vòng 1)
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V1_04_01', 'TheVang', 30, 'Phan Bá Quyền nhận thẻ vàng đầu tiên của trận đấu', 'MT_V1_04', 'CLB_SLNA', '85'),
('SK_V1_04_02', 'TheVang', 55, 'Nguyễn Thái Sơn bị phạt thẻ vàng vì phạm lỗi thô bạo', 'MT_V1_04', 'CLB_THANHHOA', '100');

-- ==========================================================
-- Chi tiết trận đấu TP.HCM vs Bình Dương (Vòng 1)
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V1_05_01', 'BanThang', 25, 'Nguyễn Tiến Linh mở tỷ số cho Bình Dương', 'MT_V1_05', 'CLB_BINHDUONG', '35'),
('SK_V1_05_02', 'BanThang', 50, 'Cheick Timité nhân đôi cách biệt cho Bình Dương', 'MT_V1_05', 'CLB_BINHDUONG', '119'),
('SK_V1_05_03', 'TheVang', 80, 'Sầm Ngọc Đức nhận thẻ vàng vì phản ứng trọng tài', 'MT_V1_05', 'CLB_TPHCM', '116');

-- ==========================================================
-- Chi tiết trận đấu Hải Phòng vs HAGL (Vòng 1)
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V1_02_01', 'BanThang', 40, 'Joseph Mpande mở tỷ số cho Hải Phòng', 'MT_V1_02', 'CLB_HAIPHONG', '2'),
('SK_V1_02_02', 'BanThang', 70, 'Nguyễn Quốc Việt gỡ hòa cho HAGL', 'MT_V1_02', 'CLB_HAGL', '70');


-- ==========================================================
-- VÒNG 2 (Ngày 21/09/2024 & 22/09/2024)
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: HAGL vs Hà Nội (Pleiku) - HAGL gây bất ngờ
('MT_V2_01', '2024-2025', 2, '2024-09-21 17:00:00', 'CLB_HAGL', 'CLB_HANOI', 'SVD_PLEIKU', 9000, '1-0'),
-- Trận 2: Bình Dương vs Hải Phòng (Gò Đậu)
('MT_V2_02', '2024-2025', 2, '2024-09-21 18:00:00', 'CLB_BINHDUONG', 'CLB_HAIPHONG', 'SVD_GODAU', 8500, '2-2'),
-- Trận 3: Bình Định vs Nam Định (Quy Nhơn)
('MT_V2_03', '2024-2025', 2, '2024-09-22 18:00:00', 'CLB_BINHDINH', 'CLB_NAMDINH', 'SVD_QUYNHON', 11000, '1-2'),
-- Trận 4: Thanh Hóa vs TP.HCM
('MT_V2_04', '2024-2025', 2, '2024-09-22 18:00:00', 'CLB_THANHHOA', 'CLB_TPHCM', 'SVD_VUTRONGPHUNG', 6000, '1-0'),
-- Trận 5: Quảng Ninh vs SLNA (Cẩm Phả)
('MT_V2_05', '2024-2025', 2, '2024-09-22 19:15:00', 'CLB_QUANGNINH', 'CLB_SLNA', 'SVD_CAMPHA', 5000, '0-1');

-- ==========================================================
-- VÒNG 3 (Ngày 28/09/2024 & 29/09/2024)
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Hà Nội vs Nam Định (Hàng Đẫy) - Đại chiến
('MT_V3_01', '2024-2025', 3, '2024-09-28 19:15:00', 'CLB_HANOI', 'CLB_NAMDINH', 'SVD_HANGDAY', 14000, '2-2'),
-- Trận 2: SLNA vs Bình Dương (Vinh)
('MT_V3_02', '2024-2025', 3, '2024-09-28 17:00:00', 'CLB_SLNA', 'CLB_BINHDUONG', 'SVD_VINH', 6000, '0-2'),
-- Trận 3: HAGL vs Quảng Ninh (Pleiku)
('MT_V3_03', '2024-2025', 3, '2024-09-29 17:00:00', 'CLB_HAGL', 'CLB_QUANGNINH', 'SVD_PLEIKU', 7500, '3-1'),
-- Trận 4: TP.HCM vs Hải Phòng (Thống Nhất)
('MT_V3_04', '2024-2025', 3, '2024-09-29 19:15:00', 'CLB_TPHCM', 'CLB_HAIPHONG', 'SVD_THONGNHAT', 5000, '1-1'),
-- Trận 5: Bình Định vs Thanh Hóa (Quy Nhơn)
('MT_V3_05', '2024-2025', 3, '2024-09-29 18:00:00', 'CLB_BINHDINH', 'CLB_THANHHOA', 'SVD_QUYNHON', 8000, '0-0');

-- ==========================================================
-- VÒNG 4 (Ngày 04/10/2024 & 05/10/2024)
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Hải Phòng vs Hà Nội (Lạch Tray) - Derby căng thẳng
('MT_V4_01', '2024-2025', 4, '2024-10-04 18:00:00', 'CLB_HAIPHONG', 'CLB_HANOI', 'SVD_LACHTRAY', 22000, '3-2'),
-- Trận 2: Nam Định vs SLNA
('MT_V4_02', '2024-2025', 4, '2024-10-04 18:00:00', 'CLB_NAMDINH', 'CLB_SLNA', 'SVD_THIENTRUONG', 15000, '1-0'),
-- Trận 3: Bình Dương vs HAGL
('MT_V4_03', '2024-2025', 4, '2024-10-05 17:00:00', 'CLB_BINHDUONG', 'CLB_HAGL', 'SVD_GODAU', 12000, '4-1'),
-- Trận 4: Quảng Ninh vs TP.HCM
('MT_V4_04', '2024-2025', 4, '2024-10-05 18:00:00', 'CLB_QUANGNINH', 'CLB_TPHCM', 'SVD_CAMPHA', 4000, '1-2'),
-- Trận 5: Thanh Hóa vs Bình Định
('MT_V4_05', '2024-2025', 4, '2024-10-05 18:00:00', 'CLB_THANHHOA', 'CLB_BINHDINH', 'SVD_VUTRONGPHUNG', 5500, '0-1');

-- ==========================================================
-- VÒNG 5 (Ngày 19/10/2024 & 20/10/2024)
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Hà Nội vs Bình Dương (Hàng Đẫy)
('MT_V5_01', '2024-2025', 5, '2024-10-19 19:15:00', 'CLB_HANOI', 'CLB_BINHDUONG', 'SVD_HANGDAY', 13000, '1-0'),
-- Trận 2: SLNA vs Hải Phòng (Vinh)
('MT_V5_02', '2024-2025', 5, '2024-10-19 17:00:00', 'CLB_SLNA', 'CLB_HAIPHONG', 'SVD_VINH', 9500, '2-2'),
-- Trận 3: Quảng Ninh vs Bình Định (Cẩm Phả)
('MT_V5_03', '2024-2025', 5, '2024-10-20 18:00:00', 'CLB_QUANGNINH', 'CLB_BINHDINH', 'SVD_CAMPHA', 6000, '1-1'),
-- Trận 4: HAGL vs Thanh Hóa (Pleiku)
('MT_V5_04', '2024-2025', 5, '2024-10-20 17:00:00', 'CLB_HAGL', 'CLB_THANHHOA', 'SVD_PLEIKU', 8000, '2-1'),
-- Trận 5: TP.HCM vs Nam Định (Thống Nhất)
('MT_V5_05', '2024-2025', 5, '2024-10-20 19:15:00', 'CLB_TPHCM', 'CLB_NAMDINH', 'SVD_THONGNHAT', 6500, '0-2');

-- ==========================================================
-- VÒNG 6 (Ngày 26/10/2024 & 27/10/2024)
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Hải Phòng vs Bình Định (Lạch Tray)
('MT_V6_01', '2024-2025', 6, '2024-10-26 18:00:00', 'CLB_HAIPHONG', 'CLB_BINHDINH', 'SVD_LACHTRAY', 14000, '2-0'),
-- Trận 2: Nam Định vs Bình Dương (Thiên Trường)
('MT_V6_02', '2024-2025', 6, '2024-10-26 18:00:00', 'CLB_NAMDINH', 'CLB_BINHDUONG', 'SVD_THIENTRUONG', 16000, '1-1'),
-- Trận 3: Thanh Hóa vs Quảng Ninh (Vũ Trọng Phụng)
('MT_V6_03', '2024-2025', 6, '2024-10-27 18:00:00', 'CLB_THANHHOA', 'CLB_QUANGNINH', 'SVD_VUTRONGPHUNG', 5000, '1-0'),
-- Trận 4: TP.HCM vs HAGL (Thống Nhất)
('MT_V6_04', '2024-2025', 6, '2024-10-27 18:00:00', 'CLB_TPHCM', 'CLB_HAGL', 'SVD_THONGNHAT', 7000, '0-1'),
-- Trận 5: SLNA vs Hà Nội (Vinh)
('MT_V6_05', '2024-2025', 6, '2024-10-27 17:00:00', 'CLB_SLNA', 'CLB_HANOI', 'SVD_VINH', 11000, '1-3');

-- ==========================================================
-- VÒNG 7 (Ngày 02/11/2024 & 03/11/2024)
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Hà Nội vs Thanh Hóa (Hàng Đẫy)
('MT_V7_01', '2024-2025', 7, '2024-11-02 19:15:00', 'CLB_HANOI', 'CLB_THANHHOA', 'SVD_HANGDAY', 12500, '3-1'),
-- Trận 2: Bình Dương vs Quảng Ninh (Gò Đậu)
('MT_V7_02', '2024-2025', 7, '2024-11-02 18:00:00', 'CLB_BINHDUONG', 'CLB_QUANGNINH', 'SVD_GODAU', 9000, '2-0'),
-- Trận 3: HAGL vs Hải Phòng (Pleiku)
('MT_V7_03', '2024-2025', 7, '2024-11-03 17:00:00', 'CLB_HAGL', 'CLB_HAIPHONG', 'SVD_PLEIKU', 7000, '1-2'),
-- Trận 4: TP.HCM vs Bình Định (Thống Nhất)
('MT_V7_04', '2024-2025', 7, '2024-11-03 19:15:00', 'CLB_TPHCM', 'CLB_BINHDINH', 'SVD_THONGNHAT', 6000, '2-1'),
-- Trận 5: Nam Định vs SLNA (Thiên Trường) - Derby miền Bắc
('MT_V7_05', '2024-2025', 7, '2024-11-03 18:00:00', 'CLB_NAMDINH', 'CLB_SLNA', 'SVD_THIENTRUONG', 20000, '2-2');

-- ==========================================================
-- VÒNG 8 (Ngày 09/11/2024 & 10/11/2024)
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Hải Phòng vs Quảng Ninh (Lạch Tray)
('MT_V8_01', '2024-2025', 8, '2024-11-09 18:00:00', 'CLB_HAIPHONG', 'CLB_QUANGNINH', 'SVD_LACHTRAY', 17000, '3-0'),
-- Trận 2: SLNA vs TP.HCM (Vinh)
('MT_V8_02', '2024-2025', 8, '2024-11-09 17:00:00', 'CLB_SLNA', 'CLB_TPHCM', 'SVD_VINH', 8500, '1-1'),
-- Trận 3: Bình Định vs Bình Dương (Quy Nhơn)
('MT_V8_03', '2024-2025', 8, '2024-11-10 18:00:00', 'CLB_BINHDINH', 'CLB_BINHDUONG', 'SVD_QUYNHON', 9500, '1-2'),
-- Trận 4: Thanh Hóa vs Nam Định (Vũ Trọng Phụng)
('MT_V8_04', '2024-2025', 8, '2024-11-10 18:00:00', 'CLB_THANHHOA', 'CLB_NAMDINH', 'SVD_VUTRONGPHUNG', 6500, '0-0'),
-- Trận 5: Hà Nội vs HAGL (Hàng Đẫy)
('MT_V8_05', '2024-2025', 8, '2024-11-10 19:15:00', 'CLB_HANOI', 'CLB_HAGL', 'SVD_HANGDAY', 14000, '2-1');

-- ==========================================================
-- VÒNG 9 (Ngày 23/11/2024 & 24/11/2024)
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Quảng Ninh vs Hà Nội (Cẩm Phả)
('MT_V9_01', '2024-2025', 9, '2024-11-23 18:00:00', 'CLB_QUANGNINH', 'CLB_HANOI', 'SVD_CAMPHA', 10000, '0-2'),
-- Trận 2: Bình Dương vs Thanh Hóa (Gò Đậu)
('MT_V9_02', '2024-2025', 9, '2024-11-23 18:00:00', 'CLB_BINHDUONG', 'CLB_THANHHOA', 'SVD_GODAU', 8000, '3-1'),
-- Trận 3: HAGL vs SLNA (Pleiku)
('MT_V9_03', '2024-2025', 9, '2024-11-24 17:00:00', 'CLB_HAGL', 'CLB_SLNA', 'SVD_PLEIKU', 7500, '2-0'),
-- Trận 4: Nam Định vs TP.HCM (Thiên Trường) - Đại chiến
('MT_V9_04', '2024-2025', 9, '2024-11-24 18:00:00', 'CLB_NAMDINH', 'CLB_TPHCM', 'SVD_THIENTRUONG', 15000, '2-0'),
-- Trận 5: Hải Phòng vs Bình Định (Lạch Tray)
('MT_V9_05', '2024-2025', 9, '2024-11-24 18:00:00', 'CLB_HAIPHONG', 'CLB_BINHDINH', 'SVD_LACHTRAY', 13000, '1-1');

-- ==========================================================
-- LƯỢT VỀ - VÒNG 10 (Ngày 30/11/2024 & 01/12/2024)
-- Đảo ngược lịch thi đấu vòng 1
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Bình Định vs Hà Nội (Quy Nhơn)
('MT_V10_01', '2024-2025', 10, '2024-11-30 18:00:00', 'CLB_BINHDINH', 'CLB_HANOI', 'SVD_QUYNHON', 11000, '1-2'),
-- Trận 2: HAGL vs Hải Phòng (Pleiku)
('MT_V10_02', '2024-2025', 10, '2024-11-30 17:00:00', 'CLB_HAGL', 'CLB_HAIPHONG', 'SVD_PLEIKU', 8500, '0-1'),
-- Trận 3: Quảng Ninh vs Nam Định (Cẩm Phả)
('MT_V10_03', '2024-2025', 10, '2024-12-01 18:00:00', 'CLB_QUANGNINH', 'CLB_NAMDINH', 'SVD_CAMPHA', 7000, '1-3'),
-- Trận 4: Thanh Hóa vs SLNA (Vũ Trọng Phụng)
('MT_V10_04', '2024-2025', 10, '2024-12-01 18:00:00', 'CLB_THANHHOA', 'CLB_SLNA', 'SVD_VUTRONGPHUNG', 7500, '1-1'),
-- Trận 5: Bình Dương vs TP.HCM (Gò Đậu)
('MT_V10_05', '2024-2025', 10, '2024-12-01 18:00:00', 'CLB_BINHDUONG', 'CLB_TPHCM', 'SVD_GODAU', 10000, '2-1');

-- ==========================================================
-- VÒNG 11 (Ngày 07/12/2024 & 08/12/2024)
-- Đảo ngược lịch thi đấu vòng 2
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Hà Nội vs HAGL (Hàng Đẫy)
('MT_V11_01', '2024-2025', 11, '2024-12-07 19:15:00', 'CLB_HANOI', 'CLB_HAGL', 'SVD_HANGDAY', 13500, '3-0'),
-- Trận 2: Hải Phòng vs Bình Dương (Lạch Tray)
('MT_V11_02', '2024-2025', 11, '2024-12-07 18:00:00', 'CLB_HAIPHONG', 'CLB_BINHDUONG', 'SVD_LACHTRAY', 16000, '1-1'),
-- Trận 3: Nam Định vs Bình Định (Thiên Trường)
('MT_V11_03', '2024-2025', 11, '2024-12-08 18:00:00', 'CLB_NAMDINH', 'CLB_BINHDINH', 'SVD_THIENTRUONG', 17000, '3-1'),
-- Trận 4: TP.HCM vs Thanh Hóa (Thống Nhất)
('MT_V11_04', '2024-2025', 11, '2024-12-08 19:15:00', 'CLB_TPHCM', 'CLB_THANHHOA', 'SVD_THONGNHAT', 7000, '2-0'),
-- Trận 5: SLNA vs Quảng Ninh (Vinh)
('MT_V11_05', '2024-2025', 11, '2024-12-08 17:00:00', 'CLB_SLNA', 'CLB_QUANGNINH', 'SVD_VINH', 9000, '1-0');

-- ==========================================================
-- VÒNG 12 (Ngày 14/12/2024 & 15/12/2024)
-- Đảo ngược lịch thi đấu vòng 3
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Nam Định vs Hà Nội (Thiên Trường) - Đại chiến
('MT_V12_01', '2024-2025', 12, '2024-12-14 18:00:00', 'CLB_NAMDINH', 'CLB_HANOI', 'SVD_THIENTRUONG', 22000, '1-1'),
-- Trận 2: Bình Dương vs SLNA (Gò Đậu)
('MT_V12_02', '2024-2025', 12, '2024-12-14 18:00:00', 'CLB_BINHDUONG', 'CLB_SLNA', 'SVD_GODAU', 9500, '3-2'),
-- Trận 3: Quảng Ninh vs HAGL (Cẩm Phả)
('MT_V12_03', '2024-2025', 12, '2024-12-15 18:00:00', 'CLB_QUANGNINH', 'CLB_HAGL', 'SVD_CAMPHA', 6500, '0-2'),
-- Trận 4: Hải Phòng vs TP.HCM (Lạch Tray)
('MT_V12_04', '2024-2025', 12, '2024-12-15 18:00:00', 'CLB_HAIPHONG', 'CLB_TPHCM', 'SVD_LACHTRAY', 14000, '2-1'),
-- Trận 5: Thanh Hóa vs Bình Định (Vũ Trọng Phụng)
('MT_V12_05', '2024-2025', 12, '2024-12-15 18:00:00', 'CLB_THANHHOA', 'CLB_BINHDINH', 'SVD_VUTRONGPHUNG', 6000, '1-0');

-- ==========================================================
-- VÒNG 13 (Ngày 21/12/2024 & 22/12/2024)
-- Đảo ngược lịch thi đấu vòng 4
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Hà Nội vs Hải Phòng (Hàng Đẫy) - Derby miền Bắc
('MT_V13_01', '2024-2025', 13, '2024-12-21 19:15:00', 'CLB_HANOI', 'CLB_HAIPHONG', 'SVD_HANGDAY', 18000, '1-0'),
-- Trận 2: SLNA vs Nam Định (Vinh)
('MT_V13_02', '2024-2025', 13, '2024-12-21 17:00:00', 'CLB_SLNA', 'CLB_NAMDINH', 'SVD_VINH', 12000, '0-1'),
-- Trận 3: HAGL vs Bình Dương (Pleiku)
('MT_V13_03', '2024-2025', 13, '2024-12-22 17:00:00', 'CLB_HAGL', 'CLB_BINHDUONG', 'SVD_PLEIKU', 8500, '1-3'),
-- Trận 4: TP.HCM vs Quảng Ninh (Thống Nhất)
('MT_V13_04', '2024-2025', 13, '2024-12-22 19:15:00', 'CLB_TPHCM', 'CLB_QUANGNINH', 'SVD_THONGNHAT', 6500, '2-0'),
-- Trận 5: Bình Định vs Thanh Hóa (Quy Nhơn)
('MT_V13_05', '2024-2025', 13, '2024-12-22 18:00:00', 'CLB_BINHDINH', 'CLB_THANHHOA', 'SVD_QUYNHON', 9000, '1-1');

-- ==========================================================
-- VÒNG 14 (Ngày 28/12/2024 & 29/12/2024)
-- Đảo ngược lịch thi đấu vòng 5
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Bình Dương vs Hà Nội (Gò Đậu)
('MT_V14_01', '2024-2025', 14, '2024-12-28 18:00:00', 'CLB_BINHDUONG', 'CLB_HANOI', 'SVD_GODAU', 11000, '2-2'),
-- Trận 2: Hải Phòng vs SLNA (Lạch Tray)
('MT_V14_02', '2024-2025', 14, '2024-12-28 18:00:00', 'CLB_HAIPHONG', 'CLB_SLNA', 'SVD_LACHTRAY', 13000, '3-1'),
-- Trận 3: Bình Định vs Quảng Ninh (Quy Nhơn)
('MT_V14_03', '2024-2025', 14, '2024-12-29 18:00:00', 'CLB_BINHDINH', 'CLB_QUANGNINH', 'SVD_QUYNHON', 8500, '0-0'),
-- Trận 4: Thanh Hóa vs HAGL (Vũ Trọng Phụng)
('MT_V14_04', '2024-2025', 14, '2024-12-29 18:00:00', 'CLB_THANHHOA', 'CLB_HAGL', 'SVD_VUTRONGPHUNG', 7000, '1-2'),
-- Trận 5: Nam Định vs TP.HCM (Thiên Trường)
('MT_V14_05', '2024-2025', 14, '2024-12-29 18:00:00', 'CLB_NAMDINH', 'CLB_TPHCM', 'SVD_THIENTRUONG', 16000, '3-0');

-- ==========================================================
-- VÒNG 15 (Ngày 04/01/2025 & 05/01/2025)
-- Đảo ngược lịch thi đấu vòng 6
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Bình Định vs Hải Phòng (Quy Nhơn)
('MT_V15_01', '2024-2025', 15, '2025-01-04 18:00:00', 'CLB_BINHDINH', 'CLB_HAIPHONG', 'SVD_QUYNHON', 10000, '1-1'),
-- Trận 2: Bình Dương vs Nam Định (Gò Đậu)
('MT_V15_02', '2024-2025', 15, '2025-01-04 18:00:00', 'CLB_BINHDUONG', 'CLB_NAMDINH', 'SVD_GODAU', 10500, '1-2'),
-- Trận 3: Quảng Ninh vs Thanh Hóa (Cẩm Phả)
('MT_V15_03', '2024-2025', 15, '2025-01-05 18:00:00', 'CLB_QUANGNINH', 'CLB_THANHHOA', 'SVD_CAMPHA', 5500, '0-1'),
-- Trận 4: HAGL vs TP.HCM (Pleiku)
('MT_V15_04', '2024-2025', 15, '2025-01-05 17:00:00', 'CLB_HAGL', 'CLB_TPHCM', 'SVD_PLEIKU', 8000, '1-0'),
-- Trận 5: Hà Nội vs SLNA (Hàng Đẫy)
('MT_V15_05', '2024-2025', 15, '2025-01-05 19:15:00', 'CLB_HANOI', 'CLB_SLNA', 'SVD_HANGDAY', 14500, '2-1');

-- ==========================================================
-- VÒNG 16 (Ngày 11/01/2025 & 12/01/2025)
-- Đảo ngược lịch thi đấu vòng 7
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Thanh Hóa vs Hà Nội (Vũ Trọng Phụng)
('MT_V16_01', '2024-2025', 16, '2025-01-11 18:00:00', 'CLB_THANHHOA', 'CLB_HANOI', 'SVD_VUTRONGPHUNG', 8000, '0-2'),
-- Trận 2: Quảng Ninh vs Bình Dương (Cẩm Phả)
('MT_V16_02', '2024-2025', 16, '2025-01-11 18:00:00', 'CLB_QUANGNINH', 'CLB_BINHDUONG', 'SVD_CAMPHA', 6000, '1-2'),
-- Trận 3: Hải Phòng vs HAGL (Lạch Tray)
('MT_V16_03', '2024-2025', 16, '2025-01-12 18:00:00', 'CLB_HAIPHONG', 'CLB_HAGL', 'SVD_LACHTRAY', 15000, '2-2'),
-- Trận 4: Bình Định vs TP.HCM (Quy Nhơn)
('MT_V16_04', '2024-2025', 16, '2025-01-12 18:00:00', 'CLB_BINHDINH', 'CLB_TPHCM', 'SVD_QUYNHON', 9500, '1-0'),
-- Trận 5: SLNA vs Nam Định (Vinh) - Derby miền Bắc lượt về
('MT_V16_05', '2024-2025', 16, '2025-01-12 17:00:00', 'CLB_SLNA', 'CLB_NAMDINH', 'SVD_VINH', 13000, '1-1');

-- ==========================================================
-- VÒNG 17 (Ngày 18/01/2025 & 19/01/2025)
-- Đảo ngược lịch thi đấu vòng 8
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Quảng Ninh vs Hải Phòng (Cẩm Phả)
('MT_V17_01', '2024-2025', 17, '2025-01-18 18:00:00', 'CLB_QUANGNINH', 'CLB_HAIPHONG', 'SVD_CAMPHA', 8000, '0-2'),
-- Trận 2: TP.HCM vs SLNA (Thống Nhất)
('MT_V17_02', '2024-2025', 17, '2025-01-18 19:15:00', 'CLB_TPHCM', 'CLB_SLNA', 'SVD_THONGNHAT', 7500, '1-0'),
-- Trận 3: Bình Dương vs Bình Định (Gò Đậu)
('MT_V17_03', '2024-2025', 17, '2025-01-19 18:00:00', 'CLB_BINHDUONG', 'CLB_BINHDINH', 'SVD_GODAU', 10000, '3-1'),
-- Trận 4: Nam Định vs Thanh Hóa (Thiên Trường)
('MT_V17_04', '2024-2025', 17, '2025-01-19 18:00:00', 'CLB_NAMDINH', 'CLB_THANHHOA', 'SVD_THIENTRUONG', 18000, '1-1'),
-- Trận 5: HAGL vs Hà Nội (Pleiku)
('MT_V17_05', '2024-2025', 17, '2025-01-19 17:00:00', 'CLB_HAGL', 'CLB_HANOI', 'SVD_PLEIKU', 9500, '0-1');

-- ==========================================================
-- VÒNG 18 (Ngày 25/01/2025 & 26/01/2025) - VÒNG CUỐI
-- Đảo ngược lịch thi đấu vòng 9
-- ==========================================================
INSERT INTO LichThiDau (MaTran, MuaGiai, Vong, ThoiGianThiDau, MaClbNha, MaClbKhach, MaSanVanDong, SoKhanGia, TiSo) VALUES
-- Trận 1: Hà Nội vs Quảng Ninh (Hàng Đẫy)
('MT_V18_01', '2024-2025', 18, '2025-01-25 19:15:00', 'CLB_HANOI', 'CLB_QUANGNINH', 'SVD_HANGDAY', 15000, '3-0'),
-- Trận 2: Thanh Hóa vs Bình Dương (Vũ Trọng Phụng)
('MT_V18_02', '2024-2025', 18, '2025-01-25 18:00:00', 'CLB_THANHHOA', 'CLB_BINHDUONG', 'SVD_VUTRONGPHUNG', 7000, '1-2'),
-- Trận 3: SLNA vs HAGL (Vinh) - Derby Tây Nguyên - Nghệ An
('MT_V18_03', '2024-2025', 18, '2025-01-26 17:00:00', 'CLB_SLNA', 'CLB_HAGL', 'SVD_VINH', 11000, '2-1'),
-- Trận 4: TP.HCM vs Nam Định (Thống Nhất) - Trận cầu tâm điểm cuối mùa
('MT_V18_04', '2024-2025', 18, '2025-01-26 19:15:00', 'CLB_TPHCM', 'CLB_NAMDINH', 'SVD_THONGNHAT', 12000, '0-2'),
-- Trận 5: Bình Định vs Hải Phòng (Quy Nhơn)
('MT_V18_05', '2024-2025', 18, '2025-01-26 18:00:00', 'CLB_BINHDINH', 'CLB_HAIPHONG', 'SVD_QUYNHON', 10000, '1-1');

-- ==========================================================
-- ĐOIHINHXUATPHAT - VÒNG 1 MÙAGIẢI 2024-2025
-- ==========================================================
-- Cấu trúc: 1 GK - 4 DF - 4 MF - 2 FW (sơ đồ 4-4-2)
-- Mỗi đội có 1 đội trưởng (LaDoiTruong = TRUE)
-- ==========================================================

-- ==========================================================
-- TRẬN 1: HÀ NỘI vs BÌNH ĐỊNH (MT_V1_01)
-- ==========================================================

-- ĐỘI NHÀ: HÀ NỘI FC
INSERT INTO DoiHinhXuatPhat (MaTran, MaCauThu, ViTri, DuocXuatPhat, LaDoiTruong) VALUES
-- Thủ môn
('MT_V1_01', '54', 'GK', TRUE, FALSE),   -- Quan Văn Chuẩn
-- Hậu vệ
('MT_V1_01', '51', 'DF', TRUE, FALSE),   -- Đỗ Duy Mạnh
('MT_V1_01', '53', 'DF', TRUE, FALSE),   -- Nguyễn Thành Chung
('MT_V1_01', '55', 'DF', TRUE, FALSE),   -- Phạm Xuân Mạnh
('MT_V1_01', '62', 'DF', TRUE, FALSE),   -- Lê Văn Xuân
-- Tiền vệ
('MT_V1_01', '49', 'MF', TRUE, TRUE),    -- Nguyễn Văn Quyết (Đội trưởng)
('MT_V1_01', '50', 'MF', TRUE, FALSE),   -- Đỗ Hùng Dũng
('MT_V1_01', '56', 'MF', TRUE, FALSE),   -- Nguyễn Hai Long
('MT_V1_01', '58', 'MF', TRUE, FALSE),   -- Brandon Wilson
-- Tiền đạo
('MT_V1_01', '52', 'FW', TRUE, FALSE),   -- Phạm Tuấn Hải
('MT_V1_01', '57', 'FW', TRUE, FALSE),   -- Tagueu Joel
-- Dự bị
('MT_V1_01', '63', 'GK', FALSE, FALSE),  -- Nguyễn Văn Hoàng (GK dự bị)
('MT_V1_01', '59', 'MF', FALSE, FALSE),  -- Nguyễn Văn Trường
('MT_V1_01', '60', 'MF', FALSE, FALSE),  -- Vũ Minh Tuấn
('MT_V1_01', '61', 'MF', FALSE, FALSE),  -- Đậu Văn Toàn
('MT_V1_01', '64', 'MF', FALSE, FALSE);  -- Trương Văn Thái Quý

-- ĐỘI KHÁCH: BÌNH ĐỊNH FC
INSERT INTO DoiHinhXuatPhat (MaTran, MaCauThu, ViTri, DuocXuatPhat, LaDoiTruong) VALUES
-- Thủ môn
('MT_V1_01', '181', 'GK', TRUE, FALSE),  -- Đặng Văn Lâm
-- Hậu vệ
('MT_V1_01', '184', 'DF', TRUE, FALSE),  -- Lê Ngọc Bảo
('MT_V1_01', '185', 'DF', TRUE, FALSE),  -- Marlon Rangel
('MT_V1_01', '189', 'DF', TRUE, FALSE),  -- Phạm Văn Thành
('MT_V1_01', '191', 'DF', TRUE, TRUE),   -- Trần Đình Trọng (Đội trưởng)
-- Tiền vệ
('MT_V1_01', '182', 'MF', TRUE, FALSE),  -- Đỗ Văn Thuận
('MT_V1_01', '183', 'MF', TRUE, FALSE),  -- Cao Văn Triền
('MT_V1_01', '188', 'MF', TRUE, FALSE),  -- Nghiêm Thành Chí
('MT_V1_01', '194', 'MF', TRUE, FALSE),  -- Ngô Hồng Phước
-- Tiền đạo
('MT_V1_01', '186', 'FW', TRUE, FALSE),  -- Leonardo Artur
('MT_V1_01', '187', 'FW', TRUE, FALSE),  -- Alan Grafite
-- Dự bị
('MT_V1_01', '190', 'GK', FALSE, FALSE), -- Vũ Tuyên Quang (GK dự bị)
('MT_V1_01', '192', 'DF', FALSE, FALSE), -- Mạc Đức Việt Anh
('MT_V1_01', '196', 'DF', FALSE, FALSE), -- Adriano Schmidt
('MT_V1_01', '195', 'MF', FALSE, FALSE), -- Nguyễn Văn Đức
('MT_V1_01', '193', 'FW', FALSE, FALSE); -- Huỳnh Tiến Đạt

-- ==========================================================
-- TRẬN 2: HẢI PHÒNG vs HAGL (MT_V1_02)
-- ==========================================================

-- ĐỘI NHÀ: HẢI PHÒNG FC
INSERT INTO DoiHinhXuatPhat (MaTran, MaCauThu, ViTri, DuocXuatPhat, LaDoiTruong) VALUES
-- Thủ môn
('MT_V1_02', '1', 'GK', TRUE, FALSE),    -- Nguyễn Đình Triệu
-- Hậu vệ
('MT_V1_02', '4', 'DF', TRUE, FALSE),    -- Đặng Văn Tới
('MT_V1_02', '5', 'DF', TRUE, FALSE),    -- Bicou Bissainthe
('MT_V1_02', '7', 'DF', TRUE, TRUE),     -- Lê Mạnh Dũng (Đội trưởng)
('MT_V1_02', '8', 'DF', TRUE, FALSE),    -- Phạm Trung Hiếu
-- Tiền vệ
('MT_V1_02', '2', 'MF', TRUE, FALSE),    -- Joseph Mpande
('MT_V1_02', '3', 'MF', TRUE, FALSE),    -- Triệu Việt Hưng
('MT_V1_02', '10', 'MF', TRUE, FALSE),   -- Martin Lo
('MT_V1_02', '11', 'MF', TRUE, FALSE),   -- Nguyễn Văn Minh
-- Tiền đạo
('MT_V1_02', '6', 'FW', TRUE, FALSE),    -- Lucao do Break
('MT_V1_02', '13', 'FW', TRUE, FALSE),   -- Nguyễn Hữu Sơn
-- Dự bị
('MT_V1_02', '15', 'GK', FALSE, FALSE),  -- Nguyễn Văn Toản (GK dự bị)
('MT_V1_02', '12', 'DF', FALSE, FALSE),  -- Đàm Tiến Dũng
('MT_V1_02', '14', 'DF', FALSE, FALSE),  -- Phạm Hoài Dương
('MT_V1_02', '9', 'MF', FALSE, FALSE),   -- Hồ Minh Dĩ
('MT_V1_02', '16', 'MF', FALSE, FALSE);  -- Lương Hoàng Nam

-- ĐỘI KHÁCH: HAGL FC
INSERT INTO DoiHinhXuatPhat (MaTran, MaCauThu, ViTri, DuocXuatPhat, LaDoiTruong) VALUES
-- Thủ môn
('MT_V1_02', '65', 'GK', TRUE, FALSE),   -- Trần Trung Kiên
-- Hậu vệ
('MT_V1_02', '66', 'DF', TRUE, FALSE),   -- Jairo Filho
('MT_V1_02', '71', 'DF', TRUE, FALSE),   -- Lê Văn Sơn
('MT_V1_02', '73', 'DF', TRUE, FALSE),   -- Gabriel Ferreira
('MT_V1_02', '75', 'DF', TRUE, FALSE),   -- Phan Du Học
-- Tiền vệ
('MT_V1_02', '67', 'MF', TRUE, FALSE),   -- Châu Ngọc Quang
('MT_V1_02', '68', 'MF', TRUE, TRUE),    -- Trần Minh Vương (Đội trưởng)
('MT_V1_02', '69', 'MF', TRUE, FALSE),   -- Dụng Quang Nho
('MT_V1_02', '72', 'MF', TRUE, FALSE),   -- Trần Bảo Toàn
-- Tiền đạo
('MT_V1_02', '70', 'FW', TRUE, FALSE),   -- Nguyễn Quốc Việt
('MT_V1_02', '74', 'FW', TRUE, FALSE),   -- Joao Veras
-- Dự bị
('MT_V1_02', '80', 'GK', FALSE, FALSE),  -- Dương Văn Lợi (GK dự bị)
('MT_V1_02', '76', 'DF', FALSE, FALSE),  -- Nguyễn Thanh Nhân
('MT_V1_02', '77', 'MF', FALSE, FALSE),  -- Võ Đình Lâm
('MT_V1_02', '78', 'MF', FALSE, FALSE),  -- Nguyễn Đức Việt
('MT_V1_02', '79', 'MF', FALSE, FALSE);  -- Trần Thanh Sơn

-- ==========================================================
-- TRẬN 3: NAM ĐỊNH vs QUẢNG NINH (MT_V1_03)
-- ==========================================================

-- ĐỘI NHÀ: NAM ĐỊNH FC
INSERT INTO DoiHinhXuatPhat (MaTran, MaCauThu, ViTri, DuocXuatPhat, LaDoiTruong) VALUES
-- Thủ môn
('MT_V1_03', '17', 'GK', TRUE, FALSE),   -- Trần Nguyên Mạnh
-- Hậu vệ
('MT_V1_03', '18', 'DF', TRUE, FALSE),   -- Nguyễn Phong Hồng Duy
('MT_V1_03', '19', 'DF', TRUE, TRUE),    -- Dương Thanh Hào (Đội trưởng)
('MT_V1_03', '26', 'DF', TRUE, FALSE),   -- Trần Văn Kiên
('MT_V1_03', '28', 'DF', TRUE, FALSE),   -- Lucas Alves
-- Tiền vệ
('MT_V1_03', '20', 'MF', TRUE, FALSE),   -- Nguyễn Văn Toàn
-- Dự bị
('MT_V1_03', '32', 'GK', FALSE, FALSE),  -- Trần Liêm Điều (GK dự bị)
('MT_V1_03', '29', 'DF', FALSE, FALSE),  -- Nguyễn Văn Vĩ
('MT_V1_03', '27', 'MF', FALSE, FALSE),  -- Lý Công Hoàng Anh
('MT_V1_03', '31', 'MF', FALSE, FALSE),  -- Trần Văn Công
('MT_V1_03', '30', 'FW', FALSE, FALSE),  -- Hoàng Minh Tuấ
('MT_V1_03', '21', 'MF', TRUE, FALSE),   -- Nguyễn Tuấn Anh
('MT_V1_03', '22', 'MF', TRUE, FALSE),   -- Hendrio Araujo
('MT_V1_03', '25', 'MF', TRUE, FALSE),   -- Tô Văn Vũ
-- Tiền đạo
('MT_V1_03', '23', 'FW', TRUE, FALSE),   -- Rafaelson Bezerra
('MT_V1_03', '24', 'FW', TRUE, FALSE);   -- Nguyễn Văn Toàn

-- ĐỘI KHÁCH: QUẢNG NINH FC
INSERT INTO DoiHinhXuatPhat (MaTran, MaCauThu, ViTri, DuocXuatPhat, LaDoiTruong) VALUES
-- Thủ môn
('MT_V1_03', '165', 'GK', TRUE, FALSE),  -- Huỳnh Tuấn Linh
-- Hậu vệ
('MT_V1_03', '168', 'DF', TRUE, FALSE),  -- Dương Văn Khoa
('MT_V1_03', '169', 'DF', TRUE, FALSE),  -- Đào Duy Khánh
('MT_V1_03', '170', 'DF', TRUE, FALSE),  -- Nguyễn Xuân Hùng
('MT_V1_03', '175', 'DF', TRUE, FALSE),  -- Trịnh Hoa Hùng
-- Tiền vệ
('MT_V1_03', '166', 'MF', TRUE, TRUE), -- Nguyễn Văn Khoa
-- Dự bị
('MT_V1_03', '180', 'GK', FALSE, FALSE), -- Phan Minh Thành (GK dự bị)
('MT_V1_03', '176', 'DF', FALSE, FALSE), -- Nguyễn Tiến Duy
('MT_V1_03', '177', 'MF', FALSE, FALSE), -- Vũ Hồng Quân
('MT_V1_03', '178', 'MF', FALSE, FALSE), -- Bùi Văn Hiếu
('MT_V1_03', '179', 'MF', FALSE, FALSE), -- Giang Trần Quách TânĐội trưởng)
('MT_V1_03', '167', 'MF', TRUE, FALSE),  -- Nghiêm Xuân Tú
('MT_V1_03', '171', 'MF', TRUE, FALSE),  -- Phạm Nguyên Sa
('MT_V1_03', '172', 'MF', TRUE, FALSE),  -- Kizito Trung Hiếu
-- Tiền đạo
('MT_V1_03', '173', 'FW', TRUE, FALSE),  -- Eydison Teofilo
('MT_V1_03', '174', 'FW', TRUE, FALSE);  -- Nguyễn Văn Khoa

-- ==========================================================
-- TRẬN 4: SLNA vs THANH HÓA (MT_V1_04)
-- ==========================================================

-- ĐỘI NHÀ: SLNA (Sông Lam Nghệ An)
INSERT INTO DoiHinhXuatPhat (MaTran, MaCauThu, ViTri, DuocXuatPhat, LaDoiTruong) VALUES
-- Thủ môn
('MT_V1_04', '81', 'GK', TRUE, FALSE),   -- Nguyễn Văn Việt
-- Hậu vệ
('MT_V1_04', '82', 'DF', TRUE, TRUE),    -- Trần Đình Hoàng (Đội trưởng)
('MT_V1_04', '84', 'DF', TRUE, FALSE),   -- Mario Zebic
('MT_V1_04', '88', 'DF', TRUE, FALSE),   -- Lê Văn Thành
('MT_V1_04', '89', 'DF', TRUE, FALSE),   -- Vương Văn Huy
-- Tiền vệ
('MT_V1_04', '85', 'MF', TRUE, FALSE),   -- Ngô Văn Lương
-- Dự bị
('MT_V1_04', '96', 'GK', FALSE, FALSE),  -- Cao Văn Bình (GK dự bị)
('MT_V1_04', '94', 'DF', FALSE, FALSE),  -- Hồ Văn Cường
('MT_V1_04', '95', 'DF', FALSE, FALSE),  -- Lê Nguyên Hoàng
('MT_V1_04', '92', 'MF', FALSE, FALSE),  -- Nguyễn Quang Vinh
('MT_V1_04', '93', 'FW', FALSE, FALSE),  -- Benjamin Kuku
('MT_V1_04', '86', 'MF', TRUE, FALSE),   -- Đinh Xuân Tiến
('MT_V1_04', '87', 'MF', TRUE, FALSE),   -- Trần Mạnh Quỳnh
('MT_V1_04', '90', 'MF', TRUE, FALSE),   -- Trần Nam Hải
-- Tiền đạo
('MT_V1_04', '83', 'FW', TRUE, FALSE),   -- Michael Olaha
('MT_V1_04', '91', 'FW', TRUE, FALSE);   -- Ngô Văn Lương

-- ĐỘI KHÁCH: THANH HÓA FC
INSERT INTO DoiHinhXuatPhat (MaTran, MaCauThu, ViTri, DuocXuatPhat, LaDoiTruong) VALUES
-- Thủ môn
('MT_V1_04', '97', 'GK', TRUE, FALSE),   -- Nguyễn Thanh Diệp
-- Hậu vệ
('MT_V1_04', '98', 'DF', TRUE, FALSE),   -- Gustavo Santos
('MT_V1_04', '99', 'DF', TRUE, TRUE),    -- Trịnh Văn Lợi (Đội trưởng)
('MT_V1_04', '102', 'DF', TRUE, FALSE),  -- Hoàng Thái Bình
('MT_V1_04', '105', 'DF', TRUE, FALSE),  -- Đinh Viết Tú
-- Tiền vệ
('MT_V1_04', '100', 'MF', TRUE, FALSE),  -- Nguyễn Thái Sơn
('MT_V1_04', '101', 'MF', TRUE, FALSE),  -- Lâm Ti Phông
('MT_V1_04', '104', 'MF', TRUE, FALSE),  -- A Mít
('MT_V1_04', '107', 'MF', TRUE, FALSE),  -- Luiz Antonio
-- Tiền đạo
('MT_V1_04', '103', 'FW', TRUE, FALSE),  -- Rimario Gordon
('MT_V1_04', '108', 'FW', TRUE, FALSE),  -- Võ Nguyên Hoàng
-- Dự bị
('MT_V1_04', '109', 'GK', FALSE, FALSE), -- Trịnh Xuân Hoàng (GK dự bị)
('MT_V1_04', '111', 'DF', FALSE, FALSE), -- Đoàn Ngọc Hà
('MT_V1_04', '106', 'MF', FALSE, FALSE), -- Lê Quốc Phương
('MT_V1_04', '110', 'MF', FALSE, FALSE), -- Doãn Ngọc Tân
('MT_V1_04', '112', 'FW', FALSE, FALSE); -- Lê Thanh Bình

-- ==========================================================
-- TRẬN 5: TP.HCM vs BÌNH DƯƠNG (MT_V1_05)
-- ==========================================================

-- ĐỘI NHÀ: TP.HCM FC
INSERT INTO DoiHinhXuatPhat (MaTran, MaCauThu, ViTri, DuocXuatPhat, LaDoiTruong) VALUES
-- Thủ môn
('MT_V1_05', '113', 'GK', TRUE, FALSE),  -- Patrik Lê Giang
-- Hậu vệ
('MT_V1_05', '114', 'DF', TRUE, FALSE),  -- Ngô Tùng Quốc
('MT_V1_05', '115', 'DF', TRUE, FALSE),  -- Brendon Lucas
('MT_V1_05', '116', 'DF', TRUE, TRUE),   -- Sầm Ngọc Đức (Đội trưởng)
('MT_V1_05', '121', 'DF', TRUE, FALSE),  -- Nguyễn Minh Tùng
-- Tiền vệ
('MT_V1_05', '117', 'MF', TRUE, FALSE),  -- Võ Huy Toàn
('MT_V1_05', '118', 'MF', TRUE, FALSE),  -- Nguyễn Hạ Long
('MT_V1_05', '122', 'MF', TRUE, FALSE),  -- Chu Văn Kiên
('MT_V1_05', '128', 'MF', TRUE, FALSE),  -- Uông Ngọc Tiến
-- Tiền đạo
('MT_V1_05', '119', 'FW', TRUE, FALSE),  -- Cheick Timité
('MT_V1_05', '120', 'FW', TRUE, FALSE),  -- Hồ Tuấn Tài
-- Dự bị
('MT_V1_05', '123', 'GK', FALSE, FALSE), -- Phạm Hữu Nghĩa (GK dự bị)
('MT_V1_05', '125', 'DF', FALSE, FALSE), -- Lê Cao Hoài An
('MT_V1_05', '126', 'DF', FALSE, FALSE), -- Nguyễn Thanh Thảo
('MT_V1_05', '127', 'FW', FALSE, FALSE); -- Hoàng Vũ Samson

-- ĐỘI KHÁCH: BÌNH DƯƠNG FC
INSERT INTO DoiHinhXuatPhat (MaTran, MaCauThu, ViTri, DuocXuatPhat, LaDoiTruong) VALUES
-- Thủ môn
('MT_V1_05', '33', 'GK', TRUE, FALSE),   -- Trần Minh Toàn
-- Hậu vệ
('MT_V1_05', '34', 'DF', TRUE, TRUE),    -- Quế Ngọc Hải (Đội trưởng)
('MT_V1_05', '36', 'DF', TRUE, FALSE),   -- Hồ Tấn Tái
('MT_V1_05', '40', 'DF', TRUE, FALSE),   -- Janclesio Almeida
('MT_V1_05', '42', 'DF', TRUE, FALSE),   -- Trương Dũ Đạt
-- Tiền vệ
('MT_V1_05', '37', 'MF', TRUE, FALSE),   -- Nguyễn Hải Huy
('MT_V1_05', '43', 'MF', TRUE, FALSE),   -- Đoàn Hải Quân
('MT_V1_05', '44', 'MF', TRUE, FALSE),   -- Tống Anh Tỷ
('MT_V1_05', '39', 'MF', TRUE, FALSE),   -- Võ Minh Trọng
-- Tiền đạo
('MT_V1_05', '35', 'FW', TRUE, FALSE),   -- Nguyễn Tiến Linh
('MT_V1_05', '41', 'FW', TRUE, FALSE),   -- Prince Ibara
-- Dự bị
('MT_V1_05', '48', 'GK', FALSE, FALSE),  -- Lại Tuấn Vũ (GK dự bị)
('MT_V1_05', '45', 'DF', FALSE, FALSE),  -- Nguyễn Thành Nhân
('MT_V1_05', '46', 'DF', FALSE, FALSE),  -- Lê Quang Hùng
('MT_V1_05', '47', 'DF', FALSE, FALSE),  -- Trần Đình Khương
('MT_V1_05', '38', 'FW', FALSE, FALSE);  -- Bùi Vĩ Hào

-- ==========================================================
-- TỔNG: 160 CẦU THỦ (110 XUẤT PHÁT + 50 DỰ BỊ)
-- 5 TRẬN × 32 CẦU THỦ (16 CẦU THỦ/ĐỘI)
-- ==========================================================

-- ===================== VÒNG 1 =====================
-- MT_V1_01: Hà Nội vs Bình Định (2-1) => Phạm Tuấn Hải (52) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V1_01','CLB_HANOI',   56.0, 14, 7, 6, 10, 2, '52');
INSERT INTO ThongKeTranDau VALUES ('MT_V1_01','CLB_BINHDINH',44.0, 11, 4, 4, 12, 1, NULL);

-- MT_V1_02: Hải Phòng vs HAGL (1-1) => Joseph Mpande (2) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V1_02','CLB_HAIPHONG',52.0, 12, 5, 5, 9, 3, '2');
INSERT INTO ThongKeTranDau VALUES ('MT_V1_02','CLB_HAGL',    48.0, 10, 4, 4, 8, 2, NULL);

-- MT_V1_03: Nam Định vs Quảng Ninh (3-0) => Rafaelson (23) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V1_03','CLB_NAMDINH', 58.0, 16, 8, 7, 11, 1, '23');
INSERT INTO ThongKeTranDau VALUES ('MT_V1_03','CLB_QUANGNINH',42.0, 7,  2, 3, 13, 2, NULL);

-- MT_V1_04: SLNA vs Thanh Hóa (0-0) => Đinh Xuân Tiến (86) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V1_04','CLB_SLNA',    49.0, 9,  3, 5, 14, 1, '86');
INSERT INTO ThongKeTranDau VALUES ('MT_V1_04','CLB_THANHHOA',51.0, 10, 3, 4, 12, 2, NULL);

-- MT_V1_05: TP.HCM vs Bình Dương (1-2) => Nguyễn Tiến Linh (35) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V1_05','CLB_TPHCM',   47.0, 11, 4, 4, 10, 2, NULL);
INSERT INTO ThongKeTranDau VALUES ('MT_V1_05','CLB_BINHDUONG',53.0, 13, 6, 6, 9,  1, '35');

-- ===================== VÒNG 2 =====================
-- MT_V2_01: HAGL vs Hà Nội (1-0) => Trần Minh Vương (68) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V2_01','CLB_HAGL',    46.0, 9,  4, 4, 12, 2, '68');
INSERT INTO ThongKeTranDau VALUES ('MT_V2_01','CLB_HANOI',   54.0, 13, 5, 6, 10, 1, NULL);

-- MT_V2_02: Bình Dương vs Hải Phòng (2-2) => Nguyễn Tiến Linh (35) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V2_02','CLB_BINHDUONG',51.0, 12, 5, 5, 11, 2, '35');
INSERT INTO ThongKeTranDau VALUES ('MT_V2_02','CLB_HAIPHONG',49.0, 11, 5, 4, 10, 3, NULL);

-- MT_V2_03: Bình Định vs Nam Định (1-2) => Rafaelson (23) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V2_03','CLB_BINHDINH',48.0, 10, 4, 4, 12, 1, NULL);
INSERT INTO ThongKeTranDau VALUES ('MT_V2_03','CLB_NAMDINH', 52.0, 12, 5, 6, 9,  2, '23');

-- MT_V2_04: Thanh Hóa vs TP.HCM (1-0) => Rimario Gordon (103) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V2_04','CLB_THANHHOA',53.0, 11, 4, 6, 10, 1, '103');
INSERT INTO ThongKeTranDau VALUES ('MT_V2_04','CLB_TPHCM',   47.0, 9,  3, 4, 12, 2, NULL);

-- MT_V2_05: Quảng Ninh vs SLNA (0-1) => Michael Olaha (83) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V2_05','CLB_QUANGNINH',45.0, 8,  3, 5, 13, 1, NULL);
INSERT INTO ThongKeTranDau VALUES ('MT_V2_05','CLB_SLNA',    55.0, 10, 4, 4, 11, 2, '83');

-- ===================== VÒNG 3 =====================
-- MT_V3_01: Hà Nội vs Nam Định (2-2) => Nguyễn Văn Quyết (49) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V3_01','CLB_HANOI',   57.0, 15, 6, 7, 9,  1, '49');
INSERT INTO ThongKeTranDau VALUES ('MT_V3_01','CLB_NAMDINH', 43.0, 10, 5, 3, 12, 2, NULL);

-- MT_V3_02: SLNA vs Bình Dương (0-2) => Prince Ibara (41) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V3_02','CLB_SLNA',    46.0, 9,  3, 4, 13, 2, NULL);
INSERT INTO ThongKeTranDau VALUES ('MT_V3_02','CLB_BINHDUONG',54.0, 12, 6, 6, 10, 1, '41');

-- MT_V3_03: HAGL vs Quảng Ninh (3-1) => Joao Veras (74) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V3_03','CLB_HAGL',    55.0, 14, 7, 6, 10, 1, '74');
INSERT INTO ThongKeTranDau VALUES ('MT_V3_03','CLB_QUANGNINH',45.0, 9,  3, 5, 12, 2, NULL);

-- MT_V3_04: TP.HCM vs Hải Phòng (1-1) => Hồ Tuấn Tài (120) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V3_04','CLB_TPHCM',   50.0, 11, 4, 5, 11, 1, '120');
INSERT INTO ThongKeTranDau VALUES ('MT_V3_04','CLB_HAIPHONG',50.0, 10, 4, 4, 10, 2, NULL);

-- MT_V3_05: Bình Định vs Thanh Hóa (0-0) => Đỗ Văn Thuận (182) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V3_05','CLB_BINHDINH',49.0, 8,  3, 4, 12, 1, '182');
INSERT INTO ThongKeTranDau VALUES ('MT_V3_05','CLB_THANHHOA',51.0, 9,  3, 5, 11, 2, NULL);

-- ===================== VÒNG 4 =====================
-- MT_V4_01: Hải Phòng vs Hà Nội (3-2) => Lucao do Break (6) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V4_01','CLB_HAIPHONG',48.0, 13, 6, 4, 12, 3, '6');
INSERT INTO ThongKeTranDau VALUES ('MT_V4_01','CLB_HANOI',   52.0, 15, 7, 6, 10, 1, NULL);

-- MT_V4_02: Nam Định vs SLNA (1-0) => Rafaelson (23) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V4_02','CLB_NAMDINH', 51.0, 11, 4, 5, 10, 1, '23');
INSERT INTO ThongKeTranDau VALUES ('MT_V4_02','CLB_SLNA',    49.0, 10, 3, 6, 12, 2, NULL);

-- MT_V4_03: Bình Dương vs HAGL (4-1) => Nguyễn Hải Huy (37) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V4_03','CLB_BINHDUONG',53.0, 16, 8, 7, 9,  1, '37');
INSERT INTO ThongKeTranDau VALUES ('MT_V4_03','CLB_HAGL',    47.0, 9,  3, 3, 13, 2, NULL);

-- MT_V4_04: Quảng Ninh vs TP.HCM (1-2) => Cheick Timité (119) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V4_04','CLB_QUANGNINH',46.0, 10, 4, 5, 11, 2, NULL);
INSERT INTO ThongKeTranDau VALUES ('MT_V4_04','CLB_TPHCM',   54.0, 12, 5, 6, 10, 1, '119');

-- MT_V4_05: Thanh Hóa vs Bình Định (0-1) => Leonardo Artur (186) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V4_05','CLB_THANHHOA',52.0, 12, 5, 7, 12, 2, NULL);
INSERT INTO ThongKeTranDau VALUES ('MT_V4_05','CLB_BINHDINH',48.0, 8,  3, 3, 10, 1, '186');

-- ===================== VÒNG 5 =====================
-- MT_V5_01: Hà Nội vs Bình Dương (1-0) => Phạm Tuấn Hải (52) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V5_01','CLB_HANOI',   55.0, 12, 5, 6, 9,  1, '52');
INSERT INTO ThongKeTranDau VALUES ('MT_V5_01','CLB_BINHDUONG',45.0, 9,  3, 4, 11, 2, NULL);

-- MT_V5_02: SLNA vs Hải Phòng (2-2) => Michael Olaha (83) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V5_02','CLB_SLNA',    51.0, 11, 5, 6, 10, 2, '83');
INSERT INTO ThongKeTranDau VALUES ('MT_V5_02','CLB_HAIPHONG',49.0, 12, 5, 5, 12, 3, NULL);

-- MT_V5_03: Quảng Ninh vs Bình Định (1-1) => Eydison Teofilo (173) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V5_03','CLB_QUANGNINH',47.0, 10, 4, 5, 11, 2, '173');
INSERT INTO ThongKeTranDau VALUES ('MT_V5_03','CLB_BINHDINH',53.0, 11, 4, 6, 9,  1, NULL);

-- MT_V5_04: HAGL vs Thanh Hóa (2-1) => Joao Veras (74) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V5_04','CLB_HAGL',    52.0, 13, 6, 6, 10, 2, '74');
INSERT INTO ThongKeTranDau VALUES ('MT_V5_04','CLB_THANHHOA',48.0, 11, 4, 5, 12, 2, NULL);

-- MT_V5_05: TP.HCM vs Nam Định (0-2) => Rafaelson (23) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V5_05','CLB_TPHCM',   46.0, 9,  3, 4, 12, 2, NULL);
INSERT INTO ThongKeTranDau VALUES ('MT_V5_05','CLB_NAMDINH', 54.0, 12, 5, 6, 10, 1, '23');

-- ===================== VÒNG 6 =====================
-- MT_V6_01: Hải Phòng vs Bình Định (2-0) => Lucao do Break (6) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V6_01','CLB_HAIPHONG',51.0, 12, 6, 5, 11, 2, '6');
INSERT INTO ThongKeTranDau VALUES ('MT_V6_01','CLB_BINHDINH',49.0, 9,  3, 4, 10, 1, NULL);

-- MT_V6_02: Nam Định vs Bình Dương (1-1) => Hendrio Araujo (22) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V6_02','CLB_NAMDINH', 52.0, 11, 4, 6, 10, 2, '22');
INSERT INTO ThongKeTranDau VALUES ('MT_V6_02','CLB_BINHDUONG',48.0, 10, 4, 5, 11, 1, NULL);

-- MT_V6_03: Thanh Hóa vs Quảng Ninh (1-0) => Rimario Gordon (103) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V6_03','CLB_THANHHOA',53.0, 12, 5, 7, 9,  1, '103');
INSERT INTO ThongKeTranDau VALUES ('MT_V6_03','CLB_QUANGNINH',47.0, 9,  3, 3, 12, 2, NULL);

-- MT_V6_04: TP.HCM vs HAGL (0-1) => Trần Minh Vương (68) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V6_04','CLB_TPHCM',   49.0, 10, 3, 4, 11, 2, NULL);
INSERT INTO ThongKeTranDau VALUES ('MT_V6_04','CLB_HAGL',    51.0, 11, 4, 5, 10, 1, '68');

-- MT_V6_05: SLNA vs Hà Nội (1-3) => Nguyễn Văn Quyết (49) là xuất sắc
INSERT INTO ThongKeTranDau VALUES ('MT_V6_05','CLB_SLNA',    44.0, 8,  3, 3, 13, 2, NULL);
INSERT INTO ThongKeTranDau VALUES ('MT_V6_05','CLB_HANOI',   56.0, 14, 7, 6, 10, 1, '49');

-- ==========================================================
-- TỔNG: 60 bản ghi (30 trận × 2 đội)
-- Mỗi trận có 1 cầu thủ xuất sắc nhất (ở 1 trong 2 đội), hàng kia là NULL
-- ==========================================================


-- ==========================================================
-- DOIHINHXUATPHAT - VÒNG 2 MÙAGIẢI 2024-2025
-- ==========================================================

-- MT_V2_01: HAGL vs Hà Nội
-- ĐỘI NHÀ: HAGL FC
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V2_01', '65', 'GK', TRUE, FALSE),   -- Trần Trung Kiên
('MT_V2_01', '66', 'DF', TRUE, FALSE),   -- Jairo Filho
('MT_V2_01', '71', 'DF', TRUE, FALSE),   -- Lê Văn Sơn
('MT_V2_01', '73', 'DF', TRUE, FALSE),   -- Gabriel Ferreira
('MT_V2_01', '75', 'DF', TRUE, FALSE),   -- Phan Du Học
('MT_V2_01', '67', 'MF', TRUE, FALSE),   -- Châu Ngọc Quang
('MT_V2_01', '68', 'MF', TRUE, TRUE),    -- Trần Minh Vương (Đội trưởng)
('MT_V2_01', '69', 'MF', TRUE, FALSE),   -- Dụng Quang Nho
('MT_V2_01', '72', 'MF', TRUE, FALSE),   -- Trần Bảo Toàn
('MT_V2_01', '70', 'FW', TRUE, FALSE),   -- Nguyễn Quốc Việt
('MT_V2_01', '74', 'FW', TRUE, FALSE),   -- Joao Veras
('MT_V2_01', '80', 'GK', FALSE, FALSE),  -- Dương Văn Lợi (GK dự bị)
('MT_V2_01', '76', 'DF', FALSE, FALSE),  -- Nguyễn Thanh Nhân
('MT_V2_01', '77', 'MF', FALSE, FALSE),  -- Võ Đình Lâm
('MT_V2_01', '78', 'MF', FALSE, FALSE),  -- Nguyễn Đức Việt
('MT_V2_01', '79', 'MF', FALSE, FALSE);  -- Trần Thanh Sơn

-- ĐỘI KHÁCH: HÀ NỘI FC
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V2_01', '54', 'GK', TRUE, FALSE),   -- Quan Văn Chuẩn
('MT_V2_01', '51', 'DF', TRUE, FALSE),   -- Đỗ Duy Mạnh
('MT_V2_01', '53', 'DF', TRUE, FALSE),   -- Nguyễn Thành Chung
('MT_V2_01', '55', 'DF', TRUE, FALSE),   -- Phạm Xuân Mạnh
('MT_V2_01', '62', 'DF', TRUE, FALSE),   -- Lê Văn Xuân
('MT_V2_01', '49', 'MF', TRUE, TRUE),    -- Nguyễn Văn Quyết (Đội trưởng)
('MT_V2_01', '50', 'MF', TRUE, FALSE),   -- Đỗ Hùng Dũng
('MT_V2_01', '56', 'MF', TRUE, FALSE),   -- Nguyễn Hai Long
('MT_V2_01', '58', 'MF', TRUE, FALSE),   -- Brandon Wilson
('MT_V2_01', '52', 'FW', TRUE, FALSE),   -- Phạm Tuấn Hải
('MT_V2_01', '57', 'FW', TRUE, FALSE),   -- Tagueu Joel
('MT_V2_01', '63', 'GK', FALSE, FALSE),  -- Nguyễn Văn Hoàng (GK dự bị)
('MT_V2_01', '59', 'MF', FALSE, FALSE),  -- Nguyễn Văn Trường
('MT_V2_01', '60', 'MF', FALSE, FALSE),  -- Vũ Minh Tuấn
('MT_V2_01', '61', 'MF', FALSE, FALSE),  -- Đậu Văn Toàn
('MT_V2_01', '64', 'MF', FALSE, FALSE);  -- Trương Văn Thái Quý

-- MT_V2_02: Bình Dương vs Hải Phòng
-- ĐỘI NHÀ: BÌNH DƯƠNG
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V2_02', '33', 'GK', TRUE, FALSE),   -- Trần Minh Toàn
('MT_V2_02', '34', 'DF', TRUE, TRUE),    -- Quế Ngọc Hải (Đội trưởng)
('MT_V2_02', '36', 'DF', TRUE, FALSE),   -- Hồ Tấn Tái
('MT_V2_02', '40', 'DF', TRUE, FALSE),   -- Janclesio Almeida
('MT_V2_02', '42', 'DF', TRUE, FALSE),   -- Trương Dũ Đạt
('MT_V2_02', '37', 'MF', TRUE, FALSE),   -- Nguyễn Hải Huy
('MT_V2_02', '43', 'MF', TRUE, FALSE),   -- Đoàn Hải Quân
('MT_V2_02', '44', 'MF', TRUE, FALSE),   -- Tống Anh Tỷ
('MT_V2_02', '39', 'MF', TRUE, FALSE),   -- Võ Minh Trọng
('MT_V2_02', '35', 'FW', TRUE, FALSE),   -- Nguyễn Tiến Linh
('MT_V2_02', '41', 'FW', TRUE, FALSE),   -- Prince Ibara
('MT_V2_02', '48', 'GK', FALSE, FALSE),  -- Lại Tuấn Vũ (GK dự bị)
('MT_V2_02', '45', 'DF', FALSE, FALSE),  -- Nguyễn Thành Nhân
('MT_V2_02', '46', 'DF', FALSE, FALSE),  -- Lê Quang Hùng
('MT_V2_02', '47', 'DF', FALSE, FALSE),  -- Trần Đình Khương
('MT_V2_02', '38', 'FW', FALSE, FALSE);  -- Bùi Vĩ Hào

-- ĐỘI KHÁCH: HẢI PHÒNG
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V2_02', '1', 'GK', TRUE, FALSE),    -- Nguyễn Đình Triệu
('MT_V2_02', '4', 'DF', TRUE, FALSE),    -- Đặng Văn Tới
('MT_V2_02', '5', 'DF', TRUE, FALSE),    -- Bicou Bissainthe
('MT_V2_02', '7', 'DF', TRUE, TRUE),     -- Lê Mạnh Dũng (Đội trưởng)
('MT_V2_02', '8', 'DF', TRUE, FALSE),    -- Phạm Trung Hiếu
('MT_V2_02', '2', 'MF', TRUE, FALSE),    -- Joseph Mpande
('MT_V2_02', '3', 'MF', TRUE, FALSE),    -- Triệu Việt Hưng
('MT_V2_02', '10', 'MF', TRUE, FALSE),   -- Martin Lo
('MT_V2_02', '11', 'MF', TRUE, FALSE),   -- Nguyễn Văn Minh
('MT_V2_02', '6', 'FW', TRUE, FALSE),    -- Lucao do Break
('MT_V2_02', '13', 'FW', TRUE, FALSE),   -- Nguyễn Hữu Sơn
('MT_V2_02', '15', 'GK', FALSE, FALSE),  -- Nguyễn Văn Toản (GK dự bị)
('MT_V2_02', '12', 'DF', FALSE, FALSE),  -- Đàm Tiến Dũng
('MT_V2_02', '14', 'DF', FALSE, FALSE),  -- Phạm Hoài Dương
('MT_V2_02', '9', 'MF', FALSE, FALSE),   -- Hồ Minh Dĩ
('MT_V2_02', '16', 'MF', FALSE, FALSE);  -- Lương Hoàng Nam

-- MT_V2_03: Bình Định vs Nam Định
-- ĐỘI NHÀ: BÌNH ĐỊNH
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V2_03', '181', 'GK', TRUE, FALSE),  -- Đặng Văn Lâm
('MT_V2_03', '184', 'DF', TRUE, FALSE),  -- Lê Ngọc Bảo
('MT_V2_03', '185', 'DF', TRUE, FALSE),  -- Marlon Rangel
('MT_V2_03', '189', 'DF', TRUE, FALSE),  -- Phạm Văn Thành
('MT_V2_03', '191', 'DF', TRUE, TRUE),   -- Trần Đình Trọng (Đội trưởng)
('MT_V2_03', '182', 'MF', TRUE, FALSE),  -- Đỗ Văn Thuận
('MT_V2_03', '183', 'MF', TRUE, FALSE),  -- Cao Văn Triền
('MT_V2_03', '188', 'MF', TRUE, FALSE),  -- Nghiêm Thành Chí
('MT_V2_03', '194', 'MF', TRUE, FALSE),  -- Ngô Hồng Phước
('MT_V2_03', '186', 'FW', TRUE, FALSE),  -- Leonardo Artur
('MT_V2_03', '187', 'FW', TRUE, FALSE),  -- Alan Grafite
('MT_V2_03', '190', 'GK', FALSE, FALSE), -- Vũ Tuyên Quang (GK dự bị)
('MT_V2_03', '192', 'DF', FALSE, FALSE), -- Mạc Đức Việt Anh
('MT_V2_03', '196', 'DF', FALSE, FALSE), -- Adriano Schmidt
('MT_V2_03', '195', 'MF', FALSE, FALSE), -- Nguyễn Văn Đức
('MT_V2_03', '193', 'FW', FALSE, FALSE); -- Huỳnh Tiến Đạt

-- ĐỘI KHÁCH: NAM ĐỊNH
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V2_03', '17', 'GK', TRUE, FALSE),   -- Trần Nguyên Mạnh
('MT_V2_03', '18', 'DF', TRUE, FALSE),   -- Nguyễn Phong Hồng Duy
('MT_V2_03', '19', 'DF', TRUE, TRUE),    -- Dương Thanh Hào (Đội trưởng)
('MT_V2_03', '26', 'DF', TRUE, FALSE),   -- Trần Văn Kiên
('MT_V2_03', '28', 'DF', TRUE, FALSE),   -- Lucas Alves
('MT_V2_03', '20', 'MF', TRUE, FALSE),   -- Hồ Khắc Ngọc
('MT_V2_03', '21', 'MF', TRUE, FALSE),   -- Nguyễn Tuấn Anh
('MT_V2_03', '22', 'MF', TRUE, FALSE),   -- Hendrio Araujo
('MT_V2_03', '25', 'MF', TRUE, FALSE),   -- Tô Văn Vũ
('MT_V2_03', '23', 'FW', TRUE, FALSE),   -- Rafaelson Bezerra
('MT_V2_03', '24', 'FW', TRUE, FALSE),   -- Nguyễn Văn Toàn
('MT_V2_03', '32', 'GK', FALSE, FALSE),  -- Trần Liêm Điều (GK dự bị)
('MT_V2_03', '29', 'DF', FALSE, FALSE),  -- Nguyễn Văn Vĩ
('MT_V2_03', '27', 'MF', FALSE, FALSE),  -- Lý Công Hoàng Anh
('MT_V2_03', '31', 'MF', FALSE, FALSE),  -- Trần Văn Công
('MT_V2_03', '30', 'FW', FALSE, FALSE);  -- Hoàng Minh Tuấn

-- MT_V2_04: Thanh Hóa vs TP.HCM
-- ĐỘI NHÀ: THANH HÓA
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V2_04', '97', 'GK', TRUE, FALSE),   -- Nguyễn Thanh Diệp
('MT_V2_04', '98', 'DF', TRUE, FALSE),   -- Gustavo Santos
('MT_V2_04', '99', 'DF', TRUE, TRUE),    -- Trịnh Văn Lợi (Đội trưởng)
('MT_V2_04', '102', 'DF', TRUE, FALSE),  -- Hoàng Thái Bình
('MT_V2_04', '105', 'DF', TRUE, FALSE),  -- Đinh Viết Tú
('MT_V2_04', '100', 'MF', TRUE, FALSE),  -- Nguyễn Thái Sơn
('MT_V2_04', '101', 'MF', TRUE, FALSE),  -- Lâm Ti Phông
('MT_V2_04', '104', 'MF', TRUE, FALSE),  -- A Mít
('MT_V2_04', '107', 'MF', TRUE, FALSE),  -- Luiz Antonio
('MT_V2_04', '103', 'FW', TRUE, FALSE),  -- Rimario Gordon
('MT_V2_04', '108', 'FW', TRUE, FALSE),  -- Võ Nguyên Hoàng
('MT_V2_04', '109', 'GK', FALSE, FALSE), -- Trịnh Xuân Hoàng (GK dự bị)
('MT_V2_04', '111', 'DF', FALSE, FALSE), -- Đoàn Ngọc Hà
('MT_V2_04', '106', 'MF', FALSE, FALSE), -- Lê Quốc Phương
('MT_V2_04', '110', 'MF', FALSE, FALSE), -- Doãn Ngọc Tân
('MT_V2_04', '112', 'FW', FALSE, FALSE); -- Lê Thanh Bình

-- ĐỘI KHÁCH: TP.HCM
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V2_04', '113', 'GK', TRUE, FALSE),  -- Patrik Lê Giang
('MT_V2_04', '114', 'DF', TRUE, FALSE),  -- Ngô Tùng Quốc
('MT_V2_04', '115', 'DF', TRUE, FALSE),  -- Brendon Lucas
('MT_V2_04', '116', 'DF', TRUE, TRUE),   -- Sầm Ngọc Đức (Đội trưởng)
('MT_V2_04', '121', 'DF', TRUE, FALSE),  -- Nguyễn Minh Tùng
('MT_V2_04', '117', 'MF', TRUE, FALSE),  -- Võ Huy Toàn
('MT_V2_04', '118', 'MF', TRUE, FALSE),  -- Nguyễn Hạ Long
('MT_V2_04', '122', 'MF', TRUE, FALSE),  -- Chu Văn Kiên
('MT_V2_04', '128', 'MF', TRUE, FALSE),  -- Uông Ngọc Tiến
('MT_V2_04', '119', 'FW', TRUE, FALSE),  -- Cheick Timité
('MT_V2_04', '120', 'FW', TRUE, FALSE),  -- Hồ Tuấn Tài
('MT_V2_04', '123', 'GK', FALSE, FALSE), -- Phạm Hữu Nghĩa (GK dự bị)
('MT_V2_04', '125', 'DF', FALSE, FALSE), -- Lê Cao Hoài An
('MT_V2_04', '126', 'DF', FALSE, FALSE), -- Nguyễn Thanh Thảo
('MT_V2_04', '127', 'FW', FALSE, FALSE); -- Hoàng Vũ Samson

-- MT_V2_05: Quảng Ninh vs SLNA
-- ĐỘI NHÀ: QUẢNG NINH
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V2_05', '165', 'GK', TRUE, FALSE),  -- Huỳnh Tuấn Linh
('MT_V2_05', '168', 'DF', TRUE, FALSE),  -- Dương Văn Khoa
('MT_V2_05', '169', 'DF', TRUE, FALSE),  -- Đào Duy Khánh
('MT_V2_05', '170', 'DF', TRUE, FALSE),  -- Nguyễn Xuân Hùng
('MT_V2_05', '175', 'DF', TRUE, FALSE),  -- Trịnh Hoa Hùng
('MT_V2_05', '166', 'MF', TRUE, TRUE),   -- Mạc Hồng Quân (Đội trưởng)
('MT_V2_05', '167', 'MF', TRUE, FALSE),  -- Nghiêm Xuân Tú
('MT_V2_05', '171', 'MF', TRUE, FALSE),  -- Phạm Nguyên Sa
('MT_V2_05', '172', 'MF', TRUE, FALSE),  -- Kizito Trung Hiếu
('MT_V2_05', '173', 'FW', TRUE, FALSE),  -- Eydison Teofilo
('MT_V2_05', '174', 'FW', TRUE, FALSE),  -- Nguyễn Văn Khoa
('MT_V2_05', '180', 'GK', FALSE, FALSE), -- Phan Minh Thành (GK dự bị)
('MT_V2_05', '176', 'DF', FALSE, FALSE), -- Nguyễn Tiến Duy
('MT_V2_05', '177', 'MF', FALSE, FALSE), -- Vũ Hồng Quân
('MT_V2_05', '178', 'MF', FALSE, FALSE), -- Bùi Văn Hiếu
('MT_V2_05', '179', 'MF', FALSE, FALSE); -- Giang Trần Quách Tân

-- ĐỘI KHÁCH: SLNA
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V2_05', '81', 'GK', TRUE, FALSE),   -- Nguyễn Văn Việt
('MT_V2_05', '82', 'DF', TRUE, TRUE),    -- Trần Đình Hoàng (Đội trưởng)
('MT_V2_05', '84', 'DF', TRUE, FALSE),   -- Mario Zebic
('MT_V2_05', '88', 'DF', TRUE, FALSE),   -- Lê Văn Thành
('MT_V2_05', '89', 'DF', TRUE, FALSE),   -- Vương Văn Huy
('MT_V2_05', '85', 'MF', TRUE, FALSE),   -- Phan Bá Quyền
('MT_V2_05', '86', 'MF', TRUE, FALSE),   -- Đinh Xuân Tiến
('MT_V2_05', '87', 'MF', TRUE, FALSE),   -- Trần Mạnh Quỳnh
('MT_V2_05', '90', 'MF', TRUE, FALSE),   -- Trần Nam Hải
('MT_V2_05', '83', 'FW', TRUE, FALSE),   -- Michael Olaha
('MT_V2_05', '91', 'FW', TRUE, FALSE),   -- Ngô Văn Lương
('MT_V2_05', '96', 'GK', FALSE, FALSE),  -- Cao Văn Bình (GK dự bị)
('MT_V2_05', '94', 'DF', FALSE, FALSE),  -- Hồ Văn Cường
('MT_V2_05', '95', 'DF', FALSE, FALSE),  -- Lê Nguyên Hoàng
('MT_V2_05', '92', 'MF', FALSE, FALSE),  -- Nguyễn Quang Vinh
('MT_V2_05', '93', 'FW', FALSE, FALSE);  -- Benjamin Kuku

-- ==========================================================
-- DOIHINHXUATPHAT - VÒNG 3 MÙAGIẢI 2024-2025
-- ==========================================================

-- MT_V3_01: Quảng Ninh vs Hà Nội
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V3_01', '165', 'GK', TRUE, FALSE),  -- Huỳnh Tuấn Linh
('MT_V3_01', '168', 'DF', TRUE, FALSE),  -- Dương Văn Khoa
('MT_V3_01', '169', 'DF', TRUE, FALSE),  -- Đào Duy Khánh
('MT_V3_01', '170', 'DF', TRUE, FALSE),  -- Nguyễn Xuân Hùng
('MT_V3_01', '175', 'DF', TRUE, FALSE),  -- Trịnh Hoa Hùng
('MT_V3_01', '166', 'MF', TRUE, TRUE),   -- Mạc Hồng Quân
('MT_V3_01', '167', 'MF', TRUE, FALSE),  -- Nghiêm Xuân Tú
('MT_V3_01', '171', 'MF', TRUE, FALSE),  -- Phạm Nguyên Sa
('MT_V3_01', '172', 'MF', TRUE, FALSE),  -- Kizito Trung Hiếu
('MT_V3_01', '173', 'FW', TRUE, FALSE),  -- Eydison Teofilo
('MT_V3_01', '174', 'FW', TRUE, FALSE),  -- Nguyễn Văn Khoa
('MT_V3_01', '180', 'GK', FALSE, FALSE), -- Phan Minh Thành
('MT_V3_01', '176', 'DF', FALSE, FALSE), -- Nguyễn Tiến Duy
('MT_V3_01', '177', 'MF', FALSE, FALSE), -- Vũ Hồng Quân
('MT_V3_01', '178', 'MF', FALSE, FALSE), -- Bùi Văn Hiếu
('MT_V3_01', '179', 'MF', FALSE, FALSE),
('MT_V3_01', '54', 'GK', TRUE, FALSE),   -- Quan Văn Chuẩn
('MT_V3_01', '51', 'DF', TRUE, FALSE),   -- Đỗ Duy Mạnh
('MT_V3_01', '53', 'DF', TRUE, FALSE),   -- Nguyễn Thành Chung
('MT_V3_01', '55', 'DF', TRUE, FALSE),   -- Phạm Xuân Mạnh
('MT_V3_01', '62', 'DF', TRUE, FALSE),   -- Lê Văn Xuân
('MT_V3_01', '49', 'MF', TRUE, TRUE),    -- Nguyễn Văn Quyết
('MT_V3_01', '50', 'MF', TRUE, FALSE),   -- Đỗ Hùng Dũng
('MT_V3_01', '56', 'MF', TRUE, FALSE),   -- Nguyễn Hai Long
('MT_V3_01', '58', 'MF', TRUE, FALSE),   -- Brandon Wilson
('MT_V3_01', '52', 'FW', TRUE, FALSE),   -- Phạm Tuấn Hải
('MT_V3_01', '57', 'FW', TRUE, FALSE),   -- Tagueu Joel
('MT_V3_01', '63', 'GK', FALSE, FALSE),  -- Nguyễn Văn Hoàng
('MT_V3_01', '59', 'MF', FALSE, FALSE),  -- Nguyễn Văn Trường
('MT_V3_01', '60', 'MF', FALSE, FALSE),
('MT_V3_01', '61', 'MF', FALSE, FALSE),
('MT_V3_01', '64', 'MF', FALSE, FALSE);

-- MT_V3_02: Hải Phòng vs Thanh Hóa
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V3_02', '1', 'GK', TRUE, FALSE),    -- Nguyễn Đình Triệu
('MT_V3_02', '4', 'DF', TRUE, FALSE),    -- Đặng Văn Tới
('MT_V3_02', '5', 'DF', TRUE, FALSE),    -- Bicou Bissainthe
('MT_V3_02', '7', 'DF', TRUE, TRUE),     -- Lê Mạnh Dũng
('MT_V3_02', '8', 'DF', TRUE, FALSE),    -- Phạm Trung Hiếu
('MT_V3_02', '2', 'MF', TRUE, FALSE),    -- Joseph Mpande
('MT_V3_02', '3', 'MF', TRUE, FALSE),    -- Triệu Việt Hưng
('MT_V3_02', '10', 'MF', TRUE, FALSE),   -- Martin Lo
('MT_V3_02', '11', 'MF', TRUE, FALSE),   -- Nguyễn Văn Minh
('MT_V3_02', '6', 'FW', TRUE, FALSE),    -- Lucao do Break
('MT_V3_02', '13', 'FW', TRUE, FALSE),   -- Nguyễn Hữu Sơn
('MT_V3_02', '15', 'GK', FALSE, FALSE),
('MT_V3_02', '12', 'DF', FALSE, FALSE),
('MT_V3_02', '14', 'DF', FALSE, FALSE),
('MT_V3_02', '9', 'MF', FALSE, FALSE),
('MT_V3_02', '16', 'MF', FALSE, FALSE),
('MT_V3_02', '97', 'GK', TRUE, FALSE),   -- Nguyễn Thanh Diệp
('MT_V3_02', '98', 'DF', TRUE, FALSE),   -- Gustavo Santos
('MT_V3_02', '99', 'DF', TRUE, TRUE),    -- Trịnh Văn Lợi
('MT_V3_02', '102', 'DF', TRUE, FALSE),  -- Hoàng Thái Bình
('MT_V3_02', '105', 'DF', TRUE, FALSE),  -- Đinh Viết Tú
('MT_V3_02', '100', 'MF', TRUE, FALSE),  -- Nguyễn Thái Sơn
('MT_V3_02', '101', 'MF', TRUE, FALSE),  -- Lâm Ti Phông
('MT_V3_02', '104', 'MF', TRUE, FALSE),  -- A Mít
('MT_V3_02', '107', 'MF', TRUE, FALSE),  -- Luiz Antonio
('MT_V3_02', '103', 'FW', TRUE, FALSE),  -- Rimario Gordon
('MT_V3_02', '108', 'FW', TRUE, FALSE),  -- Võ Nguyên Hoàng
('MT_V3_02', '109', 'GK', FALSE, FALSE),
('MT_V3_02', '111', 'DF', FALSE, FALSE),
('MT_V3_02', '106', 'MF', FALSE, FALSE),
('MT_V3_02', '110', 'MF', FALSE, FALSE);

-- MT_V3_03: TP.HCM vs Bình Định
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V3_03', '113', 'GK', TRUE, FALSE),  -- Patrik Lê Giang
('MT_V3_03', '114', 'DF', TRUE, FALSE),  -- Ngô Tùng Quốc
('MT_V3_03', '115', 'DF', TRUE, FALSE),  -- Brendon Lucas
('MT_V3_03', '116', 'DF', TRUE, TRUE),   -- Sầm Ngọc Đức
('MT_V3_03', '121', 'DF', TRUE, FALSE),  -- Nguyễn Minh Tùng
('MT_V3_03', '117', 'MF', TRUE, FALSE),  -- Võ Huy Toàn
('MT_V3_03', '118', 'MF', TRUE, FALSE),  -- Nguyễn Hạ Long
('MT_V3_03', '122', 'MF', TRUE, FALSE),  -- Chu Văn Kiên
('MT_V3_03', '128', 'MF', TRUE, FALSE),  -- Uông Ngọc Tiến
('MT_V3_03', '119', 'FW', TRUE, FALSE),  -- Cheick Timité
('MT_V3_03', '120', 'FW', TRUE, FALSE),  -- Hồ Tuấn Tài
('MT_V3_03', '123', 'GK', FALSE, FALSE),
('MT_V3_03', '125', 'DF', FALSE, FALSE),
('MT_V3_03', '126', 'DF', FALSE, FALSE),
('MT_V3_03', '127', 'FW', FALSE, FALSE),
('MT_V3_03', '181', 'GK', TRUE, FALSE),  -- Đặng Văn Lâm
('MT_V3_03', '184', 'DF', TRUE, FALSE),  -- Lê Ngọc Bảo
('MT_V3_03', '185', 'DF', TRUE, FALSE),  -- Marlon Rangel
('MT_V3_03', '189', 'DF', TRUE, FALSE),  -- Phạm Văn Thành
('MT_V3_03', '191', 'DF', TRUE, TRUE),   -- Trần Đình Trọng
('MT_V3_03', '182', 'MF', TRUE, FALSE),  -- Đỗ Văn Thuận
('MT_V3_03', '183', 'MF', TRUE, FALSE),  -- Cao Văn Triền
('MT_V3_03', '188', 'MF', TRUE, FALSE),  -- Nghiêm Thành Chí
('MT_V3_03', '194', 'MF', TRUE, FALSE),  -- Ngô Hồng Phước
('MT_V3_03', '186', 'FW', TRUE, FALSE),  -- Leonardo Artur
('MT_V3_03', '187', 'FW', TRUE, FALSE),  -- Alan Grafite
('MT_V3_03', '190', 'GK', FALSE, FALSE),
('MT_V3_03', '192', 'DF', FALSE, FALSE),
('MT_V3_03', '196', 'DF', FALSE, FALSE),
('MT_V3_03', '195', 'MF', FALSE, FALSE);

-- MT_V3_04: Nam Định vs HAGL
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V3_04', '17', 'GK', TRUE, FALSE),   -- Trần Nguyên Mạnh
('MT_V3_04', '18', 'DF', TRUE, FALSE),   -- Nguyễn Phong Hồng Duy
('MT_V3_04', '19', 'DF', TRUE, TRUE),    -- Dương Thanh Hào
('MT_V3_04', '26', 'DF', TRUE, FALSE),   -- Trần Văn Kiên
('MT_V3_04', '28', 'DF', TRUE, FALSE),   -- Lucas Alves
('MT_V3_04', '20', 'MF', TRUE, FALSE),   -- Hồ Khắc Ngọc
('MT_V3_04', '21', 'MF', TRUE, FALSE),   -- Nguyễn Tuấn Anh
('MT_V3_04', '22', 'MF', TRUE, FALSE),   -- Hendrio Araujo
('MT_V3_04', '25', 'MF', TRUE, FALSE),   -- Tô Văn Vũ
('MT_V3_04', '23', 'FW', TRUE, FALSE),   -- Rafaelson Bezerra
('MT_V3_04', '24', 'FW', TRUE, FALSE),   -- Nguyễn Văn Toàn
('MT_V3_04', '32', 'GK', FALSE, FALSE),
('MT_V3_04', '29', 'DF', FALSE, FALSE),
('MT_V3_04', '27', 'MF', FALSE, FALSE),
('MT_V3_04', '31', 'MF', FALSE, FALSE),
('MT_V3_04', '30', 'FW', FALSE, FALSE),
('MT_V3_04', '65', 'GK', TRUE, FALSE),   -- Trần Trung Kiên
('MT_V3_04', '66', 'DF', TRUE, FALSE),   -- Jairo Filho
('MT_V3_04', '71', 'DF', TRUE, FALSE),   -- Lê Văn Sơn
('MT_V3_04', '73', 'DF', TRUE, FALSE),   -- Gabriel Ferreira
('MT_V3_04', '75', 'DF', TRUE, FALSE),   -- Phan Du Học
('MT_V3_04', '67', 'MF', TRUE, FALSE),   -- Châu Ngọc Quang
('MT_V3_04', '68', 'MF', TRUE, TRUE),    -- Trần Minh Vương
('MT_V3_04', '69', 'MF', TRUE, FALSE),   -- Dụng Quang Nho
('MT_V3_04', '72', 'MF', TRUE, FALSE),   -- Trần Bảo Toàn
('MT_V3_04', '70', 'FW', TRUE, FALSE),   -- Nguyễn Quốc Việt
('MT_V3_04', '74', 'FW', TRUE, FALSE),   -- Joao Veras
('MT_V3_04', '80', 'GK', FALSE, FALSE),
('MT_V3_04', '76', 'DF', FALSE, FALSE),
('MT_V3_04', '77', 'MF', FALSE, FALSE),
('MT_V3_04', '78', 'MF', FALSE, FALSE);

-- MT_V3_05: Bình Dương vs SLNA
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V3_05', '33', 'GK', TRUE, FALSE),   -- Trần Minh Toàn
('MT_V3_05', '34', 'DF', TRUE, TRUE),    -- Quế Ngọc Hải
('MT_V3_05', '36', 'DF', TRUE, FALSE),   -- Hồ Tấn Tái
('MT_V3_05', '40', 'DF', TRUE, FALSE),   -- Janclesio Almeida
('MT_V3_05', '42', 'DF', TRUE, FALSE),   -- Trương Dũ Đạt
('MT_V3_05', '37', 'MF', TRUE, FALSE),   -- Nguyễn Hải Huy
('MT_V3_05', '43', 'MF', TRUE, FALSE),   -- Đoàn Hải Quân
('MT_V3_05', '44', 'MF', TRUE, FALSE),   -- Tống Anh Tỷ
('MT_V3_05', '39', 'MF', TRUE, FALSE),   -- Võ Minh Trọng
('MT_V3_05', '35', 'FW', TRUE, FALSE),   -- Nguyễn Tiến Linh
('MT_V3_05', '41', 'FW', TRUE, FALSE),   -- Prince Ibara
('MT_V3_05', '48', 'GK', FALSE, FALSE),
('MT_V3_05', '45', 'DF', FALSE, FALSE),
('MT_V3_05', '46', 'DF', FALSE, FALSE),
('MT_V3_05', '47', 'DF', FALSE, FALSE),
('MT_V3_05', '38', 'FW', FALSE, FALSE),
('MT_V3_05', '81', 'GK', TRUE, FALSE),   -- Nguyễn Văn Việt
('MT_V3_05', '82', 'DF', TRUE, TRUE),    -- Trần Đình Hoàng
('MT_V3_05', '84', 'DF', TRUE, FALSE),   -- Mario Zebic
('MT_V3_05', '88', 'DF', TRUE, FALSE),   -- Lê Văn Thành
('MT_V3_05', '89', 'DF', TRUE, FALSE),   -- Vương Văn Huy
('MT_V3_05', '85', 'MF', TRUE, FALSE),   -- Phan Bá Quyền
('MT_V3_05', '86', 'MF', TRUE, FALSE),   -- Đinh Xuân Tiến
('MT_V3_05', '87', 'MF', TRUE, FALSE),   -- Trần Mạnh Quỳnh
('MT_V3_05', '90', 'MF', TRUE, FALSE),   -- Trần Nam Hải
('MT_V3_05', '83', 'FW', TRUE, FALSE),   -- Michael Olaha
('MT_V3_05', '91', 'FW', TRUE, FALSE),   -- Ngô Văn Lương
('MT_V3_05', '96', 'GK', FALSE, FALSE),
('MT_V3_05', '94', 'DF', FALSE, FALSE),
('MT_V3_05', '95', 'DF', FALSE, FALSE),
('MT_V3_05', '92', 'MF', FALSE, FALSE);

-- ==========================================================
-- DOIHINHXUATPHAT - VÒNG 4 & 5 & 6 MÙAGIẢI 2024-2025
-- ==========================================================

-- MT_V4_01: Thanh Hóa vs Hà Nội
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V4_01', '97', 'GK', TRUE, FALSE),   ('MT_V4_01', '98', 'DF', TRUE, FALSE),   ('MT_V4_01', '99', 'DF', TRUE, TRUE),    ('MT_V4_01', '102', 'DF', TRUE, FALSE),  ('MT_V4_01', '105', 'DF', TRUE, FALSE),
('MT_V4_01', '100', 'MF', TRUE, FALSE),  ('MT_V4_01', '101', 'MF', TRUE, FALSE),  ('MT_V4_01', '104', 'MF', TRUE, FALSE),  ('MT_V4_01', '107', 'MF', TRUE, FALSE),  ('MT_V4_01', '103', 'FW', TRUE, FALSE),
('MT_V4_01', '108', 'FW', TRUE, FALSE),  ('MT_V4_01', '109', 'GK', FALSE, FALSE), ('MT_V4_01', '111', 'DF', FALSE, FALSE), ('MT_V4_01', '106', 'MF', FALSE, FALSE), ('MT_V4_01', '110', 'MF', FALSE, FALSE),
('MT_V4_01', '54', 'GK', TRUE, FALSE),   ('MT_V4_01', '51', 'DF', TRUE, FALSE),   ('MT_V4_01', '53', 'DF', TRUE, FALSE),   ('MT_V4_01', '55', 'DF', TRUE, FALSE),   ('MT_V4_01', '62', 'DF', TRUE, FALSE),
('MT_V4_01', '49', 'MF', TRUE, TRUE),    ('MT_V4_01', '50', 'MF', TRUE, FALSE),   ('MT_V4_01', '56', 'MF', TRUE, FALSE),   ('MT_V4_01', '58', 'MF', TRUE, FALSE),   ('MT_V4_01', '52', 'FW', TRUE, FALSE),
('MT_V4_01', '57', 'FW', TRUE, FALSE),   ('MT_V4_01', '63', 'GK', FALSE, FALSE),  ('MT_V4_01', '59', 'MF', FALSE, FALSE),  ('MT_V4_01', '60', 'MF', FALSE, FALSE),  ('MT_V4_01', '61', 'MF', FALSE, FALSE);

-- MT_V4_02: SLNA vs Nam Định
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V4_02', '81', 'GK', TRUE, FALSE),   ('MT_V4_02', '82', 'DF', TRUE, TRUE),    ('MT_V4_02', '84', 'DF', TRUE, FALSE),   ('MT_V4_02', '88', 'DF', TRUE, FALSE),   ('MT_V4_02', '89', 'DF', TRUE, FALSE),
('MT_V4_02', '85', 'MF', TRUE, FALSE),   ('MT_V4_02', '86', 'MF', TRUE, FALSE),   ('MT_V4_02', '87', 'MF', TRUE, FALSE),   ('MT_V4_02', '90', 'MF', TRUE, FALSE),   ('MT_V4_02', '83', 'FW', TRUE, FALSE),
('MT_V4_02', '91', 'FW', TRUE, FALSE),   ('MT_V4_02', '96', 'GK', FALSE, FALSE),  ('MT_V4_02', '94', 'DF', FALSE, FALSE),  ('MT_V4_02', '95', 'DF', FALSE, FALSE),  ('MT_V4_02', '92', 'MF', FALSE, FALSE),
('MT_V4_02', '17', 'GK', TRUE, FALSE),   ('MT_V4_02', '18', 'DF', TRUE, FALSE),   ('MT_V4_02', '19', 'DF', TRUE, TRUE),    ('MT_V4_02', '26', 'DF', TRUE, FALSE),   ('MT_V4_02', '28', 'DF', TRUE, FALSE),
('MT_V4_02', '20', 'MF', TRUE, FALSE),   ('MT_V4_02', '21', 'MF', TRUE, FALSE),   ('MT_V4_02', '22', 'MF', TRUE, FALSE),   ('MT_V4_02', '25', 'MF', TRUE, FALSE),   ('MT_V4_02', '23', 'FW', TRUE, FALSE),
('MT_V4_02', '24', 'FW', TRUE, FALSE),   ('MT_V4_02', '32', 'GK', FALSE, FALSE),  ('MT_V4_02', '29', 'DF', FALSE, FALSE),  ('MT_V4_02', '27', 'MF', FALSE, FALSE),  ('MT_V4_02', '31', 'MF', FALSE, FALSE);

-- MT_V4_03: Bình Dương vs Quảng Ninh
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V4_03', '33', 'GK', TRUE, FALSE),   ('MT_V4_03', '34', 'DF', TRUE, TRUE),    ('MT_V4_03', '36', 'DF', TRUE, FALSE),   ('MT_V4_03', '40', 'DF', TRUE, FALSE),   ('MT_V4_03', '42', 'DF', TRUE, FALSE),
('MT_V4_03', '37', 'MF', TRUE, FALSE),   ('MT_V4_03', '43', 'MF', TRUE, FALSE),   ('MT_V4_03', '44', 'MF', TRUE, FALSE),   ('MT_V4_03', '39', 'MF', TRUE, FALSE),   ('MT_V4_03', '35', 'FW', TRUE, FALSE),
('MT_V4_03', '41', 'FW', TRUE, FALSE),   ('MT_V4_03', '48', 'GK', FALSE, FALSE),  ('MT_V4_03', '45', 'DF', FALSE, FALSE),  ('MT_V4_03', '46', 'DF', FALSE, FALSE),  ('MT_V4_03', '47', 'DF', FALSE, FALSE),
('MT_V4_03', '165', 'GK', TRUE, FALSE),  ('MT_V4_03', '168', 'DF', TRUE, FALSE),  ('MT_V4_03', '169', 'DF', TRUE, FALSE),  ('MT_V4_03', '170', 'DF', TRUE, FALSE),  ('MT_V4_03', '175', 'DF', TRUE, FALSE),
('MT_V4_03', '166', 'MF', TRUE, TRUE),   ('MT_V4_03', '167', 'MF', TRUE, FALSE),  ('MT_V4_03', '171', 'MF', TRUE, FALSE),  ('MT_V4_03', '172', 'MF', TRUE, FALSE),  ('MT_V4_03', '173', 'FW', TRUE, FALSE),
('MT_V4_03', '174', 'FW', TRUE, FALSE),  ('MT_V4_03', '180', 'GK', FALSE, FALSE), ('MT_V4_03', '176', 'DF', FALSE, FALSE), ('MT_V4_03', '177', 'MF', FALSE, FALSE), ('MT_V4_03', '178', 'MF', FALSE, FALSE);

-- MT_V4_04: Bình Định vs Hải Phòng
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V4_04', '181', 'GK', TRUE, FALSE),  ('MT_V4_04', '184', 'DF', TRUE, FALSE),  ('MT_V4_04', '185', 'DF', TRUE, FALSE),  ('MT_V4_04', '189', 'DF', TRUE, FALSE),  ('MT_V4_04', '191', 'DF', TRUE, TRUE),
('MT_V4_04', '182', 'MF', TRUE, FALSE),  ('MT_V4_04', '183', 'MF', TRUE, FALSE),  ('MT_V4_04', '188', 'MF', TRUE, FALSE),  ('MT_V4_04', '194', 'MF', TRUE, FALSE),  ('MT_V4_04', '186', 'FW', TRUE, FALSE),
('MT_V4_04', '187', 'FW', TRUE, FALSE),  ('MT_V4_04', '190', 'GK', FALSE, FALSE), ('MT_V4_04', '192', 'DF', FALSE, FALSE), ('MT_V4_04', '196', 'DF', FALSE, FALSE), ('MT_V4_04', '195', 'MF', FALSE, FALSE),
('MT_V4_04', '1', 'GK', TRUE, FALSE),    ('MT_V4_04', '4', 'DF', TRUE, FALSE),    ('MT_V4_04', '5', 'DF', TRUE, FALSE),    ('MT_V4_04', '7', 'DF', TRUE, TRUE),     ('MT_V4_04', '8', 'DF', TRUE, FALSE),
('MT_V4_04', '2', 'MF', TRUE, FALSE),    ('MT_V4_04', '3', 'MF', TRUE, FALSE),    ('MT_V4_04', '10', 'MF', TRUE, FALSE),   ('MT_V4_04', '11', 'MF', TRUE, FALSE),   ('MT_V4_04', '6', 'FW', TRUE, FALSE),
('MT_V4_04', '13', 'FW', TRUE, FALSE),   ('MT_V4_04', '15', 'GK', FALSE, FALSE),  ('MT_V4_04', '12', 'DF', FALSE, FALSE),  ('MT_V4_04', '14', 'DF', FALSE, FALSE),  ('MT_V4_04', '9', 'MF', FALSE, FALSE);

-- MT_V4_05: TP.HCM vs HAGL
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V4_05', '113', 'GK', TRUE, FALSE),  ('MT_V4_05', '114', 'DF', TRUE, FALSE),  ('MT_V4_05', '115', 'DF', TRUE, FALSE),  ('MT_V4_05', '116', 'DF', TRUE, TRUE),   ('MT_V4_05', '121', 'DF', TRUE, FALSE),
('MT_V4_05', '117', 'MF', TRUE, FALSE),  ('MT_V4_05', '118', 'MF', TRUE, FALSE),  ('MT_V4_05', '122', 'MF', TRUE, FALSE),  ('MT_V4_05', '128', 'MF', TRUE, FALSE),  ('MT_V4_05', '119', 'FW', TRUE, FALSE),
('MT_V4_05', '120', 'FW', TRUE, FALSE),  ('MT_V4_05', '123', 'GK', FALSE, FALSE), ('MT_V4_05', '125', 'DF', FALSE, FALSE), ('MT_V4_05', '126', 'DF', FALSE, FALSE), ('MT_V4_05', '127', 'FW', FALSE, FALSE),
('MT_V4_05', '65', 'GK', TRUE, FALSE),   ('MT_V4_05', '66', 'DF', TRUE, FALSE),   ('MT_V4_05', '71', 'DF', TRUE, FALSE),   ('MT_V4_05', '73', 'DF', TRUE, FALSE),   ('MT_V4_05', '75', 'DF', TRUE, FALSE),
('MT_V4_05', '67', 'MF', TRUE, FALSE),   ('MT_V4_05', '68', 'MF', TRUE, TRUE),    ('MT_V4_05', '69', 'MF', TRUE, FALSE),   ('MT_V4_05', '72', 'MF', TRUE, FALSE),   ('MT_V4_05', '70', 'FW', TRUE, FALSE),
('MT_V4_05', '74', 'FW', TRUE, FALSE),   ('MT_V4_05', '80', 'GK', FALSE, FALSE),  ('MT_V4_05', '76', 'DF', FALSE, FALSE),  ('MT_V4_05', '77', 'MF', FALSE, FALSE),  ('MT_V4_05', '78', 'MF', FALSE, FALSE);

-- ==========================================================
-- VÒNG 5
-- ==========================================================

-- MT_V5_01: Hà Nội vs SLNA
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V5_01', '54', 'GK', TRUE, FALSE),   ('MT_V5_01', '51', 'DF', TRUE, FALSE),   ('MT_V5_01', '53', 'DF', TRUE, FALSE),   ('MT_V5_01', '55', 'DF', TRUE, FALSE),   ('MT_V5_01', '62', 'DF', TRUE, FALSE),
('MT_V5_01', '49', 'MF', TRUE, TRUE),    ('MT_V5_01', '50', 'MF', TRUE, FALSE),   ('MT_V5_01', '56', 'MF', TRUE, FALSE),   ('MT_V5_01', '58', 'MF', TRUE, FALSE),   ('MT_V5_01', '52', 'FW', TRUE, FALSE),
('MT_V5_01', '57', 'FW', TRUE, FALSE),   ('MT_V5_01', '63', 'GK', FALSE, FALSE),  ('MT_V5_01', '59', 'MF', FALSE, FALSE),  ('MT_V5_01', '60', 'MF', FALSE, FALSE),  ('MT_V5_01', '61', 'MF', FALSE, FALSE),
('MT_V5_01', '81', 'GK', TRUE, FALSE),   ('MT_V5_01', '82', 'DF', TRUE, TRUE),    ('MT_V5_01', '84', 'DF', TRUE, FALSE),   ('MT_V5_01', '88', 'DF', TRUE, FALSE),   ('MT_V5_01', '89', 'DF', TRUE, FALSE),
('MT_V5_01', '85', 'MF', TRUE, FALSE),   ('MT_V5_01', '86', 'MF', TRUE, FALSE),   ('MT_V5_01', '87', 'MF', TRUE, FALSE),   ('MT_V5_01', '90', 'MF', TRUE, FALSE),   ('MT_V5_01', '83', 'FW', TRUE, FALSE),
('MT_V5_01', '91', 'FW', TRUE, FALSE),   ('MT_V5_01', '96', 'GK', FALSE, FALSE),  ('MT_V5_01', '94', 'DF', FALSE, FALSE),  ('MT_V5_01', '95', 'DF', FALSE, FALSE),  ('MT_V5_01', '92', 'MF', FALSE, FALSE);

-- MT_V5_02: Quảng Ninh vs TP.HCM
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V5_02', '165', 'GK', TRUE, FALSE),  ('MT_V5_02', '168', 'DF', TRUE, FALSE),  ('MT_V5_02', '169', 'DF', TRUE, FALSE),  ('MT_V5_02', '170', 'DF', TRUE, FALSE),  ('MT_V5_02', '175', 'DF', TRUE, FALSE),
('MT_V5_02', '166', 'MF', TRUE, TRUE),   ('MT_V5_02', '167', 'MF', TRUE, FALSE),  ('MT_V5_02', '171', 'MF', TRUE, FALSE),  ('MT_V5_02', '172', 'MF', TRUE, FALSE),  ('MT_V5_02', '173', 'FW', TRUE, FALSE),
('MT_V5_02', '174', 'FW', TRUE, FALSE),  ('MT_V5_02', '180', 'GK', FALSE, FALSE), ('MT_V5_02', '176', 'DF', FALSE, FALSE), ('MT_V5_02', '177', 'MF', FALSE, FALSE), ('MT_V5_02', '178', 'MF', FALSE, FALSE),
('MT_V5_02', '113', 'GK', TRUE, FALSE),  ('MT_V5_02', '114', 'DF', TRUE, FALSE),  ('MT_V5_02', '115', 'DF', TRUE, FALSE),  ('MT_V5_02', '116', 'DF', TRUE, TRUE),   ('MT_V5_02', '121', 'DF', TRUE, FALSE),
('MT_V5_02', '117', 'MF', TRUE, FALSE),  ('MT_V5_02', '118', 'MF', TRUE, FALSE),  ('MT_V5_02', '122', 'MF', TRUE, FALSE),  ('MT_V5_02', '128', 'MF', TRUE, FALSE),  ('MT_V5_02', '119', 'FW', TRUE, FALSE),
('MT_V5_02', '120', 'FW', TRUE, FALSE),  ('MT_V5_02', '123', 'GK', FALSE, FALSE), ('MT_V5_02', '125', 'DF', FALSE, FALSE), ('MT_V5_02', '126', 'DF', FALSE, FALSE), ('MT_V5_02', '127', 'FW', FALSE, FALSE);

-- MT_V5_03: Nam Định vs Bình Dương
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V5_03', '17', 'GK', TRUE, FALSE),   ('MT_V5_03', '18', 'DF', TRUE, FALSE),   ('MT_V5_03', '19', 'DF', TRUE, TRUE),    ('MT_V5_03', '26', 'DF', TRUE, FALSE),   ('MT_V5_03', '28', 'DF', TRUE, FALSE),
('MT_V5_03', '20', 'MF', TRUE, FALSE),   ('MT_V5_03', '21', 'MF', TRUE, FALSE),   ('MT_V5_03', '22', 'MF', TRUE, FALSE),   ('MT_V5_03', '25', 'MF', TRUE, FALSE),   ('MT_V5_03', '23', 'FW', TRUE, FALSE),
('MT_V5_03', '24', 'FW', TRUE, FALSE),   ('MT_V5_03', '32', 'GK', FALSE, FALSE),  ('MT_V5_03', '29', 'DF', FALSE, FALSE),  ('MT_V5_03', '27', 'MF', FALSE, FALSE),  ('MT_V5_03', '31', 'MF', FALSE, FALSE),
('MT_V5_03', '33', 'GK', TRUE, FALSE),   ('MT_V5_03', '34', 'DF', TRUE, TRUE),    ('MT_V5_03', '36', 'DF', TRUE, FALSE),   ('MT_V5_03', '40', 'DF', TRUE, FALSE),   ('MT_V5_03', '42', 'DF', TRUE, FALSE),
('MT_V5_03', '37', 'MF', TRUE, FALSE),   ('MT_V5_03', '43', 'MF', TRUE, FALSE),   ('MT_V5_03', '44', 'MF', TRUE, FALSE),   ('MT_V5_03', '39', 'MF', TRUE, FALSE),   ('MT_V5_03', '35', 'FW', TRUE, FALSE),
('MT_V5_03', '41', 'FW', TRUE, FALSE),   ('MT_V5_03', '48', 'GK', FALSE, FALSE),  ('MT_V5_03', '45', 'DF', FALSE, FALSE),  ('MT_V5_03', '46', 'DF', FALSE, FALSE),  ('MT_V5_03', '47', 'DF', FALSE, FALSE);

-- MT_V5_04: HAGL vs Bình Định
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V5_04', '65', 'GK', TRUE, FALSE),   ('MT_V5_04', '66', 'DF', TRUE, FALSE),   ('MT_V5_04', '71', 'DF', TRUE, FALSE),   ('MT_V5_04', '73', 'DF', TRUE, FALSE),   ('MT_V5_04', '75', 'DF', TRUE, FALSE),
('MT_V5_04', '67', 'MF', TRUE, FALSE),   ('MT_V5_04', '68', 'MF', TRUE, TRUE),    ('MT_V5_04', '69', 'MF', TRUE, FALSE),   ('MT_V5_04', '72', 'MF', TRUE, FALSE),   ('MT_V5_04', '70', 'FW', TRUE, FALSE),
('MT_V5_04', '74', 'FW', TRUE, FALSE),   ('MT_V5_04', '80', 'GK', FALSE, FALSE),  ('MT_V5_04', '76', 'DF', FALSE, FALSE),  ('MT_V5_04', '77', 'MF', FALSE, FALSE),  ('MT_V5_04', '78', 'MF', FALSE, FALSE),
('MT_V5_04', '181', 'GK', TRUE, FALSE),  ('MT_V5_04', '184', 'DF', TRUE, FALSE),  ('MT_V5_04', '185', 'DF', TRUE, FALSE),  ('MT_V5_04', '189', 'DF', TRUE, FALSE),  ('MT_V5_04', '191', 'DF', TRUE, TRUE),
('MT_V5_04', '182', 'MF', TRUE, FALSE),  ('MT_V5_04', '183', 'MF', TRUE, FALSE),  ('MT_V5_04', '188', 'MF', TRUE, FALSE),  ('MT_V5_04', '194', 'MF', TRUE, FALSE),  ('MT_V5_04', '186', 'FW', TRUE, FALSE),
('MT_V5_04', '187', 'FW', TRUE, FALSE),  ('MT_V5_04', '190', 'GK', FALSE, FALSE), ('MT_V5_04', '192', 'DF', FALSE, FALSE), ('MT_V5_04', '196', 'DF', FALSE, FALSE), ('MT_V5_04', '195', 'MF', FALSE, FALSE);

-- MT_V5_05: Thanh Hóa vs Hải Phòng
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V5_05', '97', 'GK', TRUE, FALSE),   ('MT_V5_05', '98', 'DF', TRUE, FALSE),   ('MT_V5_05', '99', 'DF', TRUE, TRUE),    ('MT_V5_05', '102', 'DF', TRUE, FALSE),  ('MT_V5_05', '105', 'DF', TRUE, FALSE),
('MT_V5_05', '100', 'MF', TRUE, FALSE),  ('MT_V5_05', '101', 'MF', TRUE, FALSE),  ('MT_V5_05', '104', 'MF', TRUE, FALSE),  ('MT_V5_05', '107', 'MF', TRUE, FALSE),  ('MT_V5_05', '103', 'FW', TRUE, FALSE),
('MT_V5_05', '108', 'FW', TRUE, FALSE),  ('MT_V5_05', '109', 'GK', FALSE, FALSE), ('MT_V5_05', '111', 'DF', FALSE, FALSE), ('MT_V5_05', '106', 'MF', FALSE, FALSE), ('MT_V5_05', '110', 'MF', FALSE, FALSE),
('MT_V5_05', '1', 'GK', TRUE, FALSE),    ('MT_V5_05', '4', 'DF', TRUE, FALSE),    ('MT_V5_05', '5', 'DF', TRUE, FALSE),    ('MT_V5_05', '7', 'DF', TRUE, TRUE),     ('MT_V5_05', '8', 'DF', TRUE, FALSE),
('MT_V5_05', '2', 'MF', TRUE, FALSE),    ('MT_V5_05', '3', 'MF', TRUE, FALSE),    ('MT_V5_05', '10', 'MF', TRUE, FALSE),   ('MT_V5_05', '11', 'MF', TRUE, FALSE),   ('MT_V5_05', '6', 'FW', TRUE, FALSE),
('MT_V5_05', '13', 'FW', TRUE, FALSE),   ('MT_V5_05', '15', 'GK', FALSE, FALSE),  ('MT_V5_05', '12', 'DF', FALSE, FALSE),  ('MT_V5_05', '14', 'DF', FALSE, FALSE),  ('MT_V5_05', '9', 'MF', FALSE, FALSE);

-- ==========================================================
-- VÒNG 6
-- ==========================================================

-- MT_V6_01: Bình Định vs Thanh Hóa
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V6_01', '181', 'GK', TRUE, FALSE),  ('MT_V6_01', '184', 'DF', TRUE, FALSE),  ('MT_V6_01', '185', 'DF', TRUE, FALSE),  ('MT_V6_01', '189', 'DF', TRUE, FALSE),  ('MT_V6_01', '191', 'DF', TRUE, TRUE),
('MT_V6_01', '182', 'MF', TRUE, FALSE),  ('MT_V6_01', '183', 'MF', TRUE, FALSE),  ('MT_V6_01', '188', 'MF', TRUE, FALSE),  ('MT_V6_01', '194', 'MF', TRUE, FALSE),  ('MT_V6_01', '186', 'FW', TRUE, FALSE),
('MT_V6_01', '187', 'FW', TRUE, FALSE),  ('MT_V6_01', '190', 'GK', FALSE, FALSE), ('MT_V6_01', '192', 'DF', FALSE, FALSE), ('MT_V6_01', '196', 'DF', FALSE, FALSE), ('MT_V6_01', '195', 'MF', FALSE, FALSE),
('MT_V6_01', '97', 'GK', TRUE, FALSE),   ('MT_V6_01', '98', 'DF', TRUE, FALSE),   ('MT_V6_01', '99', 'DF', TRUE, TRUE),    ('MT_V6_01', '102', 'DF', TRUE, FALSE),  ('MT_V6_01', '105', 'DF', TRUE, FALSE),
('MT_V6_01', '100', 'MF', TRUE, FALSE),  ('MT_V6_01', '101', 'MF', TRUE, FALSE),  ('MT_V6_01', '104', 'MF', TRUE, FALSE),  ('MT_V6_01', '107', 'MF', TRUE, FALSE),  ('MT_V6_01', '103', 'FW', TRUE, FALSE),
('MT_V6_01', '108', 'FW', TRUE, FALSE),  ('MT_V6_01', '109', 'GK', FALSE, FALSE), ('MT_V6_01', '111', 'DF', FALSE, FALSE), ('MT_V6_01', '106', 'MF', FALSE, FALSE), ('MT_V6_01', '110', 'MF', FALSE, FALSE);

-- MT_V6_02: HAGL vs Quảng Ninh
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V6_02', '65', 'GK', TRUE, FALSE),   ('MT_V6_02', '66', 'DF', TRUE, FALSE),   ('MT_V6_02', '71', 'DF', TRUE, FALSE),   ('MT_V6_02', '73', 'DF', TRUE, FALSE),   ('MT_V6_02', '75', 'DF', TRUE, FALSE),
('MT_V6_02', '67', 'MF', TRUE, FALSE),   ('MT_V6_02', '68', 'MF', TRUE, TRUE),    ('MT_V6_02', '69', 'MF', TRUE, FALSE),   ('MT_V6_02', '72', 'MF', TRUE, FALSE),   ('MT_V6_02', '70', 'FW', TRUE, FALSE),
('MT_V6_02', '74', 'FW', TRUE, FALSE),   ('MT_V6_02', '80', 'GK', FALSE, FALSE),  ('MT_V6_02', '76', 'DF', FALSE, FALSE),  ('MT_V6_02', '77', 'MF', FALSE, FALSE),  ('MT_V6_02', '78', 'MF', FALSE, FALSE),
('MT_V6_02', '165', 'GK', TRUE, FALSE),  ('MT_V6_02', '168', 'DF', TRUE, FALSE),  ('MT_V6_02', '169', 'DF', TRUE, FALSE),  ('MT_V6_02', '170', 'DF', TRUE, FALSE),  ('MT_V6_02', '175', 'DF', TRUE, FALSE),
('MT_V6_02', '166', 'MF', TRUE, TRUE),   ('MT_V6_02', '167', 'MF', TRUE, FALSE),  ('MT_V6_02', '171', 'MF', TRUE, FALSE),  ('MT_V6_02', '172', 'MF', TRUE, FALSE),  ('MT_V6_02', '173', 'FW', TRUE, FALSE),
('MT_V6_02', '174', 'FW', TRUE, FALSE),  ('MT_V6_02', '180', 'GK', FALSE, FALSE), ('MT_V6_02', '176', 'DF', FALSE, FALSE), ('MT_V6_02', '177', 'MF', FALSE, FALSE), ('MT_V6_02', '178', 'MF', FALSE, FALSE);

-- MT_V6_03: Hải Phòng vs Nam Định
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V6_03', '1', 'GK', TRUE, FALSE),    ('MT_V6_03', '4', 'DF', TRUE, FALSE),    ('MT_V6_03', '5', 'DF', TRUE, FALSE),    ('MT_V6_03', '7', 'DF', TRUE, TRUE),     ('MT_V6_03', '8', 'DF', TRUE, FALSE),
('MT_V6_03', '2', 'MF', TRUE, FALSE),    ('MT_V6_03', '3', 'MF', TRUE, FALSE),    ('MT_V6_03', '10', 'MF', TRUE, FALSE),   ('MT_V6_03', '11', 'MF', TRUE, FALSE),   ('MT_V6_03', '6', 'FW', TRUE, FALSE),
('MT_V6_03', '13', 'FW', TRUE, FALSE),   ('MT_V6_03', '15', 'GK', FALSE, FALSE),  ('MT_V6_03', '12', 'DF', FALSE, FALSE),  ('MT_V6_03', '14', 'DF', FALSE, FALSE),  ('MT_V6_03', '9', 'MF', FALSE, FALSE),
('MT_V6_03', '17', 'GK', TRUE, FALSE),   ('MT_V6_03', '18', 'DF', TRUE, FALSE),   ('MT_V6_03', '19', 'DF', TRUE, TRUE),    ('MT_V6_03', '26', 'DF', TRUE, FALSE),   ('MT_V6_03', '28', 'DF', TRUE, FALSE),
('MT_V6_03', '20', 'MF', TRUE, FALSE),   ('MT_V6_03', '21', 'MF', TRUE, FALSE),   ('MT_V6_03', '22', 'MF', TRUE, FALSE),   ('MT_V6_03', '25', 'MF', TRUE, FALSE),   ('MT_V6_03', '23', 'FW', TRUE, FALSE),
('MT_V6_03', '24', 'FW', TRUE, FALSE),   ('MT_V6_03', '32', 'GK', FALSE, FALSE),  ('MT_V6_03', '29', 'DF', FALSE, FALSE),  ('MT_V6_03', '27', 'MF', FALSE, FALSE),  ('MT_V6_03', '31', 'MF', FALSE, FALSE);

-- MT_V6_04: TP.HCM vs HAGL (Fixed - was Bình Định vs HAGL, then HAGL vs Bình Định in return)
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V6_04', '113', 'GK', TRUE, FALSE),  ('MT_V6_04', '114', 'DF', TRUE, FALSE),  ('MT_V6_04', '115', 'DF', TRUE, FALSE),  ('MT_V6_04', '116', 'DF', TRUE, TRUE),   ('MT_V6_04', '121', 'DF', TRUE, FALSE),
('MT_V6_04', '117', 'MF', TRUE, FALSE),  ('MT_V6_04', '118', 'MF', TRUE, FALSE),  ('MT_V6_04', '122', 'MF', TRUE, FALSE),  ('MT_V6_04', '128', 'MF', TRUE, FALSE),  ('MT_V6_04', '119', 'FW', TRUE, FALSE),
('MT_V6_04', '120', 'FW', TRUE, FALSE),  ('MT_V6_04', '123', 'GK', FALSE, FALSE), ('MT_V6_04', '125', 'DF', FALSE, FALSE), ('MT_V6_04', '126', 'DF', FALSE, FALSE), ('MT_V6_04', '127', 'FW', FALSE, FALSE),
('MT_V6_04', '65', 'GK', TRUE, FALSE),   ('MT_V6_04', '66', 'DF', TRUE, FALSE),   ('MT_V6_04', '71', 'DF', TRUE, FALSE),   ('MT_V6_04', '73', 'DF', TRUE, FALSE),   ('MT_V6_04', '75', 'DF', TRUE, FALSE),
('MT_V6_04', '67', 'MF', TRUE, FALSE),   ('MT_V6_04', '68', 'MF', TRUE, TRUE),    ('MT_V6_04', '69', 'MF', TRUE, FALSE),   ('MT_V6_04', '72', 'MF', TRUE, FALSE),   ('MT_V6_04', '70', 'FW', TRUE, FALSE),
('MT_V6_04', '74', 'FW', TRUE, FALSE),   ('MT_V6_04', '80', 'GK', FALSE, FALSE),  ('MT_V6_04', '76', 'DF', FALSE, FALSE),  ('MT_V6_04', '77', 'MF', FALSE, FALSE),  ('MT_V6_04', '78', 'MF', FALSE, FALSE);

-- MT_V6_05: SLNA vs Bình Dương
INSERT INTO DoiHinhXuatPhat VALUES
('MT_V6_05', '81', 'GK', TRUE, FALSE),   ('MT_V6_05', '82', 'DF', TRUE, TRUE),    ('MT_V6_05', '84', 'DF', TRUE, FALSE),   ('MT_V6_05', '88', 'DF', TRUE, FALSE),   ('MT_V6_05', '89', 'DF', TRUE, FALSE),
('MT_V6_05', '85', 'MF', TRUE, FALSE),   ('MT_V6_05', '86', 'MF', TRUE, FALSE),   ('MT_V6_05', '87', 'MF', TRUE, FALSE),   ('MT_V6_05', '90', 'MF', TRUE, FALSE),   ('MT_V6_05', '83', 'FW', TRUE, FALSE),
('MT_V6_05', '91', 'FW', TRUE, FALSE),   ('MT_V6_05', '96', 'GK', FALSE, FALSE),  ('MT_V6_05', '94', 'DF', FALSE, FALSE),  ('MT_V6_05', '95', 'DF', FALSE, FALSE),  ('MT_V6_05', '92', 'MF', FALSE, FALSE),
('MT_V6_05', '33', 'GK', TRUE, FALSE),   ('MT_V6_05', '34', 'DF', TRUE, TRUE),    ('MT_V6_05', '36', 'DF', TRUE, FALSE),   ('MT_V6_05', '40', 'DF', TRUE, FALSE),   ('MT_V6_05', '42', 'DF', TRUE, FALSE),
('MT_V6_05', '37', 'MF', TRUE, FALSE),   ('MT_V6_05', '43', 'MF', TRUE, FALSE),   ('MT_V6_05', '44', 'MF', TRUE, FALSE),   ('MT_V6_05', '39', 'MF', TRUE, FALSE),   ('MT_V6_05', '35', 'FW', TRUE, FALSE),
('MT_V6_05', '41', 'FW', TRUE, FALSE),   ('MT_V6_05', '48', 'GK', FALSE, FALSE),  ('MT_V6_05', '45', 'DF', FALSE, FALSE),  ('MT_V6_05', '46', 'DF', FALSE, FALSE),  ('MT_V6_05', '47', 'DF', FALSE, FALSE);


-- ==========================================================
-- SUKIENTRANDAU - VÒNG 2 MÙAGIẢI 2024-2025 (FIXED)
-- ==========================================================

-- MT_V2_01: HAGL 2-1 Hà Nội
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V2_01_01', 'BanThang', 18, 'Joao Veras sút xa ghi bàn mở tỷ số cho HAGL', 'MT_V2_01', 'CLB_HAGL', '74'),
('SK_V2_01_02', 'BanThang', 35, 'Nguyễn Quốc Việt đánh đầu nâng tỷ số lên 2-0', 'MT_V2_01', 'CLB_HAGL', '70'),
('SK_V2_01_03', 'BanThang', 72, 'Phạm Tuấn Hải ghi bàn rút ngắn tỷ số cho Hà Nội', 'MT_V2_01', 'CLB_HANOI', '52'),
('SK_V2_01_04', 'TheVang', 45, 'Nguyễn Hai Long nhận thẻ vàng vì phạm lỗi', 'MT_V2_01', 'CLB_HANOI', '56'),
('SK_V2_01_05', 'TheVang', 60, 'Nguyễn Thái Sơn nhận thẻ vàng', 'MT_V2_01', 'CLB_THANHHOA', '100');

-- MT_V2_02: Bình Dương 1-0 Hải Phòng
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V2_02_01', 'BanThang', 42, 'Nguyễn Tiến Linh sút ngang ghi bàn duy nhất', 'MT_V2_02', 'CLB_BINHDUONG', '35'),
('SK_V2_02_02', 'TheVang', 55, 'Triệu Việt Hưng nhận thẻ vàng', 'MT_V2_02', 'CLB_HAIPHONG', '3');

-- MT_V2_03: Bình Định 2-2 Nam Định
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V2_03_01', 'BanThang', 15, 'Alan Grafite sút xa mở tỷ số cho Bình Định', 'MT_V2_03', 'CLB_BINHDINH', '187'),
('SK_V2_03_02', 'BanThang', 38, 'Leonardo Artur đánh đầu nâng tỷ số', 'MT_V2_03', 'CLB_BINHDINH', '186'),
('SK_V2_03_03', 'BanThang', 52, 'Rafaelson Bezerra ghi bàn rút ngắn tỷ số', 'MT_V2_03', 'CLB_NAMDINH', '23'),
('SK_V2_03_04', 'BanThang', 68, 'Hendrio Araujo ghi bàn gỡ hòa', 'MT_V2_03', 'CLB_NAMDINH', '22'),
('SK_V2_03_05', 'TheVang', 44, 'Dương Thanh Hào nhận thẻ vàng', 'MT_V2_03', 'CLB_NAMDINH', '19'),
('SK_V2_03_06', 'TheVang', 70, 'Đỗ Văn Thuận nhận thẻ vàng', 'MT_V2_03', 'CLB_BINHDINH', '182');

-- MT_V2_04: Thanh Hóa 1-2 TP.HCM
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V2_04_01', 'BanThang', 28, 'Rimario Gordon mở tỷ số cho Thanh Hóa', 'MT_V2_04', 'CLB_THANHHOA', '103'),
('SK_V2_04_02', 'BanThang', 55, 'Cheick Timité ghi bàn gỡ hòa cho TP.HCM', 'MT_V2_04', 'CLB_TPHCM', '119'),
('SK_V2_04_03', 'BanThang', 82, 'Hồ Tuấn Tài ghi bàn chiến thắng cho TP.HCM', 'MT_V2_04', 'CLB_TPHCM', '120'),
('SK_V2_04_04', 'TheVang', 65, 'A Mít nhận thẻ vàng', 'MT_V2_04', 'CLB_THANHHOA', '104');

-- MT_V2_05: Quảng Ninh 0-0 SLNA
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V2_05_01', 'TheVang', 38, 'Nguyễn Xuân Hùng nhận thẻ vàng', 'MT_V2_05', 'CLB_QUANGNINH', '170'),
('SK_V2_05_02', 'TheVang', 71, 'Trần Mạnh Quỳnh nhận thẻ vàng', 'MT_V2_05', 'CLB_SLNA', '87');

-- ==========================================================
-- SUKIENTRANDAU - VÒNG 3 MÙAGIẢI 2024-2025
-- ==========================================================

-- MT_V3_01: Quảng Ninh 1-1 Hà Nội
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V3_01_01', 'BanThang', 22, 'Eydison Teofilo sút ngang mở tỷ số cho Quảng Ninh', 'MT_V3_01', 'CLB_QUANGNINH', '173'),
('SK_V3_01_02', 'BanThang', 76, 'Tagueu Joel ghi bàn gỡ hòa cho Hà Nội', 'MT_V3_01', 'CLB_HANOI', '57'),
('SK_V3_01_03', 'TheVang', 50, 'Đỗ Duy Mạnh nhận thẻ vàng', 'MT_V3_01', 'CLB_HANOI', '51');

-- MT_V3_02: Hải Phòng 3-1 Thanh Hóa
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V3_02_01', 'BanThang', 12, 'Lucao do Break mở tỷ số cho Hải Phòng', 'MT_V3_02', 'CLB_HAIPHONG', '6'),
('SK_V3_02_02', 'BanThang', 34, 'Nguyễn Hữu Sơn nâng tỷ số lên 2-0', 'MT_V3_02', 'CLB_HAIPHONG', '13'),
('SK_V3_02_03', 'BanThang', 58, 'Martin Lo ghi bàn thứ 3 cho Hải Phòng', 'MT_V3_02', 'CLB_HAIPHONG', '10'),
('SK_V3_02_04', 'BanThang', 88, 'Luiz Antonio ghi bàn vinh dự cho Thanh Hóa', 'MT_V3_02', 'CLB_THANHHOA', '107'),
('SK_V3_02_05', 'TheVang', 45, 'Nguyễn Thanh Diệp nhận thẻ vàng', 'MT_V3_02', 'CLB_THANHHOA', '97');

-- MT_V3_03: TP.HCM 1-0 Bình Định
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V3_03_01', 'BanThang', 41, 'Uông Ngọc Tiến sút xa ghi bàn duy nhất', 'MT_V3_03', 'CLB_TPHCM', '128'),
('SK_V3_03_02', 'TheVang', 62, 'Võ Huy Toàn nhận thẻ vàng', 'MT_V3_03', 'CLB_TPHCM', '117');

-- MT_V3_04: Nam Định 2-0 HAGL
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V3_04_01', 'BanThang', 19, 'Nguyễn Tuấn Anh mở tỷ số cho Nam Định', 'MT_V3_04', 'CLB_NAMDINH', '21'),
('SK_V3_04_02', 'BanThang', 67, 'Tô Văn Vũ ghi bàn thứ hai', 'MT_V3_04', 'CLB_NAMDINH', '25'),
('SK_V3_04_03', 'TheVang', 54, 'Châu Ngọc Quang nhận thẻ vàng', 'MT_V3_04', 'CLB_HAGL', '67');

-- MT_V3_05: Bình Dương 3-1 SLNA
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V3_05_01', 'BanThang', 25, 'Quế Ngọc Hải mở tỷ số cho Bình Dương', 'MT_V3_05', 'CLB_BINHDUONG', '34'),
('SK_V3_05_02', 'BanThang', 44, 'Nguyễn Tiến Linh nâng tỷ số lên 2-0', 'MT_V3_05', 'CLB_BINHDUONG', '35'),
('SK_V3_05_03', 'BanThang', 73, 'Prince Ibara ghi bàn thứ ba', 'MT_V3_05', 'CLB_BINHDUONG', '41'),
('SK_V3_05_04', 'BanThang', 85, 'Phan Bá Quyền ghi bàn vinh dự cho SLNA', 'MT_V3_05', 'CLB_SLNA', '85'),
('SK_V3_05_05', 'TheVang', 51, 'Trần Đình Hoàng nhận thẻ vàng', 'MT_V3_05', 'CLB_SLNA', '82'),
('SK_V3_05_06', 'TheVang', 67, 'Mario Zebic nhận thẻ vàng', 'MT_V3_05', 'CLB_SLNA', '84');

-- ==========================================================
-- SUKIENTRANDAU - VÒNG 4 MÙAGIẢI 2024-2025
-- ==========================================================

-- MT_V4_01: Thanh Hóa 2-1 Hà Nội
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V4_01_01', 'BanThang', 16, 'Rimario Gordon mở tỷ số cho Thanh Hóa', 'MT_V4_01', 'CLB_THANHHOA', '103'),
('SK_V4_01_02', 'BanThang', 37, 'Luiz Antonio nâng tỷ số lên 2-0', 'MT_V4_01', 'CLB_THANHHOA', '107'),
('SK_V4_01_03', 'BanThang', 79, 'Nguyễn Văn Quyết ghi bàn vinh dự cho Hà Nội', 'MT_V4_01', 'CLB_HANOI', '49'),
('SK_V4_01_04', 'TheVang', 62, 'Hoàng Thái Bình nhận thẻ vàng', 'MT_V4_01', 'CLB_THANHHOA', '102');

-- MT_V4_02: SLNA 2-1 Nam Định
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V4_02_01', 'BanThang', 24, 'Michael Olaha mở tỷ số cho SLNA', 'MT_V4_02', 'CLB_SLNA', '83'),
('SK_V4_02_02', 'BanThang', 58, 'Trần Nam Hải nâng tỷ số lên 2-0', 'MT_V4_02', 'CLB_SLNA', '90'),
('SK_V4_02_03', 'BanThang', 74, 'Rafaelson Bezerra ghi bàn rút ngắn tỷ số', 'MT_V4_02', 'CLB_NAMDINH', '23'),
('SK_V4_02_04', 'TheVang', 48, 'Nguyễn Tuấn Anh nhận thẻ vàng', 'MT_V4_02', 'CLB_NAMDINH', '21');

-- MT_V4_03: Bình Dương 4-0 Quảng Ninh
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V4_03_01', 'BanThang', 20, 'Nguyễn Tiến Linh mở tỷ số cho Bình Dương', 'MT_V4_03', 'CLB_BINHDUONG', '35'),
('SK_V4_03_02', 'BanThang', 39, 'Prince Ibara nâng tỷ số lên 2-0', 'MT_V4_03', 'CLB_BINHDUONG', '41'),
('SK_V4_03_03', 'BanThang', 56, 'Võ Minh Trọng ghi bàn thứ ba', 'MT_V4_03', 'CLB_BINHDUONG', '39'),
('SK_V4_03_04', 'BanThang', 81, 'Bùi Vĩ Hào ghi bàn thứ tư', 'MT_V4_03', 'CLB_BINHDUONG', '38'),
('SK_V4_03_05', 'TheVang', 72, 'Đào Duy Khánh nhận thẻ vàng', 'MT_V4_03', 'CLB_QUANGNINH', '169');

-- MT_V4_04: Bình Định 1-2 Hải Phòng
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V4_04_01', 'BanThang', 30, 'Alan Grafite mở tỷ số cho Bình Định', 'MT_V4_04', 'CLB_BINHDINH', '187'),
('SK_V4_04_02', 'BanThang', 47, 'Martin Lo gỡ hòa cho Hải Phòng', 'MT_V4_04', 'CLB_HAIPHONG', '10'),
('SK_V4_04_03', 'BanThang', 69, 'Lucao do Break ghi bàn chiến thắng', 'MT_V4_04', 'CLB_HAIPHONG', '6'),
('SK_V4_04_04', 'TheVang', 64, 'Lê Ngọc Bảo nhận thẻ vàng', 'MT_V4_04', 'CLB_BINHDINH', '184');

-- MT_V4_05: TP.HCM 2-1 HAGL
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V4_05_01', 'BanThang', 33, 'Hồ Tuấn Tài mở tỷ số cho TP.HCM', 'MT_V4_05', 'CLB_TPHCM', '120'),
('SK_V4_05_02', 'BanThang', 51, 'Cheick Timité nâng tỷ số lên 2-0', 'MT_V4_05', 'CLB_TPHCM', '119'),
('SK_V4_05_03', 'BanThang', 77, 'Joao Veras ghi bàn vinh dự cho HAGL', 'MT_V4_05', 'CLB_HAGL', '74'),
('SK_V4_05_04', 'TheVang', 59, 'Nguyễn Hạ Long nhận thẻ vàng', 'MT_V4_05', 'CLB_TPHCM', '118');

-- ==========================================================
-- SUKIENTRANDAU - VÒNG 5 & 6 MÙAGIẢI 2024-2025 (FIXED)
-- ==========================================================

-- MT_V5_01: Hà Nội 2-1 SLNA
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V5_01_01', 'BanThang', 27, 'Đỗ Hùng Dũng mở tỷ số cho Hà Nội', 'MT_V5_01', 'CLB_HANOI', '50'),
('SK_V5_01_02', 'BanThang', 52, 'Nguyễn Văn Quyết nâng tỷ số lên 2-0', 'MT_V5_01', 'CLB_HANOI', '49'),
('SK_V5_01_03', 'BanThang', 68, 'Michael Olaha ghi bàn vinh dự cho SLNA', 'MT_V5_01', 'CLB_SLNA', '83'),
('SK_V5_01_04', 'TheVang', 44, 'Brandon Wilson nhận thẻ vàng', 'MT_V5_01', 'CLB_HANOI', '58');

-- MT_V5_02: Quảng Ninh 0-3 TP.HCM
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V5_02_01', 'BanThang', 18, 'Cheick Timité mở tỷ số cho TP.HCM', 'MT_V5_02', 'CLB_TPHCM', '119'),
('SK_V5_02_02', 'BanThang', 43, 'Uông Ngọc Tiến nâng tỷ số lên 2-0', 'MT_V5_02', 'CLB_TPHCM', '128'),
('SK_V5_02_03', 'BanThang', 76, 'Hồ Tuấn Tài ghi bàn thứ ba', 'MT_V5_02', 'CLB_TPHCM', '120'),
('SK_V5_02_04', 'TheVang', 38, 'Mạc Hồng Quân nhận thẻ vàng', 'MT_V5_02', 'CLB_QUANGNINH', '166'),
('SK_V5_02_05', 'TheVang', 61, 'Phạm Nguyên Sa nhận thẻ vàng', 'MT_V5_02', 'CLB_QUANGNINH', '171');

-- MT_V5_03: Nam Định 1-2 Bình Dương
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V5_03_01', 'BanThang', 26, 'Tô Văn Vũ mở tỷ số cho Nam Định', 'MT_V5_03', 'CLB_NAMDINH', '25'),
('SK_V5_03_02', 'BanThang', 48, 'Nguyễn Tiến Linh gỡ hòa cho Bình Dương', 'MT_V5_03', 'CLB_BINHDUONG', '35'),
('SK_V5_03_03', 'BanThang', 64, 'Võ Minh Trọng ghi bàn chiến thắng', 'MT_V5_03', 'CLB_BINHDUONG', '39'),
('SK_V5_03_04', 'TheVang', 41, 'Hendrio Araujo nhận thẻ vàng', 'MT_V5_03', 'CLB_NAMDINH', '22'),
('SK_V5_03_05', 'TheVang', 57, 'Hồ Tấn Tái nhận thẻ vàng', 'MT_V5_03', 'CLB_BINHDUONG', '36');

-- MT_V5_04: HAGL 1-0 Bình Định
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V5_04_01', 'BanThang', 35, 'Gabriel Ferreira sút xa ghi bàn duy nhất', 'MT_V5_04', 'CLB_HAGL', '73'),
('SK_V5_04_02', 'TheVang', 72, 'Nghiêm Thành Chí nhận thẻ vàng', 'MT_V5_04', 'CLB_BINHDINH', '188');

-- MT_V5_05: Thanh Hóa 2-2 Hải Phòng
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V5_05_01', 'BanThang', 22, 'Võ Nguyên Hoàng mở tỷ số cho Thanh Hóa', 'MT_V5_05', 'CLB_THANHHOA', '108'),
('SK_V5_05_02', 'BanThang', 41, 'Nguyễn Thái Sơn nâng tỷ số lên 2-0', 'MT_V5_05', 'CLB_THANHHOA', '100'),
('SK_V5_05_03', 'BanThang', 56, 'Joseph Mpande gỡ hòa cho Hải Phòng', 'MT_V5_05', 'CLB_HAIPHONG', '2'),
('SK_V5_05_04', 'BanThang', 78, 'Nguyễn Văn Minh ghi bàn gỡ hòa', 'MT_V5_05', 'CLB_HAIPHONG', '11'),
('SK_V5_05_05', 'TheVang', 35, 'Rimario Gordon nhận thẻ vàng', 'MT_V5_05', 'CLB_THANHHOA', '103'),
('SK_V5_05_06', 'TheVang', 51, 'Bicou Bissainthe nhận thẻ vàng', 'MT_V5_05', 'CLB_HAIPHONG', '5');

-- ==========================================================
-- VÒNG 6 EVENTS
-- ==========================================================

-- MT_V6_01: Bình Định 0-2 Thanh Hóa
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V6_01_01', 'BanThang', 24, 'A Mít mở tỷ số cho Thanh Hóa', 'MT_V6_01', 'CLB_THANHHOA', '104'),
('SK_V6_01_02', 'BanThang', 67, 'Luiz Antonio ghi bàn thứ hai', 'MT_V6_01', 'CLB_THANHHOA', '107'),
('SK_V6_01_03', 'TheVang', 58, 'Trần Đình Trọng nhận thẻ vàng', 'MT_V6_01', 'CLB_BINHDINH', '191');

-- MT_V6_02: HAGL 1-3 Quảng Ninh
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V6_02_01', 'BanThang', 31, 'Nguyễn Quốc Việt mở tỷ số cho HAGL', 'MT_V6_02', 'CLB_HAGL', '70'),
('SK_V6_02_02', 'BanThang', 45, 'Eydison Teofilo gỡ hòa cho Quảng Ninh', 'MT_V6_02', 'CLB_QUANGNINH', '173'),
('SK_V6_02_03', 'BanThang', 62, 'Kizito Trung Hiếu nâng tỷ số lên 2-1', 'MT_V6_02', 'CLB_QUANGNINH', '172'),
('SK_V6_02_04', 'BanThang', 81, 'Nguyễn Văn Khoa ghi bàn thứ ba cho Quảng Ninh', 'MT_V6_02', 'CLB_QUANGNINH', '174'),
('SK_V6_02_05', 'TheVang', 53, 'Trần Minh Vương nhận thẻ vàng', 'MT_V6_02', 'CLB_HAGL', '68'),
('SK_V6_02_06', 'TheVang', 75, 'Nghiêm Xuân Tú nhận thẻ vàng', 'MT_V6_02', 'CLB_QUANGNINH', '167');

-- MT_V6_03: Hải Phòng 2-1 Nam Định
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V6_03_01', 'BanThang', 19, 'Lucao do Break mở tỷ số cho Hải Phòng', 'MT_V6_03', 'CLB_HAIPHONG', '6'),
('SK_V6_03_02', 'BanThang', 38, 'Nguyễn Hữu Sơn nâng tỷ số lên 2-0', 'MT_V6_03', 'CLB_HAIPHONG', '13'),
('SK_V6_03_03', 'BanThang', 72, 'Nguyễn Văn Toàn ghi bàn vinh dự cho Nam Định', 'MT_V6_03', 'CLB_NAMDINH', '24'),
('SK_V6_03_04', 'TheVang', 44, 'Lê Mạnh Dũng nhận thẻ vàng', 'MT_V6_03', 'CLB_HAIPHONG', '7'),
('SK_V6_03_05', 'TheVang', 65, 'Nguyễn Tuấn Anh nhận thẻ vàng', 'MT_V6_03', 'CLB_NAMDINH', '21');

-- MT_V6_04: TP.HCM 3-0 HAGL
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V6_04_01', 'BanThang', 28, 'Võ Huy Toàn mở tỷ số cho TP.HCM', 'MT_V6_04', 'CLB_TPHCM', '117'),
('SK_V6_04_02', 'BanThang', 54, 'Chu Văn Kiên nâng tỷ số lên 2-0', 'MT_V6_04', 'CLB_TPHCM', '122'),
('SK_V6_04_03', 'BanThang', 71, 'Uông Ngọc Tiến ghi bàn thứ ba', 'MT_V6_04', 'CLB_TPHCM', '128'),
('SK_V6_04_04', 'TheVang', 63, 'Phan Du Học nhận thẻ vàng', 'MT_V6_04', 'CLB_HAGL', '75');

-- MT_V6_05: SLNA 1-1 Bình Dương
INSERT INTO SuKienTranDau (MaSuKien, LoaiSuKien, PhutThiDau, MoTaSuKien, MaTran, MaClb, MaCauThu) VALUES
('SK_V6_05_01', 'BanThang', 34, 'Ngô Văn Lương mở tỷ số cho SLNA', 'MT_V6_05', 'CLB_SLNA', '91'),
('SK_V6_05_02', 'BanThang', 58, 'Quế Ngọc Hải gỡ hòa cho Bình Dương', 'MT_V6_05', 'CLB_BINHDUONG', '34'),
('SK_V6_05_03', 'TheVang', 47, 'Đinh Xuân Tiến nhận thẻ vàng', 'MT_V6_05', 'CLB_SLNA', '86'),
('SK_V6_05_04', 'TheVang', 70, 'Tống Anh Tỷ nhận thẻ vàng', 'MT_V6_05', 'CLB_BINHDUONG', '44');
