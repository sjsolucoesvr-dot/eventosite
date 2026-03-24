import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

const Dashboard = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b bg-card px-4">
          <SidebarTrigger className="mr-4" />
          <h1 className="font-display font-semibold text-lg">Visão Geral</h1>
        </header>
        <main className="flex-1 p-6 bg-background overflow-auto">
          <DashboardOverview />
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default Dashboard;
