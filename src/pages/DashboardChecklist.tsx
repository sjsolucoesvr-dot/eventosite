import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Plus, FileText, MapPin, UtensilsCrossed, Camera, Palette, Shirt, Mail, Music, Moon, DollarSign } from "lucide-react";
import { useChecklist, useToggleChecklistItem, useAddChecklistItem, type EventRow, type ChecklistRow } from "@/hooks/useEvent";
import { toast } from "sonner";

const categoryEmojis: Record<string, string> = {
  "Documentação": "📋", "Local e cerimônia": "📍", "Buffet e gastronomia": "🍽️",
  "Fotografia e vídeo": "📸", "Decoração e flores": "🎨", "Vestuário": "👗",
  "Convites e papelaria": "💌", "Música e entretenimento": "🎵", "Lua de mel": "🌙", "Financeiro": "💰",
};

const priorityMap: Record<string, { label: string; className: string }> = {
  high: { label: "Alta", className: "text-red-700 bg-red-50 border-red-200" },
  medium: { label: "Média", className: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  low: { label: "Baixa", className: "text-blue-700 bg-blue-50 border-blue-200" },
};

interface Props { event: EventRow | null | undefined; }

const DashboardChecklist = ({ event }: Props) => {
  const { data: tasks = [] } = useChecklist(event?.id);
  const toggleItem = useToggleChecklistItem();
  const addItem = useAddChecklistItem();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deadlineFilter, setDeadlineFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", category: "", priority: "medium", responsible: "", supplier: "", notes: "" });

  if (!event) return <p className="text-muted-foreground text-center py-20">Crie um evento primeiro</p>;

  const doneCount = tasks.filter((t) => t.is_completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const allCategories = [...new Set(tasks.map((t) => t.category))];

  const filtered = tasks.filter((t) => {
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    if (deadlineFilter === "done" && !t.is_completed) return false;
    if (deadlineFilter === "undone" && t.is_completed) return false;
    return true;
  });

  const grouped = filtered.reduce<Record<string, ChecklistRow[]>>((acc, t) => {
    (acc[t.category] = acc[t.category] || []).push(t);
    return acc;
  }, {});

  const handleAdd = async () => {
    if (!newTask.title || !newTask.category) { toast.error("Preencha nome e categoria"); return; }
    await addItem.mutateAsync({
      event_id: event.id,
      title: newTask.title,
      category: newTask.category,
      priority: newTask.priority,
      responsible: newTask.responsible || null,
      supplier: newTask.supplier || null,
      notes: newTask.notes || null,
    });
    setNewTask({ title: "", category: "", priority: "medium", responsible: "", supplier: "", notes: "" });
    setDialogOpen(false);
    toast.success("Tarefa adicionada!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Checklist</h1>
        <p className="text-sm text-muted-foreground mt-1">Organize as tarefas do seu evento</p>
      </div>

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

      <div className="flex flex-wrap gap-3 items-center">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {allCategories.map((c) => <SelectItem key={c} value={c}>{categoryEmojis[c] || "📌"} {c}</SelectItem>)}
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full font-body ml-auto"><Plus className="w-4 h-4 mr-1" /> Adicionar tarefa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Nova Tarefa</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Nome da tarefa</Label><Input value={newTask.title} onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={newTask.category} onValueChange={(v) => setNewTask(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(categoryEmojis).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Responsável</Label><Input value={newTask.responsible} onChange={(e) => setNewTask(p => ({ ...p, responsible: e.target.value }))} /></div>
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select value={newTask.priority} onValueChange={(v) => setNewTask(p => ({ ...p, priority: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Fornecedor vinculado</Label><Input value={newTask.supplier} onChange={(e) => setNewTask(p => ({ ...p, supplier: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Notas</Label><Textarea rows={2} value={newTask.notes} onChange={(e) => setNewTask(p => ({ ...p, notes: e.target.value }))} /></div>
            </div>
            <DialogFooter><Button className="rounded-full font-body" onClick={handleAdd} disabled={addItem.isPending}>{addItem.isPending ? "Salvando..." : "Salvar tarefa"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([category, catTasks]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{categoryEmojis[category] || "📌"}</span>
              <h3 className="font-display text-base font-semibold text-foreground">{category}</h3>
              <span className="text-xs text-muted-foreground font-body">({catTasks.filter((t) => t.is_completed).length}/{catTasks.length})</span>
            </div>
            <div className="space-y-2">
              {catTasks.map((task) => (
                <div key={task.id} className={cn("card-premium rounded-xl p-4 flex items-center gap-4 transition-all duration-300", task.is_completed && "opacity-60")}>
                  <Checkbox
                    checked={task.is_completed || false}
                    onCheckedChange={(checked) => toggleItem.mutate({ id: task.id, is_completed: !!checked, eventId: event.id })}
                    className="transition-transform duration-200 data-[state=checked]:scale-110"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-body text-sm text-foreground", task.is_completed && "line-through text-muted-foreground")}>{task.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {task.due_date && <span className="text-xs text-muted-foreground font-body">{new Date(task.due_date).toLocaleDateString("pt-BR")}</span>}
                      {task.responsible && <><span className="text-xs text-muted-foreground">•</span><span className="text-xs text-muted-foreground font-body">{task.responsible}</span></>}
                      {task.supplier && <><span className="text-xs text-muted-foreground">•</span><span className="text-xs text-secondary font-body">{task.supplier}</span></>}
                    </div>
                  </div>
                  {task.priority && priorityMap[task.priority] && (
                    <Badge variant="outline" className={priorityMap[task.priority].className}>{priorityMap[task.priority].label}</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <p className="text-muted-foreground text-center py-10">Nenhuma tarefa encontrada</p>
        )}
      </div>
    </div>
  );
};

export default DashboardChecklist;
