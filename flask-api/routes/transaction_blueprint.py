from flask import Blueprint
from controllers.transaction_controller import get_transactions, add_transaction, get_transaction
from flask_cors import CORS

transaction_blueprint = Blueprint('transaction_blueprint', __name__)

transaction_blueprint.route('/', methods=['GET'])(get_transactions)
transaction_blueprint.route('/', methods=['POST'])(add_transaction)
transaction_blueprint.route('/<id>', methods=['GET'])(get_transaction)
CORS(transaction_blueprint)