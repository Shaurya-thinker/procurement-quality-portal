"""merge migration heads

Revision ID: 263ff18420a7
Revises: 23d9de0152ac, 61b842eedb48
Create Date: 2025-12-30 15:00:31.761496

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '263ff18420a7'
down_revision: Union[str, Sequence[str], None] = ('23d9de0152ac', '61b842eedb48')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
