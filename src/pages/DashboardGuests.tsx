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
import { Search, Plus, Upload, Download, Send, Pencil, Trash2, Users, UserCheck, Clock, UserX, MessageCircle } from "lucide-react";
import { useGuests, useAddGuest, useDeleteGuest, type EventRow, type GuestRow } from "@/hooks/useEvent";
import { exportGuestList } from "@/lib/export";
import { shareViaWhatsApp } from "@/lib/share";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  confirmed: { label: "Confirmado", color: "text-green-700 bg-green-50 border-green-200", variant: "outline" },
  pending: { label: "Pendente", color: "text-yellow-700 bg-yellow-50 border-yellow-200", variant: "outline" },
  declined: { label: "Recusado", color: "text-red-700 bg-red-50 border-red-200", variant: "outline" },
  maybe: { label: "Talvez", color: "text-blue-700 bg-blue-50 border-blue-200", variant: "outline" },
  "no-response": { label: "Sem resposta", color: "text-gray-700 bg-gray-50 border-gray-200", variant: "outline" },
};

interface Props { event: EventRow | null | undefined; }

const DashboardGuests = ({ event }: Props) => {
  const { data: guests = [] } = useGuests(event?.id);
  const addGuest = useAddGuest();
  const deleteGuest = useDeleteGuest();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [newGuest, setNewGuest] = useState({ full_name: "", email: "", phone: "", dietary: "", table_number: "", notes: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!event) return <p className="text-muted-foreground text-center py-20">Crie um evento primeiro</p>;

  const confirmed = guests.filter((g) => g.status === "confirmed").length;
  const pending = guests.filter((g) => g.status === "pending").length;
  const declined = guests.filter((g) => g.status === "declined").length;
  const totalCompanions = guests.reduce((acc, g) => acc + (g.companions || 0), 0);

  const filtered = guests.filter((g) => {
    const matchSearch = g.full_name.toLowerCase().includes(search.toLowerCase()) || (g.email || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || g.status === filter;
    return matchSearch && matchFilter;
  });

  const chartData = [
    { name: "Confirmados", value: confirmed, color: "hsl(122, 38%, 40%)" },
    { name: "Pendentes", value: pending, color: "#EAB308" },
    { name: "Recusados", value: declined, color: "hsl(0, 84%, 60%)" },
  ];

  const metrics = [
    { label: "Total", value: guests.length, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Confirmados", value: confirmed, icon: UserCheck, color: "bg-green-50 text-green-600" },
    { label: "Pendentes", value: pending, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
    { label: "Recusados", value: declined, icon: UserX, color: "bg-red-50 text-red-600" },
    { label: "Acompanhantes", value: totalCompanions, icon: Users, color: "bg-blue-50 text-blue-600" },
  ];

  const handleAdd = async () => {
    if (!newGuest.full_name) { toast.error("Nome é obrigatório"); return; }
    await addGuest.mutateAsync({ ...newGuest, event_id: event.id });
    setNewGuest({ full_name: "", email: "", phone: "", dietary: "", table_number: "", notes: "" });
    setDialogOpen(false);
    toast.success("Convidado adicionado!");
  };

  const eventUrl = `${window.location.origin}/evento/${event.slug}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Gestão de Convidados</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie sua lista de convidados e confirmações</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="card-premium rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.color}`}><m.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-display font-semibold tracking-tight text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground font-body">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full font-body"><Plus className="w-4 h-4 mr-1" /> Adicionar</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-display">Adicionar Convidado</DialogTitle></DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2"><Label>Nome completo</Label><Input value={newGuest.full_name} onChange={(e) => setNewGuest(p => ({ ...p, full_name: e.target.value }))} placeholder="Nome do convidado" /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" value={newGuest.email} onChange={(e) => setNewGuest(p => ({ ...p, email: e.target.value }))} placeholder="email@exemplo.com" /></div>
                  <div className="space-y-2"><Label>Telefone</Label><Input value={newGuest.phone} onChange={(e) => setNewGuest(p => ({ ...p, phone: e.target.value }))} placeholder="(00) 00000-0000" /></div>
                  <div className="space-y-2"><Label>Mesa (opcional)</Label><Input value={newGuest.table_number} onChange={(e) => setNewGuest(p => ({ ...p, table_number: e.target.value }))} placeholder="Mesa 1" /></div>
                  <div className="space-y-2"><Label>Observações</Label><Textarea value={newGuest.notes} onChange={(e) => setNewGuest(p => ({ ...p, notes: e.target.value }))} rows={2} /></div>
                </div>
                <DialogFooter><Button className="rounded-full font-body" onClick={handleAdd} disabled={addGuest.isPending}>{addGuest.isPending ? "Salvando..." : "Salvar convidado"}</Button></DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="rounded-full font-body" onClick={() => exportGuestList(guests, event.title)}><Download className="w-4 h-4 mr-1" /> Exportar</Button>
          </div>

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
                        <p className="font-body font-medium text-foreground text-sm">{guest.full_name}</p>
                        <p className="text-xs text-muted-foreground">{guest.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {statusConfig[guest.status || "pending"] && (
                        <Badge variant={statusConfig[guest.status || "pending"].variant} className={statusConfig[guest.status || "pending"].color}>
                          {statusConfig[guest.status || "pending"].label}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{guest.companions}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{guest.dietary || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{guest.confirmed_at ? new Date(guest.confirmed_at).toLocaleDateString("pt-BR") : "—"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shareViaWhatsApp(event.title, eventUrl, guest.full_name)}>
                          <MessageCircle className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteGuest.mutate({ id: guest.id, eventId: event.id })}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum convidado encontrado</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="card-premium rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-4">Distribuição</h3>
          {guests.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
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
            </>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-10">Adicione convidados para ver a distribuição</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardGuests;
