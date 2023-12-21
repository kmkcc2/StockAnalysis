from flask import Blueprint
from controllers.backup_controller import index, get_current_download_status
from flask_cors import CORS


backup_blueprint = Blueprint('backup_blueprint', __name__)

backup_blueprint.route('/<period_>', methods=['GET'])(index)
backup_blueprint.route('/status', methods=['GET'])(get_current_download_status)
CORS(backup_blueprint)
