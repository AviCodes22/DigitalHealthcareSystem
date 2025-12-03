import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// --- Types ---

export type Role = "patient" | "doctor" | "receptionist" | "pharmacy" | "radiology";

export interface User {
  id: string;
  name: string;
  role: Role;
  phone?: string;
  password?: string; // Mock password
}

export interface Patient extends User {
  role: "patient";
  age: number;
  gender: "Male" | "Female" | "Other";
  selfReportedHistory: string;
  bloodGroup?: string;
}

export interface Doctor extends User {
  role: "doctor";
  specialty: string;
  qualifications: string;
}

export interface QueueItem {
  id: string;
  patientId: string;
  doctorId: string;
  status: "waiting" | "in-consultation" | "completed";
  timestamp: Date;
}

export interface Medicine {
  name: string;
  dosage: string; // e.g., "1-0-1"
  frequency: string; // e.g., "After Food"
  duration: string; // e.g., "5 Days"
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  vitals: {
    height: string;
    weight: string;
    bp: string;
    temperature: string;
  };
  medicines: Medicine[];
  notes?: string;
}

export interface MedicalHistoryItem {
  id: string;
  patientId: string;
  date: string;
  title: string;
  description: string;
  type: "prescription" | "lab_report" | "note";
  fileUrl?: string; // Mock URL
}

// --- Mock Data ---

const MOCK_DOCTORS: Doctor[] = [
  { id: "doc1", name: "Dr. Argha Chakraborty", role: "doctor", specialty: "Cardiology", qualifications: "MBBS, MD" },
  { id: "doc2", name: "Dr. Sarah Smith", role: "doctor", specialty: "General Physician", qualifications: "MBBS" },
  { id: "doc3", name: "Dr. James Wilson", role: "doctor", specialty: "Pediatrics", qualifications: "MBBS, DCH" },
];

const MOCK_RECEPTIONISTS: User[] = [
  { id: "rec1", name: "Receptionist 1", role: "receptionist" },
];

const MOCK_PHARMACY: User[] = [
  { id: "phar1", name: "Main Pharmacy", role: "pharmacy" },
];

const MOCK_RADIOLOGY: User[] = [
  { id: "rad1", name: "Central Lab", role: "radiology" },
];

// Initial Mock Patients
const MOCK_PATIENTS: Patient[] = [
  {
    id: "9999Joh",
    name: "John Doe",
    role: "patient",
    phone: "9876549999",
    age: 34,
    gender: "Male",
    selfReportedHistory: " mild asthma, allergic to penicillin.",
    bloodGroup: "O+",
  },
];

// --- Context ---

interface HealthcareContextType {
  currentUser: User | null;
  users: User[];
  patients: Patient[];
  doctors: Doctor[];
  queue: QueueItem[];
  prescriptions: Prescription[];
  medicalHistory: MedicalHistoryItem[];
  
  login: (role: Role, id?: string) => void;
  logout: () => void;
  registerPatient: (data: Omit<Patient, "role" | "id">) => void;
  addToQueue: (patientId: string, doctorId: string) => void;
  updateQueueStatus: (queueId: string, status: QueueItem["status"]) => void;
  addPrescription: (prescription: Omit<Prescription, "id" | "date">) => void;
  getPatientHistory: (patientId: string) => MedicalHistoryItem[];
}

const HealthcareContext = createContext<HealthcareContextType | undefined>(undefined);

export function HealthcareProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryItem[]>([
    {
      id: "hist1",
      patientId: "9999Joh",
      date: "2023-10-15",
      title: "Previous Consultation",
      description: "Diagnosed with mild fever.",
      type: "note"
    }
  ]);

  // Combine all users for easier lookup
  const users = [...MOCK_DOCTORS, ...MOCK_RECEPTIONISTS, ...MOCK_PHARMACY, ...MOCK_RADIOLOGY, ...patients];

  const login = (role: Role, id?: string) => {
    if (id) {
      const user = users.find((u) => u.id === id && u.role === role);
      if (user) setCurrentUser(user);
    } else {
      // For demo purposes, if no ID provided for staff, pick the first one
      if (role === "doctor") setCurrentUser(MOCK_DOCTORS[0]);
      if (role === "receptionist") setCurrentUser(MOCK_RECEPTIONISTS[0]);
      if (role === "pharmacy") setCurrentUser(MOCK_PHARMACY[0]);
      if (role === "radiology") setCurrentUser(MOCK_RADIOLOGY[0]);
    }
  };

  const logout = () => setCurrentUser(null);

  const registerPatient = (data: Omit<Patient, "role" | "id">) => {
    // ID Generation Logic: Last 4 digits of Phone + First 3 chars of Name
    const phoneSuffix = data.phone?.slice(-4) || "0000";
    const namePrefix = data.name.slice(0, 3);
    const newId = `${phoneSuffix}${namePrefix}`;

    const newPatient: Patient = {
      ...data,
      id: newId,
      role: "patient",
    };

    setPatients([...patients, newPatient]);
    setCurrentUser(newPatient); // Auto login after register
  };

  const addToQueue = (patientId: string, doctorId: string) => {
    const newItem: QueueItem = {
      id: `q-${Date.now()}`,
      patientId,
      doctorId,
      status: "waiting",
      timestamp: new Date(),
    };
    setQueue([...queue, newItem]);
  };

  const updateQueueStatus = (queueId: string, status: QueueItem["status"]) => {
    setQueue(queue.map(q => q.id === queueId ? { ...q, status } : q));
  };

  const addPrescription = (data: Omit<Prescription, "id" | "date">) => {
    const newPrescription: Prescription = {
      ...data,
      id: `rx-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setPrescriptions([newPrescription, ...prescriptions]);
    
    // Also add to medical history
    const newHistoryItem: MedicalHistoryItem = {
      id: `hist-${Date.now()}`,
      patientId: data.patientId,
      date: newPrescription.date,
      title: `Prescription - ${MOCK_DOCTORS.find(d => d.id === data.doctorId)?.name}`,
      description: `Diagnosis: ${data.diagnosis}`,
      type: "prescription"
    };
    setMedicalHistory([newHistoryItem, ...medicalHistory]);
  };

  const getPatientHistory = (patientId: string) => {
    return medicalHistory.filter(h => h.patientId === patientId);
  };

  return (
    <HealthcareContext.Provider value={{
      currentUser,
      users,
      patients,
      doctors: MOCK_DOCTORS,
      queue,
      prescriptions,
      medicalHistory,
      login,
      logout,
      registerPatient,
      addToQueue,
      updateQueueStatus,
      addPrescription,
      getPatientHistory
    }}>
      {children}
    </HealthcareContext.Provider>
  );
}

export function useHealthcare() {
  const context = useContext(HealthcareContext);
  if (!context) {
    throw new Error("useHealthcare must be used within a HealthcareProvider");
  }
  return context;
}
