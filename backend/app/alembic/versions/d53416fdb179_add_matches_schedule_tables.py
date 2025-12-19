"""Matches & Schedule: create tables + NOT NULL + indexes + checks

Revision ID: d53416fdb179
Revises: 34dc733d2f05
Create Date: 2025-12-16
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "d53416fdb179"
down_revision = "34dc733d2f05"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # =========================================================
    # 1) lichthidau (Matches)
    # =========================================================
    op.create_table(
        "lichthidau",
        sa.Column("matran", sa.String(length=50), nullable=False),
        sa.Column("muagiai", sa.String(length=50), nullable=False),
        sa.Column("vong", sa.Integer(), nullable=False),
        sa.Column("thoigianthidau", sa.DateTime(), nullable=False),
        sa.Column("maclbnha", sa.String(length=50), nullable=False),
        sa.Column("maclbkhach", sa.String(length=50), nullable=False),
        sa.Column("masanvandong", sa.String(length=50), nullable=True),
        sa.Column("sokhangia", sa.Integer(), nullable=True),
        sa.Column("nhietdo", sa.Float(), nullable=True),
        sa.Column("bugiohiep1", sa.Integer(), nullable=True),
        sa.Column("bugiohiep2", sa.Integer(), nullable=True),
        sa.Column("tiso", sa.String(length=20), nullable=True),

        sa.PrimaryKeyConstraint("matran", name="pk_lichthidau"),

        # FK mùa giải
        sa.ForeignKeyConstraint(
            ["muagiai"],
            ["muagiai.muagiai"],
            name="fk_lichthidau_muagiai",
            ondelete="CASCADE",
        ),

        # CHECKs (đúng như bạn đang thấy trong DB)
        sa.CheckConstraint("vong > 0", name="ck_lichthidau_vong_positive"),
        sa.CheckConstraint("maclbnha <> maclbkhach", name="ck_lichthidau_home_neq_away"),
    )

    # Composite FK CLB nhà / CLB khách (phải tạo sau create_table)
    op.create_foreign_key(
        "fk_lichthidau_home_club",
        "lichthidau",
        "caulacbo",
        ["maclbnha", "muagiai"],
        ["maclb", "muagiai"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "fk_lichthidau_away_club",
        "lichthidau",
        "caulacbo",
        ["maclbkhach", "muagiai"],
        ["maclb", "muagiai"],
        ondelete="CASCADE",
    )

    # Composite FK sân vận động: KHÔNG dùng SET NULL vì composite sẽ cố set NULL cả muagiai (NOT NULL)
    # => để mặc định RESTRICT/NO ACTION là an toàn nhất
    op.create_foreign_key(
        "fk_lichthidau_stadium",
        "lichthidau",
        "sanvandong",
        ["masanvandong", "muagiai"],
        ["masanvandong", "muagiai"],
    )

    # Indexes (đúng như DB bạn đang thấy)
    op.create_index("ix_lichthidau_muagiai_vong", "lichthidau", ["muagiai", "vong"])
    op.create_index("ix_lichthidau_maclbnha", "lichthidau", ["maclbnha"])
    op.create_index("ix_lichthidau_maclbkhach", "lichthidau", ["maclbkhach"])
    op.create_index("ix_lichthidau_thoigianthidau", "lichthidau", ["thoigianthidau"])

    # =========================================================
    # 2) doihinhxuatphat (Lineup)
    # =========================================================
    op.create_table(
        "doihinhxuatphat",
        sa.Column("matran", sa.String(length=50), nullable=False),
        sa.Column("macauthu", sa.String(length=50), nullable=False),
        sa.Column("vitri", sa.String(length=50), nullable=True),
        sa.Column("duocxuatphat", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("ladoitruong", sa.Boolean(), nullable=False, server_default=sa.text("false")),

        sa.PrimaryKeyConstraint("matran", "macauthu", name="pk_doihinhxuatphat"),

        sa.ForeignKeyConstraint(
            ["matran"],
            ["lichthidau.matran"],
            name="fk_doihinhxuatphat_matran",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["macauthu"],
            ["cauthu.macauthu"],
            name="fk_doihinhxuatphat_macauthu",
            ondelete="CASCADE",
        ),
    )

    # =========================================================
    # 3) sukientrandau (Match events)
    # =========================================================
    op.create_table(
        "sukientrandau",
        sa.Column("masukien", sa.String(length=50), nullable=False),
        sa.Column("loaisukien", sa.String(length=50), nullable=False),
        sa.Column("phutthidau", sa.Integer(), nullable=False),
        sa.Column("bugio", sa.Integer(), nullable=True),
        sa.Column("motasukien", sa.Text(), nullable=True),
        sa.Column("cauthulienquan", sa.String(length=50), nullable=True),

        sa.Column("matran", sa.String(length=50), nullable=False),
        sa.Column("maclb", sa.String(length=50), nullable=False),
        sa.Column("macauthu", sa.String(length=50), nullable=False),

        sa.PrimaryKeyConstraint("masukien", name="pk_sukientrandau"),

        sa.ForeignKeyConstraint(
            ["matran"],
            ["lichthidau.matran"],
            name="fk_sukientrandau_matran",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["macauthu"],
            ["cauthu.macauthu"],
            name="fk_sukientrandau_macauthu",
            ondelete="CASCADE",
        ),
    )

    op.create_index(
        "ix_sukientrandau_matran_phutthidau",
        "sukientrandau",
        ["matran", "phutthidau"],
    )
    op.create_index("ix_sukientrandau_macauthu", "sukientrandau", ["macauthu"])

    # =========================================================
    # 4) chitiettrongtai (Referees)
    # =========================================================
    op.create_table(
        "chitiettrongtai",
        sa.Column("matran", sa.String(length=50), nullable=False),
        sa.Column("tentrongtai", sa.String(length=100), nullable=False),
        sa.Column("vitri", sa.String(length=50), nullable=False),

        sa.PrimaryKeyConstraint("matran", "tentrongtai", name="pk_chitiettrongtai"),

        sa.ForeignKeyConstraint(
            ["matran"],
            ["lichthidau.matran"],
            name="fk_chitiettrongtai_matran",
            ondelete="CASCADE",
        ),
    )


def downgrade() -> None:
    # Drop in reverse order (children first)
    op.drop_table("chitiettrongtai")

    op.drop_index("ix_sukientrandau_macauthu", table_name="sukientrandau")
    op.drop_index("ix_sukientrandau_matran_phutthidau", table_name="sukientrandau")
    op.drop_table("sukientrandau")

    op.drop_table("doihinhxuatphat")

    op.drop_index("ix_lichthidau_thoigianthidau", table_name="lichthidau")
    op.drop_index("ix_lichthidau_maclbkhach", table_name="lichthidau")
    op.drop_index("ix_lichthidau_maclbnha", table_name="lichthidau")
    op.drop_index("ix_lichthidau_muagiai_vong", table_name="lichthidau")

    # Drop table will drop its FKs + checks automatically
    op.drop_table("lichthidau")
