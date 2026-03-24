import { Users, Gift, Calendar, ListChecks, CheckCircle2, Clock, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { differenceInDays } from "date-fns";

const weddingDate = new Date("2025-12-20");
const daysLeft = Math.max(0, differenceInDays(weddingDate, new Date()));

const metrics = [
  { icon: Users, label: "Convidados confirmados", value: "98 / 200", color: "text-primary" },
  { icon: Gift, label: "Presentes recebidos", value: "R$ 4.850", color: "text-success" },
  { icon: Calendar, label: "Dias para o evento", value: String(daysLeft), color: "text-gold" },
  { icon: ListChecks, label: "Tarefas concluídas", value: "18 / 32", color: "text-primary" },
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
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <Card key={i}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${m.color}`}>
              <m.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-body">{m.label}</p>
              <p className="text-2xl font-display font-bold">{m.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* Donut chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Status dos convidados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value} convidados`, name]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", fontFamily: "DM Sans" }}
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
        </CardContent>
      </Card>

      {/* Activity feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Últimas atividades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`mt-0.5 ${a.iconColor}`}>
                <a.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-body">{a.text}</p>
                <p className="text-xs text-muted-foreground font-body">{a.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>

    {/* Progress */}
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">Progresso do planejamento</h3>
          <span className="text-sm font-body text-muted-foreground">56%</span>
        </div>
        <Progress value={56} className="h-3" />
      </CardContent>
    </Card>
  </div>
);

export default DashboardOverview;
