import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function PatientRegister() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [history, setHistory] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post(`${API}/auth/register`, {
        name,
        phone,
        password,
        role: "patient",
        age: Number(age),
        gender,
        self_reported_history: history, // backend stores it
      });
      alert("Registered successfully! Please login.");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Patient Registration</h2>

      <input placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
      <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <input placeholder="Age" onChange={(e) => setAge(e.target.value)} />

      <select onChange={(e) => setGender(e.target.value)}>
        <option>Gender</option>
        <option value="M">Male</option>
        <option value="F">Female</option>
      </select>

      <textarea
        placeholder="Previous Medical History"
        onChange={(e) => setHistory(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
