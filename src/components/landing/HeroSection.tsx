import { Button } from "@/components/ui/button";
import { Heart, Calendar, Users, ArrowRight, Sparkles } from "lucide-react";
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
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-gold/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-body font-medium">
              <Sparkles className="h-4 w-4" />
              Mais de 10.000 casamentos organizados
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
              Crie o site do seu casamento de forma prática e{" "}
              <span className="text-primary">inesquecível</span>
            </h1>
            <p className="text-lg text-muted-foreground font-body max-w-lg">
              Personalize o site, gerencie convidados, crie sua lista de presentes e organize tudo em um só lugar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/dashboard">
                  Criar meu site grátis <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Ver exemplo ao vivo
              </Button>
            </div>
          </div>

          {/* Right — mockup */}
          <div className="relative">
            <div
              className="rounded-2xl shadow-2xl overflow-hidden border-4 border-card animate-float transition-all duration-500"
              style={{ background: theme.bg }}
            >
              <div className="p-6 md:p-8 text-center space-y-4">
                <Heart className="h-8 w-8 mx-auto" style={{ color: theme.primary }} />
                <p className="text-sm font-body tracking-widest uppercase" style={{ color: theme.accent }}>
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
                        className="text-2xl font-display font-bold rounded-lg w-16 h-16 flex items-center justify-center"
                        style={{ background: `${theme.primary}15`, color: theme.primary }}
                      >
                        {item.value}
                      </div>
                      <span className="text-xs font-body text-muted-foreground mt-1">{item.label}</span>
                    </div>
                  ))}
                </div>

                <Button className="mt-4" style={{ background: theme.primary }}>
                  Confirmar presença
                </Button>
              </div>
            </div>

            {/* Theme selector */}
            <div className="flex justify-center gap-3 mt-6">
              {themes.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setActiveTheme(i)}
                  className={`rounded-lg px-4 py-2 text-xs font-body border-2 transition-all ${
                    i === activeTheme ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/30"
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
