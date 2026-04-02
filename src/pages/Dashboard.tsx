import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardSite from "@/pages/DashboardSite";
import DashboardGuests from "@/pages/DashboardGuests";
import DashboardGifts from "@/pages/DashboardGifts";
import DashboardFinance from "@/pages/DashboardFinance";
import DashboardChecklist from "@/pages/DashboardChecklist";
import DashboardSettings from "@/pages/DashboardSettings";
import Marketplace from "@/pages/Marketplace";
import SupplierProfile from "@/pages/SupplierProfile";
import { useUserEvent } from "@/hooks/useEvent";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Eye } from "lucide-react";
import { useNotifications, useMarkNotificationsRead } from "@/hooks/useEvent";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const NotificationBell = () => {
  const { data: notifications } = useNotifications();
  const markRead = useMarkNotificationsRead();
  const [open, setOpen] = useState(false);
  const unread = notifications?.filter((n) => !n.is_read).length || 0;

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (v && unread > 0) markRead.mutate(); }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-auto" align="end">
        <h4 className="font-display font-semibold mb-3">Notificações</h4>
        {!notifications?.length ? (
          <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
        ) : (
          <div className="space-y-2">
            {notifications.slice(0, 10).map((n) => (
              <div key={n.id} className={`p-2 rounded-lg text-sm ${n.is_read ? "opacity-60" : "bg-muted/50"}`}>
                <p className="font-medium">{n.title}</p>
                {n.message && <p className="text-muted-foreground text-xs mt-1">{n.message}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(n.created_at!).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

const Dashboard = () => {
  const { data: event, isLoading } = useUserEvent();
  const { signOut, profile } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar event={event} profileName={profile?.full_name} onSignOut={signOut} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="font-display font-semibold text-lg">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              {event?.slug && (
                <Button variant="ghost" size="icon" asChild>
                  <a href={`/evento/${event.slug}`} target="_blank" rel="noopener noreferrer" title="Ver site do evento">
                    <Eye className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <NotificationBell />
            </div>
          </header>
          <main className="flex-1 bg-background overflow-auto">
            <Routes>
              <Route index element={<div className="p-6"><DashboardOverview event={event} /></div>} />
              <Route path="site" element={<DashboardSite event={event} />} />
              <Route path="guests" element={<div className="p-6"><DashboardGuests event={event} /></div>} />
              <Route path="gifts" element={<div className="p-6"><DashboardGifts event={event} /></div>} />
              <Route path="finance" element={<div className="p-6"><DashboardFinance event={event} /></div>} />
              <Route path="checklist" element={<div className="p-6"><DashboardChecklist event={event} /></div>} />
              <Route path="marketplace" element={<Marketplace embedded />} />
              <Route path="marketplace/fornecedor/:id" element={<SupplierProfile embedded />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
