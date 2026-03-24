import { Palette, CheckSquare, Gift, BarChart3, ListChecks, BookOpen, Store, Smartphone, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Palette, title: "Site personalizado", desc: "Temas, cores, fontes e fotos editáveis" },
  { icon: CheckSquare, title: "RSVP / Confirmação", desc: "Gerencie sua lista de convidados" },
  { icon: Gift, title: "Lista de presentes com PIX", desc: "Receba presentes em dinheiro direto na conta" },
  { icon: BarChart3, title: "Planilha financeira", desc: "Controle total dos gastos do casamento" },
  { icon: ListChecks, title: "Checklist inteligente", desc: "Tarefas organizadas por prazo" },
  { icon: BookOpen, title: "E-book exclusivo", desc: "Guia completo para organizar seu casamento" },
  { icon: Store, title: "Marketplace de fornecedores", desc: "Fotógrafos, buffets, decoradores" },
  { icon: Smartphone, title: "100% responsivo", desc: "Funciona perfeitamente no celular" },
  { icon: Lock, title: "Site privado ou público", desc: "Controle quem pode ver" },
];

const Features = () => (
  <section id="funcionalidades" className="py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">Funcionalidades em destaque</h2>
      <p className="text-center text-muted-foreground font-body mb-12 max-w-lg mx-auto">
        Tudo que você precisa para organizar seu evento, em uma única plataforma.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <Card key={i} className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{f.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
