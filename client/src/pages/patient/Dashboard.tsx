import { useState } from "react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { useHealthcare, Patient } from "@/context/HealthcareContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QrCode, Clock, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export default function PatientDashboard() {
  const { currentUser, doctors, addToQueue, queue, medicalHistory } = useHealthcare();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

  // Find active queue item for this patient
  const activeQueueItem = queue.find(q => q.patientId === currentUser?.id && q.status !== "completed");

  const handleCheckIn = () => {
    if (selectedDoctorId && currentUser) {
      addToQueue(currentUser.id, selectedDoctorId);
      setIsQRModalOpen(false);
    }
  };

  const recentHistory = medicalHistory.filter(h => h.patientId === currentUser?.id).slice(0, 5);
  
  // Type guard or cast for patient-specific fields
  const patientUser = currentUser as Patient;

  return (
    <SidebarLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {currentUser?.name}</h1>
            <p className="text-slate-500">Patient ID: <span className="font-mono font-semibold text-primary">{currentUser?.id}</span></p>
          </div>
          {!activeQueueItem ? (
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200" onClick={() => setIsQRModalOpen(true)}>
              <QrCode className="w-5 h-5 mr-2" /> Scan QR to Check-in
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 animate-pulse">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Checked in for {doctors.find(d => d.id === activeQueueItem.doctorId)?.name}</span>
            </div>
          )}
        </div>

        {/* Active Status Card */}
        {activeQueueItem && (
          <Card className="border-l-4 border-l-primary bg-blue-50/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Status: {activeQueueItem.status === "waiting" ? "Waiting in Queue" : "In Consultation"}</h3>
                <p className="text-slate-600">Please wait for your name to be called by the receptionist.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Medical History Summary */}
          <Card className="lg:col-span-2 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Medical History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                {recentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {recentHistory.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-shadow">
                        <div className="mt-1">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-slate-500">{item.date}</span>
                            <Badge variant="outline" className="text-xs">{item.type}</Badge>
                          </div>
                          <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No medical history found.</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Vitals / Info */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Important Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <h4 className="text-sm font-semibold text-orange-800 mb-1">Self-Reported Conditions</h4>
                <p className="text-sm text-orange-700 italic">"{patientUser?.selfReportedHistory || 'None'}"</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500 uppercase">Blood</p>
                  <p className="font-bold text-slate-900">{patientUser?.bloodGroup || 'O+'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500 uppercase">Age</p>
                  <p className="font-bold text-slate-900">{patientUser?.age}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Check-in Simulation Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Simulate QR Scan</DialogTitle>
            <DialogDescription>
              In the real app, this would scan a physical QR code at the doctor's desk.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <label className="text-sm font-medium mb-2 block">Select Doctor to Check-in With:</label>
            <Select onValueChange={setSelectedDoctorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor..." />
              </SelectTrigger>
              <SelectContent>
                {doctors.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name} ({d.specialty})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsQRModalOpen(false)}>Cancel</Button>
             <Button onClick={handleCheckIn} disabled={!selectedDoctorId}>Check In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
}
