"""
Season model - Mùa giải
"""

from tortoise import fields, models

from .base import TimeStampedModel
from .enums import TrangThaiMuaGiaiEnum


class MuaGiai(TimeStampedModel):
    """Mùa giải - Season"""
    ma_mua_giai = fields.IntField(pk=True)
    ten_mua_giai = fields.CharField(max_length=100)
    ngay_bat_dau = fields.DateField()
    ngay_ket_thuc = fields.DateField()
    trang_thai = fields.CharEnumField(
        TrangThaiMuaGiaiEnum,
        default=TrangThaiMuaGiaiEnum.ACTIVE,
        max_length=20
    )

    # Reverse relations
    doi_bong: fields.ReverseRelation["DoiBong"]
    tran_dau: fields.ReverseRelation["TranDau"]
    bang_xep_hang: fields.ReverseRelation["BangXepHang"]

    class Meta:
        table = "muagiai"

    def __str__(self):
        return self.ten_mua_giai
