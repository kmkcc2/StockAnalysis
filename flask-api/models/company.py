from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Company(db.Model):
    __tablename__ = 'company'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    symbol = db.Column(db.String(20))


    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'symbol': self.symbol,
        }
