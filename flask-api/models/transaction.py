from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Transaction(db.Model):
    __tablename__ = 'transaction'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Integer)
    user_id = db.Column(db.String(20))
    price = db.Column(db.String(20))


    @property
    def serialize(self):
        return {
            'id': self.id,
            'date': self.date,
            'user_id': self.user_id,
            'price': self.price,
        }
