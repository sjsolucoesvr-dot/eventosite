import { useState } from "react";
import { Heart, MapPin, Calendar } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const themes = [
  { name: "Clássico", primary: "#E8547A", bg: "#FFF8F9", font: "Playfair Display" },
  { name: "Romântico", primary: "#C46B8A", bg: "#FFF0F5", font: "Great Vibes" },
  { name: "Moderno", primary: "#4A7DAF", bg: "#F0F6FF", font: "DM Sans" },
  { name: "Boho", primary: "#B07D4B", bg: "#FDF6EE", font: "Cormorant Garamond" },
  { name: "Cursivo", primary: "#A855F7", bg: "#F8F2FF", font: "Dancing Script" },
];

const SitePreview = () => {
  const [active, setActive] = useState(0);
  const t = themes[active];

  return (
    <section className="py-28">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <p className="text-xs font-body uppercase tracking-widest text-primary text-center mb-3">PREVIEW</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">
            Veja como fica o site do seu evento
          </h2>
          <p className="text-center text-muted-foreground font-body mb-12 max-w-lg mx-auto">
            Escolha um tema e veja a mágica acontecer.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="max-w-2xl mx-auto">
            <div className="rounded-t-2xl bg-foreground/90 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <div className="flex-1 mx-4 bg-foreground/30 rounded-md px-3 py-1 text-xs text-white/40 font-body">
                eventosite.com/ana-e-pedro
              </div>
            </div>
            <div
              className="rounded-b-2xl p-8 md:p-12 text-center transition-all duration-500 space-y-4"
              style={{ background: t.bg, border: "1px solid rgba(0,0,0,0.06)", borderTop: "none" }}
            >
              <Heart className="h-8 w-8 mx-auto transition-colors duration-500" style={{ color: t.primary }} />
              <p className="text-sm tracking-widest uppercase font-body" style={{ color: t.primary, fontFamily: t.font }}>
                Celebrem conosco
              </p>
              <h3 className="text-4xl font-bold transition-all duration-500" style={{ color: t.primary, fontFamily: t.font }}>
                Ana & Pedro
              </h3>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground font-body">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> 20/12/2025</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> São Paulo, SP</span>
              </div>
              <button
                className="mt-4 px-8 py-3 rounded-full text-sm font-body font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: t.primary }}
              >
                Confirmar presença
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {themes.map((theme, i) => (
            <button
              key={theme.name}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-body border transition-all duration-200 ${
                i === active
                  ? "border-primary bg-primary/[0.08] text-primary font-medium"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30"
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SitePreview;
