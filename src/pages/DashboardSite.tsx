import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarIcon, Monitor, Smartphone, Upload, Check, Image, Heart,
  Clock, BookOpen, Camera, MapPin, MessageSquare, Gift, Users, Layout,
} from "lucide-react";

const themes = [
  { id: "classico", name: "Clássico Dourado", primary: "#C9A96E", secondary: "#1A1A2E", bg: "#FFFDF5" },
  { id: "rosa", name: "Rosa Romance", primary: "#E8547A", secondary: "#F5C6D0", bg: "#FFF8F9" },
  { id: "azul", name: "Azul Noite", primary: "#2C3E6B", secondary: "#A8C4E0", bg: "#F0F4FA" },
  { id: "verde", name: "Verde Jardim", primary: "#3D8C40", secondary: "#A8D5A2", bg: "#F2FAF2" },
  { id: "boho", name: "Boho Bege", primary: "#A0826D", secondary: "#D4C4B0", bg: "#FAF5EF" },
  { id: "roxo", name: "Roxo Místico", primary: "#6B3FA0", secondary: "#C8A2E8", bg: "#F8F2FF" },
];

const fonts = [
  { id: "playfair", name: "Playfair Display", family: "'Playfair Display', serif" },
  { id: "cormorant", name: "Cormorant Garamond", family: "'Cormorant Garamond', serif" },
  { id: "raleway", name: "Raleway", family: "'Raleway', sans-serif" },
  { id: "great-vibes", name: "Great Vibes", family: "'Great Vibes', cursive" },
];

const sections = [
  { id: "hero", label: "Hero / Capa", icon: Layout },
  { id: "countdown", label: "Contagem Regressiva", icon: Clock },
  { id: "story", label: "Nossa História", icon: BookOpen },
  { id: "gallery", label: "Galeria de Fotos", icon: Camera },
  { id: "info", label: "Informações do Evento", icon: CalendarIcon },
  { id: "rsvp", label: "Confirmação de Presença (RSVP)", icon: Users },
  { id: "gifts", label: "Lista de Presentes", icon: Gift },
  { id: "location", label: "Localização / Mapa", icon: MapPin },
  { id: "message", label: "Mensagem dos Anfitriões", icon: MessageSquare },
  { id: "footer", label: "Rodapé", icon: Layout },
];

const DashboardSite = () => {
  const [eventDate, setEventDate] = useState<Date>();
  const [rsvpDate, setRsvpDate] = useState<Date>();
  const [selectedTheme, setSelectedTheme] = useState("rosa");
  const [selectedFont, setSelectedFont] = useState("playfair");
  const [primaryColor, setPrimaryColor] = useState("#E8547A");
  const [secondaryColor, setSecondaryColor] = useState("#C9A96E");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(
    Object.fromEntries(sections.map((s) => [s.id, true]))
  );
  const [eventName, setEventName] = useState("Ana & Pedro");
  const [welcomeMessage, setWelcomeMessage] = useState("Estamos muito felizes em compartilhar este momento com vocês!");

  const currentTheme = themes.find((t) => t.id === selectedTheme)!;

  const toggleSection = (id: string) =>
    setEnabledSections((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Editor Panel */}
      <div className="w-[40%] min-w-[380px] overflow-y-auto border-r border-border p-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground mb-1">Meu Site</h1>
        <p className="text-sm text-muted-foreground mb-6">Personalize o site do seu evento</p>

        <Tabs defaultValue="conteudo" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="conteudo" className="flex-1 font-body text-sm">Conteúdo</TabsTrigger>
            <TabsTrigger value="aparencia" className="flex-1 font-body text-sm">Aparência</TabsTrigger>
            <TabsTrigger value="secoes" className="flex-1 font-body text-sm">Seções</TabsTrigger>
          </TabsList>

          <TabsContent value="conteudo" className="space-y-5">
            <div className="space-y-2">
              <Label className="font-body text-sm">Nome do evento / casal</Label>
              <Input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Ana & Pedro" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Tipo de evento</Label>
              <Select defaultValue="casamento">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Casamento", "Aniversário", "Formatura", "Batizado", "Corporativo", "Festa"].map((t) => (
                    <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Data do evento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !eventDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={eventDate} onSelect={setEventDate} locale={ptBR} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Local do evento</Label>
              <Input placeholder="Ex: Espaço Villa Garden, São Paulo - SP" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Mensagem de boas-vindas</Label>
              <Textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Texto "Nossa História"</Label>
              <Textarea placeholder="Conte aqui como vocês se conheceram..." rows={5} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Data limite para RSVP</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !rsvpDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {rsvpDate ? format(rsvpDate, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={rsvpDate} onSelect={setRsvpDate} locale={ptBR} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </TabsContent>

          <TabsContent value="aparencia" className="space-y-6">
            <div className="space-y-3">
              <Label className="font-body text-sm font-medium">Tema visual</Label>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSelectedTheme(theme.id);
                      setPrimaryColor(theme.primary);
                    }}
                    className={cn(
                      "relative rounded-2xl p-4 text-left transition-all duration-300 border",
                      selectedTheme === theme.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/30 hover:-translate-y-0.5"
                    )}
                    style={{ backgroundColor: theme.bg }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.primary }} />
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.secondary }} />
                    </div>
                    <span className="text-xs font-body font-medium text-foreground">{theme.name}</span>
                    {selectedTheme === theme.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body text-sm">Cor principal</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                  <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 font-mono text-xs" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Cor secundária</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                  <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1 font-mono text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm">Fonte do título</Label>
              <div className="grid grid-cols-2 gap-2">
                {fonts.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFont(f.id)}
                    className={cn(
                      "rounded-xl border p-3 text-center transition-all",
                      selectedFont === f.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    )}
                  >
                    <span style={{ fontFamily: f.family }} className="text-lg text-foreground">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm">Foto de capa</Label>
              <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Arraste ou clique para enviar</p>
                <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG ou WEBP até 5MB</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm">Galeria de fotos</Label>
              <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Image className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Envie múltiplas fotos</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Até 20 fotos</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="secoes" className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">Ative ou desative seções do seu site</p>
            {sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <section.icon className="w-4 h-4 text-secondary" />
                  <span className="font-body text-sm text-foreground">{section.label}</span>
                </div>
                <Switch checked={enabledSections[section.id]} onCheckedChange={() => toggleSection(section.id)} />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col bg-muted/30">
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
          <span className="text-sm font-body text-muted-foreground">Preview ao vivo</span>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={cn("p-1.5 rounded-md transition-colors", previewMode === "desktop" ? "bg-card shadow-sm" : "text-muted-foreground")}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={cn("p-1.5 rounded-md transition-colors", previewMode === "mobile" ? "bg-card shadow-sm" : "text-muted-foreground")}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-start justify-center p-6 overflow-auto">
          <div
            className={cn(
              "bg-card rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-500",
              previewMode === "desktop" ? "w-full max-w-3xl" : "w-[375px]"
            )}
            style={{ backgroundColor: currentTheme.bg }}
          >
            {/* Mini Preview */}
            <div className="relative h-64 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}22)` }}>
              <Heart className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-6" style={{ color: primaryColor }} />
              <div className="text-center mt-6">
                <h2 className="text-3xl font-display font-semibold tracking-tight" style={{ color: currentTheme.primary, fontFamily: fonts.find(f => f.id === selectedFont)?.family }}>
                  {eventName}
                </h2>
                <p className="text-sm mt-2" style={{ color: "#6B7280" }}>
                  {eventDate ? format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "20 de Dezembro de 2025"}
                </p>
              </div>
            </div>

            {enabledSections.countdown && (
              <div className="py-8 text-center border-t" style={{ borderColor: `${primaryColor}15` }}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: primaryColor }}>Faltam</p>
                <div className="flex justify-center gap-6">
                  {[{ n: 180, l: "Dias" }, { n: 12, l: "Horas" }, { n: 45, l: "Min" }].map((item) => (
                    <div key={item.l} className="text-center">
                      <span className="text-2xl font-display font-semibold text-foreground">{item.n}</span>
                      <span className="block text-xs text-muted-foreground">{item.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {enabledSections.message && (
              <div className="px-8 py-8 text-center">
                <p className="text-sm text-muted-foreground leading-relaxed italic">"{welcomeMessage}"</p>
              </div>
            )}

            {enabledSections.rsvp && (
              <div className="px-8 py-6 text-center border-t" style={{ borderColor: `${primaryColor}15` }}>
                <button className="rounded-full px-6 py-2.5 text-sm font-body font-medium text-white" style={{ backgroundColor: primaryColor }}>
                  Confirmar Presença
                </button>
              </div>
            )}

            {enabledSections.footer && (
              <div className="px-8 py-4 text-center border-t" style={{ borderColor: `${primaryColor}10` }}>
                <p className="text-xs text-muted-foreground">Feito com ❤️ no EventoSite</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSite;
