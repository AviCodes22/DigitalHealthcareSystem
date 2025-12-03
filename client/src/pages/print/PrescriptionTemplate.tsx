import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useHealthcare } from "@/context/HealthcareContext";
import { Loader2 } from "lucide-react";
import generatedImage from '@assets/generated_images/pillpal_logo.png';

export default function PrescriptionTemplate() {
  const [, params] = useRoute("/print/prescription/:id");
  const { prescriptions, doctors, patients } = useHealthcare();
  const [isReady, setIsReady] = useState(false);

  const prescriptionId = params?.id;
  const prescription = prescriptions.find(p => p.id === prescriptionId) || prescriptions[0]; 
  
  const doctor = prescription ? doctors.find(d => d.id === prescription.doctorId) : null;
  const patient = prescription ? patients.find(p => p.id === prescription.patientId) : null;

  useEffect(() => {
    if (prescription && doctor && patient) {
      setIsReady(true);
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [prescription, doctor, patient]);

  if (!prescription || !doctor || !patient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-slate-400" />
          <p className="text-slate-500">Loading prescription details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-8 md:p-16 print:p-0 font-sans text-slate-900">
      <div className="max-w-[21cm] mx-auto bg-white print:max-w-none">
        
        {/* Header / Letterhead */}
        <header className="border-b-2 border-primary pb-6 mb-8 flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14">
               <img src={generatedImage} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary tracking-tight">PillPal</h1>
              <p className="text-xs tracking-widest uppercase text-slate-500 font-medium mt-1">Smart Healthcare Systems</p>
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-900">{doctor.name}</h2>
            <p className="text-sm text-slate-600 font-medium">{doctor.qualifications}</p>
            <p className="text-sm text-slate-500">{doctor.specialty}</p>
          </div>
        </header>

        {/* Patient Info Row */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center text-sm mb-10 print:bg-transparent print:border-y print:border-x-0 print:rounded-none print:border-slate-300">
          <div className="flex gap-8">
            <p><span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mr-2 block mb-0.5">Patient Name</span> <span className="text-base font-semibold">{patient.name}</span></p>
            <p><span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mr-2 block mb-0.5">Age/Sex</span> <span className="text-base font-semibold">{patient.age} / {patient.gender}</span></p>
            <p><span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mr-2 block mb-0.5">Patient ID</span> <span className="text-base font-mono font-semibold">{patient.id}</span></p>
          </div>
          <div className="text-right">
            <p><span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mr-2 block mb-0.5">Date</span> <span className="text-base font-semibold">{prescription.date}</span></p>
          </div>
        </div>

        {/* Vitals & Diagnosis */}
        <div className="mb-10 grid grid-cols-3 gap-8">
          <div className="col-span-1 space-y-1">
             <h4 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-2">Vitals</h4>
             <div className="flex justify-between border-b border-slate-100 py-1">
               <span className="text-slate-500">Height</span>
               <span className="font-medium">{prescription.vitals.height} cm</span>
             </div>
             <div className="flex justify-between border-b border-slate-100 py-1">
               <span className="text-slate-500">Weight</span>
               <span className="font-medium">{prescription.vitals.weight} kg</span>
             </div>
             <div className="flex justify-between border-b border-slate-100 py-1">
               <span className="text-slate-500">BP</span>
               <span className="font-medium">{prescription.vitals.bp}</span>
             </div>
          </div>
          <div className="col-span-2">
            <h4 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-2">Diagnosis</h4>
            <p className="text-lg font-medium leading-relaxed text-slate-800">{prescription.diagnosis}</p>
          </div>
        </div>

        {/* Rx Symbol */}
        <div className="text-5xl font-serif font-bold italic mb-6 text-primary/20">Rx</div>

        {/* Medicine Table */}
        <table className="w-full text-left border-collapse mb-16">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="py-3 font-bold text-xs uppercase text-slate-400 tracking-wider w-12">#</th>
              <th className="py-3 font-bold text-xs uppercase text-slate-400 tracking-wider">Medicine Name</th>
              <th className="py-3 font-bold text-xs uppercase text-slate-400 tracking-wider w-32">Dosage</th>
              <th className="py-3 font-bold text-xs uppercase text-slate-400 tracking-wider w-40">Frequency</th>
              <th className="py-3 font-bold text-xs uppercase text-slate-400 tracking-wider w-32">Duration</th>
            </tr>
          </thead>
          <tbody>
            {prescription.medicines.map((med, idx) => (
              <tr key={idx} className="border-b border-slate-50">
                <td className="py-4 text-slate-400 font-medium">{idx + 1}</td>
                <td className="py-4 font-bold text-slate-800 text-lg">{med.name}</td>
                <td className="py-4 font-mono text-sm font-medium text-primary">{med.dosage}</td>
                <td className="py-4 text-sm font-medium text-slate-600">{med.frequency}</td>
                <td className="py-4 text-sm font-medium text-slate-600">{med.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer / Signature */}
        <div className="mt-auto pt-12 flex justify-end">
          <div className="text-right w-64 border-t-2 border-slate-100 pt-4">
            <div className="h-12 mb-2">
               {/* Signature placeholder space */}
            </div>
            <p className="font-bold text-slate-900">{doctor.name}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{doctor.qualifications}</p>
          </div>
        </div>

        {/* Bottom Sponsor / Disclaimer Area */}
        <div className="mt-12 pt-6 border-t border-slate-100 text-center text-xs text-slate-400 print:fixed print:bottom-8 print:left-0 print:w-full bg-white">
          <p className="mb-1 font-medium text-slate-500">Powered by PillPal Digital Systems</p>
          <p>Consultation valid for 7 days. Not valid for medico-legal purposes.</p>
        </div>

      </div>
    </div>
  );
}
