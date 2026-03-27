import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart, Eye, EyeOff, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const Cadastro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [eventDate, setEventDate] = useState<Date>();

  return (
    <div className="min-h-screen flex font-body">
      {/* Left — Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/60 via-foreground/40 to-foreground/70" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <h2 className="font-display text-4xl font-bold text-white leading-tight">
            Comece a organizar <br />
            <em className="text-primary italic">seu grande dia</em>
          </h2>
          <p className="text-white/70 mt-4 max-w-md text-sm leading-relaxed">
            Crie seu site personalizado em minutos. Totalmente grátis para começar.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <Heart className="h-5 w-5 text-primary fill-primary" />
              <span className="text-2xl font-display font-semibold text-foreground">EventoSite</span>
            </Link>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Criar conta grátis</h1>
            <p className="text-sm text-muted-foreground mt-2">Preencha os dados para começar</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body text-sm">Nome completo</Label>
              <Input placeholder="Seu nome" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Email</Label>
              <Input type="email" placeholder="seu@email.com" className="h-11" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="font-body text-sm">Senha</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="h-11 pr-10" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Confirmar senha</Label>
                <Input type="password" placeholder="••••••••" className="h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Nome do seu evento</Label>
              <Input placeholder="Ex: Casamento de Ana e João" className="h-11" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="font-body text-sm">Data do evento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full h-11 justify-start text-left font-normal", !eventDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventDate ? format(eventDate, "dd/MM/yyyy") : "Data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={eventDate} onSelect={setEventDate} locale={ptBR} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Tipo de evento</Label>
                <Select defaultValue="casamento">
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Casamento", "Aniversário", "Formatura", "Batizado", "Corporativo", "Festa"].map((t) => (
                      <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <Checkbox id="terms" className="mt-0.5" />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                Eu concordo com os <a href="#" className="text-primary hover:underline">Termos de Uso</a> e a{" "}
                <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
              </label>
            </div>

            <Button className="w-full h-11 rounded-full font-body font-medium" asChild>
              <Link to="/onboarding">Criar minha conta grátis</Link>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-body">ou</span>
            </div>
          </div>

          <Button variant="outline" className="w-full h-11 rounded-full font-body gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Cadastrar com Google
          </Button>

          <p className="text-center text-sm text-muted-foreground font-body">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Entrar →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
