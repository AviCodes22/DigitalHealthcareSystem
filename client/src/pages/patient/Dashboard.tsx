import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHealthcare } from "../../context/HealthcareContext";

const API = "http://localhost:5000";

export default function PatientDashboard() {
  const { user } = useHealthcare();
  const [history, setHistory] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [doctorId, setDoctorId] = useState("");

  const loadHistory = async () => {
    const res = await axios.get(`${API}/patient/history`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    setHistory(res.data);
  };

  const addHistory = async () => {
    await axios.post(
      `${API}/patient/add_history`,
      { note },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );
    setNote("");
    loadHistory();
  };

  const checkIn = async () => {
    if (!doctorId) return alert("Enter Doctor ID");
    await axios.post(
      `${API}/patient/checkin`,
      { doctor_id: doctorId },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );
    alert("Checked in successfully!");
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>Patient Dashboard</h2>

      <h3>Your Medical History</h3>
      <ul>
        {history.map((h, i) => (
          <li key={i}>{h.note}</li>
        ))}
      </ul>

      <textarea
        placeholder="Add new medical note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button onClick={addHistory}>Save Note</button>

      <h3>Check-In</h3>
      <input
        placeholder="Enter Doctor ID"
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
      />
      <button onClick={checkIn}>Check In</button>
    </div>
  );
}
