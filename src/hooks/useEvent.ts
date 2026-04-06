import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type EventRow = Tables<"events">;
export type GuestRow = Tables<"guests">;
export type GiftRow = Tables<"gifts">;
export type GiftPaymentRow = Tables<"gift_payments">;
export type ExpenseRow = Tables<"expenses">;
export type ChecklistRow = Tables<"checklist_items">;
export type WallMessageRow = Tables<"wall_messages">;
export type GalleryPhotoRow = Tables<"gallery_photos">;
export type NotificationRow = Tables<"notifications">;

export function useUserEvent() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["event", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", user!.id)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function usePublicEvent(slug: string) {
  return useQuery({
    queryKey: ["public-event", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<TablesUpdate<"events">>) => {
      const { error } = await supabase.from("events").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event"] }),
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (event: TablesInsert<"events">) => {
      const { data, error } = await supabase.from("events").insert(event).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event"] }),
  });
}

// GUESTS
export function useGuests(eventId: string | undefined) {
  return useQuery({
    queryKey: ["guests", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guests").select("*").eq("event_id", eventId!).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}

export function usePublicGuests(eventId: string | undefined) {
  return useQuery({
    queryKey: ["public-guests", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guests").select("full_name, status, companions").eq("event_id", eventId!);
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}

export function useAddGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (guest: TablesInsert<"guests">) => {
      const { data, error } = await supabase.from("guests").insert(guest).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["guests", vars.event_id] }),
  });
}

export function useUpdateGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; event_id: string } & Partial<TablesUpdate<"guests">>) => {
      const { error } = await supabase.from("guests").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["guests", vars.event_id] }),
  });
}

export function useDeleteGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
      const { error } = await supabase.from("guests").delete().eq("id", id);
      if (error) throw error;
      return eventId;
    },
    onSuccess: (eventId) => qc.invalidateQueries({ queryKey: ["guests", eventId] }),
  });
}

// GIFTS
export function useGifts(eventId: string | undefined) {
  return useQuery({
    queryKey: ["gifts", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gifts").select("*").eq("event_id", eventId!).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}

export function useAddGift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (gift: TablesInsert<"gifts">) => {
      const { error } = await supabase.from("gifts").insert(gift);
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["gifts", vars.event_id] }),
  });
}

export function useUpdateGift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, event_id, ...updates }: { id: string; event_id: string } & Partial<TablesUpdate<"gifts">>) => {
      const { error } = await supabase.from("gifts").update(updates).eq("id", id);
      if (error) throw error;
      return event_id;
    },
    onSuccess: (eventId) => qc.invalidateQueries({ queryKey: ["gifts", eventId] }),
  });
}

export function useDeleteGift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
      const { error } = await supabase.from("gifts").delete().eq("id", id);
      if (error) throw error;
      return eventId;
    },
    onSuccess: (eventId) => qc.invalidateQueries({ queryKey: ["gifts", eventId] }),
  });
}

// GIFT PAYMENTS
export function useGiftPayments(eventId: string | undefined) {
  return useQuery({
    queryKey: ["gift-payments", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gift_payments").select("*").eq("event_id", eventId!).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}

// EXPENSES
export function useExpenses(eventId: string | undefined) {
  return useQuery({
    queryKey: ["expenses", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses").select("*").eq("event_id", eventId!).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}

export function useAddExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (expense: TablesInsert<"expenses">) => {
      const { error } = await supabase.from("expenses").insert(expense);
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["expenses", vars.event_id] }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, event_id, ...updates }: { id: string; event_id: string } & Partial<TablesUpdate<"expenses">>) => {
      const { error } = await supabase.from("expenses").update(updates).eq("id", id);
      if (error) throw error;
      return event_id;
    },
    onSuccess: (eventId) => qc.invalidateQueries({ queryKey: ["expenses", eventId] }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      return eventId;
    },
    onSuccess: (eventId) => qc.invalidateQueries({ queryKey: ["expenses", eventId] }),
  });
}

// CHECKLIST
export function useChecklist(eventId: string | undefined) {
  return useQuery({
    queryKey: ["checklist", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklist_items").select("*").eq("event_id", eventId!).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}

export function useToggleChecklistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_completed, eventId }: { id: string; is_completed: boolean; eventId: string }) => {
      const { error } = await supabase.from("checklist_items").update({
        is_completed,
        completed_at: is_completed ? new Date().toISOString() : null,
      }).eq("id", id);
      if (error) throw error;
      return eventId;
    },
    onSuccess: (eventId) => qc.invalidateQueries({ queryKey: ["checklist", eventId] }),
  });
}

export function useAddChecklistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: TablesInsert<"checklist_items">) => {
      const { error } = await supabase.from("checklist_items").insert(item);
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["checklist", vars.event_id] }),
  });
}

// WALL MESSAGES
export function useWallMessages(eventId: string | undefined) {
  return useQuery({
    queryKey: ["wall-messages", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wall_messages").select("*").eq("event_id", eventId!).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}

export function useAddWallMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (msg: TablesInsert<"wall_messages">) => {
      const { error } = await supabase.from("wall_messages").insert(msg);
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["wall-messages", vars.event_id] }),
  });
}

// GALLERY
export function useGalleryPhotos(eventId: string | undefined) {
  return useQuery({
    queryKey: ["gallery", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_photos").select("*").eq("event_id", eventId!).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}

// NOTIFICATIONS
export function useNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useMarkNotificationsRead() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("user_id", user!.id).eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// PHOTO UPLOAD
export async function uploadEventPhoto(file: File, eventId: string, type: "cover" | "gallery" | "gifts") {
  const ext = file.name.split(".").pop();
  const path = `${eventId}/${type}/${Date.now()}.${ext}`;

  const compressed = file.size > 1_000_000 ? await compressImage(file) : file;

  const { error } = await supabase.storage.from("event-photos").upload(path, compressed, { upsert: true });
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage.from("event-photos").getPublicUrl(path);
  return { path, publicUrl };
}

async function compressImage(file: File, maxWidth = 1920, quality = 0.85): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ratio = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        resolve(new File([blob!], file.name, { type: "image/jpeg" }));
        URL.revokeObjectURL(url);
      }, "image/jpeg", quality);
    };
    img.src = url;
  });
}

// CHECKLIST AUTO-POPULATE
export async function createDefaultChecklist(eventId: string, eventDate: Date) {
  const items = [
    { category: "Local e cerimônia", title: "Definir o estilo e tema do casamento", months: 12, priority: "high" },
    { category: "Local e cerimônia", title: "Pesquisar e visitar espaços para a festa", months: 12, priority: "high" },
    { category: "Local e cerimônia", title: "Reservar o espaço da festa", months: 12, priority: "high" },
    { category: "Documentação", title: "Dar entrada no processo de habilitação no cartório", months: 12, priority: "high" },
    { category: "Fotografia e vídeo", title: "Pesquisar e contratar fotógrafo", months: 12, priority: "high" },
    { category: "Buffet e gastronomia", title: "Pesquisar buffets e catering", months: 12, priority: "medium" },
    { category: "Fotografia e vídeo", title: "Contratar videomaker", months: 9, priority: "high" },
    { category: "Música e entretenimento", title: "Contratar banda ou DJ", months: 9, priority: "high" },
    { category: "Buffet e gastronomia", title: "Contratar buffet", months: 9, priority: "high" },
    { category: "Vestuário", title: "Iniciar busca pelo vestido de noiva", months: 9, priority: "high" },
    { category: "Decoração e flores", title: "Contratar decorador", months: 9, priority: "medium" },
    { category: "Convites e papelaria", title: "Definir lista de convidados", months: 9, priority: "high" },
    { category: "Vestuário", title: "Escolher e encomendar o vestido", months: 6, priority: "high" },
    { category: "Vestuário", title: "Escolher traje do noivo", months: 6, priority: "medium" },
    { category: "Convites e papelaria", title: "Criar e enviar site do casamento", months: 6, priority: "high" },
    { category: "Lua de mel", title: "Pesquisar e reservar viagem de lua de mel", months: 6, priority: "medium" },
    { category: "Buffet e gastronomia", title: "Fazer degustação com o buffet", months: 6, priority: "high" },
    { category: "Convites e papelaria", title: "Encomendar convites impressos", months: 6, priority: "medium" },
    { category: "Documentação", title: "Confirmar habilitação no cartório", months: 3, priority: "high" },
    { category: "Vestuário", title: "Fazer primeira prova do vestido", months: 3, priority: "high" },
    { category: "Convites e papelaria", title: "Enviar convites", months: 3, priority: "high" },
    { category: "Buffet e gastronomia", title: "Definir cardápio final", months: 3, priority: "high" },
    { category: "Financeiro", title: "Criar lista de presentes", months: 3, priority: "medium" },
    { category: "Música e entretenimento", title: "Definir playlist e músicas especiais", months: 3, priority: "medium" },
    { category: "Convites e papelaria", title: "Confirmar lista de presença final", months: 1, priority: "high" },
    { category: "Vestuário", title: "Prova final do vestido", months: 1, priority: "high" },
    { category: "Local e cerimônia", title: "Ensaio na cerimônia", months: 1, priority: "high" },
    { category: "Buffet e gastronomia", title: "Confirmar número de convidados com buffet", months: 1, priority: "high" },
    { category: "Financeiro", title: "Quitar todos os fornecedores restantes", months: 1, priority: "high" },
    { category: "Lua de mel", title: "Confirmar reservas e documentos de viagem", months: 1, priority: "medium" },
    { category: "Local e cerimônia", title: "Montar mapa de mesas", months: 0, priority: "high" },
    { category: "Documentação", title: "Separar alianças e documentos do cartório", months: 0, priority: "high" },
  ];

  const rows = items.map((item, i) => {
    const dueDate = new Date(eventDate);
    dueDate.setMonth(dueDate.getMonth() - item.months);
    return {
      event_id: eventId,
      category: item.category,
      title: item.title,
      due_months_before: item.months,
      due_date: dueDate.toISOString().split("T")[0],
      priority: item.priority,
      sort_order: i,
    };
  });

  await supabase.from("checklist_items").insert(rows);
}

// GEOCODING
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const encoded = encodeURIComponent(address + ", Brasil");
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1`,
    { headers: { "User-Agent": "EventoSite/1.0" } }
  );
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}
