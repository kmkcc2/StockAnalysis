from flask import Blueprint
from controllers.company_database_controller import getOne, addOne, getAll, deleteOne, getAvailableDates
from flask_cors import CORS

company_database_blueprint = Blueprint('company_database_blueprint', __name__)

company_database_blueprint.route('/<symbol_or_name_>', methods=['GET'])(getOne)
company_database_blueprint.route('/', methods=['GET'])(getAll)
company_database_blueprint.route('/', methods=['POST'])(addOne)
company_database_blueprint.route('/<id>', methods=['DELETE'])(deleteOne)
company_database_blueprint.route('/dates/<symbol_>', methods=['GET'])(getAvailableDates)
CORS(company_database_blueprint)