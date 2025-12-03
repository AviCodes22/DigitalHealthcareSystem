import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";

const API = "http://localhost:5000"; // Flask backend

interface User {
  id: string;
  role: string;
  token: string;
}

interface HealthcareContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const HealthcareContext = createContext<HealthcareContextType | null>(null);

export const HealthcareProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (phone: string, password: string) => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        phone,
        password,
      });

      const token = res.data.token;
      const role = res.data.role;
      const id = res.data.id;

      setUser({ token, role, id });

      localStorage.setItem(
        "healthcare_user",
        JSON.stringify({ token, role, id })
      );

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("healthcare_user");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <HealthcareContext.Provider value={{ user, login, logout }}>
      {children}
    </HealthcareContext.Provider>
  );
};

export const useHealthcare = () => {
  const ctx = useContext(HealthcareContext);
  if (!ctx) throw new Error("useHealthcare must be used inside HealthcareProvider");
  return ctx;
};
