-- =================================================================
-- SCRIPT TÍNH TOÁN VÀ CẬP NHẬT BẢNG XẾP HẠNG (BXH)
-- Mùa giải: 2024-2025
-- =================================================================
CREATE OR REPLACE FUNCTION UpdateBXH_DoiBong()
RETURNS void AS $$
BEGIN
    INSERT INTO BXH_DoiBong (MuaGiai, MaClb, SoTran, Thang, Hoa, Thua, BanThang, BanThua, Diem, ThuHang)
    WITH TranDauDaDau AS (
        SELECT 
            MaTran,
            MaClbNha,
            MaClbKhach,
            CAST(SPLIT_PART(TiSo, '-', 1) AS INT) AS BanThangNha,
            CAST(SPLIT_PART(TiSo, '-', 2) AS INT) AS BanThangKhach
        FROM LichThiDau
        WHERE MuaGiai = '2024-2025' 
          AND TiSo IS NOT NULL 
          AND TiSo LIKE '%-%'
    ),
    KetQuaTungDoi AS (
        SELECT 
            MaClbNha AS MaClb,
            1 AS SoTran,
            CASE WHEN BanThangNha > BanThangKhach THEN 1 ELSE 0 END AS Thang,
            CASE WHEN BanThangNha = BanThangKhach THEN 1 ELSE 0 END AS Hoa,
            CASE WHEN BanThangNha < BanThangKhach THEN 1 ELSE 0 END AS Thua,
            BanThangNha AS BanThang,
            BanThangKhach AS BanThua,
            CASE 
                WHEN BanThangNha > BanThangKhach THEN 3 
                WHEN BanThangNha = BanThangKhach THEN 1 
                ELSE 0 
            END AS Diem
        FROM TranDauDaDau
        
        UNION ALL
        
        SELECT 
            MaClbKhach AS MaClb,
            1 AS SoTran,
            CASE WHEN BanThangKhach > BanThangNha THEN 1 ELSE 0 END AS Thang,
            CASE WHEN BanThangKhach = BanThangNha THEN 1 ELSE 0 END AS Hoa,
            CASE WHEN BanThangKhach < BanThangNha THEN 1 ELSE 0 END AS Thua,
            BanThangKhach AS BanThang,
            BanThangNha AS BanThua,
            CASE 
                WHEN BanThangKhach > BanThangNha THEN 3 
                WHEN BanThangKhach = BanThangNha THEN 1 
                ELSE 0 
            END AS Diem
        FROM TranDauDaDau
    ),
    TongHopBXH AS (
        SELECT 
            MaClb,
            SUM(SoTran) AS TongSoTran,
            SUM(Thang) AS TongThang,
            SUM(Hoa) AS TongHoa,
            SUM(Thua) AS TongThua,
            SUM(BanThang) AS TongBanThang,
            SUM(BanThua) AS TongBanThua,
            SUM(Diem) AS TongDiem
        FROM KetQuaTungDoi
        GROUP BY MaClb
    ),
    XepHangCuoiCung AS (
        SELECT 
            '2024-2025' AS MuaGiai,
            MaClb,
            TongSoTran,
            TongThang,
            TongHoa,
            TongThua,
            TongBanThang,
            TongBanThua,
            TongDiem,
            RANK() OVER (
                ORDER BY 
                    TongDiem DESC,
                    (TongBanThang - TongBanThua) DESC,
                    TongBanThang DESC
            ) AS ThuHang
        FROM TongHopBXH
    )
    SELECT * FROM XepHangCuoiCung
    ON CONFLICT (MuaGiai, MaClb) 
    DO UPDATE SET
        SoTran = EXCLUDED.SoTran,
        Thang = EXCLUDED.Thang,
        Hoa = EXCLUDED.Hoa,
        Thua = EXCLUDED.Thua,
        BanThang = EXCLUDED.BanThang,
        BanThua = EXCLUDED.BanThua,
        Diem = EXCLUDED.Diem,
        ThuHang = EXCLUDED.ThuHang;
END;
$$ LANGUAGE plpgsql;

SELECT UpdateBXH_DoiBong();

-- =================================================================
SELECT 
    b.ThuHang,
    c.TenClb, 
    b.SoTran, 
    b.Thang, 
    b.Hoa, 
    b.Thua, 
    b.BanThang, 
    b.BanThua, 
    (b.BanThang - b.BanThua) as HieuSo,
    b.Diem
FROM BXH_DoiBong b
JOIN CauLacBo c ON b.MaClb = c.MaClb AND b.MuaGiai = c.MuaGiai
WHERE b.MuaGiai = '2024-2025'
ORDER BY b.ThuHang ASC;