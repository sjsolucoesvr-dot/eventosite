import { UserPlus, Palette, Share2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const steps = [
  { icon: UserPlus, title: "Crie sua conta grátis", desc: "Cadastre-se em segundos e comece agora mesmo." },
  { icon: Palette, title: "Personalize seu site", desc: "Escolha tema, cores, fotos e textos do seu jeito." },
  { icon: Share2, title: "Compartilhe com seus convidados", desc: "Envie o link e gerencie tudo em um só lugar." },
];

const HowItWorks = () => (
  <section className="py-24">
    <div className="max-w-6xl mx-auto px-6">
      <ScrollReveal>
        <p className="text-xs font-body uppercase tracking-widest text-primary text-center mb-3">COMO FUNCIONA</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">
          Em apenas 3 passos simples
        </h2>
        <p className="text-center text-muted-foreground font-body mb-16 max-w-lg mx-auto">
          Seu site estará pronto em minutos.
        </p>
      </ScrollReveal>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <ScrollReveal key={i} delay={i * 0.15}>
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-2xl card-premium flex items-center justify-center">
                <s.icon className="h-8 w-8 text-gold" />
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-body font-bold flex items-center justify-center mx-auto text-sm">
                {i + 1}
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground">{s.title}</h3>
              <p className="text-muted-foreground font-body text-sm max-w-xs mx-auto">{s.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
