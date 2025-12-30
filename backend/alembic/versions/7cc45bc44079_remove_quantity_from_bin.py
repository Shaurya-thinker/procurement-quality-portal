"""remove quantity from bin

Revision ID: 7cc45bc44079
Revises: 263ff18420a7
Create Date: 2025-12-30 15:10:47.720260
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = '7cc45bc44079'
down_revision = '263ff18420a7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema.

    SQLite does not support DROP COLUMN,
    so we recreate the bins table without `quantity`.
    """

    bind = op.get_bind()
    inspector = inspect(bind)

    # ✅ Fresh DB safety
    if 'bins' not in inspector.get_table_names():
        return

    # 1. Rename old table
    op.rename_table('bins', 'bins_old')

    # 2. Create new bins table WITHOUT quantity
    op.create_table(
        'bins',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('bin_no', sa.String(length=50), nullable=False),
        sa.Column('store_id', sa.Integer(), nullable=False),
        sa.Column('component_details', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['store_id'], ['stores.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # 3. Copy data
    op.execute("""
        INSERT INTO bins (id, bin_no, store_id, component_details, created_at, updated_at)
        SELECT id, bin_no, store_id, component_details, created_at, updated_at
        FROM bins_old
    """)

    # 4. Drop old table
    op.drop_table('bins_old')


def downgrade() -> None:
    """Downgrade schema.

    Re-add quantity column by recreating table.
    """

    bind = op.get_bind()
    inspector = inspect(bind)

    if 'bins' not in inspector.get_table_names():
        return

    op.rename_table('bins', 'bins_new')

    op.create_table(
        'bins',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('bin_no', sa.String(length=50), nullable=False),
        sa.Column('store_id', sa.Integer(), nullable=False),
        sa.Column('component_details', sa.String(length=255), nullable=True),
        sa.Column('quantity', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['store_id'], ['stores.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.execute("""
        INSERT INTO bins (id, bin_no, store_id, component_details, quantity, created_at, updated_at)
        SELECT id, bin_no, store_id, component_details, NULL, created_at, updated_at
        FROM bins_new
    """)

    op.drop_table('bins_new')