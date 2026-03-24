import { QrCode, Banknote, BarChart3, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  { icon: QrCode, text: "PIX instantâneo" },
  { icon: Banknote, text: "Sem taxa de saque" },
  { icon: BarChart3, text: "Painel de controle" },
  { icon: MessageSquare, text: "Mensagem personalizada" },
];

const GiftListSection = () => (
  <section className="py-20 bg-card">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Card illustration */}
        <div className="bg-background rounded-2xl border shadow-xl p-8 space-y-6 order-2 lg:order-1">
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
                <Badge variant="outline" className="text-success border-success/30 bg-success/5">PIX ✓</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
            Transferência via PIX a qualquer momento
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Lista de presentes com <span className="text-primary">PIX integrado</span>
          </h2>
          <p className="text-muted-foreground font-body mb-8">
            Receba presentes em dinheiro, sem burocracia. Seus convidados escolhem o valor e transferem via PIX.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <f.icon className="h-5 w-5 text-primary" />
                <span className="font-body text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default GiftListSection;
