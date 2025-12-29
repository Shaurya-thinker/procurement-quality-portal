"""merge heads

Revision ID: e5898f7076d1
Revises: 6700031b60ae, c2a2fd41b760
Create Date: 2025-12-29 15:00:11.221649

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5898f7076d1'
down_revision: Union[str, Sequence[str], None] = ('6700031b60ae', 'c2a2fd41b760')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
