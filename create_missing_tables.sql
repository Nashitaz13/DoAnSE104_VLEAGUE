
CREATE TABLE IF NOT EXISTS Diem (
    MuaGiai VARCHAR(50) PRIMARY KEY,
    DiemThang INT,
    DiemHoa INT,
    DiemThua INT,
    FOREIGN KEY (MuaGiai) REFERENCES MuaGiai(MuaGiai)
);

CREATE TABLE IF NOT EXISTS ThongKeCauThu (
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

CREATE TABLE IF NOT EXISTS BXH_DoiBong (
    MuaGiai VARCHAR(50),
    MaClb VARCHAR(50),
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

CREATE TABLE IF NOT EXISTS ThongKeTranDau (
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
