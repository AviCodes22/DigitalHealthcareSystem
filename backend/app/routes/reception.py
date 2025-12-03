from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from . import role_required
from ..extensions import db
from ..models import Appointment

reception_bp = Blueprint("reception", __name__)


@reception_bp.post("/next")
@jwt_required()
@role_required("reception")
def next_patient():
    nxt = Appointment.query.filter_by(status="Waiting").order_by(Appointment.id.asc()).first()

    if not nxt:
        return jsonify({"message": "No patients waiting"})

    nxt.status = "In-Consultation"
    db.session.commit()

    return jsonify({"patient_id": nxt.patient_id, "doctor_id": nxt.doctor_id})
