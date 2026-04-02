import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Mail, Globe, ArrowLeft, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const suppliersData: Record<string, {
  name: string; category: string; city: string; rating: number; reviews: number;
  priceMin: number; priceMax: number; description: string; fullDescription: string;
  phone: string; email: string; website: string; address: string;
  customerReviews: { name: string; rating: number; text: string; date: string }[];
}> = {
  "1": {
    name: "Studio Luz Fotografia", category: "Fotografia", city: "São Paulo, SP",
    rating: 4.9, reviews: 127, priceMin: 3500, priceMax: 8000,
    description: "Fotografia autoral e emocional para casamentos.",
    fullDescription: "Com mais de 10 anos de experiência, o Studio Luz captura os momentos mais especiais do seu casamento com um olhar artístico e emocional. Nossa equipe é formada por fotógrafos premiados que trabalham com equipamentos de última geração. Oferecemos pacotes completos que incluem pré-wedding, cobertura integral da cerimônia e festa, álbum impresso premium e galeria digital com todas as fotos editadas.",
    phone: "(11) 99999-1234", email: "contato@studioluz.com.br", website: "www.studioluz.com.br",
    address: "Rua Augusta, 1234 - Consolação, São Paulo - SP",
    customerReviews: [
      { name: "Carolina Mendes", rating: 5, text: "Simplesmente perfeito! As fotos ficaram incríveis, cada momento capturado com muita sensibilidade. Super recomendo!", date: "15/02/2025" },
      { name: "Lucas e Beatriz", rating: 5, text: "Profissionais excepcionais. Nos sentiram muito à vontade e o resultado superou todas as expectativas.", date: "20/01/2025" },
      { name: "Amanda Rodrigues", rating: 4, text: "Ótimo trabalho! As fotos ficaram lindas e a entrega foi dentro do prazo. Adoramos o álbum impresso.", date: "10/12/2024" },
    ],
  },
};

// Fallback for IDs not in the map
const defaultSupplier = {
  name: "Fornecedor Premium", category: "Serviços", city: "São Paulo, SP",
  rating: 4.8, reviews: 50, priceMin: 2000, priceMax: 10000,
  description: "Serviço profissional de alta qualidade.",
  fullDescription: "Fornecedor com anos de experiência no mercado de eventos, oferecendo serviços personalizados e de alta qualidade para tornar seu evento memorável.",
  phone: "(11) 99999-0000", email: "contato@fornecedor.com.br", website: "www.fornecedor.com.br",
  address: "São Paulo - SP",
  customerReviews: [
    { name: "Cliente Satisfeito", rating: 5, text: "Excelente serviço, superou expectativas!", date: "01/03/2025" },
    { name: "Maria Santos", rating: 4, text: "Muito bom, recomendo.", date: "15/02/2025" },
  ],
};

const SupplierProfile = ({ embedded }: { embedded?: boolean }) => {
  const { id } = useParams();
  const supplier = suppliersData[id || ""] || defaultSupplier;
  const [currentImage, setCurrentImage] = useState(0);
  const totalImages = 5;

  return (
    <div className={`${embedded ? '' : 'min-h-screen'} font-body bg-background`}>
      {!embedded && <Navbar />}

      <section className={`${embedded ? 'pt-8' : 'pt-28'} pb-24 px-6`}>
        <div className="max-w-5xl mx-auto">
          <Link to={embedded ? "/dashboard/marketplace" : "/marketplace"} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar ao marketplace
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gallery */}
              <div className="card-premium rounded-2xl overflow-hidden">
                <div className="relative h-80 bg-muted/50 flex items-center justify-center">
                  <p className="text-muted-foreground/40 text-sm">Foto {currentImage + 1} de {totalImages}</p>
                  <button
                    onClick={() => setCurrentImage((p) => (p - 1 + totalImages) % totalImages)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center border border-border"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((p) => (p + 1) % totalImages)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center border border-border"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-2 p-3">
                  {Array.from({ length: totalImages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`flex-1 h-16 rounded-lg bg-muted/50 transition-all ${currentImage === i ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="card-premium rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2 text-xs">{supplier.category}</Badge>
                    <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">{supplier.name}</h1>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {supplier.city}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(supplier.rating) ? "text-secondary fill-secondary" : "text-muted"}`} />
                        ))}
                      </div>
                      <span className="text-sm font-body font-medium">{supplier.rating}</span>
                      <span className="text-xs text-muted-foreground">({supplier.reviews} avaliações)</span>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <Heart className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="mt-6">
                  <h3 className="font-display text-base font-semibold text-foreground mb-2">Sobre</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{supplier.fullDescription}</p>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {supplier.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {supplier.email}</span>
                  <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {supplier.website}</span>
                </div>
              </div>

              {/* Reviews */}
              <div className="card-premium rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-4">Avaliações de clientes</h3>
                <div className="space-y-4">
                  {supplier.customerReviews.map((review, i) => (
                    <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {review.name.charAt(0)}
                          </div>
                          <span className="font-body text-sm font-medium text-foreground">{review.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex gap-0.5 mt-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? "text-secondary fill-secondary" : "text-muted"}`} />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="card-premium rounded-2xl p-6">
                <h3 className="font-display text-base font-semibold text-foreground mb-3">Localização</h3>
                <div className="h-48 rounded-xl bg-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{supplier.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar — Contact */}
            <div className="space-y-6">
              <div className="card-premium rounded-2xl p-6 sticky top-28">
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-1">Faixa de preço</h3>
                <p className="text-2xl font-display font-semibold text-primary">
                  R$ {supplier.priceMin.toLocaleString("pt-BR")} — R$ {supplier.priceMax.toLocaleString("pt-BR")}
                </p>
                <div className="border-t border-border mt-5 pt-5">
                  <h3 className="font-display text-base font-semibold text-foreground mb-4">Solicitar orçamento</h3>
                  <div className="space-y-3">
                    <div className="space-y-1"><Label className="text-xs">Nome</Label><Input placeholder="Seu nome" /></div>
                    <div className="space-y-1"><Label className="text-xs">Email</Label><Input type="email" placeholder="seu@email.com" /></div>
                    <div className="space-y-1"><Label className="text-xs">Telefone</Label><Input placeholder="(00) 00000-0000" /></div>
                    <div className="space-y-1"><Label className="text-xs">Data do evento</Label><Input type="date" /></div>
                    <div className="space-y-1"><Label className="text-xs">Mensagem</Label><Textarea rows={3} placeholder="Conte um pouco sobre seu evento..." /></div>
                    <Button className="w-full rounded-full font-body">Enviar solicitação</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!embedded && <Footer />}
    </div>
  );
};

export default SupplierProfile;
