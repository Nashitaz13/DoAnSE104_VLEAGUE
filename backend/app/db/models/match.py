"""
Match and Match Events models - Trận đấu và sự kiện
"""

from tortoise import fields, models

from .base import TimeStampedModel
from .enums import TrangThaiTranDauEnum, LoaiTheEnum


class TranDau(TimeStampedModel):
    """Trận đấu - Match"""
    ma_tran_dau = fields.IntField(pk=True)
    mua_giai = fields.ForeignKeyField(
        "models.MuaGiai",
        related_name="tran_dau",
        on_delete=fields.CASCADE
    )
    vong_dau = fields.CharField(max_length=50, null=True)
    doi_nha = fields.ForeignKeyField(
        "models.DoiBong",
        related_name="tran_dau_nha",
        on_delete=fields.CASCADE
    )
    doi_khach = fields.ForeignKeyField(
        "models.DoiBong",
        related_name="tran_dau_khach",
        on_delete=fields.CASCADE
    )
    san = fields.ForeignKeyField(
        "models.San",
        related_name="tran_dau",
        null=True,
        on_delete=fields.SET_NULL
    )
    ngay_thi_dau = fields.DatetimeField(null=True)
    trang_thai = fields.CharEnumField(
        TrangThaiTranDauEnum,
        default=TrangThaiTranDauEnum.SCHEDULED,
        max_length=20
    )
    so_ban_thang_doi_nha = fields.IntField(default=0)
    so_ban_thang_doi_khach = fields.IntField(default=0)

    # Reverse relations
    ban_thang: fields.ReverseRelation["BanThang"]
    the_phat: fields.ReverseRelation["ThePhat"]

    class Meta:
        table = "trandau"

    def __str__(self):
        return f"{self.doi_nha} vs {self.doi_khach}"


class BanThang(models.Model):
    """Bàn thắng - Goal"""
    ma_ban_thang = fields.IntField(pk=True)
    tran_dau = fields.ForeignKeyField(
        "models.TranDau",
        related_name="ban_thang",
        on_delete=fields.CASCADE
    )
    cau_thu = fields.ForeignKeyField(
        "models.CauThu",
        related_name="ban_thang",
        on_delete=fields.CASCADE
    )
    doi_bong = fields.ForeignKeyField(
        "models.DoiBong",
        related_name="ban_thang",
        on_delete=fields.CASCADE
    )
    thoi_diem = fields.IntField()  # Phút ghi bàn
    loai_ban_thang = fields.ForeignKeyField(
        "models.LoaiBanThang",
        related_name="ban_thang",
        null=True,
        on_delete=fields.SET_NULL
    )
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "banthang"

    def __str__(self):
        return f"Goal by {self.cau_thu} at {self.thoi_diem}'"


class ThePhat(models.Model):
    """Thẻ phạt - Card"""
    ma_the_phat = fields.IntField(pk=True)
    tran_dau = fields.ForeignKeyField(
        "models.TranDau",
        related_name="the_phat",
        on_delete=fields.CASCADE
    )
    cau_thu = fields.ForeignKeyField(
        "models.CauThu",
        related_name="the_phat",
        on_delete=fields.CASCADE
    )
    doi_bong = fields.ForeignKeyField(
        "models.DoiBong",
        related_name="the_phat",
        on_delete=fields.CASCADE
    )
    thoi_diem = fields.IntField()  # Phút nhận thẻ
    loai_the = fields.CharEnumField(LoaiTheEnum, max_length=20)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "thephat"

    def __str__(self):
        return f"{self.loai_the} card for {self.cau_thu} at {self.thoi_diem}'"
