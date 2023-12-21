from flask_sqlalchemy import SQLAlchemy
from models.user import User
db = SQLAlchemy()

class User_reset_token(db.Model):
    __tablename__ = 'user_reset_token'

    id = db.Column(db.Integer, primary_key=True)
    user_id =db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    token = db.Column(db.String(256))
    token_expire = db.Column(db.Integer)


    @property
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'token': self.token,
            'token_expire': self.token_expire,
        }
