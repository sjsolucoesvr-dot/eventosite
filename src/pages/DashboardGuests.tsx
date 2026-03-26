import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Search, Plus, Upload, Download, Send, Pencil, Trash2, Users, UserCheck, Clock, UserX } from "lucide-react";

const mockGuests = [
  { id: 1, name: "Maria Silva", email: "maria@email.com", phone: "(11) 99999-1234", status: "confirmed", companions: 1, dietary: "Vegetariana", confirmedAt: "10/03/2025" },
  { id: 2, name: "João Santos", email: "joao@email.com", phone: "(11) 98888-5678", status: "confirmed", companions: 0, dietary: "Nenhuma", confirmedAt: "12/03/2025" },
  { id: 3, name: "Ana Oliveira", email: "ana@email.com", phone: "(21) 97777-9012", status: "pending", companions: 2, dietary: "Sem glúten", confirmedAt: null },
  { id: 4, name: "Carlos Souza", email: "carlos@email.com", phone: "(31) 96666-3456", status: "declined", companions: 0, dietary: "Nenhuma", confirmedAt: "08/03/2025" },
  { id: 5, name: "Fernanda Lima", email: "fernanda@email.com", phone: "(41) 95555-7890", status: "confirmed", companions: 1, dietary: "Nenhuma", confirmedAt: "15/03/2025" },
  { id: 6, name: "Ricardo Pereira", email: "ricardo@email.com", phone: "(51) 94444-2345", status: "pending", companions: 0, dietary: "Vegano", confirmedAt: null },
  { id: 7, name: "Juliana Costa", email: "juliana@email.com", phone: "(61) 93333-6789", status: "confirmed", companions: 1, dietary: "Nenhuma", confirmedAt: "18/03/2025" },
  { id: 8, name: "Paulo Mendes", email: "paulo@email.com", phone: "(71) 92222-0123", status: "pending", companions: 0, dietary: "Intolerante a lactose", confirmedAt: null },
];

const statusConfig: Record<string, { label: string; color: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  confirmed: { label: "Confirmado", color: "text-green-700 bg-green-50 border-green-200", variant: "outline" },
  pending: { label: "Pendente", color: "text-yellow-700 bg-yellow-50 border-yellow-200", variant: "outline" },
  declined: { label: "Recusado", color: "text-red-700 bg-red-50 border-red-200", variant: "outline" },
};

const DashboardGuests = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const confirmed = mockGuests.filter((g) => g.status === "confirmed").length;
  const pending = mockGuests.filter((g) => g.status === "pending").length;
  const declined = mockGuests.filter((g) => g.status === "declined").length;
  const totalCompanions = mockGuests.reduce((acc, g) => acc + g.companions, 0);

  const filtered = mockGuests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || g.status === filter;
    return matchSearch && matchFilter;
  });

  const chartData = [
    { name: "Confirmados", value: confirmed, color: "hsl(var(--success))" },
    { name: "Pendentes", value: pending, color: "#EAB308" },
    { name: "Recusados", value: declined, color: "hsl(var(--destructive))" },
  ];

  const metrics = [
    { label: "Total", value: mockGuests.length, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Confirmados", value: confirmed, icon: UserCheck, color: "bg-green-50 text-green-600" },
    { label: "Pendentes", value: pending, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
    { label: "Recusados", value: declined, icon: UserX, color: "bg-red-50 text-red-600" },
    { label: "Acompanhantes", value: totalCompanions, icon: Users, color: "bg-blue-50 text-blue-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Gestão de Convidados</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie sua lista de convidados e confirmações</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="card-premium rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.color}`}>
              <m.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-display font-semibold tracking-tight text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground font-body">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou email" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="confirmed">Confirmados</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="declined">Recusados</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-full font-body"><Plus className="w-4 h-4 mr-1" /> Adicionar</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-display">Adicionar Convidado</DialogTitle></DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2"><Label>Nome completo</Label><Input placeholder="Nome do convidado" /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@exemplo.com" /></div>
                  <div className="space-y-2"><Label>Telefone</Label><Input placeholder="(00) 00000-0000" /></div>
                  <div className="space-y-2"><Label>Mesa (opcional)</Label><Input placeholder="Mesa 1" /></div>
                  <div className="space-y-2"><Label>Observações</Label><Textarea placeholder="Alguma observação especial?" rows={2} /></div>
                </div>
                <DialogFooter><Button className="rounded-full font-body">Salvar convidado</Button></DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="rounded-full font-body"><Upload className="w-4 h-4 mr-1" /> Importar CSV</Button>
            <Button variant="outline" className="rounded-full font-body"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
          </div>

          {/* Table */}
          <div className="card-premium rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body">Nome</TableHead>
                  <TableHead className="font-body">Status</TableHead>
                  <TableHead className="font-body">Acomp.</TableHead>
                  <TableHead className="font-body">Restrição</TableHead>
                  <TableHead className="font-body">Confirmação</TableHead>
                  <TableHead className="font-body text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell>
                      <div>
                        <p className="font-body font-medium text-foreground text-sm">{guest.name}</p>
                        <p className="text-xs text-muted-foreground">{guest.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[guest.status].variant} className={statusConfig[guest.status].color}>
                        {statusConfig[guest.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{guest.companions}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{guest.dietary}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{guest.confirmedAt || "—"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Send className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Chart */}
        <div className="card-premium rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-4">Distribuição</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {chartData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground font-body">{d.name}</span>
                </div>
                <span className="font-body font-medium text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGuests;
