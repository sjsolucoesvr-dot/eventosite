import { Star } from "lucide-react";

const testimonials = [
  { name: "Mariana Silva", city: "São Paulo, SP", text: "O EventoSite transformou a organização do nosso casamento. Tudo ficou lindo e fácil de gerenciar!" },
  { name: "Lucas Ferreira", city: "Rio de Janeiro, RJ", text: "A lista de presentes com PIX foi um sucesso! Recebemos tudo sem complicação." },
  { name: "Camila Santos", city: "Belo Horizonte, MG", text: "O site ficou maravilhoso e todos os convidados elogiaram. Super recomendo!" },
];

const Testimonials = () => (
  <section className="py-20 bg-primary/5">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
        O que nossos casais dizem
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-card rounded-2xl p-6 shadow-sm border space-y-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-sm font-body text-foreground/80 leading-relaxed">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-sm">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="font-body font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground font-body">{t.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
