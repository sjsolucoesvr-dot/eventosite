import { UserPlus, Palette, Share2 } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Crie sua conta grátis", desc: "Cadastre-se em segundos e comece agora mesmo." },
  { icon: Palette, title: "Personalize seu site", desc: "Escolha tema, cores, fotos e textos do seu jeito." },
  { icon: Share2, title: "Compartilhe com seus convidados", desc: "Envie o link e gerencie tudo em um só lugar." },
];

const HowItWorks = () => (
  <section className="py-20 bg-card">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">Como funciona</h2>
      <p className="text-center text-muted-foreground font-body mb-12 max-w-lg mx-auto">
        Em apenas 3 passos simples, seu site estará pronto.
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <div key={i} className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <s.icon className="h-9 w-9 text-primary" />
            </div>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-body font-bold flex items-center justify-center mx-auto text-sm">
              {i + 1}
            </div>
            <h3 className="text-xl font-display font-semibold">{s.title}</h3>
            <p className="text-muted-foreground font-body text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
