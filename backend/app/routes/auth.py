from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import User
from flask_jwt_extended import create_access_token
from argon2 import PasswordHasher

auth_bp = Blueprint("auth", __name__)
ph = PasswordHasher()


def generate_user_id(name, phone):
    return phone[-4:] + name[:3].capitalize()


@auth_bp.post("/register")
def register():
    data = request.json
    name = data["name"]
    phone = data["phone"]
    password = ph.hash(data["password"])

    user_id = generate_user_id(name, phone)
    user = User(
        id=user_id,
        name=name,
        phone=phone,
        password=password,
        role=data["role"],
        age=data.get("age"),
        gender=data.get("gender"),
        degrees=data.get("degrees"),
        specialization=data.get("specialization"),
        experience=data.get("experience"),
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User Registered", "id": user_id}), 201


@auth_bp.post("/login")
def login():
    data = request.json
    phone = data["phone"]
    password = data["password"]

    user = User.query.filter_by(phone=phone).first()
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    try:
        ph.verify(user.password, password)
    except:
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity={"id": user.id, "role": user.role})
    return jsonify({"token": token, "role": user.role, "id": user.id})
