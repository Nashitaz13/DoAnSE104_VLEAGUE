"""
User management models - Quản lý người dùng
"""

from tortoise import fields, models

from .base import TimeStampedModel


class NhomNguoiDung(models.Model):
    """Nhóm người dùng / Vai trò - User Group / Role"""
    ma_nhom = fields.IntField(pk=True)
    ten_nhom = fields.CharField(max_length=50, unique=True)
    mo_ta = fields.CharField(max_length=255, null=True)

    class Meta:
        table = "nhomnguoidung"

    def __str__(self):
        return self.ten_nhom


class TaiKhoan(TimeStampedModel):
    """Tài khoản người dùng - User Account"""
    ma_tai_khoan = fields.IntField(pk=True)
    ten_dang_nhap = fields.CharField(max_length=100, unique=True)
    mat_khau = fields.CharField(max_length=255)
    ho_ten = fields.CharField(max_length=100, null=True)
    email = fields.CharField(max_length=100, null=True)
    nhom = fields.ForeignKeyField(
        "models.NhomNguoiDung",
        related_name="tai_khoan",
        null=True,
        on_delete=fields.SET_NULL
    )
    is_active = fields.BooleanField(default=True)

    class Meta:
        table = "taikhoan"

    def __str__(self):
        return self.ten_dang_nhap
