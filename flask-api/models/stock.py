from flask_sqlalchemy import SQLAlchemy
from models.company import Company
db = SQLAlchemy()

class Stock(db.Model):
    __tablename__ = 'stock'

    id = db.Column(db.Integer, primary_key=True)
    company_id =db.Column(db.Integer, db.ForeignKey(Company.id), nullable=False)
    date = db.Column(db.DateTime)
    open = db.Column(db.Float)
    high = db.Column(db.Float)
    low = db.Column(db.Float)
    close = db.Column(db.Float)
    volume = db.Column(db.Integer)


    @property
    def serialize(self):
        return {
            'id': self.id,
            'company_id': self.company_id,
            'data': self.data,
            'open': self.open,
            'high': self.high,
            'low': self.low,
            'close': self.close,
            'volume': self.volume,
        }
