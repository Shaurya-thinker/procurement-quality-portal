"""add inventory transaction log

Revision ID: 23d9de0152ac
Revises: 61b842eedb48
Create Date: 2025-12-29 15:13:09.776813
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = '23d9de0152ac'
down_revision = '61b842eedb48'
branch_labels = None
depends_on = None


def table_exists(table_name: str) -> bool:
    bind = op.get_bind()
    inspector = inspect(bind)
    return table_name in inspector.get_table_names()


def index_exists(table_name: str, index_name: str) -> bool:
    bind = op.get_bind()
    inspector = inspect(bind)
    return index_name in [i["name"] for i in inspector.get_indexes(table_name)]


def upgrade() -> None:
    """Upgrade schema."""

    # 1️⃣ Create inventory_transactions table (this is REQUIRED)
    op.create_table(
        'inventory_transactions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('inventory_item_id', sa.Integer(), nullable=False),
        sa.Column(
            'transaction_type',
            sa.Enum('IN', 'OUT', name='inventory_transaction_type'),
            nullable=False
        ),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('reference_type', sa.String(), nullable=False),
        sa.Column('reference_id', sa.Integer(), nullable=False),
        sa.Column('remarks', sa.String(), nullable=True),
        sa.Column('created_by', sa.String(), nullable=True),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('(CURRENT_TIMESTAMP)'),
            nullable=True
        ),
        sa.ForeignKeyConstraint(['inventory_item_id'], ['inventory_items.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_index(
        'ix_inventory_transactions_id',
        'inventory_transactions',
        ['id'],
        unique=False
    )

    # 2️⃣ Drop legacy dispatch tables ONLY if they exist
    if table_exists('dispatch_items'):
        if index_exists('dispatch_items', 'ix_dispatch_items_id'):
            op.drop_index('ix_dispatch_items_id', table_name='dispatch_items')
        op.drop_table('dispatch_items')

    if table_exists('dispatches'):
        if index_exists('dispatches', 'ix_dispatches_dispatch_number'):
            op.drop_index(
                'ix_dispatches_dispatch_number',
                table_name='dispatches'
            )
        if index_exists('dispatches', 'ix_dispatches_id'):
            op.drop_index(
                'ix_dispatches_id',
                table_name='dispatches'
            )
        op.drop_table('dispatches')


def downgrade() -> None:
    """Downgrade schema."""

    # Recreate dispatches
    op.create_table(
        'dispatches',
        sa.Column('id', sa.INTEGER(), nullable=False),
        sa.Column('dispatch_number', sa.VARCHAR(length=50), nullable=False),
        sa.Column('dispatch_date', sa.DATETIME(), nullable=False),
        sa.Column('dispatch_type', sa.VARCHAR(length=8), nullable=False),
        sa.Column('status', sa.VARCHAR(length=9), nullable=False),
        sa.Column('store', sa.VARCHAR(length=100), nullable=True),
        sa.Column('department', sa.VARCHAR(length=100), nullable=True),
        sa.Column('vendor', sa.VARCHAR(length=100), nullable=True),
        sa.Column('project_site', sa.VARCHAR(length=100), nullable=True),
        sa.Column('issued_by', sa.VARCHAR(length=100), nullable=False),
        sa.Column('received_by', sa.VARCHAR(length=100), nullable=False),
        sa.Column('vehicle_number', sa.VARCHAR(length=50), nullable=True),
        sa.Column('gate_pass_number', sa.VARCHAR(length=50), nullable=True),
        sa.Column('remarks', sa.TEXT(), nullable=True),
        sa.Column('total_value', sa.FLOAT(), nullable=True),
        sa.Column('created_at', sa.DATETIME(), nullable=True),
        sa.Column('updated_at', sa.DATETIME(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_index(
        'ix_dispatches_id',
        'dispatches',
        ['id'],
        unique=False
    )

    op.create_index(
        'ix_dispatches_dispatch_number',
        'dispatches',
        ['dispatch_number'],
        unique=True
    )

    op.create_table(
        'dispatch_items',
        sa.Column('id', sa.INTEGER(), nullable=False),
        sa.Column('dispatch_id', sa.INTEGER(), nullable=False),
        sa.Column('item_code', sa.VARCHAR(length=50), nullable=False),
        sa.Column('item_name', sa.VARCHAR(length=200), nullable=False),
        sa.Column('unit', sa.VARCHAR(length=20), nullable=False),
        sa.Column('dispatch_qty', sa.FLOAT(), nullable=False),
        sa.Column('batch_lot', sa.VARCHAR(length=50), nullable=True),
        sa.Column('rate', sa.FLOAT(), nullable=True),
        sa.Column('line_value', sa.FLOAT(), nullable=True),
        sa.ForeignKeyConstraint(['dispatch_id'], ['dispatches.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_index(
        'ix_dispatch_items_id',
        'dispatch_items',
        ['id'],
        unique=False
    )

    op.drop_index(
        'ix_inventory_transactions_id',
        table_name='inventory_transactions'
    )
    op.drop_table('inventory_transactions')