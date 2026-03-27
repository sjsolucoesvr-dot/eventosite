import { Palette, CheckSquare, Gift, BarChart3, ListChecks, BookOpen, Store, Smartphone, Lock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  { icon: Palette, title: "Site personalizado", desc: "Temas, cores, fontes e fotos editáveis. Crie um site único que reflete a personalidade do seu evento.", large: true },
  { icon: CheckSquare, title: "RSVP / Confirmação", desc: "Gerencie sua lista de convidados com praticidade." },
  { icon: Gift, title: "Lista de presentes com PIX", desc: "Receba presentes em dinheiro direto na conta." },
  { icon: BarChart3, title: "Planilha financeira", desc: "Controle total dos gastos do casamento." },
  { icon: ListChecks, title: "Checklist inteligente", desc: "Tarefas organizadas por prazo." },
  { icon: BookOpen, title: "E-book exclusivo", desc: "Guia completo para organizar seu casamento." },
  { icon: Store, title: "Marketplace de fornecedores", desc: "Fotógrafos, buffets, decoradores — tudo em um só lugar. Encontre os melhores profissionais da sua região.", large: true },
  { icon: Smartphone, title: "100% responsivo", desc: "Funciona perfeitamente no celular." },
  { icon: Lock, title: "Site privado ou público", desc: "Controle quem pode ver." },
];

const Features = () => (
  <section id="funcionalidades" className="py-28">
    <div className="max-w-6xl mx-auto px-6">
      <ScrollReveal>
        <p className="text-xs font-body uppercase tracking-widest text-primary text-center mb-3">FUNCIONALIDADES</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">
          Tudo que você precisa em um só lugar
        </h2>
        <p className="text-center text-muted-foreground font-body mb-16 max-w-lg mx-auto">
          Uma plataforma completa para organizar seu evento.
        </p>
      </ScrollReveal>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <ScrollReveal key={i} delay={i * 0.08}>
            <div
              className={`card-premium card-premium-hover p-8 space-y-4 h-full ${f.large ? "md:col-span-2" : ""}`}
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <f.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{f.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
