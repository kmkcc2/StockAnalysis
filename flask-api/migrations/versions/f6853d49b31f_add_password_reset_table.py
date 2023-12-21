"""add password-reset table

Revision ID: f6853d49b31f
Revises: f0393e5d9f1e
Create Date: 2023-11-22 12:00:53.255028

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'f6853d49b31f'
down_revision = 'f0393e5d9f1e'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('user_reset_token',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('token', sa.VARCHAR(length=256), autoincrement=False, nullable=False),
        sa.Column('token_expire', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='user_fk'),
        sa.PrimaryKeyConstraint('id', name='user_reset_token_pkey')
    )



def downgrade():
    op.drop_table('user_reset_token')
