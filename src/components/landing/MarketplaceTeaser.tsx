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
  <section id="marketplace" className="py-20 bg-card">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
        Encontre os melhores fornecedores
      </h2>
      <p className="text-center text-muted-foreground font-body mb-12 max-w-lg mx-auto">
        Nosso marketplace conecta você aos profissionais mais qualificados da sua região.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((c, i) => (
          <div
            key={i}
            className="bg-background rounded-xl border p-6 text-center hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <c.icon className="h-7 w-7 text-primary" />
            </div>
            <h4 className="font-body font-medium text-sm">{c.name}</h4>
            <p className="text-xs text-muted-foreground font-body mt-1">{c.count} fornecedores</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Button variant="outline" size="lg" className="gap-2">
          Explorar marketplace <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </section>
);

export default MarketplaceTeaser;
