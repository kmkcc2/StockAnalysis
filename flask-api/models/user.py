from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String)
    password = db.Column(db.String(120))
    is_active = db.Column(db.String(120))
    role = db.Column(db.String(100))

    @property
    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'password': self.password,
            'is_active': self.active,
        }
