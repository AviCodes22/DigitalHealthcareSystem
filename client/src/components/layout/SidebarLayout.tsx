import { useHealthcare } from "@/context/HealthcareContext";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LayoutDashboard, History, Users, Calendar, Pill, LogOut, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import generatedImage from '@assets/generated_images/pillpal_logo.png';
import { motion } from "framer-motion";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { currentUser, logout } = useHealthcare();
  const [, setLocation] = useLocation();

  if (!currentUser) {
    setTimeout(() => setLocation("/"), 0);
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const getNavItems = () => {
    switch (currentUser.role) {
      case "patient":
        return [
          { icon: LayoutDashboard, label: "Dashboard", path: "/patient/dashboard" },
          { icon: History, label: "Medical History", path: "/patient/history" },
          { icon: Users, label: "My Doctors", path: "/patient/doctors" },
          { icon: Activity, label: "Tests & Vitals", path: "/patient/tests" },
        ];
      case "doctor":
        return [
          { icon: LayoutDashboard, label: "Dashboard", path: "/doctor/dashboard" },
          { icon: Users, label: "My Patients", path: "/doctor/patients" },
        ];
      case "receptionist":
        return [
          { icon: Calendar, label: "Queue Management", path: "/receptionist/dashboard" },
        ];
      case "pharmacy":
        return [
          { icon: Pill, label: "Prescriptions", path: "/pharmacy/dashboard" },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen flex bg-slate-50/50">
      {/* Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-md border-r border-slate-200/60 fixed h-full z-20 hidden md:flex flex-col shadow-2xl shadow-slate-200/50">
        <div className="p-6 flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-2.5 flex items-center justify-center shadow-inner shadow-white/50 ring-1 ring-primary/10">
             <img src={generatedImage} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">PillPal</h1>
            <p className="text-xs text-slate-500 font-medium">v2.0 Pro</p>
          </div>
        </div>

        <div className="px-4 py-2 flex-1 overflow-y-auto">
          <div className="mb-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">Main Menu</p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-slate-600 font-medium transition-all duration-200 rounded-xl h-12 px-4",
                    window.location.pathname === item.path 
                      ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" 
                      : "hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1"
                  )}
                  onClick={() => setLocation(item.path)}
                >
                  <item.icon className={cn("w-5 h-5", window.location.pathname === item.path ? "text-primary" : "text-slate-400")} />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 m-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary font-bold text-sm ring-2 ring-white">
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 bg-white shadow-sm h-10 rounded-xl border-slate-200" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 min-h-screen relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8 max-w-7xl mx-auto relative z-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
