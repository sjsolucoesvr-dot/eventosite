import { create } from "zustand";
import { addMonths } from "date-fns";

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "confirmed" | "pending" | "declined" | "no-response";
  companions: number;
  dietary: string;
  confirmedAt: string | null;
  table?: string;
  notes?: string;
}

export interface GiftItem {
  id: number;
  name: string;
  description: string;
  value: number;
  status: "available" | "bought" | "partial";
  buyer: string | null;
  photo: string | null;
}

export interface GiftTransaction {
  date: string;
  from: string;
  gift: string;
  value: number;
  pixStatus: string;
}

export interface Expense {
  id: number;
  category: string;
  description: string;
  supplier: string;
  predicted: number;
  paid: number;
  due: string;
  status: "paid" | "pending" | "overdue";
  notes?: string;
}

export interface ChecklistTask {
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

export interface EventTheme {
  id: string;
  name: string;
  primaryDark: string;
  primary: string;
  primaryLight: string;
}

export interface WallMessage {
  id: number;
  name: string;
  message: string;
  date: string;
}

export interface EventConfig {
  name: string;
  slug: string;
  type: string;
  date: Date;
  location: string;
  welcomeMessage: string;
  story: string;
  rsvpDeadline: Date;
  themeId: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  bodyFontFamily: string;
  enabledSections: Record<string, boolean>;
  pixKey: string;
  spotifyPlaylistUrl: string;
  sectionColors: Record<string, { bg: string; text: string; accent: string }>;
}

export interface EventStore {
  event: EventConfig;
  guests: Guest[];
  gifts: GiftItem[];
  giftTransactions: GiftTransaction[];
  expenses: Expense[];
  tasks: ChecklistTask[];
  wallMessages: WallMessage[];
  budget: number;
  updateEvent: (partial: Partial<EventConfig>) => void;
  toggleTask: (id: number) => void;
  toggleSection: (id: string) => void;
  addWallMessage: (name: string, message: string) => void;
}

const eventDate = addMonths(new Date(), 6);
const rsvpDate = addMonths(new Date(), 5);

export const eventThemes: EventTheme[] = [
  { id: "classico", name: "Clássico Dourado", primaryDark: "#1A1A1A", primary: "#C9A96E", primaryLight: "#F5E6CC" },
  { id: "rosa", name: "Rosa Romance", primaryDark: "#2D0A18", primary: "#E8547A", primaryLight: "#FFF0F3" },
  { id: "azul", name: "Azul Noite", primaryDark: "#0D2340", primary: "#5DA0F4", primaryLight: "#E8F2FF" },
  { id: "verde", name: "Verde Jardim", primaryDark: "#0D2B0E", primary: "#3D8C40", primaryLight: "#EDFAED" },
  { id: "boho", name: "Boho Bege", primaryDark: "#3D2B0A", primary: "#8B6914", primaryLight: "#F5EEDC" },
  { id: "roxo", name: "Roxo Místico", primaryDark: "#2D1B4E", primary: "#A855F7", primaryLight: "#F3E8FF" },
  { id: "lilas", name: "Lilás Elegante", primaryDark: "#72489b", primary: "#9b75c1", primaryLight: "#FFFFFF" },
];

const defaultSections: Record<string, boolean> = {
  hero: true, countdown: true, story: true, gallery: true, info: true,
  rsvp: true, gifts: true, location: true, message: true, footer: true,
  playlist: true, wall: true,
};

const mockWallMessages: WallMessage[] = [
  { id: 1, name: "Maria Silva", message: "Estou muito feliz por vocês! Que Deus abençoe essa união! 🥰", date: "15/03/2025" },
  { id: 2, name: "João Santos", message: "Parabéns ao casal mais lindo! Ansiosos pelo grande dia!", date: "12/03/2025" },
  { id: 3, name: "Fernanda Lima", message: "Vocês merecem toda a felicidade do mundo! ❤️", date: "18/03/2025" },
  { id: 4, name: "Beatriz Almeida", message: "Que amor! Mal posso esperar para celebrar com vocês!", date: "20/03/2025" },
  { id: 5, name: "Thiago Rocha", message: "Que esse dia seja apenas o começo de uma vida linda juntos! 🎉", date: "22/03/2025" },
];

const mockGuests: Guest[] = [
  { id: 1, name: "Maria Silva", email: "maria@email.com", phone: "(11) 99999-1234", status: "confirmed", companions: 1, dietary: "Vegetariana", confirmedAt: "10/03/2025" },
  { id: 2, name: "João Santos", email: "joao@email.com", phone: "(11) 98888-5678", status: "confirmed", companions: 0, dietary: "Nenhuma", confirmedAt: "12/03/2025" },
  { id: 3, name: "Ana Oliveira", email: "ana@email.com", phone: "(21) 97777-9012", status: "pending", companions: 2, dietary: "Sem glúten", confirmedAt: null },
  { id: 4, name: "Carlos Souza", email: "carlos@email.com", phone: "(31) 96666-3456", status: "declined", companions: 0, dietary: "Nenhuma", confirmedAt: "08/03/2025" },
  { id: 5, name: "Fernanda Lima", email: "fernanda@email.com", phone: "(41) 95555-7890", status: "confirmed", companions: 1, dietary: "Nenhuma", confirmedAt: "15/03/2025" },
  { id: 6, name: "Ricardo Pereira", email: "ricardo@email.com", phone: "(51) 94444-2345", status: "pending", companions: 0, dietary: "Vegano", confirmedAt: null },
  { id: 7, name: "Juliana Costa", email: "juliana@email.com", phone: "(61) 93333-6789", status: "confirmed", companions: 1, dietary: "Nenhuma", confirmedAt: "18/03/2025" },
  { id: 8, name: "Paulo Mendes", email: "paulo@email.com", phone: "(71) 92222-0123", status: "pending", companions: 0, dietary: "Intolerante a lactose", confirmedAt: null },
  { id: 9, name: "Beatriz Almeida", email: "beatriz@email.com", phone: "(11) 91111-4567", status: "confirmed", companions: 2, dietary: "Nenhuma", confirmedAt: "20/03/2025" },
  { id: 10, name: "Roberto Dias", email: "roberto@email.com", phone: "(21) 90000-8901", status: "confirmed", companions: 0, dietary: "Nenhuma", confirmedAt: "22/03/2025" },
  { id: 11, name: "Larissa Gomes", email: "larissa@email.com", phone: "(31) 98765-4321", status: "no-response", companions: 1, dietary: "Nenhuma", confirmedAt: null },
  { id: 12, name: "Thiago Rocha", email: "thiago@email.com", phone: "(41) 97654-3210", status: "confirmed", companions: 1, dietary: "Sem lactose", confirmedAt: "25/03/2025" },
  { id: 13, name: "Camila Nunes", email: "camila@email.com", phone: "(51) 96543-2109", status: "confirmed", companions: 0, dietary: "Nenhuma", confirmedAt: "26/03/2025" },
  { id: 14, name: "Diego Martins", email: "diego@email.com", phone: "(61) 95432-1098", status: "pending", companions: 0, dietary: "Nenhuma", confirmedAt: null },
  { id: 15, name: "Patrícia Lopes", email: "patricia@email.com", phone: "(71) 94321-0987", status: "declined", companions: 0, dietary: "Nenhuma", confirmedAt: "05/03/2025" },
];

const mockGifts: GiftItem[] = [
  { id: 1, name: "Jogo de Panelas", description: "Jogo com 10 peças antiaderente premium", value: 450, status: "available", buyer: null, photo: null },
  { id: 2, name: "Jogo de Cama Queen", description: "400 fios, algodão egípcio", value: 380, status: "bought", buyer: "Maria Silva", photo: null },
  { id: 3, name: "Cafeteira Elétrica", description: "Nespresso com espumador de leite", value: 600, status: "available", buyer: null, photo: null },
  { id: 4, name: "Aspirador Robot", description: "Limpeza inteligente com app", value: 1200, status: "partial", buyer: "João Santos (R$ 500)", photo: null },
  { id: 5, name: "Smart TV 55\"", description: "4K, Android TV integrado", value: 2800, status: "available", buyer: null, photo: null },
  { id: 6, name: "Air Fryer", description: "12L digital com receitas", value: 350, status: "bought", buyer: "Ana Oliveira", photo: null },
  { id: 7, name: "Jogo de Toalhas", description: "Banho + rosto, 100% algodão", value: 220, status: "available", buyer: null, photo: null },
  { id: 8, name: "Liquidificador", description: "1200W com jarra de vidro", value: 280, status: "bought", buyer: "Fernanda Lima", photo: null },
  { id: 9, name: "Viagem Romântica", description: "Contribuição para lua de mel", value: 1500, status: "available", buyer: null, photo: null },
  { id: 10, name: "Jantar Romântico", description: "Experiência gastronômica para dois", value: 400, status: "bought", buyer: "Beatriz Almeida", photo: null },
  { id: 11, name: "Kit Churrasco", description: "Conjunto premium com 12 peças", value: 350, status: "available", buyer: null, photo: null },
  { id: 12, name: "Robô de Cozinha", description: "Multifuncional com 20 funções", value: 890, status: "bought", buyer: "Roberto Dias", photo: null },
];

const mockTransactions: GiftTransaction[] = [
  { date: "18/03/2025", from: "Maria Silva", gift: "Jogo de Cama Queen", value: 380, pixStatus: "Recebido" },
  { date: "17/03/2025", from: "Beatriz Almeida", gift: "Jantar Romântico", value: 400, pixStatus: "Recebido" },
  { date: "15/03/2025", from: "Ana Oliveira", gift: "Air Fryer", value: 350, pixStatus: "Recebido" },
  { date: "14/03/2025", from: "João Santos", gift: "Aspirador Robot", value: 500, pixStatus: "Recebido" },
  { date: "12/03/2025", from: "Fernanda Lima", gift: "Liquidificador", value: 280, pixStatus: "Recebido" },
  { date: "10/03/2025", from: "Roberto Dias", gift: "Robô de Cozinha", value: 890, pixStatus: "Recebido" },
  { date: "08/03/2025", from: "Thiago Rocha", gift: "Contribuição livre", value: 200, pixStatus: "Recebido" },
  { date: "05/03/2025", from: "Camila Nunes", gift: "Contribuição livre", value: 150, pixStatus: "Recebido" },
];

const mockExpenses: Expense[] = [
  { id: 1, category: "Local", description: "Aluguel espaço festa", supplier: "Villa Garden", predicted: 15000, paid: 7500, due: "15/06/2025", status: "pending" },
  { id: 2, category: "Buffet", description: "Jantar 150 convidados", supplier: "Chef Rafael", predicted: 12000, paid: 6000, due: "01/11/2025", status: "pending" },
  { id: 3, category: "Fotografia", description: "Cobertura completa", supplier: "Studio Luz", predicted: 4000, paid: 4000, due: "10/03/2025", status: "paid" },
  { id: 4, category: "Decoração", description: "Flores + arranjos", supplier: "Ateliê Rosa", predicted: 5500, paid: 2750, due: "01/12/2025", status: "pending" },
  { id: 5, category: "Música", description: "DJ + som + iluminação", supplier: "DJ Marcos", predicted: 2500, paid: 2500, due: "01/03/2025", status: "paid" },
  { id: 6, category: "Vestimenta", description: "Vestido de noiva", supplier: "Maison Bride", predicted: 3800, paid: 3800, due: "20/02/2025", status: "paid" },
  { id: 7, category: "Convites", description: "Convites digitais premium", supplier: "EventoSite", predicted: 800, paid: 800, due: "15/01/2025", status: "paid" },
  { id: 8, category: "Outros", description: "Lembrancinhas", supplier: "Artesã Local", predicted: 900, paid: 0, due: "01/02/2025", status: "overdue" },
  { id: 9, category: "Lua de Mel", description: "Passagens aéreas", supplier: "Agência Viagem", predicted: 8000, paid: 4000, due: "15/08/2025", status: "pending" },
  { id: 10, category: "Buffet", description: "Bolo de casamento", supplier: "Doce Encanto", predicted: 1800, paid: 0, due: "01/01/2025", status: "overdue" },
  { id: 11, category: "Decoração", description: "Iluminação cênica", supplier: "LuzArte", predicted: 2200, paid: 0, due: "15/11/2025", status: "pending" },
  { id: 12, category: "Outros", description: "Papelaria cerimônia", supplier: "Papel & Estilo", predicted: 500, paid: 0, due: "01/02/2025", status: "overdue" },
];

const mockTasks: ChecklistTask[] = [
  { id: 1, name: "Definir orçamento total do casamento", category: "Financeiro", deadline: "12 meses antes", responsible: "Casal", priority: "alta", done: true },
  { id: 2, name: "Pesquisar e visitar locais para a cerimônia", category: "Local e cerimônia", deadline: "12 meses antes", responsible: "Casal", priority: "alta", done: true },
  { id: 3, name: "Reservar o local da festa", category: "Local e cerimônia", deadline: "12 meses antes", responsible: "Noiva", priority: "alta", supplier: "Villa Garden", done: true },
  { id: 4, name: "Montar lista preliminar de convidados", category: "Convites e papelaria", deadline: "12 meses antes", responsible: "Casal", priority: "alta", done: true },
  { id: 5, name: "Contratar fotógrafo e cinegrafista", category: "Fotografia e vídeo", deadline: "10 meses antes", responsible: "Noiva", priority: "alta", supplier: "Studio Luz", done: true },
  { id: 6, name: "Escolher e contratar buffet", category: "Buffet e gastronomia", deadline: "10 meses antes", responsible: "Casal", priority: "alta", supplier: "Chef Rafael", done: true },
  { id: 7, name: "Iniciar processo de habilitação de casamento", category: "Documentação e burocracia", deadline: "10 meses antes", responsible: "Casal", priority: "alta", done: false },
  { id: 8, name: "Pesquisar músicos e DJ", category: "Música e entretenimento", deadline: "10 meses antes", responsible: "Noivo", priority: "media", done: true },
  { id: 9, name: "Escolher vestido de noiva", category: "Vestuário", deadline: "8 meses antes", responsible: "Noiva", priority: "alta", supplier: "Maison Bride", done: true },
  { id: 10, name: "Escolher terno do noivo", category: "Vestuário", deadline: "8 meses antes", responsible: "Noivo", priority: "media", done: false },
  { id: 11, name: "Definir tema e paleta de cores", category: "Decoração e flores", deadline: "8 meses antes", responsible: "Noiva", priority: "media", done: true },
  { id: 12, name: "Contratar decorador", category: "Decoração e flores", deadline: "8 meses antes", responsible: "Noiva", priority: "alta", supplier: "Ateliê Rosa", done: false },
  { id: 13, name: "Criar site do casamento no EventoSite", category: "Convites e papelaria", deadline: "6 meses antes", responsible: "Casal", priority: "alta", done: true },
  { id: 14, name: "Enviar convites (digitais ou físicos)", category: "Convites e papelaria", deadline: "6 meses antes", responsible: "Casal", priority: "alta", done: false },
  { id: 15, name: "Planejar lua de mel", category: "Lua de mel", deadline: "6 meses antes", responsible: "Casal", priority: "media", done: false },
  { id: 16, name: "Reservar hospedagem lua de mel", category: "Lua de mel", deadline: "6 meses antes", responsible: "Noivo", priority: "media", done: false },
  { id: 17, name: "Fazer degustação do buffet", category: "Buffet e gastronomia", deadline: "4 meses antes", responsible: "Casal", priority: "media", done: false },
  { id: 18, name: "Definir cardápio final", category: "Buffet e gastronomia", deadline: "4 meses antes", responsible: "Casal", priority: "alta", done: false },
  { id: 19, name: "Encomendar bolo de casamento", category: "Buffet e gastronomia", deadline: "4 meses antes", responsible: "Noiva", priority: "media", done: false },
  { id: 20, name: "Primeira prova do vestido", category: "Vestuário", deadline: "4 meses antes", responsible: "Noiva", priority: "alta", done: true },
  { id: 21, name: "Escolher alianças", category: "Vestuário", deadline: "4 meses antes", responsible: "Casal", priority: "alta", done: true },
  { id: 22, name: "Confirmar lista de presentes no EventoSite", category: "Financeiro", deadline: "3 meses antes", responsible: "Casal", priority: "media", done: true },
  { id: 23, name: "Contratar cerimonialista", category: "Local e cerimônia", deadline: "3 meses antes", responsible: "Noiva", priority: "media", done: false },
  { id: 24, name: "Definir playlist e repertório musical", category: "Música e entretenimento", deadline: "3 meses antes", responsible: "Casal", priority: "baixa", done: false },
  { id: 25, name: "Contratar serviço de transporte", category: "Local e cerimônia", deadline: "3 meses antes", responsible: "Noivo", priority: "baixa", done: false },
  { id: 26, name: "Segunda prova do vestido", category: "Vestuário", deadline: "2 meses antes", responsible: "Noiva", priority: "alta", done: false },
  { id: 27, name: "Confirmar presença dos convidados via RSVP", category: "Convites e papelaria", deadline: "2 meses antes", responsible: "Casal", priority: "alta", done: false },
  { id: 28, name: "Agendar maquiagem e cabelo (teste)", category: "Vestuário", deadline: "2 meses antes", responsible: "Noiva", priority: "media", done: false },
  { id: 29, name: "Definir disposição das mesas", category: "Local e cerimônia", deadline: "2 meses antes", responsible: "Casal", priority: "media", done: false },
  { id: 30, name: "Comprar lembrancinhas", category: "Decoração e flores", deadline: "2 meses antes", responsible: "Noiva", priority: "baixa", done: false },
  { id: 31, name: "Reunião final com todos os fornecedores", category: "Documentação e burocracia", deadline: "1 mês antes", responsible: "Casal", priority: "alta", done: false },
  { id: 32, name: "Confirmar horários e logística do dia", category: "Local e cerimônia", deadline: "1 mês antes", responsible: "Cerimonialista", priority: "alta", done: false },
  { id: 33, name: "Última prova do vestido", category: "Vestuário", deadline: "1 mês antes", responsible: "Noiva", priority: "alta", done: false },
  { id: 34, name: "Preparar votos (se personalizados)", category: "Local e cerimônia", deadline: "1 mês antes", responsible: "Casal", priority: "media", done: false },
  { id: 35, name: "Confirmar reservas de lua de mel", category: "Lua de mel", deadline: "1 mês antes", responsible: "Noivo", priority: "alta", done: false },
  { id: 36, name: "Ensaio da cerimônia", category: "Local e cerimônia", deadline: "1 semana antes", responsible: "Casal", priority: "alta", done: false },
  { id: 37, name: "Entrega das alianças ao padrinho", category: "Documentação e burocracia", deadline: "1 semana antes", responsible: "Noivo", priority: "alta", done: false },
  { id: 38, name: "Pagar saldo final dos fornecedores", category: "Financeiro", deadline: "1 semana antes", responsible: "Casal", priority: "alta", done: false },
  { id: 39, name: "Preparar malas para lua de mel", category: "Lua de mel", deadline: "1 semana antes", responsible: "Casal", priority: "media", done: false },
  { id: 40, name: "Relaxar e curtir o grande dia! 🎉", category: "Local e cerimônia", deadline: "Dia do evento", responsible: "Casal", priority: "alta", done: false },
  { id: 41, name: "Registrar casamento no cartório", category: "Documentação e burocracia", deadline: "Após evento", responsible: "Casal", priority: "alta", done: false },
  { id: 42, name: "Verificar passaportes e vistos", category: "Lua de mel", deadline: "2 meses antes", responsible: "Casal", priority: "alta", done: false },
];

export const useEventStore = create<EventStore>((set) => ({
  event: {
    name: "Ana & Carlos",
    slug: "ana-e-carlos",
    type: "casamento",
    date: eventDate,
    location: "Espaço Villa Verde, São Paulo/SP",
    welcomeMessage: "Estamos muito felizes em compartilhar este momento especial com vocês! Será uma honra ter a sua presença neste dia tão importante para nós.",
    story: "Nos conhecemos em uma tarde chuvosa de março de 2019, em uma cafeteria no centro de São Paulo. O que começou com um café compartilhado se transformou no maior amor de nossas vidas. Depois de 5 anos juntos, decidimos celebrar nossa união com as pessoas que mais amamos.",
    rsvpDeadline: rsvpDate,
    themeId: "classico",
    primaryColor: "#C9A96E",
    secondaryColor: "#1A1A2E",
    fontFamily: "'Playfair Display', serif",
    bodyFontFamily: "'DM Sans', sans-serif",
    enabledSections: { ...defaultSections },
    pixKey: "ana.carlos@email.com",
    spotifyPlaylistUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
    sectionColors: {},
  },
  guests: mockGuests,
  gifts: mockGifts,
  giftTransactions: mockTransactions,
  expenses: mockExpenses,
  tasks: mockTasks,
  wallMessages: mockWallMessages,
  budget: 80000,
  updateEvent: (partial) =>
    set((state) => ({ event: { ...state.event, ...partial } })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    })),
  toggleSection: (id) =>
    set((state) => ({
      event: {
        ...state.event,
        enabledSections: {
          ...state.event.enabledSections,
          [id]: !state.event.enabledSections[id],
        },
      },
    })),
}));
