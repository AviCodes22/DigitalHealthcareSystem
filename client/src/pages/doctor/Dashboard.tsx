import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHealthcare } from "../../context/HealthcareContext";

const API = "http://localhost:5000";

export default function DoctorDashboard() {
  const { user } = useHealthcare();
  const [patient, setPatient] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [vitals, setVitals] = useState({ BP: "", Height: "" });
  const [medicines, setMedicines] = useState<any[]>([]);
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [hospital, setHospital] = useState({
    hospital_name: "",
    address: "",
    phone: "",
    website: "",
  });

  const loadCurrentPatient = async () => {
    try {
      const res = await axios.get(`${API}/doctor/current`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.data.id) setPatient(res.data);
      else setPatient(null);
    } catch (err) {
      console.log("No patient assigned");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      loadCurrentPatient();
    }, 3000); // poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: medName, dosage, frequency, duration },
    ]);
    setMedName("");
    setDosage("");
    setFrequency("");
    setDuration("");
  };

  const savePrescription = async () => {
    if (!patient) return alert("No patient to prescribe for");
    try {
      const res = await axios.post(
        `${API}/prescription/create`,
        {
          patient_id: patient.id,
          diagnosis,
          vitals,
          medicines,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      alert("Prescription saved!");

      window.open(`${API}/prescription/download/${res.data.id}`);
    } catch (err) {
      alert("Error creating prescription");
    }
  };

  const updateHospital = async () => {
    await axios.post(`${API}/hospital/update`, hospital, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    alert("Hospital info updated");
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Doctor Dashboard</h2>

      {patient ? (
        <>
          <h3>Current Patient</h3>
          <p>
            <strong>{patient.name}</strong> ({patient.age}/{patient.gender})
          </p>

          <h3>Vitals</h3>
          <input
            placeholder="BP"
            value={vitals.BP}
            onChange={(e) => setVitals({ ...vitals, BP: e.target.value })}
          />
          <input
            placeholder="Height"
            value={vitals.Height}
            onChange={(e) => setVitals({ ...vitals, Height: e.target.value })}
          />

          <h3>Diagnosis</h3>
          <textarea
            placeholder="Diagnosis..."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />

          <h3>Medicines</h3>
          <input
            placeholder="Medicine Name"
            value={medName}
            onChange={(e) => setMedName(e.target.value)}
          />
          <input
            placeholder="Dosage (e.g. 1-0-1)"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
          <input
            placeholder="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
          <input
            placeholder="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <button onClick={addMedicine}>Add Medicine</button>

          <ul>
            {medicines.map((m, i) => (
              <li key={i}>
                {m.name} — {m.dosage} — {m.frequency} — {m.duration}
              </li>
            ))}
          </ul>

          <button onClick={savePrescription}>Save & Download Prescription</button>
        </>
      ) : (
        <h3>No patient in consultation</h3>
      )}

      <hr />
      <h3>Hospital Profile</h3>

      <input
        placeholder="Hospital Name"
        value={hospital.hospital_name}
        onChange={(e) =>
          setHospital({ ...hospital, hospital_name: e.target.value })
        }
      />
      <input
        placeholder="Address"
        value={hospital.address}
        onChange={(e) => setHospital({ ...hospital, address: e.target.value })}
      />
      <input
        placeholder="Phone"
        value={hospital.phone}
        onChange={(e) => setHospital({ ...hospital, phone: e.target.value })}
      />
      <input
        placeholder="Website"
        value={hospital.website}
        onChange={(e) => setHospital({ ...hospital, website: e.target.value })}
      />
      <button onClick={updateHospital}>Save Hospital Details</button>
    </div>
  );
}
