-- ==========================================================
-- AUTO UPDATE ThongKeCauThu VIA FUNCTIONS + TRIGGERS (PostgreSQL)
-- Depends on existing tables: ThongKeCauThu, DoiHinhXuatPhat, SuKienTranDau
-- ==========================================================

-- Helper: normalize event types to constants
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_type_enum') THEN
    CREATE TYPE event_type_enum AS ENUM ('BanThang','KienTao','TheVang','TheVangThu2','TheDo');
  END IF;
END $$;

-- Recompute stats for a single player from source tables
CREATE OR REPLACE FUNCTION recompute_thongkecauthu(ma_cauthu TEXT)
RETURNS VOID AS $$
BEGIN
  -- Ensure player row exists
  INSERT INTO ThongKeCauThu (MaCauThu, SoTranDaChoi, SoPhutDaChoi, KienTao, BanThang, TheVang, TheVangThu2, TheDo, GiuSachLuoi, ThungLuoi)
  VALUES (ma_cauthu, 0, 0, 0, 0, 0, 0, 0, 0, 0)
  ON CONFLICT (MaCauThu) DO NOTHING;

  -- Compute matches played and minutes from DoiHinhXuatPhat
  UPDATE ThongKeCauThu t
  SET SoTranDaChoi = COALESCE(src.so_tran, 0),
      SoPhutDaChoi = COALESCE(src.so_phut, 0)
  FROM (
    SELECT d.MaCauThu,
           COUNT(*) FILTER (WHERE d.DuocXuatPhat = TRUE) + COUNT(*) FILTER (WHERE d.DuocXuatPhat = FALSE) AS so_tran,
           -- Simple minutes: 90 for starters, 30 for subs (can refine later)
           (COUNT(*) FILTER (WHERE d.DuocXuatPhat = TRUE) * 90) + (COUNT(*) FILTER (WHERE d.DuocXuatPhat = FALSE) * 30) AS so_phut
    FROM DoiHinhXuatPhat d
    WHERE d.MaCauThu = ma_cauthu
    GROUP BY d.MaCauThu
  ) src
  WHERE t.MaCauThu = src.MaCauThu;

  -- Compute goals, assists, cards from SuKienTranDau
  UPDATE ThongKeCauThu t
  SET BanThang = COALESCE(ev.banthang, 0),
      KienTao  = COALESCE(ev.kientao, 0),
      TheVang  = COALESCE(ev.thevang, 0),
      TheVangThu2 = COALESCE(ev.thevang2, 0),
      TheDo    = COALESCE(ev.thedo, 0)
  FROM (
    SELECT s.MaCauThu,
           COUNT(*) FILTER (WHERE s.LoaiSuKien = 'BanThang') AS banthang,
           COUNT(*) FILTER (WHERE s.LoaiSuKien = 'KienTao') AS kientao,
           COUNT(*) FILTER (WHERE s.LoaiSuKien = 'TheVang') AS thevang,
           COUNT(*) FILTER (WHERE s.LoaiSuKien = 'TheVangThu2') AS thevang2,
           COUNT(*) FILTER (WHERE s.LoaiSuKien = 'TheDo') AS thedo
    FROM SuKienTranDau s
    WHERE s.MaCauThu = ma_cauthu
    GROUP BY s.MaCauThu
  ) ev
  WHERE t.MaCauThu = ev.MaCauThu;

  -- Compute clean sheets and conceded for goalkeepers based on match results if available
  -- NOTE: DoiHinhXuatPhat doesn't carry MaClb, so we can't safely
  -- infer team side for the goalkeeper to compute conceded/clean sheets
  -- without additional linkage. Skipping GiuSachLuoi/ThungLuoi update
  -- here to avoid referencing a non-existent column (d.MaClb).
END;
$$ LANGUAGE plpgsql;

-- Trigger function: recompute affected player from DoiHinhXuatPhat changes
CREATE OR REPLACE FUNCTION trg_doi_hinh_recompute()
RETURNS TRIGGER AS $$
DECLARE
  affected_player TEXT;
BEGIN
  affected_player := COALESCE(NEW.MaCauThu::TEXT, OLD.MaCauThu::TEXT);
  PERFORM recompute_thongkecauthu(affected_player);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger function: recompute affected player from SuKienTranDau changes
CREATE OR REPLACE FUNCTION trg_su_kien_recompute()
RETURNS TRIGGER AS $$
DECLARE
  affected_player TEXT;
BEGIN
  affected_player := COALESCE(NEW.MaCauThu::TEXT, OLD.MaCauThu::TEXT);
  PERFORM recompute_thongkecauthu(affected_player);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Attach triggers
DROP TRIGGER IF EXISTS thkc_t_doi_hinh_ins ON DoiHinhXuatPhat;
DROP TRIGGER IF EXISTS thkc_t_doi_hinh_upd ON DoiHinhXuatPhat;
DROP TRIGGER IF EXISTS thkc_t_doi_hinh_del ON DoiHinhXuatPhat;

CREATE TRIGGER thkc_t_doi_hinh_ins AFTER INSERT ON DoiHinhXuatPhat
FOR EACH ROW EXECUTE FUNCTION trg_doi_hinh_recompute();
CREATE TRIGGER thkc_t_doi_hinh_upd AFTER UPDATE ON DoiHinhXuatPhat
FOR EACH ROW EXECUTE FUNCTION trg_doi_hinh_recompute();
CREATE TRIGGER thkc_t_doi_hinh_del AFTER DELETE ON DoiHinhXuatPhat
FOR EACH ROW EXECUTE FUNCTION trg_doi_hinh_recompute();

DROP TRIGGER IF EXISTS thkc_t_su_kien_ins ON SuKienTranDau;
DROP TRIGGER IF EXISTS thkc_t_su_kien_upd ON SuKienTranDau;
DROP TRIGGER IF EXISTS thkc_t_su_kien_del ON SuKienTranDau;

CREATE TRIGGER thkc_t_su_kien_ins AFTER INSERT ON SuKienTranDau
FOR EACH ROW EXECUTE FUNCTION trg_su_kien_recompute();
CREATE TRIGGER thkc_t_su_kien_upd AFTER UPDATE ON SuKienTranDau
FOR EACH ROW EXECUTE FUNCTION trg_su_kien_recompute();
CREATE TRIGGER thkc_t_su_kien_del AFTER DELETE ON SuKienTranDau
FOR EACH ROW EXECUTE FUNCTION trg_su_kien_recompute();

-- Optional: batch recompute all players
CREATE OR REPLACE FUNCTION recompute_all_players()
RETURNS VOID AS $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT MaCauThu FROM CauThu LOOP
    PERFORM recompute_thongkecauthu(r.MaCauThu);
  END LOOP;
END;
$$ LANGUAGE plpgsql;


select recompute_all_players();

select * from ThongKeCauThu;

