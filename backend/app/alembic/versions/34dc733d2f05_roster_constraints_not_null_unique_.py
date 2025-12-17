"""Roster constraints: NOT NULL + unique shirt number + composite FK

Revision ID: 34dc733d2f05
Revises: 1a31ce608336
Create Date: 2025-12-16 11:03:43.037058

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '34dc733d2f05'
down_revision = '1a31ce608336'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        "chitietdoibong",
        "soaothidau",
        existing_type=sa.Integer(),
        nullable=False,
        existing_nullable=True,
    )

    op.create_unique_constraint(
        "uq_chitietdoibong_maclb_muagiai_soaothidau",
        "chitietdoibong",
        ["maclb", "muagiai", "soaothidau"],
    )

    op.create_index(
        "ix_chitietdoibong_maclb_muagiai",
        "chitietdoibong",
        ["maclb", "muagiai"],
    )


def downgrade() -> None:
    op.drop_index("ix_chitietdoibong_maclb_muagiai", table_name="chitietdoibong")

    op.drop_constraint(
        "uq_chitietdoibong_maclb_muagiai_soaothidau",
        "chitietdoibong",
        type_="unique",
    )

    op.alter_column(
        "chitietdoibong",
        "soaothidau",
        existing_type=sa.Integer(),
        nullable=True,
        existing_nullable=False,
    )
