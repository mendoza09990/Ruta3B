"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import json
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from flask_jwt_extended import JWTManager

# === FLASK SETUP ===
app = Flask(__name__)
app.url_map.strict_slashes = False

# === STATIC FILES ===
ENV = os.getenv("FLASK_ENV")
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')

# === DATABASE CONFIG ===
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# === CORS SETUP ===
frontend_origin = f"https://3000-{os.getenv('GITPOD_WORKSPACE_ID')}.{os.getenv('GITPOD_WORKSPACE_CLUSTER_HOST')}"
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": frontend_origin}})

# === JWT SETUP ===
app.config["JWT_SECRET_KEY"] = "super-secret"  # Cambia esto por una clave segura
jwt = JWTManager(app)

# === ADMIN Y COMANDOS ===
setup_admin(app)
setup_commands(app)

# === RUTAS ===
app.register_blueprint(api, url_prefix='/api')

# === ERRORES PERSONALIZADOS ===
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# === SITEMAP ===
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# === CUALQUIER OTRA RUTA ===
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

# === MAIN ===
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
