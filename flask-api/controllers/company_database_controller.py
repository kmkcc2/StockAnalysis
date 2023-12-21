from datetime import datetime
from flask.json import jsonify
from models.company import Company, db
from models.stock import Stock, db as stock_db
from sqlalchemy import join, select, or_, func, insert, delete
from flask import request, Response

def getOne(symbol_or_name_):
    stmt = Company.query.join(Stock).with_entities(Company.id, Company.name, Company.symbol, func.min(Stock.date), func.max(Stock.date)).filter(or_(func.lower(Company.symbol).like("%"+symbol_or_name_+"%"), func.lower(Company.name).like("%"+symbol_or_name_+"%"))).group_by(Company.id)
    db.session.close()
    data = []
    for company in stmt:
        min_date = str(datetime.date(company[3]))
        max_date = str(datetime.date(company[4]))
        print("Date: ",min_date)
        data.append({'id': company.id, 'name': company.name, 'symbol': company.symbol, 'min_date': min_date, 'max_date': max_date})
    return jsonify(data)

def getAll():
    stmt = Company.query.filter(or_(1 == 1)).all()
    db.session.close()
    data = []
    for company in stmt:
        data.append({'id': company.id, 'name': company.name, 'symbol': company.symbol})
    return jsonify(data)

def addOne():
    payload = request.get_json()
    name_ = ''
    symbol_ = ''
    try:
        name_ = payload['name']
        symbol_ = payload['symbol']
    except:
        return (jsonify({"message": "missing content"}), 400)
    try:
        stmt = (
            insert(Company).
            values(name = name_, symbol = symbol_)
            ).returning(Company.id)
        res = db.session.execute(stmt)
        id = ''
        for row in res:
            id = row.id
        db.session.commit()
        db.session.close()
        return (jsonify({"message": "New record created", "id": id}), 201)
    except Exception as e:
        return (jsonify({"message": "Error when inserting new record", "error": str(e)}), 500)

def deleteOne(id):
    if not id:
        return (jsonify({"message": "missing content"}), 400)
    try:
        stmt = delete(Company).where(Company.id == id).returning(Company.id)
        res = db.session.execute(stmt)
        db.session.commit()
        db.session.close()
        for row in res:
            return (jsonify({"id": row.id}),200)
        return (jsonify({"message": "Company with provided id does not exists"}),404)

    except Exception as e:
        return (jsonify({"message": str(e)}), 500)
def getAvailableDates(symbol_):
    stmt = select([func.min(Stock.date)]).select_from(join(Stock, Company, Company.id == Stock.company_id)).where(Company.symbol == symbol_.upper())
    res = stock_db.session.execute(stmt)
    stock_db.session.close()
    data = []
    for row in res:
        data.append({'min_date': row[0]})
    stmt = select([func.max(Stock.date)]).select_from(join(Stock, Company, Company.id == Stock.company_id)).where(Company.symbol == symbol_.upper())
    res = stock_db.session.execute(stmt)
    stock_db.session.close()
    for row in res:
        data.append({'max_date': row[0]})
    return jsonify(data)