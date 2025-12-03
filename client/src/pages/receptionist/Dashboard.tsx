import React, { useState } from "react";
import axios from "axios";
import { useHealthcare } from "../../context/HealthcareContext";

const API = "http://localhost:5000";

export default function ReceptionistDashboard() {
  const { user } = useHealthcare();
  const [lastCalled, setLastCalled] = useState<any>(null);

  const nextPatient = async () => {
    try {
      const res = await axios.post(
        `${API}/reception/next`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (res.data.patient_id) {
        setLastCalled(res.data);
        alert(`Next patient sent to doctor!`);
      } else {
        alert("No patients in queue!");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching next patient");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Reception Dashboard</h2>

      <button onClick={nextPatient} style={{ marginBottom: 20 }}>
        Call Next Patient
      </button>

      {lastCalled && (
        <div>
          <h3>Last Called:</h3>
          <p>Patient ID: {lastCalled.patient_id}</p>
          <p>Doctor ID: {lastCalled.doctor_id}</p>
        </div>
      )}
    </div>
  );
}
