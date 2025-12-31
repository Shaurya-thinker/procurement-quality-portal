"""merge multiple heads

Revision ID: d93064cc4382
Revises: 75fc83dad5fa, 7cc45bc44079
Create Date: 2025-12-31 13:12:25.034306

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd93064cc4382'
down_revision: Union[str, Sequence[str], None] = ('75fc83dad5fa', '7cc45bc44079')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
