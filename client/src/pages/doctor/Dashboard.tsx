import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { useHealthcare, Medicine } from "@/context/HealthcareContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Printer, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DoctorDashboard() {
  const { currentUser, queue, patients, updateQueueStatus, addPrescription, prescriptions } = useHealthcare();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [activeConsultation, setActiveConsultation] = useState<{queueId: string, patientId: string} | null>(null);
  const [showReadyModal, setShowReadyModal] = useState(false);
  const [readyPatientName, setReadyPatientName] = useState("");

  // Prescription Form State
  const [diagnosis, setDiagnosis] = useState("");
  const [vitals, setVitals] = useState({ height: "", weight: "", bp: "", temperature: "" });
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [newMed, setNewMed] = useState<Medicine>({ name: "", dosage: "", frequency: "", duration: "" });

  // Polling for new patients sent by receptionist
  useEffect(() => {
    const interval = setInterval(() => {
      const nextPatient = queue.find(q => q.doctorId === currentUser?.id && q.status === "in-consultation");
      
      // If there is a patient marked as "in-consultation" but we haven't picked them up yet locally
      if (nextPatient && (!activeConsultation || activeConsultation.queueId !== nextPatient.id)) {
        const patient = patients.find(p => p.id === nextPatient.patientId);
        setReadyPatientName(patient?.name || "Unknown");
        setShowReadyModal(true);
        // Auto-set active consultation when acknowledged
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [queue, currentUser, activeConsultation, patients]);

  const handleStartConsultation = () => {
    const nextPatient = queue.find(q => q.doctorId === currentUser?.id && q.status === "in-consultation");
    if (nextPatient) {
      setActiveConsultation({ queueId: nextPatient.id, patientId: nextPatient.patientId });
      setShowReadyModal(false);
      // Reset form
      setDiagnosis("");
      setVitals({ height: "", weight: "", bp: "", temperature: "" });
      setMedicines([]);
    }
  };

  const handleAddMedicine = () => {
    if (!newMed.name) return;
    setMedicines([...medicines, newMed]);
    setNewMed({ name: "", dosage: "", frequency: "", duration: "" });
  };

  const handleCompleteConsultation = () => {
    if (!activeConsultation) return;

    addPrescription({
      patientId: activeConsultation.patientId,
      doctorId: currentUser!.id,
      diagnosis,
      vitals,
      medicines
    });

    updateQueueStatus(activeConsultation.queueId, "completed");
    setActiveConsultation(null);
    
    toast({
      title: "Consultation Completed",
      description: "Prescription saved and patient checked out.",
    });

    // Find the newly created prescription to redirect to print? 
    // In a real app we'd get the ID back. Here we rely on the user finding it or just completing the flow.
    // For the prototype, we just reset.
  };

  const activePatient = activeConsultation ? patients.find(p => p.id === activeConsultation.patientId) : null;

  // Find latest prescription for this patient/doctor to show "Print Preview" if just completed?
  // Or just a button to print *current* form state (which is harder without saving).
  // Let's keep it simple: Print Preview only works properly after saving (in real life), 
  // or we mock it by creating a temporary one.
  // For now, I'll make the "Print Preview" button just alert or work on the *latest* prescription if available.
  
  const handlePrintPreview = () => {
    // Mock: if we have saved a prescription recently, go to it.
    // Since we reset state on complete, let's find the last prescription for this doctor.
    const lastRx = prescriptions.find(p => p.doctorId === currentUser?.id);
    if (lastRx) {
      window.open(`/print/prescription/${lastRx.id}`, '_blank');
    } else {
      toast({
        title: "No Prescription Found",
        description: "Complete a consultation first to generate a prescription.",
        variant: "destructive"
      });
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-slate-900">Doctor's Dashboard</h1>

        {!activeConsultation ? (
          <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
            <Stethoscope className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-semibold">No Patient In Consultation</h2>
            <p>Waiting for receptionist to send the next patient...</p>
            {/* Debug button to manually trigger if receptionist flow is annoying to test */}
            <Button variant="link" className="mt-4 text-xs text-slate-300" onClick={() => setShowReadyModal(true)}>
               (Debug: Simulate Patient Ready)
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Patient Info & History */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                  <CardTitle>Current Patient</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{activePatient?.name}</h3>
                    <p className="text-slate-500">{activePatient?.age} yrs • {activePatient?.gender}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <Label className="text-orange-800 text-xs uppercase">Self-Reported History</Label>
                    <p className="text-sm text-orange-900 mt-1">{activePatient?.selfReportedHistory}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Consultation Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-t-4 border-t-primary shadow-lg">
                <CardHeader>
                  <CardTitle>Consultation Notes & Prescription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Vitals */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <Label>Height (cm)</Label>
                      <Input value={vitals.height} onChange={e => setVitals({...vitals, height: e.target.value})} placeholder="175" />
                    </div>
                    <div className="space-y-1">
                      <Label>Weight (kg)</Label>
                      <Input value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value})} placeholder="70" />
                    </div>
                    <div className="space-y-1">
                      <Label>BP</Label>
                      <Input value={vitals.bp} onChange={e => setVitals({...vitals, bp: e.target.value})} placeholder="120/80" />
                    </div>
                    <div className="space-y-1">
                      <Label>Temp (°F)</Label>
                      <Input value={vitals.temperature} onChange={e => setVitals({...vitals, temperature: e.target.value})} placeholder="98.6" />
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="space-y-2">
                    <Label>Diagnosis</Label>
                    <Textarea 
                      value={diagnosis} 
                      onChange={e => setDiagnosis(e.target.value)} 
                      placeholder="Clinical findings and diagnosis..." 
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Medicines */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Prescribed Medicines</Label>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-4"><Input placeholder="Medicine Name" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} /></div>
                        <div className="col-span-2"><Input placeholder="1-0-1" value={newMed.dosage} onChange={e => setNewMed({...newMed, dosage: e.target.value})} /></div>
                        <div className="col-span-3"><Input placeholder="Timing (e.g. After Food)" value={newMed.frequency} onChange={e => setNewMed({...newMed, frequency: e.target.value})} /></div>
                        <div className="col-span-2"><Input placeholder="Duration" value={newMed.duration} onChange={e => setNewMed({...newMed, duration: e.target.value})} /></div>
                        <div className="col-span-1"><Button size="icon" onClick={handleAddMedicine}><Plus className="w-4 h-4" /></Button></div>
                      </div>
                      
                      {medicines.length > 0 && (
                        <div className="space-y-2 mt-4">
                          {medicines.map((m, i) => (
                            <div key={i} className="flex items-center justify-between bg-white p-3 rounded border border-slate-100 text-sm">
                              <div className="grid grid-cols-12 gap-4 w-full">
                                <span className="col-span-4 font-medium">{m.name}</span>
                                <span className="col-span-2">{m.dosage}</span>
                                <span className="col-span-3 text-slate-500">{m.frequency}</span>
                                <span className="col-span-2 text-slate-500">{m.duration}</span>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400" onClick={() => setMedicines(medicines.filter((_, idx) => idx !== i))}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-4">
                    <Button variant="outline" size="lg" className="gap-2" onClick={handlePrintPreview}>
                      <Printer className="w-4 h-4" /> Print Last Rx
                    </Button>
                    <Button size="lg" onClick={handleCompleteConsultation} className="bg-primary hover:bg-primary/90">
                      Complete Consultation & Issue Rx
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Alert Modal */}
        <Dialog open={showReadyModal} onOpenChange={setShowReadyModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary">Next Patient Ready</DialogTitle>
              <DialogDescription>
                Reception has marked <strong>{readyPatientName}</strong> as ready for consultation.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button size="lg" className="w-full" onClick={handleStartConsultation}>Start Consultation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarLayout>
  );
}
