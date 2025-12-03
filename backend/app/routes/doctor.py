from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import role_required
from ..models import Appointment, User

doctor_bp = Blueprint("doctor", __name__)


@doctor_bp.get("/current")
@jwt_required()
@role_required("doctor")
def current():
    user = get_jwt_identity()
    appt = Appointment.query.filter_by(doctor_id=user["id"], status="In-Consultation").first()

    if not appt:
        return jsonify({"message": "No patient assigned"})

    patient = User.query.get(appt.patient_id)
    return jsonify({"id": patient.id, "name": patient.name, "age": patient.age, "gender": patient.gender})
