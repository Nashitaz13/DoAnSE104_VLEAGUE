"""
Regulation model - Quy định giải đấu
"""

from tortoise import fields, models


class QuyDinh(models.Model):
    """Quy định giải đấu - Tournament Regulations"""
    ma_quy_dinh = fields.IntField(pk=True)
    ten_quy_dinh = fields.CharField(max_length=100, unique=True)
    gia_tri = fields.IntField()
    mo_ta = fields.CharField(max_length=255, null=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "quydinh"

    def __str__(self):
        return f"{self.ten_quy_dinh}: {self.gia_tri}"
