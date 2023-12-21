from flask.json import jsonify
from flask import request
from models.transaction import Transaction, db
from models.user import User, db as db_user
from sqlalchemy import join, select, or_, func, insert, delete

def add_transaction():
  payload = request.get_json()
  date = ''
  user_id = ''
  price = ''
  try:
      date = payload['date']
      user_id = payload['user_id']
      price = payload['price']
  except:
      return (jsonify({"message": "missing content"}), 400)
  try:
      stmt = (
          insert(Transaction).
          values(date = date, user_id = user_id, price = price)
          )
      db.session.execute(stmt)
      db.session.commit()
      db.session.close()
      return (jsonify({"message": "New transaction created"}), 201)
  except Exception as e:
      return (jsonify({"message": "Error when inserting new transaction", "error": str(e)}), 500)

def get_transactions():
  stmt = select([Transaction.id, User.email, Transaction.date, Transaction.price]).select_from(join(User, Transaction, User.id == Transaction.user_id))
  res = db.session.execute(stmt)
  db.session.close()
  data = []
  for transaction in res:
      data.append({'id': transaction.id, 'date': transaction.date, 'email': transaction.email, 'price': transaction.price})
  return jsonify(data)

def get_transaction(id):
  stmt = select(Transaction).where(Transaction.id == id)
  res = db.session.execute(stmt)
  db.session.close()
  data = []
  for transaction in res:
      data.append({'id': transaction.id, 'date': transaction.date, 'email': transaction.email, 'price': transaction.price})
  return jsonify(data)
