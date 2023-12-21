import os
import threading

import psycopg2
from models.stock import Stock, db as stock_db
import yfinance as yf
from sqlalchemy import select, func, exc
from models.company import Company, db as company_db
from middleware import verifyAdminToken
import os
# @verifyAdminToken
def index(period_):
    stmt = select([func.count()]).select_from(Company)
    res = company_db.session.execute(stmt)
    company_count = 0
    for row in res:
        company_count = row.count_1
    stmt = company_db.Query(Company)
    res = company_db.session.execute(stmt)
    iter = 0

    for row in res:
        with open('download_status.txt', 'w') as f:
            f.write(str(iter))
        iter += 1
        symbol = row.company_symbol
        id = row.company_id
        hist = yf.Ticker(symbol).history(period=period_)
        hist.reset_index(inplace=True)
        if hist.empty:
            continue
        for index, record in hist.iterrows():
            stmt = Stock(
                company_id = id,
                date = record.Date,
                open = record.Open,
                high = record.High,
                low = record.Low,
                close = record.Close,
                volume = record.Volume
            )
            try:
                stock_db.session.add(stmt)
                stock_db.session.commit()
                print("rekord dodany "+ str(record.Date))
            except exc.IntegrityError as e:
                stock_db.session.rollback()
                continue

        print("ukonczono "+str(iter)+" z "+str(company_count))

    data = {'info': 'Backup create successfuly.'}
    return (data, 200)

def get_current_download_status():
    text_file = open("download_status.txt", "r")
    data = text_file.read()
    text_file.close()
    return {"status": data}, 200