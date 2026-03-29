import { Users, Gift, Calendar, ListChecks, CheckCircle2, Clock, UserPlus, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { differenceInDays } from "date-fns";
import { useGuests, useChecklist, useGiftPayments, useNotifications, type EventRow } from "@/hooks/useEvent";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Props {
  event: EventRow | null | undefined;
}

const DashboardOverview = ({ event }: Props) => {
  const { data: guests } = useGuests(event?.id);
  const { data: tasks } = useChecklist(event?.id);
  const { data: payments } = useGiftPayments(event?.id);
  const { data: notifications } = useNotifications();

  if (!event) {
    return (
      <div className="text-center py-20">
        <h2 className="font-display text-2xl font-semibold mb-4">Bem-vindo ao EventoSite!</h2>
        <p className="text-muted-foreground mb-6">Crie seu primeiro evento para começar.</p>
        <Button asChild><Link to="/onboarding">Criar meu evento</Link></Button>
      </div>
    );
  }

  const confirmed = guests?.filter((g) => g.status === "confirmed").length || 0;
  const pending = guests?.filter((g) => g.status === "pending").length || 0;
  const declined = guests?.filter((g) => g.status === "declined").length || 0;
  const totalGuests = guests?.length || 0;
  const totalReceived = payments?.reduce((s, p) => s + Number(p.amount), 0) || 0;
  const daysLeft = event.date ? Math.max(0, differenceInDays(new Date(event.date), new Date())) : 0;
  const completedTasks = tasks?.filter((t) => t.is_completed).length || 0;
  const totalTasks = tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const metrics = [
    { icon: Users, label: "Convidados confirmados", value: `${confirmed} / ${totalGuests}`, color: "hsl(345, 75%, 62%)" },
    { icon: Gift, label: "Presentes recebidos", value: `R$ ${totalReceived.toLocaleString("pt-BR")}`, color: "hsl(122, 38%, 40%)" },
    { icon: Calendar, label: "Dias para o evento", value: String(daysLeft), color: "hsl(37, 42%, 61%)" },
    { icon: ListChecks, label: "Tarefas concluídas", value: `${completedTasks} / ${totalTasks}`, color: "hsl(345, 75%, 62%)" },
  ];

  const pieData = [
    { name: "Confirmados", value: confirmed, color: "hsl(122, 38%, 40%)" },
    { name: "Pendentes", value: pending, color: "hsl(37, 42%, 61%)" },
    { name: "Recusados", value: declined, color: "hsl(0, 84%, 60%)" },
  ];

  const recentNotifications = notifications?.slice(0, 4) || [];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="card-premium rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-muted-foreground font-body">{m.label}</p>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}15` }}>
                <m.icon className="h-5 w-5" style={{ color: m.color }} />
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-foreground tracking-tight">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-premium rounded-2xl p-6">
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">Status dos convidados</h3>
          {totalGuests > 0 ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="none">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [`${value} convidados`, name]} contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.06)", fontFamily: "DM Sans" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm font-body">
                    <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                    {d.name}: {d.value}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm py-10 text-center">Nenhum convidado adicionado ainda</p>
          )}
        </div>

        <div className="card-premium rounded-2xl p-6">
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">Últimas atividades</h3>
          {recentNotifications.length > 0 ? (
            <div className="space-y-4">
              {recentNotifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3">
                  <div className="mt-0.5 text-primary"><CheckCircle2 className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-body text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground font-body">
                      {new Date(n.created_at!).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm py-10 text-center">Nenhuma atividade recente</p>
          )}
        </div>
      </div>

      <div className="card-premium rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-foreground">Progresso do planejamento</h3>
          <span className="text-sm font-body text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>
    </div>
  );
};

export default DashboardOverview;
