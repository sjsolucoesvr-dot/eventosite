import { CheckCircle2, Mail, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  { icon: CheckCircle2, text: "Confirmação online simples" },
  { icon: Users, text: "Controle de presença em tempo real" },
  { icon: Mail, text: "Notificações por e-mail automáticas" },
  { icon: Download, text: "Exportar lista em Excel" },
];

const RSVPSection = () => (
  <section className="py-28">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <ScrollReveal direction="left">
          <div>
            <p className="text-xs font-body uppercase tracking-widest text-primary mb-3">RSVP</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Confirmação de presença <em className="text-primary italic">simplificada</em>
            </h2>
            <p className="text-muted-foreground font-body mb-8 leading-relaxed">
              Gerencie seus convidados de forma prática. Saiba quem vai, quem não vai e organize mesas com facilidade.
            </p>
            <div className="space-y-4 mb-8">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <f.icon className="h-5 w-5 text-success" />
                  <span className="font-body text-sm text-foreground">{f.text}</span>
                </div>
              ))}
            </div>
            <Button className="rounded-full px-8 gap-2 transition-all duration-200 hover:-translate-y-0.5">
              Ver como funciona
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.2}>
          <div className="card-premium p-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-display font-semibold text-lg text-foreground">Convidados</h4>
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
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default RSVPSection;
