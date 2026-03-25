import { Star } from "lucide-react";

const testimonials = [
  { name: "Mariana Silva", city: "São Paulo, SP", text: "O EventoSite transformou a organização do nosso casamento. Tudo ficou lindo e fácil de gerenciar!" },
  { name: "Lucas Ferreira", city: "Rio de Janeiro, RJ", text: "A lista de presentes com PIX foi um sucesso! Recebemos tudo sem complicação." },
  { name: "Camila Santos", city: "Belo Horizonte, MG", text: "O site ficou maravilhoso e todos os convidados elogiaram. Super recomendo!" },
];

const Testimonials = () => (
  <section className="py-28">
    <div className="max-w-6xl mx-auto px-6">
      <p className="text-xs font-body uppercase tracking-widest text-primary text-center mb-3">DEPOIMENTOS</p>
      <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-16">
        O que nossos casais dizem
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="card-premium p-8 space-y-4">
            {/* Decorative quote */}
            <span className="text-6xl font-display text-primary/30 leading-none select-none">"</span>
            <p className="text-base font-body text-foreground/80 leading-relaxed -mt-4">{t.text}</p>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-11 h-11 rounded-full bg-primary/[0.08] flex items-center justify-center text-primary font-body font-medium text-sm">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="font-body font-medium text-sm text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground font-body">{t.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
