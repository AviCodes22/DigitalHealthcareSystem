import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { useHealthcare } from "@/context/HealthcareContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  age: z.string().transform(val => parseInt(val, 10)),
  gender: z.enum(["Male", "Female", "Other"]),
  selfReportedHistory: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPatient() {
  const { registerPatient } = useHealthcare();
  const [, setLocation] = useLocation();
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      gender: "Male",
      selfReportedHistory: "",
    }
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerPatient({
      name: data.name,
      phone: data.phone,
      age: data.age,
      gender: data.gender,
      selfReportedHistory: data.selfReportedHistory || "None",
    });
    
    // Calculate what the ID would be just to show the user (logic duplicated from context for visual feedback)
    const phoneSuffix = data.phone.slice(-4);
    const namePrefix = data.name.slice(0, 3);
    const newId = `${phoneSuffix}${namePrefix}`;
    setGeneratedId(newId);
  };

  if (generatedId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8 animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
          <p className="text-slate-600 mb-6">Your Unique Patient ID is:</p>
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 mb-8">
            <code className="text-3xl font-mono font-bold text-primary tracking-wider">{generatedId}</code>
          </div>
          <Button className="w-full" size="lg" onClick={() => setLocation("/patient/dashboard")}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-1">
          <Button variant="ghost" className="w-fit pl-0 hover:bg-transparent hover:text-primary" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          <CardTitle className="text-2xl text-primary">New Patient Registration</CardTitle>
          <CardDescription>Please fill in your details to create your medical record.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...form.register("name")} placeholder="John Doe" />
                {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...form.register("phone")} placeholder="9876543210" type="tel" />
                {form.formState.errors.phone && <p className="text-red-500 text-xs">{form.formState.errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" {...form.register("age")} placeholder="30" type="number" />
                {form.formState.errors.age && <p className="text-red-500 text-xs">{form.formState.errors.age.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(val: any) => form.setValue("gender", val)} defaultValue="Male">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="history" className="text-base font-semibold text-slate-800">Previous Medical History</Label>
              <p className="text-sm text-slate-500">Please self-report any pre-existing conditions, allergies, or past surgeries.</p>
              <Textarea 
                id="history" 
                {...form.register("selfReportedHistory")} 
                placeholder="e.g., Allergic to Penicillin, Appendectomy in 2018, Mild Asthma..." 
                className="min-h-[150px] text-base resize-none bg-slate-50"
              />
            </div>

            <Button type="submit" className="w-full text-lg h-12 bg-primary hover:bg-primary/90">Create Account</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
