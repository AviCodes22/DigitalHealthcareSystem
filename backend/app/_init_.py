from flask import Flask
from .extensions import db, migrate, jwt
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # register blueprints
    from .routes.auth import auth_bp
    from .routes.patient import patient_bp
    from .routes.doctor import doctor_bp
    from .routes.reception import reception_bp
    from .routes.hospital import hospital_bp
    from .routes.prescription import prescription_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(patient_bp, url_prefix="/patient")
    app.register_blueprint(doctor_bp, url_prefix="/doctor")
    app.register_blueprint(reception_bp, url_prefix="/reception")
    app.register_blueprint(hospital_bp, url_prefix="/hospital")
    app.register_blueprint(prescription_bp, url_prefix="/prescription")

    return app
