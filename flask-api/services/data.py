import yfinance as yf
import json
import pandas as pd
from sqlalchemy import insert
from models.company import db, Company
def getInfo(symbol):
    company_data = yf.Ticker(symbol)
    if company_data is None:
        print("bad request")


    # get all stock info
    company_data.info
    hist = company_data.history(period="1y")
    return hist.to_json(orient="split")

def loadSeed():
    # Read the CSV file
    companies = pd.read_csv("services/seed.csv", usecols=["Symbol", "Name"]).to_dict()

    for value in companies["Symbol"]:
        s = companies["Symbol"][value]
        n = companies["Name"][value]
        if len(n) > 100:
            continue
        stmt = Company(
            symbol=s,
            name=n
        )
        db.session.add(stmt)
        db.session.commit()


