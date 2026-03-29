import * as XLSX from "xlsx";
import type { GuestRow, ExpenseRow } from "@/hooks/useEvent";

export function exportGuestList(guests: GuestRow[], eventTitle: string) {
  const data = guests.map((g) => ({
    Nome: g.full_name,
    Email: g.email || "",
    Telefone: g.phone || "",
    Status:
      g.status === "confirmed" ? "Confirmado"
      : g.status === "declined" ? "Recusou"
      : g.status === "maybe" ? "Talvez"
      : "Pendente",
    Acompanhantes: g.companions || 0,
    Mesa: g.table_number || "",
    "Restrição alimentar": g.dietary || "",
    Mensagem: g.message || "",
    "Data de confirmação": g.confirmed_at
      ? new Date(g.confirmed_at).toLocaleDateString("pt-BR")
      : "",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = [
    { wch: 25 }, { wch: 30 }, { wch: 16 }, { wch: 12 },
    { wch: 14 }, { wch: 8 }, { wch: 20 }, { wch: 40 }, { wch: 20 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Convidados");
  XLSX.writeFile(wb, `${eventTitle} - Lista de Convidados.xlsx`);
}

export function exportFinancial(expenses: ExpenseRow[], budget: number, eventTitle: string) {
  const data = expenses.map((e) => ({
    Categoria: e.category,
    Descrição: e.description,
    Fornecedor: e.supplier || "",
    "Valor total": e.total_amount,
    "Valor pago": e.paid_amount,
    Restante: Number(e.total_amount) - Number(e.paid_amount),
    Vencimento: e.due_date
      ? new Date(e.due_date).toLocaleDateString("pt-BR")
      : "",
    Status:
      e.status === "paid" ? "Pago"
      : e.status === "overdue" ? "Atrasado"
      : "Pendente",
  }));

  const total = expenses.reduce((s, e) => s + Number(e.total_amount), 0);
  const paid = expenses.reduce((s, e) => s + Number(e.paid_amount), 0);
  data.push({
    Categoria: "TOTAL",
    Descrição: "",
    Fornecedor: "",
    "Valor total": total,
    "Valor pago": paid,
    Restante: total - paid,
    Vencimento: "",
    Status: `Orçamento: R$ ${budget.toLocaleString("pt-BR")}`,
  });

  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = [
    { wch: 16 }, { wch: 30 }, { wch: 20 }, { wch: 14 },
    { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Financeiro");
  XLSX.writeFile(wb, `${eventTitle} - Controle Financeiro.xlsx`);
}
