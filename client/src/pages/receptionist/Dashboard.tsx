import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { useHealthcare } from "@/context/HealthcareContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, CheckCircle2 } from "lucide-react";

export default function ReceptionistDashboard() {
  const { queue, patients, doctors, updateQueueStatus } = useHealthcare();

  // Filter waiting patients
  const waitingQueue = queue.filter(q => q.status === "waiting");
  const inConsultation = queue.filter(q => q.status === "in-consultation");

  const handleNextPatient = (queueId: string) => {
    updateQueueStatus(queueId, "in-consultation");
  };

  return (
    <SidebarLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">Queue Management</h1>
          <Badge variant="outline" className="text-lg py-1 px-4">
            {waitingQueue.length} Waiting
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Waiting Queue */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <Clock className="w-5 h-5" /> Waiting Room
            </h2>
            {waitingQueue.length === 0 ? (
              <Card className="border-dashed border-2 bg-slate-50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Users className="w-12 h-12 mb-2 opacity-20" />
                  <p>No patients in waiting list</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {waitingQueue.map((item, index) => {
                  const patient = patients.find(p => p.id === item.patientId);
                  const doctor = doctors.find(d => d.id === item.doctorId);
                  
                  return (
                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow border-l-4 border-l-yellow-400">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-slate-900">#{index + 1}</span>
                            <h3 className="font-semibold text-slate-900">{patient?.name}</h3>
                          </div>
                          <p className="text-sm text-slate-500">Dr. {doctor?.name}</p>
                          <p className="text-xs text-slate-400 mt-1">Waiting since {item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <Button onClick={() => handleNextPatient(item.id)}>Send In &rarr;</Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* In Consultation */}
          <div className="space-y-4">
             <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" /> In Consultation
            </h2>
             {inConsultation.length === 0 ? (
              <Card className="border-dashed border-2 bg-slate-50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Users className="w-12 h-12 mb-2 opacity-20" />
                  <p>No consultations in progress</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {inConsultation.map((item) => {
                  const patient = patients.find(p => p.id === item.patientId);
                  const doctor = doctors.find(d => d.id === item.doctorId);
                  
                  return (
                    <Card key={item.id} className="overflow-hidden border-l-4 border-l-green-500 bg-green-50/30">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-slate-900">{patient?.name}</h3>
                            <p className="text-sm text-slate-500">with Dr. {doctor?.name}</p>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">In Progress</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
