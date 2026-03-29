import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingDown, TrendingUp, Wallet, Plus, Download, Trash2 } from "lucide-react";
import { useExpenses, useAddExpense, useDeleteExpense, type EventRow } from "@/hooks/useEvent";
import { exportFinancial } from "@/lib/export";
import { toast } from "sonner";

const statusMap: Record<string, { label: string; className: string }> = {
  paid: { label: "Pago", className: "text-green-700 bg-green-50 border-green-200" },
  pending: { label: "Pendente", className: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  overdue: { label: "Atrasado", className: "text-red-700 bg-red-50 border-red-200" },
  cancelled: { label: "Cancelado", className: "text-gray-700 bg-gray-50 border-gray-200" },
};

const categories = ["Local", "Buffet", "Decoração", "Fotografia", "Música", "Vestimenta", "Convites", "Lua de Mel", "Outros"];

interface Props { event: EventRow | null | undefined; }

const DashboardFinance = ({ event }: Props) => {
  const { data: expenses = [] } = useExpenses(event?.id);
  const addExpense = useAddExpense();
  const deleteExpense = useDeleteExpense();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: "", description: "", supplier: "", total_amount: "", paid_amount: "", due_date: "", status: "pending", notes: "" });

  if (!event) return <p className="text-muted-foreground text-center py-20">Crie um evento primeiro</p>;

  const budget = Number(event.budget_total) || 0;
  const spent = expenses.reduce((s, e) => s + Number(e.paid_amount), 0);
  const forecast = expenses.reduce((s, e) => s + Number(e.total_amount), 0);
  const budgetPercent = budget > 0 ? Math.round((spent / budget) * 100) : 0;

  const categoryData = categories.map((name) => ({
    name,
    value: expenses.filter((e) => e.category === name).reduce((s, e) => s + Number(e.total_amount), 0),
  })).filter((c) => c.value > 0);

  const metricsData = [
    { label: "Orçamento Total", value: `R$ ${budget.toLocaleString("pt-BR")}`, icon: Wallet, color: "bg-primary/10 text-primary" },
    { label: "Gasto até agora", value: `R$ ${spent.toLocaleString("pt-BR")}`, icon: DollarSign, color: "bg-blue-50 text-blue-600" },
    { label: "Previsto restante", value: `R$ ${(forecast - spent).toLocaleString("pt-BR")}`, icon: TrendingDown, color: "bg-yellow-50 text-yellow-600" },
    { label: "Economia vs orçamento", value: `R$ ${(budget - forecast).toLocaleString("pt-BR")}`, icon: TrendingUp, color: "bg-green-50 text-green-600" },
  ];

  const handleAdd = async () => {
    if (!newExpense.category || !newExpense.description || !newExpense.total_amount) { toast.error("Preencha os campos obrigatórios"); return; }
    await addExpense.mutateAsync({
      event_id: event.id,
      category: newExpense.category,
      description: newExpense.description,
      supplier: newExpense.supplier || null,
      total_amount: Number(newExpense.total_amount),
      paid_amount: Number(newExpense.paid_amount) || 0,
      due_date: newExpense.due_date || null,
      status: newExpense.status as any,
      notes: newExpense.notes || null,
    });
    setNewExpense({ category: "", description: "", supplier: "", total_amount: "", paid_amount: "", due_date: "", status: "pending", notes: "" });
    setDialogOpen(false);
    toast.success("Gasto adicionado!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Financeiro</h1>
          <p className="text-sm text-muted-foreground mt-1">Controle seus gastos e orçamento</p>
        </div>
        <Button variant="outline" className="rounded-full font-body" onClick={() => exportFinancial(expenses, budget, event.title)}>
          <Download className="w-4 h-4 mr-1" /> Exportar Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((m) => (
          <div key={m.label} className="card-premium rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{m.label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.color}`}><m.icon className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-display font-semibold tracking-tight text-foreground">{m.value}</p>
          </div>
        ))}
      </div>

      {budget > 0 && (
        <div className="card-premium rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="font-body text-sm text-foreground font-medium">Progresso do orçamento</p>
            <p className="font-body text-sm text-muted-foreground">{budgetPercent}% utilizado</p>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(budgetPercent, 100)}%`, backgroundColor: budgetPercent > 90 ? "hsl(var(--destructive))" : budgetPercent > 70 ? "#EAB308" : "hsl(var(--success))" }} />
          </div>
        </div>
      )}

      {categoryData.length > 0 && (
        <div className="card-premium rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-4">Gastos por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Gasto"]} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card-premium rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">Lançamentos</h3>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full font-body" size="sm"><Plus className="w-4 h-4 mr-1" /> Adicionar gasto</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Adicionar Gasto</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={newExpense.category} onValueChange={(v) => setNewExpense(p => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Descrição</Label><Input value={newExpense.description} onChange={(e) => setNewExpense(p => ({ ...p, description: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Fornecedor</Label><Input value={newExpense.supplier} onChange={(e) => setNewExpense(p => ({ ...p, supplier: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Valor total (R$)</Label><Input type="number" value={newExpense.total_amount} onChange={(e) => setNewExpense(p => ({ ...p, total_amount: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Valor entrada (R$)</Label><Input type="number" value={newExpense.paid_amount} onChange={(e) => setNewExpense(p => ({ ...p, paid_amount: e.target.value }))} /></div>
                </div>
                <div className="space-y-2"><Label>Data de vencimento</Label><Input type="date" value={newExpense.due_date} onChange={(e) => setNewExpense(p => ({ ...p, due_date: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Observações</Label><Textarea rows={2} value={newExpense.notes} onChange={(e) => setNewExpense(p => ({ ...p, notes: e.target.value }))} /></div>
              </div>
              <DialogFooter><Button className="rounded-full font-body" onClick={handleAdd} disabled={addExpense.isPending}>{addExpense.isPending ? "Salvando..." : "Salvar gasto"}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Categoria</TableHead>
              <TableHead className="font-body">Descrição</TableHead>
              <TableHead className="font-body">Fornecedor</TableHead>
              <TableHead className="font-body">Previsto</TableHead>
              <TableHead className="font-body">Pago</TableHead>
              <TableHead className="font-body">Vencimento</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-body text-sm">{e.category}</TableCell>
                <TableCell className="font-body text-sm font-medium text-foreground">{e.description}</TableCell>
                <TableCell className="font-body text-sm text-muted-foreground">{e.supplier || "—"}</TableCell>
                <TableCell className="font-body text-sm">R$ {Number(e.total_amount).toLocaleString("pt-BR")}</TableCell>
                <TableCell className="font-body text-sm font-medium text-foreground">R$ {Number(e.paid_amount).toLocaleString("pt-BR")}</TableCell>
                <TableCell className="font-body text-sm text-muted-foreground">{e.due_date ? new Date(e.due_date).toLocaleDateString("pt-BR") : "—"}</TableCell>
                <TableCell><Badge variant="outline" className={statusMap[e.status || "pending"]?.className}>{statusMap[e.status || "pending"]?.label}</Badge></TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteExpense.mutate({ id: e.id, eventId: event.id })}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {expenses.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Nenhum gasto registrado</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardFinance;
