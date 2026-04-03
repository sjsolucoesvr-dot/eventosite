import { useState, useEffect } from "react";
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
import {
  defaultSiteSections,
  getReadableTextColor,
  getSectionPalette,
  resolveSectionColors,
  resolveSiteSections,
  resolveSiteTheme,
  siteThemes,
  withAlpha,
} from "@/lib/site-customization";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ColorPickerField from "@/components/dashboard/ColorPickerField";
import {
  CalendarIcon, Monitor, Smartphone, Upload, Check, Image, Heart, Save, Loader2,
  Clock, BookOpen, Camera, MapPin, MessageSquare, Gift, Users, Layout, Music, MessageCircle, QrCode,
} from "lucide-react";
import { toast } from "sonner";
import { useUpdateEvent } from "@/hooks/useEvent";
import type { EventRow } from "@/hooks/useEvent";

const themes = siteThemes;

const fonts = [
  { id: "playfair", name: "Playfair Display", family: "'Playfair Display', serif" },
  { id: "cormorant", name: "Cormorant Garamond", family: "'Cormorant Garamond', serif" },
  { id: "great-vibes", name: "Great Vibes", family: "'Great Vibes', cursive" },
  { id: "dancing", name: "Dancing Script", family: "'Dancing Script', cursive" },
  { id: "raleway", name: "Raleway", family: "'Raleway', sans-serif" },
  { id: "boston-angel", name: "Boston Angel", family: "'Boston Angel', serif" },
  { id: "glacial", name: "Glacial Indifference", family: "'Glacial Indifference', sans-serif" },
];

const bodyFonts = [
  { id: "dm-sans", name: "DM Sans", family: "'DM Sans', sans-serif" },
  { id: "glacial", name: "Glacial Indifference", family: "'Glacial Indifference', sans-serif" },
  { id: "raleway", name: "Raleway", family: "'Raleway', sans-serif" },
  { id: "cormorant", name: "Cormorant Garamond", family: "'Cormorant Garamond', serif" },
];

const sectionsList = [
  { id: "hero", label: "Hero / Capa", icon: Layout },
  { id: "countdown", label: "Contagem Regressiva", icon: Clock },
  { id: "story", label: "Nossa História", icon: BookOpen },
  { id: "gallery", label: "Galeria de Fotos", icon: Camera },
  { id: "info", label: "Informações do Evento", icon: CalendarIcon },
  { id: "playlist", label: "Playlist (Spotify)", icon: Music },
  { id: "rsvp", label: "Confirmação de Presença (RSVP)", icon: Users },
  { id: "gifts", label: "Lista de Presentes", icon: Gift },
  { id: "wall", label: "Mural de Recados", icon: MessageCircle },
  { id: "location", label: "Localização / Mapa", icon: MapPin },
  { id: "message", label: "Mensagem dos Anfitriões", icon: MessageSquare },
  { id: "footer", label: "Rodapé", icon: Layout },
];

interface Props { event?: EventRow | null; }

const parseLocalDate = (value?: string | null) => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

const formatLocalDate = (value?: Date) => (value ? format(value, "yyyy-MM-dd") : null);

const DashboardSite = ({ event }: Props) => {
  const updateEvent = useUpdateEvent();

  // Content state
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("casamento");
  const [eventDate, setEventDate] = useState<Date>();
  const [eventLocation, setEventLocation] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [story, setStory] = useState("");
  const [rsvpDate, setRsvpDate] = useState<Date>();
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [eventDateOpen, setEventDateOpen] = useState(false);
  const [rsvpDateOpen, setRsvpDateOpen] = useState(false);

  // Appearance state
  const [selectedTheme, setSelectedTheme] = useState("rosa");
  const [selectedFont, setSelectedFont] = useState("playfair");
  const [selectedBodyFont, setSelectedBodyFont] = useState("dm-sans");
  const [primaryColor, setPrimaryColor] = useState("#E8547A");
  const [secondaryColor, setSecondaryColor] = useState("#C9A96E");
  const [colorPreviewMode, setColorPreviewMode] = useState<"solid" | "gradient">("solid");

  // Sections state
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(
    () => ({ ...defaultSiteSections })
  );
  const [sectionColorEditing, setSectionColorEditing] = useState<string | null>(null);
  const [sectionColors, setSectionColors] = useState<Record<string, { bg: string; text: string; accent: string }>>({});

  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  // Load event data
  useEffect(() => {
    if (!event) return;
    setEventName(event.title || "");
    setEventType(event.type || "casamento");
    setEventDate(parseLocalDate(event.date));
    setEventLocation(event.location || "");
    setWelcomeMessage(event.welcome_message || "");
    setStory(event.story || "");
    setRsvpDate(parseLocalDate(event.rsvp_deadline));
    setSpotifyUrl(event.spotify_playlist_url || "");
    setSelectedTheme(event.theme || "rosa");
    setSelectedFont(event.font_title === "Boston Angel" ? "boston-angel" : event.font_title === "Playfair Display" ? "playfair" : event.font_title === "Great Vibes" ? "great-vibes" : event.font_title === "Dancing Script" ? "dancing" : event.font_title === "Cormorant Garamond" ? "cormorant" : event.font_title === "Raleway" ? "raleway" : event.font_title === "Glacial Indifference" ? "glacial" : "playfair");
    setSelectedBodyFont(event.font_body === "Glacial Indifference" ? "glacial" : event.font_body === "Raleway" ? "raleway" : event.font_body === "Cormorant Garamond" ? "cormorant" : "dm-sans");
    setPrimaryColor(event.color_primary || "#E8547A");
    setSecondaryColor(event.color_secondary || "#C9A96E");
    setEnabledSections(resolveSiteSections(event.sections));
    setSectionColors(resolveSectionColors(event.section_colors) as Record<string, { bg: string; text: string; accent: string }>);
  }, [event]);

  if (!event) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <p className="text-muted-foreground">Crie um evento primeiro no onboarding para editar seu site.</p>
      </div>
    );
  }

  const saveContent = async () => {
    try {
      await updateEvent.mutateAsync({
        id: event.id,
        title: eventName,
        type: eventType,
        date: formatLocalDate(eventDate),
        location: eventLocation,
        welcome_message: welcomeMessage,
        story,
        rsvp_deadline: formatLocalDate(rsvpDate),
        spotify_playlist_url: spotifyUrl,
      });
      toast.success("Conteúdo salvo com sucesso!");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    }
  };

  const saveAppearance = async () => {
    const fontFamily = fonts.find((f) => f.id === selectedFont)?.name || "Playfair Display";
    const bodyFamily = bodyFonts.find((f) => f.id === selectedBodyFont)?.name || "DM Sans";
    try {
      await updateEvent.mutateAsync({
        id: event.id,
        theme: selectedTheme,
        font_title: fontFamily,
        font_body: bodyFamily,
        color_primary: primaryColor,
        color_secondary: secondaryColor,
      });
      toast.success("Aparência salva com sucesso!");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    }
  };

  const saveSections = async () => {
    try {
      await updateEvent.mutateAsync({
        id: event.id,
        sections: enabledSections as any,
        section_colors: sectionColors as any,
      });
      toast.success("Seções salvas com sucesso!");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    }
  };

  const currentTheme = resolveSiteTheme({
    theme: selectedTheme,
    color_primary: primaryColor,
    color_secondary: secondaryColor,
  });
  const toggleSection = (id: string) =>
    setEnabledSections((prev) => ({ ...prev, [id]: !prev[id] }));
  const updateSectionColor = (sectionId: string, field: "bg" | "text" | "accent", value: string) => {
    setSectionColors((prev) => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] || { bg: "", text: "", accent: "" }), [field]: value },
    }));
  };

  const isSaving = updateEvent.isPending;

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
              <Select value={eventType} onValueChange={setEventType}>
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
              <Popover open={eventDateOpen} onOpenChange={setEventDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !eventDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={eventDate} onSelect={(d) => { setEventDate(d); setEventDateOpen(false); }} locale={ptBR} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Local do evento</Label>
              <Input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Ex: Espaço Villa Garden, São Paulo - SP" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Mensagem de boas-vindas</Label>
              <Textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Texto "Nossa História"</Label>
              <Textarea value={story} onChange={(e) => setStory(e.target.value)} placeholder="Conte aqui como vocês se conheceram..." rows={5} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Data limite para RSVP</Label>
              <Popover open={rsvpDateOpen} onOpenChange={setRsvpDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !rsvpDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {rsvpDate ? format(rsvpDate, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={rsvpDate} onSelect={(d) => { setRsvpDate(d); setRsvpDateOpen(false); }} locale={ptBR} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Link da Playlist (Spotify Embed)</Label>
              <Input value={spotifyUrl} onChange={(e) => setSpotifyUrl(e.target.value)} placeholder="https://open.spotify.com/embed/playlist/..." />
            </div>

            {/* Save button */}
            <Button onClick={saveContent} disabled={isSaving} className="w-full rounded-full gap-2 mt-4">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar conteúdo
            </Button>
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
                      setSecondaryColor(theme.secondary);
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

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Label className="font-body text-sm font-medium">Editor de cores</Label>
                <div className="inline-flex rounded-full border border-border bg-muted/40 p-1">
                  <button
                    className={cn(
                      "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                      colorPreviewMode === "solid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                    )}
                    onClick={() => setColorPreviewMode("solid")}
                    type="button"
                  >
                    Cor sólida
                  </button>
                  <button
                    className={cn(
                      "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                      colorPreviewMode === "gradient" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                    )}
                    onClick={() => setColorPreviewMode("gradient")}
                    type="button"
                  >
                    Gradiente
                  </button>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <ColorPickerField
                  label="Cor principal"
                  onChange={setPrimaryColor}
                  previewMode={colorPreviewMode}
                  secondaryValue={secondaryColor}
                  value={primaryColor}
                />
                <ColorPickerField
                  label="Cor secundária"
                  onChange={setSecondaryColor}
                  previewMode={colorPreviewMode}
                  secondaryValue={primaryColor}
                  value={secondaryColor}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm">Fonte dos títulos</Label>
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
              <Label className="font-body text-sm">Fonte do corpo de texto</Label>
              <div className="grid grid-cols-2 gap-2">
                {bodyFonts.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedBodyFont(f.id)}
                    className={cn(
                      "rounded-xl border p-3 text-center transition-all",
                      selectedBodyFont === f.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    )}
                  >
                    <span style={{ fontFamily: f.family }} className="text-sm text-foreground">{f.name}</span>
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

            {/* Save button */}
            <Button onClick={saveAppearance} disabled={isSaving} className="w-full rounded-full gap-2 mt-4">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar aparência
            </Button>
          </TabsContent>

          <TabsContent value="secoes" className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">Ative ou desative seções do seu site. Clique no ícone de paleta para customizar cores por seção.</p>
            {sectionsList.map((section) => (
              <div key={section.id}>
                <div className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <section.icon className="w-4 h-4 text-secondary" />
                    <span className="font-body text-sm text-foreground">{section.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSectionColorEditing(sectionColorEditing === section.id ? null : section.id)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors text-muted-foreground hover:text-primary",
                        sectionColorEditing === section.id && "text-primary bg-primary/10"
                      )}
                      title="Cores desta seção"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    </button>
                    <Switch checked={enabledSections[section.id]} onCheckedChange={() => toggleSection(section.id)} />
                  </div>
                </div>
                {sectionColorEditing === section.id && (
                  <div className="ml-7 mt-2 mb-3 p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Cores personalizadas para "{section.label}"</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Fundo</Label>
                        <div className="flex items-center gap-1">
                          <input type="color" value={sectionColors[section.id]?.bg || currentTheme.bg} onChange={(e) => updateSectionColor(section.id, "bg", e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
                          <Input value={sectionColors[section.id]?.bg || ""} onChange={(e) => updateSectionColor(section.id, "bg", e.target.value)} placeholder="Auto" className="flex-1 font-mono text-xs h-8" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Texto</Label>
                        <div className="flex items-center gap-1">
                          <input type="color" value={sectionColors[section.id]?.text || "#333333"} onChange={(e) => updateSectionColor(section.id, "text", e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
                          <Input value={sectionColors[section.id]?.text || ""} onChange={(e) => updateSectionColor(section.id, "text", e.target.value)} placeholder="Auto" className="flex-1 font-mono text-xs h-8" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Destaque</Label>
                        <div className="flex items-center gap-1">
                          <input type="color" value={sectionColors[section.id]?.accent || primaryColor} onChange={(e) => updateSectionColor(section.id, "accent", e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
                          <Input value={sectionColors[section.id]?.accent || ""} onChange={(e) => updateSectionColor(section.id, "accent", e.target.value)} placeholder="Auto" className="flex-1 font-mono text-xs h-8" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Save button */}
            <Button onClick={saveSections} disabled={isSaving} className="w-full rounded-full gap-2 mt-4">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar seções
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col bg-muted/30">
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
          <span className="text-sm font-body text-muted-foreground">Preview ao vivo</span>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button onClick={() => setPreviewMode("desktop")} className={cn("p-1.5 rounded-md transition-colors", previewMode === "desktop" ? "bg-card shadow-sm" : "text-muted-foreground")}>
              <Monitor className="w-4 h-4" />
            </button>
            <button onClick={() => setPreviewMode("mobile")} className={cn("p-1.5 rounded-md transition-colors", previewMode === "mobile" ? "bg-card shadow-sm" : "text-muted-foreground")}>
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-start justify-center p-6 overflow-auto">
          {previewMode === "mobile" ? (
            <div className="relative">
              <div className="relative w-[390px] rounded-[3rem] border-[12px] border-foreground/90 bg-foreground/90 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-foreground/90 rounded-b-2xl z-10" />
                <div className="rounded-[2.2rem] overflow-hidden bg-card" style={{ backgroundColor: currentTheme.bg }}>
                  <div className="pt-7">
                    <PreviewContent currentTheme={currentTheme} primaryColor={primaryColor} secondaryColor={secondaryColor} selectedFont={selectedFont} selectedBodyFont={selectedBodyFont} eventName={eventName} eventDate={eventDate} welcomeMessage={welcomeMessage} enabledSections={enabledSections} />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full" />
            </div>
          ) : (
            <div className="w-full max-w-3xl bg-card rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden" style={{ backgroundColor: currentTheme.bg }}>
              <PreviewContent currentTheme={currentTheme} primaryColor={primaryColor} secondaryColor={secondaryColor} selectedFont={selectedFont} selectedBodyFont={selectedBodyFont} eventName={eventName} eventDate={eventDate} welcomeMessage={welcomeMessage} enabledSections={enabledSections} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PreviewContentProps {
  currentTheme: typeof themes[0];
  primaryColor: string;
  secondaryColor: string;
  selectedFont: string;
  selectedBodyFont: string;
  eventName: string;
  eventDate: Date | undefined;
  welcomeMessage: string;
  enabledSections: Record<string, boolean>;
}

const PreviewContent = ({ currentTheme, primaryColor, secondaryColor, selectedFont, selectedBodyFont, eventName, eventDate, welcomeMessage, enabledSections }: PreviewContentProps) => {
  const bodyFamily = bodyFonts.find((f) => f.id === selectedBodyFont)?.family || "'DM Sans', sans-serif";

  return (
    <div style={{ fontFamily: bodyFamily }}>
      <div className="relative h-64 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}22)` }}>
        <Heart className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-6" style={{ color: primaryColor }} />
        <div className="text-center mt-6">
          <h2 className="text-3xl font-semibold tracking-tight" style={{ color: currentTheme.primary, fontFamily: fonts.find((f) => f.id === selectedFont)?.family }}>
            {eventName || "Seu Evento"}
          </h2>
          <p className="text-sm mt-2" style={{ color: "#6B7280", fontFamily: bodyFamily }}>
            {eventDate ? format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
          </p>
        </div>
      </div>

      {enabledSections.countdown && (
        <div className="py-8 text-center border-t" style={{ borderColor: `${primaryColor}15` }}>
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: primaryColor }}>Faltam</p>
          <div className="flex justify-center gap-6">
            {[{ n: 180, l: "Dias" }, { n: 12, l: "Horas" }, { n: 45, l: "Min" }].map((item) => (
              <div key={item.l} className="text-center">
                <span className="text-2xl font-semibold text-foreground">{item.n}</span>
                <span className="block text-xs text-muted-foreground">{item.l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {enabledSections.message && (
        <div className="px-8 py-8 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed italic" style={{ fontFamily: bodyFamily }}>"{welcomeMessage || "Sua mensagem de boas-vindas"}"</p>
        </div>
      )}

      {enabledSections.playlist && (
        <div className="px-8 py-4 text-center border-t" style={{ borderColor: `${primaryColor}15` }}>
          <div className="flex items-center justify-center gap-2 text-xs" style={{ color: primaryColor }}>
            <Music className="w-3.5 h-3.5" /> Nossa Playlist
          </div>
        </div>
      )}

      {enabledSections.wall && (
        <div className="px-8 py-4 text-center border-t" style={{ borderColor: `${primaryColor}15` }}>
          <div className="flex items-center justify-center gap-2 text-xs" style={{ color: primaryColor }}>
            <MessageCircle className="w-3.5 h-3.5" /> Mural de Recados
          </div>
        </div>
      )}

      {enabledSections.rsvp && (
        <div className="px-8 py-6 text-center border-t" style={{ borderColor: `${primaryColor}15` }}>
          <button className="rounded-full px-6 py-2.5 text-sm font-medium text-white" style={{ backgroundColor: primaryColor }}>
            Confirmar Presença
          </button>
        </div>
      )}

      {enabledSections.footer && (
        <div className="px-8 py-4 text-center border-t" style={{ borderColor: `${primaryColor}10` }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <QrCode className="w-3 h-3" style={{ color: `${primaryColor}60` }} />
            <span className="text-xs" style={{ color: `${primaryColor}60` }}>QR Code</span>
          </div>
          <p className="text-xs text-muted-foreground">Feito com ❤️ no EventoSite</p>
        </div>
      )}
    </div>
  );
};

export default DashboardSite;
