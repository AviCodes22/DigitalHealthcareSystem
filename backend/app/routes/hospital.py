from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import role_required
from ..extensions import db
from ..models import HospitalProfile

hospital_bp = Blueprint("hospital", __name__)


@hospital_bp.post("/update")
@jwt_required()
@role_required("doctor")
def update_hospital():
    user = get_jwt_identity()
    data = request.json

    hp = HospitalProfile.query.filter_by(doctor_id=user["id"]).first()
    if not hp:
        hp = HospitalProfile(doctor_id=user["id"])
        db.session.add(hp)

    hp.hospital_name = data.get("hospital_name", hp.hospital_name)
    hp.address = data.get("address", hp.address)
    hp.phone = data.get("phone", hp.phone)
    hp.website = data.get("website", hp.website)

    db.session.commit()
    return jsonify({"message": "Hospital profile updated successfully"})
