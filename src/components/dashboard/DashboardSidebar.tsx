import {
  Home, Globe, Users, Gift, DollarSign, ListChecks, Store, Settings, Heart,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Visão Geral", url: "/dashboard", icon: Home },
  { title: "Meu Site", url: "/dashboard/site", icon: Globe },
  { title: "Convidados", url: "/dashboard/guests", icon: Users },
  { title: "Lista de Presentes", url: "/dashboard/gifts", icon: Gift },
  { title: "Financeiro", url: "/dashboard/finance", icon: DollarSign },
  { title: "Checklist", url: "/dashboard/checklist", icon: ListChecks },
  { title: "Marketplace", url: "/marketplace", icon: Store },
  { title: "Configurações", url: "/dashboard/settings", icon: Settings },
];

const DashboardSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-sidebar-primary fill-sidebar-primary shrink-0" />
          {!collapsed && (
            <span className="text-lg font-display font-semibold text-sidebar-foreground">EventoSite</span>
          )}
        </div>
        {!collapsed && (
          <div className="mt-6 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-body font-medium text-sm"
              style={{ background: "rgba(232, 84, 122, 0.2)", color: "hsl(345, 75%, 62%)" }}
            >
              A
            </div>
            <div>
              <p className="text-sm font-body font-medium text-sidebar-foreground">Ana & Pedro</p>
              <p className="text-xs font-body text-sidebar-foreground/50">20/12/2025</p>
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium border-l-2 border-sidebar-primary"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span className="font-body">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
