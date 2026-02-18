"""add email auth fields

Revision ID: a1b2c3d4e5f6
Revises: 8e266ecb07b2
Create Date: 2026-02-18 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '8e266ecb07b2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Step 1: Add auth_provider with a server default so existing rows get 'google'
    op.add_column('users', sa.Column(
        'auth_provider',
        sa.String(),
        nullable=False,
        server_default='google',
    ))
    # Remove server default after backfill — keeps schema clean
    op.alter_column('users', 'auth_provider', server_default=None)

    # Step 2: Add password_hash as nullable (Google users have none)
    op.add_column('users', sa.Column(
        'password_hash',
        sa.String(),
        nullable=True,
    ))

    # Step 3: Make google_id nullable (email-registered users have none)
    op.alter_column('users', 'google_id', existing_type=sa.String(), nullable=True)


def downgrade() -> None:
    # Restore google_id NOT NULL — only safe if no email-only users exist
    op.alter_column('users', 'google_id', existing_type=sa.String(), nullable=False)
    op.drop_column('users', 'password_hash')
    op.drop_column('users', 'auth_provider')
