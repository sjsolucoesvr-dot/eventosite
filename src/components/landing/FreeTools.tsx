import { BookOpen, Table, ListChecks, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "sonner";

const tools = [
  { icon: BookOpen, title: "E-book: Descomplicando a jornada do casamento", desc: "Guia completo com dicas de especialistas." },
  { icon: Table, title: "Planilha financeira completa", desc: "Controle todos os gastos do seu evento." },
  { icon: ListChecks, title: "Checklist do casamento", desc: "Tarefas organizadas mês a mês." },
];

const FreeTools = () => (
  <section id="recursos" className="py-28">
    <div className="max-w-6xl mx-auto px-6">
      <ScrollReveal>
        <p className="text-xs font-body uppercase tracking-widest text-primary text-center mb-3">RECURSOS</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">Ferramentas gratuitas</h2>
        <p className="text-center text-muted-foreground font-body mb-16 max-w-lg mx-auto">
          Baixe agora e comece a organizar seu casamento.
        </p>
      </ScrollReveal>
      <div className="grid md:grid-cols-3 gap-6">
        {tools.map((t, i) => (
          <ScrollReveal key={i} delay={i * 0.12}>
            <div className="card-premium card-premium-hover text-center p-8 space-y-4 h-full">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center">
                <t.icon className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground">{t.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{t.desc}</p>
              <Button
                variant="outline"
                className="gap-2 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                onClick={() => toast.info("Em breve! Este recurso estará disponível para download em breve.")}
              >
                <Download className="h-4 w-4" /> Baixar grátis
              </Button>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default FreeTools;
