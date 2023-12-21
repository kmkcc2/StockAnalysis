import json
from models.user import User, db
from models.company import Company
from bs4 import BeautifulSoup
import requests
import yfinance as yf
from sqlalchemy import func

def index():
    url = "https://www.marketwatch.com/tools/screener/trending-tickers"
    html_content = requests.get(url).text
    soup = BeautifulSoup(html_content, 'lxml')
    trending_table = soup.find("table", attrs={"class": "table"})
    if(trending_table != None):
        data = []
        for tr in trending_table.tbody.findAll('tr'):
            for td in tr:
                if (td.text != "\n"):
                    data.append(td.text.replace('\n', ' ').strip().split()[0])
        if len(data) == 0:
            return {"error": 'error while fetching data from marketwatch'}
        else:
            json_data = {}
            json_data_transformed = {}
            for i in range (0, len(data), 6):
                ticker_info = yf.Ticker(data[i])
                try:
                    company_name = Company.query.filter(func.lower(Company.symbol) == func.lower(data[i])).all()
                    company_name = company_name.pop().name
                    json_data['company'+str(i)] = {'symbol': data[i], 'name': company_name, 'price': data[i+2], 'change': data[i+4]}
                except Exception as e:
                    print(e)
                    continue
            json_data_transformed['results'] = json_data
            if json_data_transformed['results'] == '':
                return {'error': 'error while fetching data from yahoo'}
            else:
                return json_data_transformed
    else:
        return {"error": 'error while fetching data from marketwatch'}