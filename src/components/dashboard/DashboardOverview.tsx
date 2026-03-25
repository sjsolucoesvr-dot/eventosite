import { Users, Gift, Calendar, ListChecks, CheckCircle2, Clock, UserPlus, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { differenceInDays } from "date-fns";

const weddingDate = new Date("2025-12-20");
const daysLeft = Math.max(0, differenceInDays(weddingDate, new Date()));

const metrics = [
  { icon: Users, label: "Convidados confirmados", value: "98 / 200", change: "+12%", changePositive: true, color: "hsl(345, 75%, 62%)" },
  { icon: Gift, label: "Presentes recebidos", value: "R$ 4.850", change: "+R$ 350", changePositive: true, color: "hsl(122, 38%, 40%)" },
  { icon: Calendar, label: "Dias para o evento", value: String(daysLeft), change: "", changePositive: true, color: "hsl(37, 42%, 61%)" },
  { icon: ListChecks, label: "Tarefas concluídas", value: "18 / 32", change: "56%", changePositive: true, color: "hsl(345, 75%, 62%)" },
];

const pieData = [
  { name: "Confirmados", value: 98, color: "hsl(122, 38%, 40%)" },
  { name: "Pendentes", value: 70, color: "hsl(37, 42%, 61%)" },
  { name: "Recusados", value: 12, color: "hsl(0, 84%, 60%)" },
];

const activities = [
  { icon: CheckCircle2, text: "Mariana Silva confirmou presença", time: "Há 2 horas", iconColor: "text-success" },
  { icon: Gift, text: "Tio Marcos enviou um presente de R$ 200", time: "Há 5 horas", iconColor: "text-primary" },
  { icon: UserPlus, text: "Família Santos foi adicionada à lista", time: "Ontem", iconColor: "text-gold" },
  { icon: Clock, text: 'Tarefa "Confirmar buffet" concluída', time: "Ontem", iconColor: "text-success" },
];

const DashboardOverview = () => (
  <div className="space-y-6">
    {/* Metric cards */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="card-premium rounded-2xl p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm text-muted-foreground font-body">{m.label}</p>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${m.color}15` }}
            >
              <m.icon className="h-5 w-5" style={{ color: m.color }} />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-foreground tracking-tight">{m.value}</p>
          {m.change && (
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-xs font-body text-success font-medium">{m.change}</span>
            </div>
          )}
        </div>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* Donut chart */}
      <div className="card-premium rounded-2xl p-6">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Status dos convidados</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="none">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value} convidados`, name]}
                contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.06)", fontFamily: "DM Sans", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
              />
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
      </div>

      {/* Activity feed */}
      <div className="card-premium rounded-2xl p-6">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Últimas atividades</h3>
        <div className="space-y-4">
          {activities.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`mt-0.5 ${a.iconColor}`}>
                <a.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-body text-foreground">{a.text}</p>
                <p className="text-xs text-muted-foreground font-body">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Progress */}
    <div className="card-premium rounded-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground">Progresso do planejamento</h3>
        <span className="text-sm font-body text-muted-foreground">56%</span>
      </div>
      <Progress value={56} className="h-3" />
    </div>
  </div>
);

export default DashboardOverview;
