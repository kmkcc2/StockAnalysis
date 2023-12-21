from flask import Blueprint
from controllers.trending_controller import index
from flask_cors import CORS

trendings_blueprint = Blueprint('trendings_blueprint', __name__)

trendings_blueprint.route('/', methods=['GET'])(index)
CORS(trendings_blueprint)