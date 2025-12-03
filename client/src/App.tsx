import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { HealthcareProvider } from "@/context/HealthcareContext";

import Landing from "@/pages/Landing";
import RegisterPatient from "@/pages/patient/Register";
import PatientDashboard from "@/pages/patient/Dashboard";
import ReceptionistDashboard from "@/pages/receptionist/Dashboard";
import DoctorDashboard from "@/pages/doctor/Dashboard";
import PrescriptionTemplate from "@/pages/print/PrescriptionTemplate";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/patient/register" component={RegisterPatient} />
      <Route path="/patient/dashboard" component={PatientDashboard} />
      <Route path="/receptionist/dashboard" component={ReceptionistDashboard} />
      <Route path="/doctor/dashboard" component={DoctorDashboard} />
      <Route path="/print/prescription/:id" component={PrescriptionTemplate} />
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HealthcareProvider>
          <Toaster />
          <Router />
        </HealthcareProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
