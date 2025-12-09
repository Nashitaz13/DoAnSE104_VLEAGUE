"""
Team and Stadium models - Đội bóng và Sân vận động
"""

from tortoise import fields, models

from .base import TimeStampedModel


class San(models.Model):
    """Sân vận động - Stadium"""
    ma_san = fields.IntField(pk=True)
    ten_san = fields.CharField(max_length=100)
    dia_chi = fields.CharField(max_length=255, null=True)
    suc_chua = fields.IntField(null=True)

    # Reverse relations
    doi_bong: fields.ReverseRelation["DoiBong"]
    tran_dau: fields.ReverseRelation["TranDau"]

    class Meta:
        table = "san"

    def __str__(self):
        return self.ten_san


class DoiBong(TimeStampedModel):
    """Đội bóng - Team"""
    ma_doi = fields.IntField(pk=True)
    ten_doi = fields.CharField(max_length=100)
    san = fields.ForeignKeyField(
        "models.San",
        related_name="doi_bong",
        null=True,
        on_delete=fields.SET_NULL
    )
    mua_giai = fields.ForeignKeyField(
        "models.MuaGiai",
        related_name="doi_bong",
        on_delete=fields.CASCADE
    )

    # Reverse relations
    cau_thu: fields.ReverseRelation["CauThu"]
    tran_dau_nha: fields.ReverseRelation["TranDau"]
    tran_dau_khach: fields.ReverseRelation["TranDau"]
    ban_thang: fields.ReverseRelation["BanThang"]
    the_phat: fields.ReverseRelation["ThePhat"]
    bang_xep_hang: fields.ReverseRelation["BangXepHang"]

    class Meta:
        table = "doibong"
        unique_together = (("ten_doi", "mua_giai"),)

    def __str__(self):
        return self.ten_doi
