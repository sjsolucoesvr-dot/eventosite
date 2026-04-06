import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Search, Plus } from "lucide-react";

interface CatalogItem {
  name: string;
  value: number;
  image: string;
  category: string;
}

const catalog: CatalogItem[] = [
  // Cozinha
  { name: "Jogo de Panelas Antiaderente", value: 350, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop", category: "Cozinha" },
  { name: "Air Fryer", value: 450, image: "https://images.unsplash.com/photo-1626509653291-18d9a934b9db?w=200&h=200&fit=crop", category: "Cozinha" },
  { name: "Jogo de Talheres 24 Peças", value: 180, image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=200&h=200&fit=crop", category: "Cozinha" },
  { name: "Conjunto de Travessas", value: 120, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=200&h=200&fit=crop", category: "Cozinha" },
  { name: "Jogo de Copos e Taças", value: 150, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed514?w=200&h=200&fit=crop", category: "Cozinha" },
  { name: "Aparelho de Jantar 30 Peças", value: 280, image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=200&h=200&fit=crop", category: "Cozinha" },
  { name: "Cafeteira Elétrica", value: 200, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200&h=200&fit=crop", category: "Cozinha" },
  { name: "Liquidificador", value: 180, image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=200&h=200&fit=crop", category: "Cozinha" },
  // Quarto
  { name: "Jogo de Cama Queen", value: 250, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=200&fit=crop", category: "Quarto" },
  { name: "Travesseiro Viscoelástico (2un)", value: 180, image: "https://images.unsplash.com/photo-1584100936595-c0c6b851e957?w=200&h=200&fit=crop", category: "Quarto" },
  { name: "Edredom King", value: 320, image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=200&fit=crop", category: "Quarto" },
  // Banheiro
  { name: "Jogo de Toalhas 5 Peças", value: 150, image: "https://images.unsplash.com/photo-1616627988170-851c46fb0085?w=200&h=200&fit=crop", category: "Banheiro" },
  { name: "Kit Organizadores de Banheiro", value: 90, image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=200&h=200&fit=crop", category: "Banheiro" },
  // Sala
  { name: "Almofadas Decorativas (4un)", value: 120, image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=200&h=200&fit=crop", category: "Sala" },
  { name: "Luminária de Mesa", value: 160, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=200&h=200&fit=crop", category: "Sala" },
  // Eletrodomésticos
  { name: "Aspirador Robô", value: 800, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop", category: "Eletrodomésticos" },
  { name: "Ferro de Passar a Vapor", value: 200, image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop", category: "Eletrodomésticos" },
  // Experiências
  { name: "Lua de Mel", value: 1000, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop", category: "Experiências" },
  { name: "Jantar Romântico", value: 300, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop", category: "Experiências" },
  { name: "Day Spa Casal", value: 400, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop", category: "Experiências" },
];

const categories = ["Todos", ...Array.from(new Set(catalog.map((i) => i.category)))];

interface GiftCatalogProps {
  onSelect: (items: { name: string; suggested_value: number; image_url: string; description: string }[]) => void;
  existingNames: string[];
}

const GiftCatalog = ({ onSelect, existingNames }: GiftCatalogProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const filtered = catalog.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Todos" || item.category === category;
    return matchSearch && matchCat;
  });

  const toggle = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleConfirm = () => {
    const items = Array.from(selected).map((idx) => {
      const item = catalog[idx];
      return {
        name: item.name,
        suggested_value: item.value,
        image_url: item.image,
        description: item.category,
      };
    });
    onSelect(items);
    setSelected(new Set());
  };

  const alreadyAdded = new Set(existingNames.map((n) => n.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar presente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              category === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-1">
        {filtered.map((item, i) => {
          const globalIdx = catalog.indexOf(item);
          const isSelected = selected.has(globalIdx);
          const isAdded = alreadyAdded.has(item.name.toLowerCase());

          return (
            <button
              key={i}
              onClick={() => !isAdded && toggle(globalIdx)}
              disabled={isAdded}
              className={`relative rounded-xl border p-2 text-left transition-all ${
                isAdded
                  ? "opacity-40 cursor-not-allowed border-border"
                  : isSelected
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "border-border hover:border-primary/40 hover:-translate-y-0.5"
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              {isAdded && (
                <Badge variant="outline" className="absolute top-1.5 right-1.5 text-[10px]">Já adicionado</Badge>
              )}
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-square object-cover rounded-lg mb-2"
                loading="lazy"
              />
              <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{item.name}</p>
              <p className="text-xs text-primary font-semibold mt-1">R$ {item.value.toLocaleString("pt-BR")}</p>
            </button>
          );
        })}
      </div>

      {selected.size > 0 && (
        <Button onClick={handleConfirm} className="w-full rounded-full gap-2">
          <Plus className="w-4 h-4" />
          Adicionar {selected.size} {selected.size === 1 ? "presente" : "presentes"} selecionado{selected.size > 1 ? "s" : ""}
        </Button>
      )}
    </div>
  );
};

export default GiftCatalog;
