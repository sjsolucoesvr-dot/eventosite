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
  { title: "Fornecedores", url: "/dashboard/suppliers", icon: Store },
  { title: "Configurações", url: "/dashboard/settings", icon: Settings },
];

const DashboardSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-sidebar-primary fill-sidebar-primary shrink-0" />
          {!collapsed && (
            <span className="text-lg font-display font-bold text-sidebar-foreground">EventoSite</span>
          )}
        </div>
        {!collapsed && (
          <div className="mt-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground font-display font-bold text-sm">
              A
            </div>
            <div>
              <p className="text-sm font-body font-medium text-sidebar-foreground">Ana & Pedro</p>
              <p className="text-xs font-body text-sidebar-foreground/60">20/12/2025</p>
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
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
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
