import { Button } from "@/components/ui/button";
import { Heart, Calendar, MapPin, ArrowRight, CheckCircle2, Gift, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const themes = [
  { name: "Clássico", primary: "#E8547A", accent: "#C9A96E", bg: "#FFF8F9" },
  { name: "Romântico", primary: "#C45C8A", accent: "#9B6FA0", bg: "#FDF6FB" },
  { name: "Moderno", primary: "#3A6EA8", accent: "#2E9E82", bg: "#F6F9FD" },
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

  const scrollToHowItWorks = () => {
    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative pt-28 pb-20 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 15% 60%, rgba(232,84,122,0.07) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 85% 20%, rgba(201,169,110,0.07) 0%, transparent 55%),
          radial-gradient(ellipse 40% 40% at 50% 100%, rgba(232,84,122,0.04) 0%, transparent 50%),
          hsl(40, 20%, 98%)
        `,
      }}
    >
      {/* Decorative petal shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute -top-24 -right-24 w-[600px] h-[600px] opacity-[0.035]" viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="280" stroke="#E8547A" strokeWidth="1" />
          <circle cx="300" cy="300" r="220" stroke="#C9A96E" strokeWidth="0.5" />
          <circle cx="300" cy="300" r="160" stroke="#E8547A" strokeWidth="0.5" />
        </svg>
        <svg className="absolute -bottom-32 -left-32 w-[500px] h-[500px] opacity-[0.03]" viewBox="0 0 500 500" fill="none">
          <circle cx="250" cy="250" r="230" stroke="#E8547A" strokeWidth="1" />
          <circle cx="250" cy="250" r="170" stroke="#C9A96E" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[52%_48%] gap-16 items-center">

          {/* Left — Copy */}
          <motion.div
            className="space-y-7"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 border border-primary/20 bg-primary/[0.06] text-primary px-4 py-2 rounded-full text-xs font-body font-semibold tracking-wide"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Plataforma completa para casamentos e eventos
            </motion.div>

            {/* Headline */}
            <div className="space-y-2">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-editorial text-lg text-muted-foreground italic tracking-wide"
              >
                O site dos seus sonhos,
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-script text-6xl md:text-7xl text-foreground leading-none"
                style={{ color: "#1A1A2E" }}
              >
                criado com amor
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-editorial text-xl md:text-2xl text-muted-foreground leading-relaxed mt-3"
              >
                Personalize seu site, gerencie convidados, crie a lista de presentes e organize tudo — <em>em um só lugar.</em>
              </motion.p>
            </div>

            {/* Social proof dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {["E8547A", "C9A96E", "3A6EA8", "9B6FA0"].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center"
                    style={{ background: `#${c}30` }}
                  >
                    <Heart className="w-3.5 h-3.5" style={{ color: `#${c}` }} />
                  </div>
                ))}
              </div>
              <p className="text-sm font-body text-muted-foreground">
                <span className="font-semibold text-foreground">+1.200 casais</span> já criaram seu site
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-3"
            >
              <Button
                size="lg"
                className="rounded-full px-8 h-12 font-body font-semibold gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #E8547A, #C9487A)" }}
                asChild
              >
                <Link to="/cadastro">
                  Criar meu site grátis <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 font-body border-border/60 text-muted-foreground hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-300"
                onClick={scrollToHowItWorks}
              >
                Ver como funciona
              </Button>
            </motion.div>

            {/* Trust items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-5 pt-1"
            >
              {[
                "✓ Grátis para começar",
                "✓ Sem cartão de crédito",
                "✓ Pronto em minutos",
              ].map((item) => (
                <span key={item} className="text-xs font-body text-muted-foreground">{item}</span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Mockup Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Card */}
            <div
              className="relative rounded-3xl overflow-hidden transition-all duration-500"
              style={{
                background: theme.bg,
                boxShadow: "0 24px 80px rgba(0,0,0,0.10), 0 4px 20px rgba(232,84,122,0.08)",
                border: "1px solid rgba(232,84,122,0.12)",
              }}
            >
              {/* Subtle floral top bar */}
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${theme.primary}88, ${theme.accent}88, ${theme.primary}88)` }} />

              <div className="p-8 space-y-5">
                {/* Event header */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-px flex-1" style={{ background: `${theme.accent}40` }} />
                    <Heart className="w-4 h-4" style={{ color: theme.primary, fill: theme.primary }} />
                    <div className="h-px flex-1" style={{ background: `${theme.accent}40` }} />
                  </div>
                  <p className="text-xs uppercase tracking-[0.25em] font-body font-semibold" style={{ color: theme.accent }}>
                    Convidam para o casamento
                  </p>
                  <h2
                    className="font-script leading-none"
                    style={{ fontSize: "2.8rem", color: theme.primary }}
                  >
                    Ana & Pedro
                  </h2>
                  <div className="flex items-center justify-center gap-4 text-xs font-body" style={{ color: `${theme.primary}99` }}>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> 20 de Dezembro de 2025
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> São Paulo, SP
                    </span>
                  </div>
                </div>

                {/* Countdown */}
                <div className="flex justify-center gap-3">
                  {[
                    { value: days, label: "Dias" },
                    { value: hours, label: "Horas" },
                    { value: minutes, label: "Min" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div
                        className="text-2xl font-display font-bold rounded-2xl w-16 h-14 flex items-center justify-center"
                        style={{ background: `${theme.primary}12`, color: theme.primary }}
                      >
                        {String(item.value).padStart(2, "0")}
                      </div>
                      <span className="text-[10px] font-body mt-1 block" style={{ color: `${theme.primary}80` }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA button */}
                <div className="text-center pt-1">
                  <button
                    className="px-8 py-3 rounded-full text-sm font-body font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 shadow-md"
                    style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}CC)` }}
                  >
                    Confirmar Presença
                  </button>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              className="absolute -top-4 -right-4 md:-right-10 z-10 flex items-center gap-2.5 px-4 py-3 rounded-2xl"
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 1.0 }}
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
              }}
            >
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "#3D8C40" }} />
              <span className="text-sm font-body font-semibold text-foreground whitespace-nowrap">23 confirmações</span>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 md:-left-10 z-10 flex items-center gap-2.5 px-4 py-3 rounded-2xl"
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 1.2 }}
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
              }}
            >
              <Gift className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-sm font-body font-semibold text-foreground whitespace-nowrap">12 presentes recebidos</span>
            </motion.div>

            {/* Theme switcher */}
            <div className="flex justify-center gap-2 mt-8">
              {themes.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setActiveTheme(i)}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-body border transition-all duration-300"
                  style={
                    i === activeTheme
                      ? { borderColor: theme.primary, background: `${theme.primary}12`, color: theme.primary, fontWeight: 600 }
                      : { borderColor: "rgba(0,0,0,0.1)", background: "white", color: "#999" }
                  }
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.primary }} />
                  {t.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
