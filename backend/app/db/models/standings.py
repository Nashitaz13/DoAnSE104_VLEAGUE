"""
Standings model - Bảng xếp hạng
"""

from tortoise import fields, models


class BangXepHang(models.Model):
    """Bảng xếp hạng - Standings"""
    ma_bxh = fields.IntField(pk=True)
    mua_giai = fields.ForeignKeyField(
        "models.MuaGiai",
        related_name="bang_xep_hang",
        on_delete=fields.CASCADE
    )
    doi_bong = fields.ForeignKeyField(
        "models.DoiBong",
        related_name="bang_xep_hang",
        on_delete=fields.CASCADE
    )
    so_tran = fields.IntField(default=0)
    thang = fields.IntField(default=0)
    hoa = fields.IntField(default=0)
    thua = fields.IntField(default=0)
    ban_thang = fields.IntField(default=0)
    ban_thua = fields.IntField(default=0)
    hieu_so = fields.IntField(default=0)
    diem = fields.IntField(default=0)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "bangxephang"
        unique_together = (("mua_giai", "doi_bong"),)

    def __str__(self):
        return f"{self.doi_bong}: {self.diem} points"
