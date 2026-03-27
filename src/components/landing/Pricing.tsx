import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";

const plans = [
  {
    name: "FREE",
    price: "R$ 0",
    period: "/mês",
    desc: "Para começar a organizar",
    highlight: false,
    features: ["Site básico", "50 convidados", "1 tema", "RSVP básico", "Lista de presentes"],
  },
  {
    name: "PRO",
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
      "Suporte prioritário",
    ],
  },
  {
    name: "PREMIUM",
    price: "R$ 59,90",
    period: "/mês",
    desc: "A experiência definitiva",
    highlight: false,
    features: [
      "Tudo do Pro",
      "Domínio personalizado",
      "Destaque no marketplace",
      "Sem marca d'água",
      "Suporte VIP",
    ],
  },
];

const Pricing = () => (
  <section id="preços" className="py-28">
    <div className="max-w-6xl mx-auto px-6">
      <ScrollReveal>
        <p className="text-xs font-body uppercase tracking-widest text-primary text-center mb-3">PREÇOS</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">Planos e preços</h2>
        <p className="text-center text-muted-foreground font-body mb-16 max-w-lg mx-auto">
          Escolha o plano ideal para o seu evento.
        </p>
      </ScrollReveal>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((p, i) => (
          <ScrollReveal key={p.name} delay={i * 0.12}>
            <div
              className={`rounded-3xl p-8 flex flex-col bg-card relative transition-all duration-300 h-full`}
              style={{
                background: "#FFFFFF",
                border: p.highlight ? "2px solid hsl(345, 75%, 62%)" : "1px solid rgba(0, 0, 0, 0.06)",
                boxShadow: p.highlight
                  ? "0 4px 12px rgba(0, 0, 0, 0.06), 0 12px 40px rgba(0, 0, 0, 0.06)"
                  : "0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 24px rgba(0, 0, 0, 0.04)",
              }}
            >
              {p.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-body font-medium px-4 py-1 rounded-full">
                  Mais popular
                </div>
              )}
              <p className="font-body text-sm uppercase tracking-widest text-muted-foreground mb-1">{p.name}</p>
              <p className="text-sm text-muted-foreground font-body mb-4">{p.desc}</p>
              <div className="mb-6">
                <span className="text-5xl font-display font-bold text-foreground tracking-tight">{p.price}</span>
                <span className="text-muted-foreground font-body text-base ml-1">{p.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-body text-foreground">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={p.highlight ? "default" : "outline"}
                className="w-full rounded-full transition-all duration-200 hover:-translate-y-0.5"
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
