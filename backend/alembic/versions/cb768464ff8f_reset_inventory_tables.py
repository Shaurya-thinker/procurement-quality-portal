"""reset inventory tables

Revision ID: cb768464ff8f
Revises: 752e130a4570
Create Date: 2025-12-30
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "cb768464ff8f"
down_revision = "752e130a4570"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    tables = inspector.get_table_names()

    # 1️⃣ Drop inventory_transactions if exists
    if "inventory_transactions" in tables:
        op.drop_table("inventory_transactions")

    # 2️⃣ Drop inventory_items if exists
    if "inventory_items" in tables:
        op.drop_table("inventory_items")

    # 3️⃣ Recreate inventory_items
    op.create_table(
        "inventory_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("item_id", sa.Integer(), nullable=False),
        sa.Column("store_id", sa.Integer(), nullable=False),
        sa.Column("bin_id", sa.Integer(), nullable=True),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )

    op.create_index(
        "ix_inventory_items_id",
        "inventory_items",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_inventory_items_item_id",
        "inventory_items",
        ["item_id"],
        unique=False,
    )

    # 4️⃣ Recreate inventory_transactions
    op.create_table(
        "inventory_transactions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("inventory_item_id", sa.Integer(), nullable=False),
        sa.Column("transaction_type", sa.String(length=10), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("reference_type", sa.String(length=50), nullable=False),
        sa.Column("reference_id", sa.Integer(), nullable=False),
        sa.Column("remarks", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )

    op.create_index(
        "ix_inventory_transactions_id",
        "inventory_transactions",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    tables = inspector.get_table_names()

    if "inventory_transactions" in tables:
        op.drop_table("inventory_transactions")

    if "inventory_items" in tables:
        op.drop_table("inventory_items")
