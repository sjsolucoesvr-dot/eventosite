import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardSite from "@/pages/DashboardSite";
import DashboardGuests from "@/pages/DashboardGuests";
import DashboardGifts from "@/pages/DashboardGifts";
import DashboardFinance from "@/pages/DashboardFinance";
import DashboardChecklist from "@/pages/DashboardChecklist";

const pageTitles: Record<string, string> = {
  "": "Visão Geral",
  site: "Meu Site",
  guests: "Convidados",
  gifts: "Lista de Presentes",
  finance: "Financeiro",
  checklist: "Checklist",
  suppliers: "Fornecedores",
  settings: "Configurações",
};

const Dashboard = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b bg-card px-4">
          <SidebarTrigger className="mr-4" />
          <h1 className="font-display font-semibold text-lg">Dashboard</h1>
        </header>
        <main className="flex-1 bg-background overflow-auto">
          <Routes>
            <Route index element={<div className="p-6"><DashboardOverview /></div>} />
            <Route path="site" element={<DashboardSite />} />
            <Route path="guests" element={<div className="p-6"><DashboardGuests /></div>} />
            <Route path="gifts" element={<div className="p-6"><DashboardGifts /></div>} />
            <Route path="finance" element={<div className="p-6"><DashboardFinance /></div>} />
            <Route path="checklist" element={<div className="p-6"><DashboardChecklist /></div>} />
          </Routes>
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default Dashboard;
