"""
Base models for V-League application
"""

from tortoise import fields, models


class TimeStampedModel(models.Model):
    """Abstract base model with timestamp fields"""
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        abstract = True
