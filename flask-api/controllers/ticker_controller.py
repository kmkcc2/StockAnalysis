from datetime import datetime, timedelta
from flask.json import jsonify
from matplotlib import pyplot as plt
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import FunctionTransformer, Pipeline
from models.company import Company, db
from models.stock import Stock
from sqlalchemy import join, select
from flask import request
import statsmodels.api as sm
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.seasonal import seasonal_decompose
import numpy as np
import json
import pandas as pd
from pmdarima import auto_arima
import warnings
from sklearn.model_selection import train_test_split
from scipy.stats import spearmanr, pearsonr
def index(symbol_):
    stmt = select([Company.name, Stock.date, Stock.open, Stock.high, Stock.low, Stock.close]).select_from(join(Company, Stock, Company.id == Stock.company_id)).where(Company.symbol == symbol_.upper())
    res = db.session.execute(stmt)
    db.session.close()
    data = []
    for row in res:
        data.append({'date': row.date, 'open': row.open, 'high': row.high, 'low': row.low, 'close': row.close})
    return jsonify(data)

def analyzeCompanyData(symbol_):
    data = []
    try:
        payload = request.get_json()
        data = json.loads(payload['data'])
    except Exception as e:
        print(e)
        return ({'message':'all parameters must be present'}, 400)
    values = []
    dates = []
    for row in data:
        values.append(row['data'])
        dates.append(row['date'])
    test = sm.tsa.stattools.kpss(values, regression='ct')
    response = {}
    data_frame = {
            'date': dates,
            'value': values,
        }
    data_frame = pd.DataFrame(data_frame)
    data_frame['datetime'] = pd.to_datetime(data_frame['date'], errors='coerce')
    data_frame['date_ordinal'] = data_frame['datetime'].rank().astype(int) - 1

    warnings.filterwarnings("ignore")
    train_val, test_val = train_test_split(data_frame, test_size=0.33, shuffle=False)
    if test[1] < .05:
        response['conclusion'] = 'Szereg czasowy nie jest stacjonarny'

        X_values = data_frame['date_ordinal'].values.reshape(-1, 1)
        Y_values = data_frame['value']

        model_linear = LinearRegression()
        model_linear.fit(X_values, Y_values)
        linear_prediction = model_linear.predict(X_values)
        last_value = X_values[-1][0]
        linear_forecast = model_linear.predict([[last_value + i] for i in range(1, int(X_values.__len__() / 3))])
        r_squared_linear = r2_score(Y_values, linear_prediction)
        a = model_linear.coef_[0]
        b = model_linear.intercept_

        print("linear:", r_squared_linear)
        best_pred = linear_prediction
        best_forecast = linear_forecast
        best_pred_name = 'Trend liniowy'
        # if r_squared_exp > r_squared_linear:
        #     if r_squared_exp > r_squared_log:
        #         best_pred = exp_prediction
        #         best_forecast = exp_forecast
        #         best_pred_name = 'Trend wykładniczy'
        #     else:
        #         best_pred = log_prediction
        #         best_forecast = log_forecast
        #         best_pred_name = 'Trend logarytmiczny'
        # else:
        #     if r_squared_linear > r_squared_log:
        #         best_pred = linear_prediction
        #         best_forecast = linear_forecast
        #         best_pred_name = 'Trend liniowy'
        #     else:
        #         best_pred = log_prediction
        #         best_forecast = log_forecast
        #         best_pred_name = 'Trend logarytmiczny'

        # if r_squared_pow > max(r_squared_linear, r_squared_exp, r_squared_log):
        #     best_pred = pow_prediction
        #     best_forecast = pow_forecast
        #     best_pred_name = 'Trend potęgowy'

        pearson, p_value_pearson = pearsonr(Y_values, best_pred)
        spearman, p_value_spearman = spearmanr(Y_values, best_pred)

        response['predictions'] = best_pred.tolist() + best_forecast.tolist()
        response['expected'] = Y_values.tolist()
        mse = mean_squared_error(Y_values, best_pred)
        rmse = np.sqrt(mse)
        r_squared = r2_score(Y_values, best_pred)
        response['more'] = {
            'r^2': r_squared,
            'Rmse': rmse,
            'Wybrany trend': best_pred_name,
            'Współczynnik Pearsona': pearson,
            'Współczynnik Spearmana': spearman,
        }
    else:
        response['conclusion'] = 'Szereg czasowy jest stacjonarny'
        stepwise_fit = auto_arima(train_val['value'], trace = True, suppress_warnings=True)
        params = str(stepwise_fit.get_params()['order']).replace('(', '').replace(')', '').replace(' ', '')
        array_params = params.split(',')
        p = int(array_params[0])
        d = int(array_params[1])
        q = int(array_params[2])
        model_arima = ARIMA(data_frame['value'], order=(p, d, q))
        model_arima = model_arima.fit()
        start = 0
        end = len(data_frame) -1
        pred = model_arima.predict(start = start, end = end, typ='levels')
        forecast = model_arima.forecast(steps=int(len(data_frame['value'])/10)).tolist()
        # forecast = model_arima.predict(start = len(train_val) + len(test_val), end = len(train_val) + (len(test_val) * 2)).tolist()
        pred.index = data_frame['date'][start:end +1]
        response['more'] = {
            'średnia': np.mean(values),
            'odchylenie std.': np.std(values),
            'min': np.min(values),
            'max': np.max(values),
            'mediana': np.median(values),
            'kwartyl 0.25': np.quantile(values,.25),
            'kwartyl 0.75': np.quantile(values,.75),
        }
        response['arima'] = {
            'p': p,
            'd': d,
            'q': q,
        }
        response['predictions'] = pred.values.tolist() + forecast
        response['expected'] = data_frame.value.tolist()

    response['test_result'] = test[0]
    response['p_value'] = test[1]
    response['truncation_lag'] = test[2]
    response['critical_values'] = test[3]




    return (jsonify(response), 200)