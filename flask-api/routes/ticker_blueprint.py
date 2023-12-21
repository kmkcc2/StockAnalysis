from flask import Blueprint
from controllers.ticker_controller import index, analyzeCompanyData
from flask_cors import CORS

ticker_blueprint = Blueprint('ticker_blueprint', __name__)

ticker_blueprint.route('/', methods=['GET'])(index)
ticker_blueprint.route('/analyze', methods=['POST'])(analyzeCompanyData)
CORS(ticker_blueprint)