from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Tabla Many-to-Many para likes
likes = db.Table('likes',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('locales_id', db.Integer, db.ForeignKey('locales.id'), primary_key=True)
)

# TABLA PARA REGISTRO DE USUARIO
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    apellido = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    foto_user = db.Column(db.String(200), nullable=True)
    password = db.Column(db.String(80), nullable=False)

    localesfav = db.relationship(
        'Locales',
        secondary=likes,
        lazy='subquery',
        backref=db.backref('usuarios_que_dieron_like', lazy=True)
    )
    
    reservas = db.relationship(
        'Reserva',
        back_populates='user',
        cascade='all, delete-orphan',
        overlaps="user"  # ✅ Añadido para evitar conflictos
    )

    def __repr__(self):
        return f'<User {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "email": self.email,
            "foto_user": self.foto_user,
            "likes": [favorite.serialize() for favorite in self.localesfav],
            "reservations": [reserva.serialize() for reserva in self.reservas]
        }

# TABLA PARA REGISTRO DE RESTAURANTE
class Locales(db.Model):
    __tablename__ = 'locales'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    tipo_local = db.Column(db.String(80), nullable=False)
    descripcion = db.Column(db.String(250), nullable=False)
    precio = db.Column(db.Integer, nullable=True)
    foto = db.Column(db.String(500), nullable=True)

    reservas = db.relationship(
        'Reserva',
        back_populates='local',
        cascade='all, delete-orphan',
        overlaps="local"  # ✅ Añadido para evitar conflictos
    )

    def __repr__(self):
        return f'<Locales {self.id} - {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "tipo_local": self.tipo_local,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "foto": self.foto
        }

# TABLA DE DIRECCIÓN
class Direccion(db.Model):
    __tablename__ = 'direccion'
    id = db.Column(db.Integer, primary_key=True)
    barrio = db.Column(db.String(120), nullable=False)
    calle = db.Column(db.String(120), nullable=False)
    numero = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Direccion {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "barrio": self.barrio,
            "calle": self.calle,
            "numero": self.numero
        }

# TABLA DE RESERVAS INDIVIDUALES
class Reserva(db.Model):
    __tablename__ = 'reserva'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    local_id = db.Column(db.Integer, db.ForeignKey('locales.id'), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    hora = db.Column(db.String(10), nullable=False)
    comensales = db.Column(db.Integer, nullable=False)

    user = db.relationship('User', back_populates='reservas', overlaps="reservas")
    local = db.relationship('Locales', back_populates='reservas', overlaps="reservas")

    def __repr__(self):
        return f'<Reserva {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "local_id": self.local_id,
            "local_nombre": self.local.nombre,  # nombre del restaurante correcto
            "foto": self.local.foto,            # foto del restaurante correcto
            "fecha": self.fecha,
            "hora": self.hora,
            "comensales": self.comensales
        }
    