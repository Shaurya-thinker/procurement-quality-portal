"""merge multiple heads

Revision ID: 75fc83dad5fa
Revises: 23d9de0152ac, 61b842eedb48
Create Date: 2025-12-30 00:16:49.549559

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '75fc83dad5fa'
down_revision: Union[str, Sequence[str], None] = ('23d9de0152ac', '61b842eedb48')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
