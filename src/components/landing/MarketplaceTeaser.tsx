import { Camera, UtensilsCrossed, Flower2, Music, Cake, Shirt, MapPin, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { icon: Camera, name: "Fotografia", count: 230 },
  { icon: UtensilsCrossed, name: "Buffet", count: 185 },
  { icon: Flower2, name: "Decoração", count: 142 },
  { icon: Music, name: "Música", count: 98 },
  { icon: Cake, name: "Bolo", count: 76 },
  { icon: Shirt, name: "Vestido", count: 64 },
  { icon: MapPin, name: "Local", count: 120 },
  { icon: Mail, name: "Convites", count: 55 },
];

const MarketplaceTeaser = () => (
  <section id="marketplace" className="py-28">
    <div className="max-w-6xl mx-auto px-6">
      <p className="text-xs font-body uppercase tracking-widest text-primary text-center mb-3">MARKETPLACE</p>
      <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">
        Encontre os melhores fornecedores
      </h2>
      <p className="text-center text-muted-foreground font-body mb-16 max-w-lg mx-auto">
        Nosso marketplace conecta você aos profissionais mais qualificados da sua região.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {categories.map((c, i) => (
          <div
            key={i}
            className="card-premium card-premium-hover p-6 text-center cursor-pointer"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/[0.08] flex items-center justify-center mb-3">
              <c.icon className="h-7 w-7 text-primary" />
            </div>
            <h4 className="font-body font-medium text-sm text-foreground">{c.name}</h4>
            <p className="text-xs text-muted-foreground font-body mt-1">{c.count} fornecedores</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button variant="outline" size="lg" className="gap-2 rounded-full transition-all duration-200 hover:-translate-y-0.5">
          Explorar marketplace <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </section>
);

export default MarketplaceTeaser;
