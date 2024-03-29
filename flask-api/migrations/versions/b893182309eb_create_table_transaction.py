"""create table transaction

Revision ID: b893182309eb
Revises: f6853d49b31f
Create Date: 2023-12-02 20:57:46.840216

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b893182309eb'
down_revision = 'f6853d49b31f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('transaction',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('transaction_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('date', postgresql.BIGINT(), autoincrement=False, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('price', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='transaction_pkey'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='user_fk', ondelete='CASCADE')
    )



def downgrade():
    op.drop_table('transaction')
