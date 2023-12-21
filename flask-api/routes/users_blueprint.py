from flask import Blueprint
from controllers.user_controller import get_all, get_one, login, register, patch_one, find_match, password_reset, generate_reset_token, deleteUser
from flask_cors import CORS

users_blueprint = Blueprint('users_blueprint', __name__)


users_blueprint.route('/', methods=['GET'])(get_all)
users_blueprint.route('/<user_id>', methods=['GET'])(get_one)
users_blueprint.route('/<user_id>', methods=['DELETE'])(deleteUser)
users_blueprint.route('/login', methods=['POST'])(login)
users_blueprint.route('/register', methods=['POST'])(register)
users_blueprint.route('/<user_id>', methods=['PATCH'])(patch_one)
users_blueprint.route('/tips/<pattern>', methods=['GET'])(find_match)
users_blueprint.route('/passwordReset', methods=['POST'])(password_reset)
users_blueprint.route('/generatePasswordResetToken', methods=['POST'])(generate_reset_token)

CORS(users_blueprint)