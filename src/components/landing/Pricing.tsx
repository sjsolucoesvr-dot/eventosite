import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    desc: "Para começar a organizar",
    highlight: false,
    features: ["Site básico", "50 convidados", "1 tema", "RSVP básico", "Lista de presentes"],
  },
  {
    name: "Pro",
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
    name: "Premium",
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
  <section id="preços" className="py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">Planos e preços</h2>
      <p className="text-center text-muted-foreground font-body mb-12 max-w-lg mx-auto">
        Escolha o plano ideal para o seu evento.
      </p>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl border p-8 flex flex-col ${
              p.highlight
                ? "border-primary shadow-xl ring-2 ring-primary/20 relative bg-card"
                : "bg-card"
            }`}
          >
            {p.highlight && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                Mais popular
              </Badge>
            )}
            <h3 className="font-display font-bold text-xl mb-1">{p.name}</h3>
            <p className="text-sm text-muted-foreground font-body mb-4">{p.desc}</p>
            <div className="mb-6">
              <span className="text-4xl font-display font-bold">{p.price}</span>
              <span className="text-muted-foreground font-body text-sm">{p.period}</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm font-body">
                  <Check className="h-4 w-4 text-success shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant={p.highlight ? "default" : "outline"} className="w-full" asChild>
              <Link to="/dashboard">Começar agora</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
