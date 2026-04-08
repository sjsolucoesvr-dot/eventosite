import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";

const plans = [
  {
    name: "Gratuito",
    badge: "FREE",
    price: "R$ 0",
    period: "/mês",
    desc: "Para começar sem custo",
    highlight: false,
    features: ["Site básico do evento", "Até 50 convidados", "1 tema visual", "RSVP básico", "Lista de presentes"],
  },
  {
    name: "Pro",
    badge: "PRO",
    price: "R$ 29,90",
    period: "/mês",
    desc: "Para casamentos completos",
    highlight: true,
    features: [
      "Site ilimitado",
      "Convidados ilimitados",
      "Todos os temas",
      "Checklist inteligente",
      "Planilha financeira",
      "Galeria de fotos",
      "Suporte prioritário",
    ],
  },
  {
    name: "Premium",
    badge: "PREMIUM",
    price: "R$ 59,90",
    period: "/mês",
    desc: "A experiência definitiva",
    highlight: false,
    features: [
      "Tudo do Pro",
      "Domínio personalizado",
      "Destaque no marketplace",
      "Sem marca d'água",
      "Suporte VIP 24h",
    ],
  },
];

const Pricing = () => (
  <section id="preços" className="py-28 relative overflow-hidden">
    {/* Subtle background */}
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(232,84,122,0.04) 0%, transparent 70%)" }} />

    <div className="max-w-6xl mx-auto px-6 relative z-10">
      <ScrollReveal>
        <div className="text-center mb-16 space-y-4">
          <p className="text-xs font-body uppercase tracking-[0.25em] text-primary font-semibold">PLANOS E PREÇOS</p>
          <h2 className="font-script text-5xl md:text-6xl text-foreground" style={{ color: "#1A1A2E" }}>
            Escolha o seu plano
          </h2>
          <p className="font-editorial text-lg text-muted-foreground max-w-lg mx-auto italic">
            Comece grátis e faça upgrade quando quiser — sem complicação.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto items-stretch">
        {plans.map((p, i) => (
          <ScrollReveal key={p.name} delay={i * 0.12}>
            <div
              className="rounded-3xl p-8 flex flex-col relative h-full transition-all duration-300 hover:-translate-y-1"
              style={{
                background: p.highlight
                  ? "linear-gradient(160deg, #1A1A2E 0%, #2D1A35 100%)"
                  : "#FFFFFF",
                border: p.highlight ? "none" : "1px solid rgba(0,0,0,0.07)",
                boxShadow: p.highlight
                  ? "0 20px 60px rgba(232,84,122,0.20), 0 4px 20px rgba(0,0,0,0.12)"
                  : "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              {p.highlight && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs font-body font-semibold px-5 py-1.5 rounded-full"
                  style={{ background: "linear-gradient(135deg, #E8547A, #C9A96E)", color: "white" }}
                >
                  <Sparkles className="w-3 h-3" /> Mais popular
                </div>
              )}

              {/* Plan badge */}
              <span
                className="text-[10px] font-body font-bold uppercase tracking-[0.2em] mb-3 block"
                style={{ color: p.highlight ? "rgba(255,255,255,0.5)" : "#C9A96E" }}
              >
                {p.badge}
              </span>

              <p
                className="font-editorial text-xl font-semibold mb-1"
                style={{ color: p.highlight ? "white" : "#1A1A2E" }}
              >
                {p.name}
              </p>
              <p
                className="text-sm font-body mb-5"
                style={{ color: p.highlight ? "rgba(255,255,255,0.55)" : "#888" }}
              >
                {p.desc}
              </p>

              <div className="mb-7">
                <span
                  className="text-4xl font-display font-bold tracking-tight"
                  style={{ color: p.highlight ? "white" : "#1A1A2E" }}
                >
                  {p.price}
                </span>
                <span
                  className="font-body text-sm ml-1"
                  style={{ color: p.highlight ? "rgba(255,255,255,0.5)" : "#999" }}
                >
                  {p.period}
                </span>
              </div>

              {/* Divider */}
              <div
                className="h-px w-full mb-6"
                style={{ background: p.highlight ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}
              />

              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-body">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: p.highlight ? "rgba(232,84,122,0.25)" : "rgba(61,140,64,0.12)"
                      }}
                    >
                      <Check
                        className="h-3 w-3"
                        style={{ color: p.highlight ? "#E8547A" : "#3D8C40" }}
                      />
                    </div>
                    <span style={{ color: p.highlight ? "rgba(255,255,255,0.85)" : "#444" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full rounded-full h-11 font-body font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={
                  p.highlight
                    ? {
                        background: "linear-gradient(135deg, #E8547A, #C9487A)",
                        color: "white",
                        border: "none",
                        boxShadow: "0 4px 16px rgba(232,84,122,0.4)"
                      }
                    : {}
                }
                variant={p.highlight ? "default" : "outline"}
                asChild
              >
                <Link to="/cadastro">Começar agora</Link>
              </Button>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
