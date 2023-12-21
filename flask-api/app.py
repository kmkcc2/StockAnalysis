# Importing the necessary modules and libraries
from flask import Flask, request, Response
from flask_migrate import Migrate
from middleware import verifyAdminToken
from routes.users_blueprint import users_blueprint as user_bp
from routes.trendings_blueprint import trendings_blueprint as trending_bp
from routes.backup_blueprint import backup_blueprint as backup_bp
from routes.ticker_blueprint import ticker_blueprint as ticker_bp
from routes.company_database_blueprint import company_database_blueprint as company_database_bp
from routes.transaction_blueprint import transaction_blueprint as transaction_bp
from models.user import db
import services.data as dt
from flask_cors import CORS, cross_origin
app = Flask(__name__)

app.config.from_object('config')
app.config['SQLALCHEMY_POOL_SIZE'] = 100

db.init_app(app)
migrate = Migrate(app, db)


app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(trending_bp, url_prefix='/api/trendings')
app.register_blueprint(backup_bp, url_prefix='/api/backup/')
app.register_blueprint(ticker_bp, url_prefix='/api/ticker/<symbol_>')
app.register_blueprint(company_database_bp, url_prefix='/api/companies/')
app.register_blueprint(transaction_bp, url_prefix='/api/transactions/')

CORS(app , resources={r"/api/*": {"origins": "*"}}, methods={'GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'})
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res

app.config['CORS_HEADERS'] = 'application/json'
@cross_origin
@app.route('/loadseed')
@verifyAdminToken
def index():
    dt.loadSeed()
    return {"info": "seed laoded"}

if __name__ == '__main__':
    app.debug = True
    app.run()