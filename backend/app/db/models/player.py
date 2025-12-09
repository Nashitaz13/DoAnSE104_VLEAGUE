"""
Player model - Cầu thủ
"""

from tortoise import fields, models

from .base import TimeStampedModel


class CauThu(TimeStampedModel):
    """Cầu thủ - Player"""
    ma_cau_thu = fields.IntField(pk=True)
    ten_cau_thu = fields.CharField(max_length=100)
    ngay_sinh = fields.DateField()
    loai_cau_thu = fields.ForeignKeyField(
        "models.LoaiCauThu",
        related_name="cau_thu",
        on_delete=fields.RESTRICT
    )
    vi_tri = fields.CharField(max_length=50, null=True)
    so_ao = fields.IntField(null=True)
    doi_bong = fields.ForeignKeyField(
        "models.DoiBong",
        related_name="cau_thu",
        on_delete=fields.CASCADE
    )
    ghi_chu = fields.CharField(max_length=255, null=True)

    # Reverse relations
    ban_thang: fields.ReverseRelation["BanThang"]
    the_phat: fields.ReverseRelation["ThePhat"]

    class Meta:
        table = "cauthu"
        unique_together = (("so_ao", "doi_bong"),)

    def __str__(self):
        return self.ten_cau_thu
