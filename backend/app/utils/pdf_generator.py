from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from datetime import datetime

def generate_prescription_pdf(filename, doctor, hospital, patient, prescription):
    c = canvas.Canvas(filename, pagesize=A4)
    width, height = A4

    # ===== HEADER =====
    c.setFont("Helvetica-Bold", 24)
    c.drawString(2 * cm, height - 2 * cm, hospital.hospital_name.upper())

    c.setFont("Helvetica", 10)
    c.drawString(2 * cm, height - 2.7 * cm, hospital.address or "")
    c.drawString(2 * cm, height - 3.3 * cm, f"Phone: {hospital.phone or ''}")
    c.drawString(2 * cm, height - 3.9 * cm, f"Website: {hospital.website or ''}")

    # ===== DOCTOR =====
    c.setFont("Helvetica-Bold", 12)
    c.drawRightString(width - 2 * cm, height - 2.5 * cm, doctor.name)

    c.setFont("Helvetica", 9)
    c.drawRightString(width - 2 * cm, height - 3.1 * cm, doctor.degrees or "")
    c.drawRightString(width - 2 * cm, height - 3.7 * cm, doctor.specialization or "")

    # ===== PATIENT ROW =====
    y = height - 5.2 * cm
    c.setFont("Helvetica-Bold", 10)
    c.drawString(2 * cm, y, f"Patient: {patient.name}")
    c.drawString(8 * cm, y, f"Age/Sex: {patient.age}/{patient.gender}")
    c.drawString(13 * cm, y, f"Date: {datetime.now().strftime('%d-%m-%Y')}")
    y -= 0.7 * cm
    c.setFont("Helvetica", 10)
    c.drawString(2 * cm, y, f"Phone: {patient.phone}")

    # ===== VITALS =====
    y -= 1.2 * cm
    c.setFont("Helvetica-Bold", 11)
    c.drawString(2 * cm, y, "Vitals:")
    y -= 0.7 * cm
    c.setFont("Helvetica", 10)
    for key, value in prescription.vitals.items():
        c.drawString(2.5 * cm, y, f"{key}: {value}")
        y -= 0.5 * cm

    # ===== DIAGNOSIS =====
    y -= 1 * cm
    c.setFont("Helvetica-Bold", 11)
    c.drawString(2 * cm, y, "Diagnosis:")
    y -= 0.7 * cm
    c.setFont("Helvetica", 10)
    c.drawString(2.5 * cm, y, prescription.diagnosis)

    # ===== MEDICINES =====
    y -= 1.4 * cm
    c.setFont("Helvetica-Bold", 11)
    c.drawString(2 * cm, y, "Rx")

    y -= 1 * cm
    c.setFont("Helvetica-Bold", 10)
    c.drawString(2 * cm, "No.")
    c.drawString(3 * cm, "Medicine")
    c.drawString(9 * cm, "Dosage")
    c.drawString(12 * cm, "Timing")
    c.drawString(16 * cm, "Duration")

    y -= 0.9 * cm
    c.setFont("Helvetica", 10)
    for i, med in enumerate(prescription.medicines, start=1):
        c.drawString(2 * cm, y, str(i))
        c.drawString(3 * cm, y, med["name"])
        c.drawString(9 * cm, y, med["dosage"])
        c.drawString(12 * cm, y, med["frequency"])
        c.drawString(16 * cm, y, med["duration"])
        y -= 0.7 * cm

    # ===== SIGNATURE =====
    c.setFont("Helvetica-Bold", 11)
    c.drawRightString(width - 2 * cm, 3 * cm, "Doctor's Signature")

    # ===== DISCLAIMER =====
    c.setFont("Helvetica", 8)
    c.drawString(2 * cm, 2.2 * cm, "NOTE: This prescription is generated for the mentioned patient only.")
    c.drawString(2 * cm, 1.7 * cm, "Consult your doctor before taking any medication.")

    c.save()
