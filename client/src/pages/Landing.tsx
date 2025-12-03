import { useState } from "react";
import { useLocation } from "wouter";
import { useHealthcare, Role } from "@/context/HealthcareContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Stethoscope, CalendarCheck, Pill, Activity, ArrowRight } from "lucide-react";
import generatedImage from '@assets/generated_images/pillpal_logo.png';
import { motion } from "framer-motion";

export default function Landing() {
  const { login } = useHealthcare();
  const [, setLocation] = useLocation();
  const [patientId, setPatientId] = useState("9999Joh"); // Default demo ID

  const handleLogin = (role: Role) => {
    if (role === "patient") {
      // Validate ID simply
      if (!patientId) return;
      login("patient", patientId);
      setLocation("/patient/dashboard");
    } else {
      // For staff, just auto-login to the first mock user for demo
      login(role);
      setLocation(`/${role}/dashboard`);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12 text-center z-10"
      >
        <div className="w-24 h-24 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary/10 p-5 mx-auto mb-6 flex items-center justify-center border border-white/50">
           <img src={generatedImage} alt="PillPal Logo" className="w-full h-full object-contain drop-shadow-sm" />
        </div>
        <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">PillPal</h1>
        <p className="text-lg text-slate-500 max-w-md mx-auto font-medium">Your modern digital health companion.</p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full z-10"
      >
        {/* Patient Card */}
        <motion.div variants={item}>
          <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden group cursor-pointer h-full">
            <div className="h-2 w-full bg-gradient-to-r from-blue-400 to-blue-600" />
            <CardHeader>
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <User className="w-7 h-7" />
              </div>
              <CardTitle className="text-xl">Patient Portal</CardTitle>
              <CardDescription>Access history & prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pid" className="text-xs uppercase tracking-wider text-slate-400 font-bold">Patient ID</Label>
                  <Input 
                    id="pid" 
                    placeholder="e.g. 9999Joh" 
                    value={patientId} 
                    onChange={(e) => setPatientId(e.target.value)} 
                    className="bg-slate-50 border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" onClick={() => handleLogin("patient")}>
                  Login <ArrowRight className="w-4 h-4 ml-2 opacity-70" />
                </Button>
                <Button variant="ghost" className="w-full text-slate-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => setLocation("/patient/register")}>
                  Create Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Doctor Card */}
        <motion.div variants={item}>
          <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden group cursor-pointer h-full flex flex-col">
            <div className="h-2 w-full bg-gradient-to-r from-indigo-400 to-indigo-600" />
            <CardHeader>
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-7 h-7" />
              </div>
              <CardTitle className="text-xl">Doctor</CardTitle>
              <CardDescription>Consultations & Rx</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20" onClick={() => handleLogin("doctor")}>
                Enter Portal
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Receptionist Card */}
        <motion.div variants={item}>
          <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden group cursor-pointer h-full flex flex-col">
            <div className="h-2 w-full bg-gradient-to-r from-purple-400 to-purple-600" />
            <CardHeader>
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <CardTitle className="text-xl">Reception</CardTitle>
              <CardDescription>Queue Management</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20" onClick={() => handleLogin("receptionist")}>
                Manage Queue
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pharmacy/Labs Card */}
        <motion.div variants={item}>
          <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden group cursor-pointer h-full flex flex-col">
            <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
            <CardHeader>
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-7 h-7" />
              </div>
              <CardTitle className="text-xl">Labs & Pharmacy</CardTitle>
              <CardDescription>Results & Dispensing</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50" onClick={() => handleLogin("radiology")}>Labs</Button>
                <Button variant="outline" className="hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50" onClick={() => handleLogin("pharmacy")}>Pharma</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="mt-12 text-slate-400 text-sm font-medium">
        © 2025 PillPal Systems Inc.
      </div>
    </div>
  );
}
