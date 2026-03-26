import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingDown, TrendingUp, Wallet, Plus, Download, Pencil, Trash2 } from "lucide-react";

const budget = 80000;
const spent = 42500;
const forecast = 75000;

const categoryData = [
  { name: "Local", value: 15000 },
  { name: "Buffet", value: 12000 },
  { name: "Decoração", value: 5500 },
  { name: "Fotografia", value: 4000 },
  { name: "Música", value: 2500 },
  { name: "Vestimenta", value: 1800 },
  { name: "Convites", value: 800 },
  { name: "Lua de Mel", value: 0 },
  { name: "Outros", value: 900 },
];

const expenses = [
  { id: 1, category: "Local", description: "Aluguel espaço festa", supplier: "Villa Garden", predicted: 15000, paid: 7500, due: "15/06/2025", status: "pending" },
  { id: 2, category: "Buffet", description: "Jantar 150 convidados", supplier: "Chef Rafael", predicted: 12000, paid: 6000, due: "01/11/2025", status: "pending" },
  { id: 3, category: "Fotografia", description: "Cobertura completa", supplier: "Studio Luz", predicted: 4000, paid: 4000, due: "10/03/2025", status: "paid" },
  { id: 4, category: "Decoração", description: "Flores + arranjos", supplier: "Ateliê Rosa", predicted: 5500, paid: 2750, due: "01/12/2025", status: "pending" },
  { id: 5, category: "Música", description: "DJ + som + iluminação", supplier: "DJ Marcos", predicted: 2500, paid: 2500, due: "01/03/2025", status: "paid" },
  { id: 6, category: "Vestimenta", description: "Vestido de noiva", supplier: "Maison Bride", predicted: 1800, paid: 1800, due: "20/02/2025", status: "paid" },
  { id: 7, category: "Convites", description: "Convites digitais premium", supplier: "EventoSite", predicted: 800, paid: 800, due: "15/01/2025", status: "paid" },
  { id: 8, category: "Outros", description: "Lembrancinhas", supplier: "Artesã Local", predicted: 900, paid: 0, due: "10/12/2025", status: "overdue" },
];

const statusMap: Record<string, { label: string; className: string }> = {
  paid: { label: "Pago", className: "text-green-700 bg-green-50 border-green-200" },
  pending: { label: "Pendente", className: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  overdue: { label: "Atrasado", className: "text-red-700 bg-red-50 border-red-200" },
};

const categories = ["Local", "Buffet", "Decoração", "Fotografia", "Música", "Vestimenta", "Convites", "Lua de Mel", "Outros"];

const budgetPercent = Math.round((spent / budget) * 100);

const DashboardFinance = () => {
  const metrics = [
    { label: "Orçamento Total", value: `R$ ${budget.toLocaleString("pt-BR")}`, icon: Wallet, color: "bg-primary/10 text-primary" },
    { label: "Gasto até agora", value: `R$ ${spent.toLocaleString("pt-BR")}`, icon: DollarSign, color: "bg-blue-50 text-blue-600" },
    { label: "Previsto restante", value: `R$ ${(forecast - spent).toLocaleString("pt-BR")}`, icon: TrendingDown, color: "bg-yellow-50 text-yellow-600" },
    { label: "Economia vs orçamento", value: `R$ ${(budget - forecast).toLocaleString("pt-BR")}`, icon: TrendingUp, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Financeiro</h1>
          <p className="text-sm text-muted-foreground mt-1">Controle seus gastos e orçamento</p>
        </div>
        <Button variant="outline" className="rounded-full font-body">
          <Download className="w-4 h-4 mr-1" /> Exportar Excel
        </Button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="card-premium rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{m.label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.color}`}>
                <m.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-display font-semibold tracking-tight text-foreground">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Budget bar */}
      <div className="card-premium rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-body text-sm text-foreground font-medium">Progresso do orçamento</p>
          <p className="font-body text-sm text-muted-foreground">{budgetPercent}% utilizado</p>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${budgetPercent}%`,
              backgroundColor: budgetPercent > 90 ? "hsl(var(--destructive))" : budgetPercent > 70 ? "#EAB308" : "hsl(var(--success))",
            }}
          />
        </div>
      </div>

      {/* Chart */}
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

      {/* Expenses Table */}
      <div className="card-premium rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">Lançamentos</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full font-body" size="sm"><Plus className="w-4 h-4 mr-1" /> Adicionar gasto</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Adicionar Gasto</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Descrição</Label><Input placeholder="Descrição do gasto" /></div>
                <div className="space-y-2"><Label>Fornecedor</Label><Input placeholder="Nome do fornecedor" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Valor total (R$)</Label><Input type="number" placeholder="0,00" /></div>
                  <div className="space-y-2"><Label>Valor entrada (R$)</Label><Input type="number" placeholder="0,00" /></div>
                </div>
                <div className="space-y-2"><Label>Data de vencimento</Label><Input type="date" /></div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Observações</Label><Textarea rows={2} placeholder="Notas adicionais" /></div>
              </div>
              <DialogFooter><Button className="rounded-full font-body">Salvar gasto</Button></DialogFooter>
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
                <TableCell className="font-body text-sm text-muted-foreground">{e.supplier}</TableCell>
                <TableCell className="font-body text-sm">R$ {e.predicted.toLocaleString("pt-BR")}</TableCell>
                <TableCell className="font-body text-sm font-medium text-foreground">R$ {e.paid.toLocaleString("pt-BR")}</TableCell>
                <TableCell className="font-body text-sm text-muted-foreground">{e.due}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusMap[e.status].className}>{statusMap[e.status].label}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardFinance;
