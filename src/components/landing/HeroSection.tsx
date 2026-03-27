import { Button } from "@/components/ui/button";
import { Heart, Calendar, Users, ArrowRight, Sparkles, CheckCircle2, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { Link } from "react-router-dom";

const themes = [
  { name: "Clássico", primary: "hsl(345, 75%, 62%)", accent: "hsl(37, 42%, 61%)", bg: "hsl(348, 100%, 98%)" },
  { name: "Romântico", primary: "hsl(330, 60%, 55%)", accent: "hsl(280, 40%, 65%)", bg: "hsl(330, 50%, 97%)" },
  { name: "Moderno", primary: "hsl(210, 60%, 45%)", accent: "hsl(170, 50%, 45%)", bg: "hsl(210, 30%, 97%)" },
];

const weddingDate = new Date("2025-12-20T16:00:00");

const HeroSection = () => {
  const [activeTheme, setActiveTheme] = useState(0);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const days = Math.max(0, differenceInDays(weddingDate, now));
  const hours = Math.max(0, differenceInHours(weddingDate, now) % 24);
  const minutes = Math.max(0, differenceInMinutes(weddingDate, now) % 60);

  const theme = themes[activeTheme];

  return (
    <section
      className="relative pt-32 pb-24 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 20% 50%, rgba(232, 84, 122, 0.06) 0%, transparent 60%),
                     radial-gradient(ellipse at 80% 20%, rgba(201, 169, 110, 0.06) 0%, transparent 60%),
                     hsl(40, 20%, 98%)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[55%_45%] gap-12 items-center">
          {/* Left — text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/[0.08] text-primary px-4 py-1.5 rounded-full text-xs font-body font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Mais de 10.000 casamentos organizados
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight tracking-tight">
              Crie o{" "}
              <em className="text-primary not-italic font-bold italic">site do seu casamento</em>{" "}
              de forma prática e inesquecível
            </h1>

            <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-[480px]">
              Personalize o site, gerencie convidados, crie sua lista de presentes e organize tudo em um só lugar.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-full px-8 py-3.5 font-medium gap-2 transition-all duration-300 hover:-translate-y-0.5"
                asChild
              >
                <Link to="/dashboard">
                  Criar meu site grátis <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-3.5 border-border text-foreground/70 hover:bg-muted"
              >
                Ver exemplo ao vivo
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {["A", "M", "C", "R"].map((initial, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-body font-medium text-primary"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-body">
                <strong className="text-foreground">​</strong> casais já usam
              </span>
            </div>
          </div>

          {/* Right — mockup */}
          <div className="relative">
            <div
              className="rounded-3xl overflow-hidden p-6 transition-all duration-500"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div className="text-center space-y-4">
                <Heart className="h-7 w-7 mx-auto" style={{ color: theme.primary }} />
                <p className="text-xs font-body tracking-widest uppercase" style={{ color: theme.accent }}>
                  Convidam para o casamento
                </p>
                <h3 className="text-3xl font-display font-bold" style={{ color: theme.primary }}>
                  Ana & Pedro
                </h3>
                <div className="flex items-center justify-center gap-2 text-sm font-body text-muted-foreground">
                  <Calendar className="h-4 w-4" /> 20 de Dezembro de 2025
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-body text-muted-foreground">
                  <Users className="h-4 w-4" /> Igreja Matriz — São Paulo, SP
                </div>

                {/* Countdown */}
                <div className="flex justify-center gap-4 pt-4">
                  {[
                    { value: days, label: "Dias" },
                    { value: hours, label: "Horas" },
                    { value: minutes, label: "Min" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div
                        className="text-2xl font-display font-bold rounded-xl w-16 h-16 flex items-center justify-center"
                        style={{ background: `${theme.primary}10`, color: theme.primary }}
                      >
                        {item.value}
                      </div>
                      <span className="text-xs font-body text-muted-foreground mt-1">{item.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="mt-4 px-6 py-2.5 rounded-full text-sm font-body font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: theme.primary }}
                >
                  Confirmar presença
                </button>
              </div>
            </div>

            {/* Floating card — top right */}
            <div
              className="absolute -top-3 -right-3 md:top-4 md:-right-8 z-10 flex items-center gap-2 px-4 py-3 rounded-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.80)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-sm font-body font-medium text-foreground">23 confirmações</span>
            </div>

            {/* Floating card — bottom left */}
            <div
              className="absolute -bottom-3 -left-3 md:bottom-8 md:-left-8 z-10 flex items-center gap-2 px-4 py-3 rounded-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.80)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Gift className="h-4 w-4 text-primary" />
              <span className="text-sm font-body font-medium text-foreground">R$ 2.400 recebidos</span>
            </div>

            {/* Theme selector */}
            <div className="flex justify-center gap-3 mt-6">
              {themes.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setActiveTheme(i)}
                  className={`rounded-full px-4 py-2 text-xs font-body border transition-all duration-200 ${
                    i === activeTheme
                      ? "border-primary bg-primary/[0.08] text-primary font-medium"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
