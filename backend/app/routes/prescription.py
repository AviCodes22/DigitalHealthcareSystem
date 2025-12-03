from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import role_required
from ..extensions import db
from ..models import Prescription, User, HospitalProfile
from ..utils.pdf_generator import generate_prescription_pdf
import uuid, os

prescription_bp = Blueprint("prescription", __name__)


@prescription_bp.post("/create")
@jwt_required()
@role_required("doctor")
def create_prescription():
    user = get_jwt_identity()
    data = request.json

    p = Prescription(
        doctor_id=user["id"],
        patient_id=data["patient_id"],
        diagnosis=data["diagnosis"],
        vitals=data["vitals"],
        medicines=data["medicines"]
    )
    db.session.add(p)
    db.session.commit()

    return jsonify({"message": "Prescription created", "id": p.id})


@prescription_bp.get("/download/<pid>")
@jwt_required()
def download(pid):
    p = Prescription.query.get(pid)
    doctor = User.query.get(p.doctor_id)
    patient = User.query.get(p.patient_id)
    hospital = HospitalProfile.query.filter_by(doctor_id=doctor.id).first()

    filename = f"/tmp/prescription_{uuid.uuid4()}.pdf"
    generate_prescription_pdf(filename, doctor, hospital, patient, p)
    return send_file(filename, as_attachment=True)
