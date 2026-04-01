import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart, CalendarIcon, ArrowRight, ArrowLeft, Check, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { eventThemes } from "@/stores/eventStore";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateEvent, createDefaultChecklist } from "@/hooks/useEvent";
import { toast } from "sonner";

const steps = [
  { title: "Conte sobre seu evento", desc: "Informações básicas do seu evento" },
  { title: "Escolha um tema", desc: "Selecione o estilo visual do seu site" },
  { title: "Personalize as cores", desc: "Ajuste as cores ao seu gosto" },
  { title: "Convide seus convidados", desc: "Adicione emails ou pule esta etapa" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createEvent = useCreateEvent();

  const [step, setStep] = useState(0);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("casamento");
  const [eventDate, setEventDate] = useState<Date>();
  const [eventLocation, setEventLocation] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("classico");
  const [primaryColor, setPrimaryColor] = useState("#C9A96E");
  const [secondaryColor, setSecondaryColor] = useState("#1A1A2E");
  const [saving, setSaving] = useState(false);

  const progress = ((step + 1) / steps.length) * 100;

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "meu-evento";
  };

  const handleFinish = async () => {
    if (!user) return;
    if (!eventName.trim()) {
      toast.error("Preencha o nome do evento");
      return;
    }

    setSaving(true);
    try {
      const slug = generateSlug(eventName) + "-" + Date.now().toString(36);
      const event = await createEvent.mutateAsync({
        user_id: user.id,
        title: eventName,
        slug,
        type: eventType,
        date: eventDate ? eventDate.toISOString().split("T")[0] : null,
        location: eventLocation,
        theme: selectedTheme,
        color_primary: primaryColor,
        color_secondary: secondaryColor,
      });

      if (eventDate && event?.id) {
        await createDefaultChecklist(event.id, eventDate);
      }

      toast.success("Evento criado com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao criar evento");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <span className="text-lg font-display font-semibold text-foreground">EventoSite</span>
          </Link>
          <span className="text-xs text-muted-foreground">Passo {step + 1} de {steps.length}</span>
        </div>
      </header>

      <div className="h-1 bg-muted">
        <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl space-y-8">
          <div className="text-center">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">{steps[step].title}</h1>
            <p className="text-muted-foreground mt-2 text-sm">{steps[step].desc}</p>
          </div>

          {step === 0 && (
            <div className="space-y-5 card-premium rounded-2xl p-8">
              <div className="space-y-2">
                <Label>Nome do evento</Label>
                <Input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Ex: Casamento de Ana & Carlos" className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data do evento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full h-11 justify-start font-normal", !eventDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventDate ? format(eventDate, "dd/MM/yyyy") : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={eventDate} onSelect={setEventDate} locale={ptBR} className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de evento</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Casamento", "Aniversário", "Formatura", "Batizado", "Corporativo", "Festa"].map((t) => (
                        <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Local do evento</Label>
                <Input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Ex: Espaço Villa Verde, São Paulo/SP" className="h-11" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              {eventThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme.id);
                    setPrimaryColor(theme.primary);
                    setSecondaryColor(theme.primaryDark);
                  }}
                  className={cn(
                    "relative rounded-2xl p-5 text-left transition-all duration-300 border overflow-hidden",
                    selectedTheme === theme.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/30 hover:-translate-y-0.5"
                  )}
                >
                  <div className="h-20 rounded-xl mb-3 flex items-center justify-center" style={{ background: theme.primaryDark }}>
                    <Heart className="w-6 h-6" style={{ color: theme.primary }} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primaryLight }} />
                  </div>
                  <span className="text-sm font-body font-medium text-foreground">{theme.name}</span>
                  {selectedTheme === theme.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="card-premium rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Cor principal</Label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-12 rounded-xl border border-border cursor-pointer" />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono text-sm" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Cor secundária</Label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-12 h-12 rounded-xl border border-border cursor-pointer" />
                    <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="font-mono text-sm" />
                  </div>
                </div>
              </div>
              <div className="rounded-xl p-6 text-center space-y-3" style={{ background: secondaryColor }}>
                <Heart className="w-6 h-6 mx-auto" style={{ color: primaryColor }} />
                <h3 className="font-display text-2xl font-semibold" style={{ color: primaryColor }}>{eventName || "Ana & Carlos"}</h3>
                <p className="text-xs" style={{ color: `${primaryColor}99` }}>Preview do seu tema</p>
                <button className="px-6 py-2 rounded-full text-sm text-white font-medium" style={{ background: primaryColor }}>
                  Confirmar Presença
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card-premium rounded-2xl p-8 space-y-6">
              <div className="space-y-2">
                <Label>Emails dos convidados</Label>
                <p className="text-xs text-muted-foreground">Separe os emails por vírgula ou cole uma lista</p>
                <textarea
                  className="w-full h-32 rounded-xl border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="maria@email.com, joao@email.com, ..."
                />
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <Sparkles className="w-5 h-5 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">Você também pode adicionar convidados depois no seu dashboard.</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-full gap-2 font-body">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Button>
            ) : (
              <div />
            )}
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} className="rounded-full gap-2 font-body">
                Próximo <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={saving} className="rounded-full gap-2 font-body">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Concluir e ir ao Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
