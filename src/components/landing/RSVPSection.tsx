import { CheckCircle2, Mail, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: CheckCircle2, text: "Confirmação online simples" },
  { icon: Users, text: "Controle de presença em tempo real" },
  { icon: Mail, text: "Notificações por e-mail automáticas" },
  { icon: Download, text: "Exportar lista em Excel" },
];

const RSVPSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Confirmação de presença <span className="text-primary">simplificada</span>
          </h2>
          <p className="text-muted-foreground font-body mb-8">
            Gerencie seus convidados de forma prática. Saiba quem vai, quem não vai e organize mesas com facilidade.
          </p>
          <div className="space-y-4 mb-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <f.icon className="h-5 w-5 text-success" />
                <span className="font-body text-sm">{f.text}</span>
              </div>
            ))}
          </div>
          <Button className="gap-2">Ver como funciona</Button>
        </div>
        {/* Illustrative card */}
        <div className="bg-card rounded-2xl border shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-display font-semibold text-lg">Convidados</h4>
            <span className="text-sm font-body text-muted-foreground">142 / 200</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div className="bg-primary h-3 rounded-full transition-all" style={{ width: "71%" }} />
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { label: "Confirmados", value: 98, color: "text-success" },
              { label: "Pendentes", value: 32, color: "text-gold" },
              { label: "Recusados", value: 12, color: "text-destructive" },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 bg-muted rounded-xl">
                <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground font-body">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default RSVPSection;
