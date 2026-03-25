import { QrCode, Banknote, BarChart3, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  { icon: QrCode, text: "PIX instantâneo" },
  { icon: Banknote, text: "Sem taxa de saque" },
  { icon: BarChart3, text: "Painel de controle" },
  { icon: MessageSquare, text: "Mensagem personalizada" },
];

const GiftListSection = () => (
  <section className="py-28">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="card-premium p-8 space-y-6 order-2 lg:order-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <Banknote className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-body text-muted-foreground">Total recebido</p>
              <p className="text-2xl font-display font-bold text-success">R$ 4.850,00</p>
            </div>
          </div>
          <div className="space-y-3">
            {["Tio Marcos — R$ 200", "Pri & Carlos — R$ 150", "Família Santos — R$ 500"].map((g) => (
              <div key={g} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <span className="text-sm font-body">{g}</span>
                <Badge variant="outline" className="text-success border-success/30 bg-success/5 font-body text-xs">PIX ✓</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <Badge className="mb-4 bg-primary/[0.08] text-primary border-primary/20 hover:bg-primary/[0.12] font-body text-xs">
            Transferência via PIX a qualquer momento
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Lista de presentes com <em className="text-primary italic">PIX integrado</em>
          </h2>
          <p className="text-muted-foreground font-body mb-8 leading-relaxed">
            Receba presentes em dinheiro, sem burocracia. Seus convidados escolhem o valor e transferem via PIX.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <f.icon className="h-5 w-5 text-primary" />
                <span className="font-body text-sm text-foreground">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default GiftListSection;
