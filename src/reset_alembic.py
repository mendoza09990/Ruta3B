from api.models import db
from flask import Flask
from flask_migrate import Migrate
from api.models import db
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL").replace("postgres://", "postgresql://")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.engine.execute("DROP TABLE IF EXISTS alembic_version")
    print("✅ Tabla alembic_version eliminada correctamente.")
