from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Locales, Direccion, Reserva
from api.utils import generate_sitemap, APIException
import json
import datetime
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

# === RESTAURANTES ===
@api.route('/restaurantes', methods=['GET'])
def get_restaurantes():
    restaurantes = Locales.query.all()
    all_restaurantes = list(map(lambda x: x.serialize(), restaurantes))
    return jsonify(all_restaurantes), 200

# === LOGIN ===
@api.route("/login", methods=["POST"])
def login():
    email, password, type = request.json.get('email', None), request.json.get('password', None), request.json.get('type', None)
    if not (email and password):
        return jsonify({'message': 'Data not provided'}), 400

    user = Locales.query.filter_by(email=email).one_or_none() if type else User.query.filter_by(email=email).one_or_none()
    if not user or password != user.password:
        return jsonify({"msg": "Bad username or password"}), 401

    expired = datetime.timedelta(minutes=240)
    access_token = create_access_token(identity=email, expires_delta=expired)
    return jsonify({"access_token": access_token, "type": type})

# === PERFIL USUARIO ===
@api.route("/profile", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    return jsonify(user.serialize()), 200

# === PERFIL RESTAURANTE ===
@api.route("/profile-restaurante", methods=["GET"])
@jwt_required()
def profile_protected():
    current_local = get_jwt_identity()
    local = Locales.query.filter_by(email=current_local).first()
    return jsonify(local.serialize()), 200

# === REGISTRO USUARIO ===
@api.route('/user', methods=['POST'])   
def create_new_user():
    body = json.loads(request.data)
    new_user = User(
        nombre=body["nombre"],
        apellido=body["apellido"],
        email=body["email"],
        password=body["password"]
    )
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=body["email"])
    return jsonify(access_token=access_token), 201

# === REGISTRO LOCAL ===
@api.route('/locales', methods=['POST'])   
def create_new_user_locales():
    body = json.loads(request.data)
    new_user_local = Locales(
        nombre=body["nombre"],
        email=body["email"],
        password=body["password"],
        tipo_local=body["tipo_local"],
        descripcion=body["descripcion"]
    )
    db.session.add(new_user_local)
    db.session.commit()
    access_token = create_access_token(identity=body["email"])
    return jsonify(access_token=access_token)

# === FAVORITOS ===
@api.route('/favlocales/<int:local_id>', methods=['POST', 'DELETE'])
@jwt_required()
def save_fav_local(local_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    local = Locales.query.get(local_id)

    if request.method == 'POST':
        if local not in user.localesfav:
            user.localesfav.append(local)
            db.session.commit()
            return jsonify({'response': "Favorito añadido"}), 200
        return jsonify({"response": "Ya tienes este local como favorito"}), 208

    if request.method == 'DELETE':
        user.localesfav.remove(local)
        db.session.commit()
        updated_favs = [fav.serialize() for fav in user.localesfav]
        return jsonify(updated_favs), 200

@api.route('/user/favoritos', methods=['GET'])
@jwt_required()
def get_fav_list():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    favs = [fav.serialize() for fav in user.localesfav] if user else []
    return jsonify(favs), 200

# === CREAR RESERVA ===
@api.route('/reserva', methods=['POST'])
@jwt_required()
def create_reserva():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()
    nuevo_local_id = data.get("id")

    # Verificar si usuario ya tiene una reserva para otro restaurante
    reserva_existente = Reserva.query.filter(
        Reserva.user_id == user.id,
        Reserva.local_id != nuevo_local_id
    ).first()

    if reserva_existente:
        return jsonify({"error": "Ya tienes una reserva activa en otro restaurante. Por favor cancela esa reserva antes de crear una nueva."}), 400

    nueva_reserva = Reserva(
        user_id=user.id,
        local_id=nuevo_local_id,
        fecha=data.get("date"),
        hora=data.get("hora"),
        comensales=data.get("comensales")
    )

    db.session.add(nueva_reserva)
    db.session.commit()

    return jsonify({"msg": "Reserva creada correctamente", "reserva": nueva_reserva.serialize()}), 201





# === OBTENER RESERVAS DEL USUARIO ===
@api.route('/user/reserva', methods=['GET'])
@jwt_required()
def get_reservas_list():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()

    # Cargar reservas con join a Locales para evitar que repita el primero
    reservas = Reserva.query.filter_by(user_id=user.id).join(Locales).all()

    return jsonify([reserva.serialize() for reserva in reservas]), 200


# === AÑADIR PRECIO AL LOCAL ===
@api.route('/addPrice/<int:id>', methods=['PUT'])
@jwt_required()
def edit_precio_local(id):
    local = Locales.query.get(id)
    keys = ["nombre", "email", "password", "tipo_local", "descripcion", "precio"]
    for key in keys:
        val = request.json.get(key)
        if val is not None:
            setattr(local, key, val)
    db.session.commit()
    return jsonify({'results': local.serialize()}), 201

# === AÑADIR FOTO AL LOCAL ===
@api.route('/addPhoto/<int:id>', methods=['PUT'])
@jwt_required()
def add_foto_local(id):
    local = Locales.query.get(id)
    keys = ["nombre", "email", "password", "tipo_local", "descripcion", "precio", "foto"]
    for key in keys:
        val = request.json.get(key)
        if val is not None:
            setattr(local, key, val)
    db.session.commit()
    return jsonify({'results': local.serialize()}), 201

# === MODIFICAR INFO GENERAL DEL LOCAL ===
@api.route('/editInfoRestaurantes/<int:id>', methods=['PUT'])
@jwt_required()
def edit_info_general_locales(id):
    local = Locales.query.get(id)
    keys = ["nombre", "email", "password", "tipo_local", "descripcion", "precio", "foto"]
    for key in keys:
        val = request.json.get(key)
        if val is not None:
            setattr(local, key, val)
    db.session.commit()
    return jsonify({'results': local.serialize()}), 201
