from app import create_app
from app.extensions import db
from app.models import User, HospitalProfile, Prescription
from argon2 import PasswordHasher


def main():
    app = create_app()
    with app.app_context():
        ph = PasswordHasher()

        # ----- Seed Doctor -----
        doctor_phone = "9999000001"
        doctor = User.query.filter_by(phone=doctor_phone).first()
        if not doctor:
            doctor = User(
                id="0001Avd",
                name="Dr. Avdhoot Patil",
                role="doctor",
                phone=doctor_phone,
                password=ph.hash("Avdhoot123"),
                age=40,
                gender="M",
                degrees="MBBS, MD",
                specialization="Cardiologist",
                experience=15,
            )
            db.session.add(doctor)
            db.session.commit()
            print("Seeded doctor:", doctor.name)

        # ----- Seed Hospital Profile -----
        hospital = HospitalProfile.query.filter_by(doctor_id=doctor.id).first()
        if not hospital:
            hospital = HospitalProfile(
                doctor_id=doctor.id,
                hospital_name="KEM",
                address="Shivaji Nagar, Pune",
                phone="020 445 6897",
                website="www.dravdhoot.com",
            )
            db.session.add(hospital)
            db.session.commit()
            print("Seeded hospital profile for doctor:", doctor.name)

        # ----- Seed Patient -----
        patient_phone = "9999000002"
        patient = User.query.filter_by(phone=patient_phone).first()
        if not patient:
            patient = User(
                id="0002Pat",
                name="Test Patient",
                role="patient",
                phone=patient_phone,
                password=ph.hash("Test1234"),
                age=30,
                gender="M",
            )
            db.session.add(patient)
            db.session.commit()
            print("Seeded sample patient:", patient.name)

        # ----- Seed Sample Prescription -----
        existing = Prescription.query.filter_by(doctor_id=doctor.id, patient_id=patient.id).first()
        if not existing:
            sample_prescription = Prescription(
                doctor_id=doctor.id,
                patient_id=patient.id,
                diagnosis="Chest pain with mild discomfort.",
                vitals={"BP": "120/80", "Height": "170 cm"},
                medicines=[
                    {
                        "name": "Tab. Atorvastatin 10mg",
                        "dosage": "1-0-0",
                        "frequency": "After food",
                        "duration": "30 days",
                    },
                    {
                        "name": "Tab. Aspirin 75mg",
                        "dosage": "0-1-0",
                        "frequency": "After dinner",
                        "duration": "15 days",
                    },
                ],
            )
            db.session.add(sample_prescription)
            db.session.commit()
            print("Seeded sample prescription for patient:", patient.name)

        print("Seeding completed.")


if __name__ == "__main__":
    main()
