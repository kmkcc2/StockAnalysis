import os

# Each Flask web application contains a secret key which used to sign session cookies for protection against cookie data tampering.
SECRET_KEY = 'e67e72111b363d80c8124d28193926000980e1211c7986cacbd26aacc5528d48'

# Grabs the folder where the script runs.
# In my case it is, "F:\DataScience_Ai\hobby_projects\mvc_project\src"
basedir = os.path.abspath(os.path.dirname(__file__))

# Enable debug mode, that will refresh the page when you make changes.
DEBUG = True

# Connect to the MYSQL database
SQLALCHEMY_DATABASE_URI = "postgresql://postgres:admin@localhost:5432/stockData"
# Turn off the Flask-SQLAlchemy event system and warning
SQLALCHEMY_TRACK_MODIFICATIONS = False
