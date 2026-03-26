import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Gift, Pencil, Trash2, Upload, DollarSign, ArrowDownToLine, QrCode } from "lucide-react";

const mockGifts = [
  { id: 1, name: "Jogo de Panelas", description: "Jogo com 10 peças antiaderente", value: 450, status: "available", buyer: null, photo: null },
  { id: 2, name: "Jogo de Cama Queen", description: "400 fios, algodão egípcio", value: 380, status: "bought", buyer: "Maria Silva", photo: null },
  { id: 3, name: "Cafeteira Elétrica", description: "Nespresso com espumador", value: 600, status: "available", buyer: null, photo: null },
  { id: 4, name: "Aspirador Robot", description: "Limpeza inteligente com app", value: 1200, status: "partial", buyer: "João Santos (R$ 500)", photo: null },
  { id: 5, name: "Smart TV 55\"", description: "4K, Android TV integrado", value: 2800, status: "available", buyer: null, photo: null },
  { id: 6, name: "Air Fryer", description: "12L digital com receitas", value: 350, status: "bought", buyer: "Ana Oliveira", photo: null },
  { id: 7, name: "Jogo de Toalhas", description: "Banho + rosto, 100% algodão", value: 220, status: "available", buyer: null, photo: null },
  { id: 8, name: "Liquidificador", description: "1200W com jarra de vidro", value: 280, status: "bought", buyer: "Fernanda Lima", photo: null },
];

const statusMap: Record<string, { label: string; className: string }> = {
  available: { label: "Disponível", className: "text-green-700 bg-green-50 border-green-200" },
  bought: { label: "Comprado", className: "text-blue-700 bg-blue-50 border-blue-200" },
  partial: { label: "Parcial", className: "text-yellow-700 bg-yellow-50 border-yellow-200" },
};

const mockHistory = [
  { date: "18/03/2025", from: "Maria Silva", gift: "Jogo de Cama Queen", value: 380, pixStatus: "Recebido" },
  { date: "15/03/2025", from: "Ana Oliveira", gift: "Air Fryer", value: 350, pixStatus: "Recebido" },
  { date: "14/03/2025", from: "João Santos", gift: "Aspirador Robot", value: 500, pixStatus: "Recebido" },
  { date: "12/03/2025", from: "Fernanda Lima", gift: "Liquidificador", value: 280, pixStatus: "Recebido" },
];

const DashboardGifts = () => {
  const totalReceived = mockHistory.reduce((acc, h) => acc + h.value, 0);
  const boughtCount = mockGifts.filter((g) => g.status === "bought").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Lista de Presentes</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie presentes e recebimentos via PIX</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-premium rounded-2xl p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Saldo disponível</p>
              <p className="text-3xl font-display font-semibold tracking-tight text-foreground mt-1">
                R$ {totalReceived.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <Button className="mt-4 rounded-full font-body w-full" size="sm">
            <ArrowDownToLine className="w-4 h-4 mr-1" /> Sacar via PIX
          </Button>
        </div>

        <div className="card-premium rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Presentes cadastrados</p>
              <p className="text-3xl font-display font-semibold tracking-tight text-foreground mt-1">{mockGifts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Gift className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 font-body">{boughtCount} já comprados</p>
        </div>

        <div className="card-premium rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Recebimentos</p>
              <p className="text-3xl font-display font-semibold tracking-tight text-foreground mt-1">{mockHistory.length}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 font-body">Todas via PIX instantâneo</p>
        </div>
      </div>

      {/* Add Gift Inline */}
      <div className="card-premium rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-4">Adicionar presente</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px] space-y-1">
            <Label className="text-xs font-body">Nome</Label>
            <Input placeholder="Ex: Jogo de Panelas" />
          </div>
          <div className="w-[140px] space-y-1">
            <Label className="text-xs font-body">Valor (R$)</Label>
            <Input type="number" placeholder="0,00" />
          </div>
          <div className="flex-1 min-w-[180px] space-y-1">
            <Label className="text-xs font-body">Descrição</Label>
            <Input placeholder="Breve descrição" />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 rounded-xl h-10 w-10">
            <Upload className="w-4 h-4" />
          </Button>
          <Button className="rounded-full font-body shrink-0"><Plus className="w-4 h-4 mr-1" /> Adicionar</Button>
        </div>
      </div>

      {/* Gift Grid */}
      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-4">Presentes cadastrados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockGifts.map((gift) => (
            <div key={gift.id} className="card-premium rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-full h-28 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
                <Gift className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <h4 className="font-body font-medium text-foreground text-sm">{gift.name}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{gift.description}</p>
              <p className="text-lg font-display font-semibold text-foreground mt-2">R$ {gift.value}</p>
              <div className="flex items-center justify-between mt-3">
                <Badge variant="outline" className={statusMap[gift.status].className}>
                  {statusMap[gift.status].label}
                </Badge>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
              {gift.buyer && <p className="text-xs text-muted-foreground mt-2">🎉 {gift.buyer}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="card-premium rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">Histórico de Recebimentos</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Data</TableHead>
              <TableHead className="font-body">De quem</TableHead>
              <TableHead className="font-body">Presente</TableHead>
              <TableHead className="font-body">Valor</TableHead>
              <TableHead className="font-body">Status PIX</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockHistory.map((h, i) => (
              <TableRow key={i}>
                <TableCell className="font-body text-sm">{h.date}</TableCell>
                <TableCell className="font-body text-sm font-medium text-foreground">{h.from}</TableCell>
                <TableCell className="font-body text-sm">{h.gift}</TableCell>
                <TableCell className="font-body text-sm font-medium text-foreground">R$ {h.value}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">{h.pixStatus}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PIX Settings */}
      <div className="card-premium rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-4">Configurações de PIX</h3>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label className="font-body text-sm">Chave PIX</Label>
            <Input placeholder="CPF, email, telefone ou chave aleatória" />
          </div>
          <p className="text-xs text-muted-foreground">⚠️ Os valores ficam disponíveis para saque a qualquer momento após a confirmação do PIX.</p>
          <Button className="rounded-full font-body">Salvar chave PIX</Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardGifts;
