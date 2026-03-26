import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Plus, FileText, MapPin, UtensilsCrossed, Camera, Palette, Shirt, Mail, Music, Moon, DollarSign,
} from "lucide-react";

interface Task {
  id: number;
  name: string;
  category: string;
  deadline: string;
  responsible: string;
  priority: "alta" | "media" | "baixa";
  supplier?: string;
  notes?: string;
  done: boolean;
}

const categoryIcons: Record<string, typeof FileText> = {
  "Documentação e burocracia": FileText,
  "Local e cerimônia": MapPin,
  "Buffet e gastronomia": UtensilsCrossed,
  "Fotografia e vídeo": Camera,
  "Decoração e flores": Palette,
  "Vestuário": Shirt,
  "Convites e papelaria": Mail,
  "Música e entretenimento": Music,
  "Lua de mel": Moon,
  "Financeiro": DollarSign,
};

const categoryEmojis: Record<string, string> = {
  "Documentação e burocracia": "📋",
  "Local e cerimônia": "📍",
  "Buffet e gastronomia": "🍽️",
  "Fotografia e vídeo": "📸",
  "Decoração e flores": "🎨",
  "Vestuário": "👗",
  "Convites e papelaria": "💌",
  "Música e entretenimento": "🎵",
  "Lua de mel": "🌙",
  "Financeiro": "💰",
};

const priorityMap: Record<string, { label: string; className: string }> = {
  alta: { label: "Alta", className: "text-red-700 bg-red-50 border-red-200" },
  media: { label: "Média", className: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  baixa: { label: "Baixa", className: "text-blue-700 bg-blue-50 border-blue-200" },
};

const initialTasks: Task[] = [
  // 12 meses antes
  { id: 1, name: "Definir orçamento total do casamento", category: "Financeiro", deadline: "Jan 2025", responsible: "Casal", priority: "alta", done: true },
  { id: 2, name: "Pesquisar e visitar locais para a cerimônia", category: "Local e cerimônia", deadline: "Jan 2025", responsible: "Casal", priority: "alta", done: true },
  { id: 3, name: "Reservar o local da festa", category: "Local e cerimônia", deadline: "Jan 2025", responsible: "Noiva", priority: "alta", supplier: "Villa Garden", done: true },
  { id: 4, name: "Montar lista preliminar de convidados", category: "Convites e papelaria", deadline: "Jan 2025", responsible: "Casal", priority: "alta", done: true },
  // 10 meses
  { id: 5, name: "Contratar fotógrafo e cinegrafista", category: "Fotografia e vídeo", deadline: "Mar 2025", responsible: "Noiva", priority: "alta", supplier: "Studio Luz", done: true },
  { id: 6, name: "Escolher e contratar buffet", category: "Buffet e gastronomia", deadline: "Mar 2025", responsible: "Casal", priority: "alta", supplier: "Chef Rafael", done: true },
  { id: 7, name: "Iniciar processo de habilitação de casamento", category: "Documentação e burocracia", deadline: "Mar 2025", responsible: "Casal", priority: "alta", done: false },
  { id: 8, name: "Pesquisar músicos e DJ", category: "Música e entretenimento", deadline: "Mar 2025", responsible: "Noivo", priority: "media", done: true },
  // 8 meses
  { id: 9, name: "Escolher vestido de noiva", category: "Vestuário", deadline: "Mai 2025", responsible: "Noiva", priority: "alta", supplier: "Maison Bride", done: true },
  { id: 10, name: "Escolher terno do noivo", category: "Vestuário", deadline: "Mai 2025", responsible: "Noivo", priority: "media", done: false },
  { id: 11, name: "Definir tema e paleta de cores", category: "Decoração e flores", deadline: "Mai 2025", responsible: "Noiva", priority: "media", done: true },
  { id: 12, name: "Contratar decorador", category: "Decoração e flores", deadline: "Mai 2025", responsible: "Noiva", priority: "alta", supplier: "Ateliê Rosa", done: false },
  // 6 meses
  { id: 13, name: "Criar site do casamento no EventoSite", category: "Convites e papelaria", deadline: "Jul 2025", responsible: "Casal", priority: "alta", done: true },
  { id: 14, name: "Enviar convites (digitais ou físicos)", category: "Convites e papelaria", deadline: "Jul 2025", responsible: "Casal", priority: "alta", done: false },
  { id: 15, name: "Planejar lua de mel", category: "Lua de mel", deadline: "Jul 2025", responsible: "Casal", priority: "media", done: false },
  { id: 16, name: "Reservar hospedagem lua de mel", category: "Lua de mel", deadline: "Jul 2025", responsible: "Noivo", priority: "media", done: false },
  // 4 meses
  { id: 17, name: "Fazer degustação do buffet", category: "Buffet e gastronomia", deadline: "Set 2025", responsible: "Casal", priority: "media", done: false },
  { id: 18, name: "Definir cardápio final", category: "Buffet e gastronomia", deadline: "Set 2025", responsible: "Casal", priority: "alta", done: false },
  { id: 19, name: "Encomendar bolo de casamento", category: "Buffet e gastronomia", deadline: "Set 2025", responsible: "Noiva", priority: "media", done: false },
  { id: 20, name: "Primeira prova do vestido", category: "Vestuário", deadline: "Set 2025", responsible: "Noiva", priority: "alta", done: false },
  { id: 21, name: "Escolher alianças", category: "Vestuário", deadline: "Set 2025", responsible: "Casal", priority: "alta", done: false },
  // 3 meses
  { id: 22, name: "Confirmar lista de presentes no EventoSite", category: "Financeiro", deadline: "Out 2025", responsible: "Casal", priority: "media", done: false },
  { id: 23, name: "Contratar cerimonialista", category: "Local e cerimônia", deadline: "Out 2025", responsible: "Noiva", priority: "media", done: false },
  { id: 24, name: "Definir playlist e repertório musical", category: "Música e entretenimento", deadline: "Out 2025", responsible: "Casal", priority: "baixa", done: false },
  { id: 25, name: "Contratar serviço de transporte", category: "Local e cerimônia", deadline: "Out 2025", responsible: "Noivo", priority: "baixa", done: false },
  // 2 meses
  { id: 26, name: "Segunda prova do vestido", category: "Vestuário", deadline: "Nov 2025", responsible: "Noiva", priority: "alta", done: false },
  { id: 27, name: "Confirmar presença dos convidados via RSVP", category: "Convites e papelaria", deadline: "Nov 2025", responsible: "Casal", priority: "alta", done: false },
  { id: 28, name: "Agendar maquiagem e cabelo (teste)", category: "Vestuário", deadline: "Nov 2025", responsible: "Noiva", priority: "media", done: false },
  { id: 29, name: "Definir disposição das mesas", category: "Local e cerimônia", deadline: "Nov 2025", responsible: "Casal", priority: "media", done: false },
  { id: 30, name: "Comprar lembrancinhas", category: "Decoração e flores", deadline: "Nov 2025", responsible: "Noiva", priority: "baixa", done: false },
  // 1 mês
  { id: 31, name: "Reunião final com todos os fornecedores", category: "Documentação e burocracia", deadline: "Dez 2025", responsible: "Casal", priority: "alta", done: false },
  { id: 32, name: "Confirmar horários e logística do dia", category: "Local e cerimônia", deadline: "Dez 2025", responsible: "Cerimonialista", priority: "alta", done: false },
  { id: 33, name: "Última prova do vestido", category: "Vestuário", deadline: "Dez 2025", responsible: "Noiva", priority: "alta", done: false },
  { id: 34, name: "Preparar votos (se personalizados)", category: "Local e cerimônia", deadline: "Dez 2025", responsible: "Casal", priority: "media", done: false },
  { id: 35, name: "Confirmar reservas de lua de mel", category: "Lua de mel", deadline: "Dez 2025", responsible: "Noivo", priority: "alta", done: false },
  // Semana do evento
  { id: 36, name: "Ensaio da cerimônia", category: "Local e cerimônia", deadline: "Dez 2025", responsible: "Casal", priority: "alta", done: false },
  { id: 37, name: "Entrega das alianças ao padrinho", category: "Documentação e burocracia", deadline: "Dez 2025", responsible: "Noivo", priority: "alta", done: false },
  { id: 38, name: "Pagar saldo final dos fornecedores", category: "Financeiro", deadline: "Dez 2025", responsible: "Casal", priority: "alta", done: false },
  { id: 39, name: "Preparar malas para lua de mel", category: "Lua de mel", deadline: "Dez 2025", responsible: "Casal", priority: "media", done: false },
  { id: 40, name: "Relaxar e curtir o grande dia! 🎉", category: "Local e cerimônia", deadline: "Dez 2025", responsible: "Casal", priority: "alta", done: false },
  { id: 41, name: "Registrar casamento no cartório", category: "Documentação e burocracia", deadline: "Dez 2025", responsible: "Casal", priority: "alta", done: false },
  { id: 42, name: "Verificar passaportes e vistos", category: "Lua de mel", deadline: "Nov 2025", responsible: "Casal", priority: "alta", done: false },
];

const DashboardChecklist = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deadlineFilter, setDeadlineFilter] = useState("all");

  const doneCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const progress = Math.round((doneCount / totalCount) * 100);

  const toggleTask = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const allCategories = [...new Set(tasks.map((t) => t.category))];

  const filtered = tasks.filter((t) => {
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    if (deadlineFilter === "done" && !t.done) return false;
    if (deadlineFilter === "undone" && t.done) return false;
    return true;
  });

  const grouped = filtered.reduce<Record<string, Task[]>>((acc, t) => {
    (acc[t.category] = acc[t.category] || []).push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Checklist</h1>
        <p className="text-sm text-muted-foreground mt-1">Organize as tarefas do seu casamento</p>
      </div>

      {/* Progress */}
      <div className="card-premium rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-body text-sm font-medium text-foreground">
            Você completou <span className="text-primary font-semibold">{doneCount}</span> de <span className="font-semibold">{totalCount}</span> tarefas
          </p>
          <span className="text-sm font-body text-muted-foreground">{progress}%</span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {allCategories.map((c) => <SelectItem key={c} value={c}>{categoryEmojis[c]} {c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={deadlineFilter} onValueChange={setDeadlineFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="undone">Pendentes</SelectItem>
            <SelectItem value="done">Concluídas</SelectItem>
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full font-body ml-auto"><Plus className="w-4 h-4 mr-1" /> Adicionar tarefa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Nova Tarefa</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Nome da tarefa</Label><Input placeholder="Ex: Escolher as alianças" /></div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{allCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Prazo</Label><Input placeholder="Ex: Jul 2025" /></div>
                <div className="space-y-2"><Label>Responsável</Label><Input placeholder="Ex: Noiva" /></div>
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Fornecedor vinculado</Label><Input placeholder="Opcional" /></div>
              <div className="space-y-2"><Label>Notas</Label><Textarea rows={2} placeholder="Anotações adicionais" /></div>
            </div>
            <DialogFooter><Button className="rounded-full font-body">Salvar tarefa</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Groups */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, catTasks]) => {
          const Icon = categoryIcons[category] || FileText;
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{categoryEmojis[category]}</span>
                <h3 className="font-display text-base font-semibold text-foreground">{category}</h3>
                <span className="text-xs text-muted-foreground font-body">
                  ({catTasks.filter((t) => t.done).length}/{catTasks.length})
                </span>
              </div>
              <div className="space-y-2">
                {catTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "card-premium rounded-xl p-4 flex items-center gap-4 transition-all duration-300",
                      task.done && "opacity-60"
                    )}
                  >
                    <Checkbox
                      checked={task.done}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="transition-transform duration-200 data-[state=checked]:scale-110"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-body text-sm text-foreground", task.done && "line-through text-muted-foreground")}>
                        {task.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground font-body">{task.deadline}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground font-body">{task.responsible}</span>
                        {task.supplier && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-secondary font-body">{task.supplier}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className={priorityMap[task.priority].className}>
                      {priorityMap[task.priority].label}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardChecklist;
