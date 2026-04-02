import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Search, Star, Heart, Camera, UtensilsCrossed, Palette, Music, Cake, MapPin, Shirt, Mail,
  Scissors, Users, SlidersHorizontal,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const categories = [
  { id: "fotografia", label: "Fotografia", icon: Camera },
  { id: "filmagem", label: "Filmagem", icon: Camera },
  { id: "buffet", label: "Buffet", icon: UtensilsCrossed },
  { id: "decoracao", label: "Decoração", icon: Palette },
  { id: "flores", label: "Flores", icon: Palette },
  { id: "musica", label: "Música/DJ", icon: Music },
  { id: "bolo", label: "Bolo", icon: Cake },
  { id: "local", label: "Local/Espaço", icon: MapPin },
  { id: "vestido", label: "Vestido", icon: Shirt },
  { id: "terno", label: "Terno", icon: Shirt },
  { id: "convites", label: "Convites", icon: Mail },
  { id: "maquiagem", label: "Maquiagem", icon: Scissors },
  { id: "cerimonialista", label: "Cerimonialista", icon: Users },
];

const suppliers = [
  { id: 1, name: "Studio Luz Fotografia", category: "fotografia", city: "São Paulo, SP", rating: 4.9, reviews: 127, priceMin: 3500, priceMax: 8000, description: "Fotografia autoral e emocional para casamentos. Cobertura completa com álbum digital e impresso." },
  { id: 2, name: "Chef Rafael Buffet", category: "buffet", city: "São Paulo, SP", rating: 4.8, reviews: 89, priceMin: 8000, priceMax: 25000, description: "Gastronomia refinada com menu personalizado. Finger food, jantar completo e estações gastronômicas." },
  { id: 3, name: "Ateliê Rosa Decoração", category: "decoracao", city: "Rio de Janeiro, RJ", rating: 4.7, reviews: 65, priceMin: 4000, priceMax: 15000, description: "Decoração sofisticada com flores naturais e design exclusivo para cada evento." },
  { id: 4, name: "DJ Marcos Entertainment", category: "musica", city: "São Paulo, SP", rating: 4.9, reviews: 203, priceMin: 2000, priceMax: 5000, description: "DJ profissional com mais de 15 anos de experiência. Som, iluminação e pista de dança." },
  { id: 5, name: "Villa Garden Eventos", category: "local", city: "Campinas, SP", rating: 4.6, reviews: 156, priceMin: 12000, priceMax: 30000, description: "Espaço ao ar livre com jardins, salão climatizado e infraestrutura completa para 300 convidados." },
  { id: 6, name: "Maison Bride", category: "vestido", city: "São Paulo, SP", rating: 5.0, reviews: 42, priceMin: 5000, priceMax: 20000, description: "Ateliê de vestidos de noiva sob medida. Design exclusivo com tecidos importados." },
  { id: 7, name: "Doce Encanto Bolos", category: "bolo", city: "Belo Horizonte, MG", rating: 4.8, reviews: 78, priceMin: 800, priceMax: 3000, description: "Bolos artísticos e personalizados. Sabores exclusivos com decoração em fondant e flores naturais." },
  { id: 8, name: "Cine Momento Filmes", category: "filmagem", city: "Rio de Janeiro, RJ", rating: 4.7, reviews: 54, priceMin: 4000, priceMax: 10000, description: "Filmagem cinematográfica em 4K. Edição completa com teaser, highlight e filme longo." },
  { id: 9, name: "Flora & Arte", category: "flores", city: "Curitiba, PR", rating: 4.9, reviews: 91, priceMin: 2000, priceMax: 8000, description: "Arranjos florais exclusivos com flores frescas importadas. Buquê da noiva e decoração completa." },
  { id: 10, name: "Glow Beauty Studio", category: "maquiagem", city: "São Paulo, SP", rating: 4.8, reviews: 112, priceMin: 500, priceMax: 2000, description: "Maquiagem profissional e penteado para noivas. Teste incluso no pacote." },
  { id: 11, name: "Papel & Estilo Convites", category: "convites", city: "Porto Alegre, RS", rating: 4.5, reviews: 67, priceMin: 300, priceMax: 2000, description: "Convites personalizados em papel especial. Digitais e impressos com design exclusivo." },
  { id: 12, name: "Celebrar Cerimonial", category: "cerimonialista", city: "São Paulo, SP", rating: 4.9, reviews: 145, priceMin: 3000, priceMax: 8000, description: "Assessoria completa de casamento. Do planejamento à coordenação do grande dia." },
];

const Marketplace = ({ embedded }: { embedded?: boolean }) => {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [city, setCity] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [minRating, setMinRating] = useState(0);

  const toggleCategory = (id: string) =>
    setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const filtered = suppliers.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(s.category)) return false;
    if (city !== "all" && !s.city.includes(city)) return false;
    if (s.rating < minRating) return false;
    if (s.priceMin > priceRange[1]) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price") return a.priceMin - b.priceMin;
    return b.reviews - a.reviews;
  });

  return (
    <div className={`${embedded ? '' : 'min-h-screen'} font-body bg-background`}>
      {!embedded && <Navbar />}

      {/* Hero */}
      <section className={`${embedded ? 'pt-8' : 'pt-32'} pb-12 px-6`}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
            Encontre os melhores <em className="text-primary not-italic">fornecedores</em>
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
            Fotógrafos, buffets, decoradores e muito mais para o seu evento perfeito.
          </p>
          <div className="flex items-center gap-3 max-w-xl mx-auto mt-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar fornecedores..."
                className="pl-11 h-12 rounded-full text-base"
              />
            </div>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-[180px] h-12 rounded-full">
                <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                <SelectItem value="São Paulo">São Paulo</SelectItem>
                <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                <SelectItem value="Belo Horizonte">Belo Horizonte</SelectItem>
                <SelectItem value="Curitiba">Curitiba</SelectItem>
                <SelectItem value="Porto Alegre">Porto Alegre</SelectItem>
                <SelectItem value="Campinas">Campinas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-[240px] shrink-0 hidden lg:block space-y-6">
            <div>
              <h3 className="font-body text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filtros
              </h3>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-body">Categoria</p>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedCategories.includes(cat.id)}
                      onCheckedChange={() => toggleCategory(cat.id)}
                    />
                    <span className="text-sm font-body text-foreground">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-body">Faixa de preço</p>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={30000}
                step={500}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-body">
                <span>R$ {priceRange[0].toLocaleString("pt-BR")}</span>
                <span>R$ {priceRange[1].toLocaleString("pt-BR")}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-body">Avaliação mínima</p>
              <div className="flex gap-1">
                {[0, 3, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-body transition-colors ${
                      minRating === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {r === 0 ? "Todas" : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-body">Ordenar por</p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="rating">Melhor avaliados</SelectItem>
                  <SelectItem value="price">Menor preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-body mb-4">{filtered.length} fornecedores encontrados</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((supplier) => {
                const catInfo = categories.find((c) => c.id === supplier.category);
                return (
                  <div key={supplier.id} className="card-premium rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 group">
                    <div className="h-40 bg-muted/50 relative flex items-center justify-center">
                      {catInfo && <catInfo.icon className="w-10 h-10 text-muted-foreground/30" />}
                      <Badge className="absolute top-3 left-3 bg-card/90 text-foreground backdrop-blur-sm border-border text-xs">
                        {catInfo?.label}
                      </Badge>
                      <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center border border-border hover:bg-primary/10 transition-colors">
                        <Heart className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="p-5">
                      <h3 className="font-body font-medium text-foreground text-sm">{supplier.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {supplier.city}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
                        <span className="text-sm font-body font-medium text-foreground">{supplier.rating}</span>
                        <span className="text-xs text-muted-foreground">({supplier.reviews})</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{supplier.description}</p>
                      <p className="text-sm font-body font-medium text-foreground mt-3">
                        R$ {supplier.priceMin.toLocaleString("pt-BR")} a R$ {supplier.priceMax.toLocaleString("pt-BR")}
                      </p>
                      <Link to={embedded ? `/dashboard/marketplace/fornecedor/${supplier.id}` : `/marketplace/fornecedor/${supplier.id}`}>
                        <Button className="w-full mt-4 rounded-full font-body" size="sm">Ver perfil</Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {!embedded && <Footer />}
    </div>
  );
};

export default Marketplace;
