"""add_po_sent_at_to_purchase_orders

Revision ID: ec46da8b0da4
Revises: b5c61c2e7da7
Create Date: 2026-01-03 22:58:01.785400

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ec46da8b0da4'
down_revision: Union[str, Sequence[str], None] = 'b5c61c2e7da7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "purchase_orders",
        sa.Column("po_sent_at", sa.DateTime(), nullable=True)
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("purchase_orders", "po_sent_at")
