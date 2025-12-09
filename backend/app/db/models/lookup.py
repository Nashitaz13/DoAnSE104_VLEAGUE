"""
Lookup table models - Bảng tra cứu
"""

from tortoise import fields, models


class LoaiCauThu(models.Model):
    """Loại cầu thủ - Player Type (Trong nước / Nước ngoài)"""
    ma_loai_cau_thu = fields.IntField(pk=True)
    ten_loai = fields.CharField(max_length=50, unique=True)

    class Meta:
        table = "loaicauthu"

    def __str__(self):
        return self.ten_loai


class LoaiBanThang(models.Model):
    """Loại bàn thắng - Goal Type (A, B, C)"""
    ma_loai_ban_thang = fields.IntField(pk=True)
    ten_loai = fields.CharField(max_length=10, unique=True)
    mo_ta = fields.CharField(max_length=100, null=True)

    class Meta:
        table = "loaibanthang"

    def __str__(self):
        return self.ten_loai
