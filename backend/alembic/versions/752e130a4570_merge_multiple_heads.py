"""merge multiple heads

Revision ID: 752e130a4570
Revises: 75fc83dad5fa, 7cc45bc44079
Create Date: 2025-12-30 22:43:24.342954

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '752e130a4570'
down_revision: Union[str, Sequence[str], None] = ('75fc83dad5fa', '7cc45bc44079')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
