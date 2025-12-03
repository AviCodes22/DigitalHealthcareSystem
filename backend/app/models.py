from .extensions import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # patient / doctor / reception / medical / radiology
    phone = db.Column(db.String(15), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    degrees = db.Column(db.String(255))  # doctors only
    specialization = db.Column(db.String(120))
    experience = db.Column(db.Integer)
    hospital_profile = db.relationship("HospitalProfile", backref="doctor", uselist=False)


class HospitalProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.String(20), db.ForeignKey("users.id"), unique=True)
    hospital_name = db.Column(db.String(200), default="My Hospital")
    address = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    website = db.Column(db.String(200))


class MedicalHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.String(20), db.ForeignKey("users.id"))
    note = db.Column(db.Text)
    file_path = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.String(20), db.ForeignKey("users.id"))
    doctor_id = db.Column(db.String(20), db.ForeignKey("users.id"))
    status = db.Column(db.String(50), default="Waiting")  # Waiting / In-Consultation / Completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Prescription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.String(20), db.ForeignKey("users.id"))
    patient_id = db.Column(db.String(20), db.ForeignKey("users.id"))
    diagnosis = db.Column(db.Text)
    vitals = db.Column(JSON)
    medicines = db.Column(JSON)  # [{name, dosage, frequency, duration}]
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
