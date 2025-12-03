from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import User, MedicalHistory, Appointment

patient_bp = Blueprint("patient", __name__)


@patient_bp.get("/history")
@jwt_required()
def history():
    user = get_jwt_identity()
    if user["role"] != "patient":
        return jsonify({"error": "Unauthorized"}), 403

    history = MedicalHistory.query.filter_by(patient_id=user["id"]).all()
    return jsonify([{"note": h.note, "file": h.file_path, "date": h.created_at} for h in history])


@patient_bp.post("/add_history")
@jwt_required()
def add_history():
    user = get_jwt_identity()
    data = request.json

    mh = MedicalHistory(patient_id=user["id"], note=data["note"], file_path=data.get("file_path"))
    db.session.add(mh)
    db.session.commit()

    return jsonify({"message": "Medical history added"})


@patient_bp.post("/checkin")
@jwt_required()
def checkin():
    user = get_jwt_identity()
    doctor_id = request.json["doctor_id"]

    appt = Appointment(patient_id=user["id"], doctor_id=doctor_id, status="Waiting")
    db.session.add(appt)
    db.session.commit()

    return jsonify({"message": "Checked in successfully"})
