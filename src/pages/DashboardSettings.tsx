import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useEventStore } from "@/stores/eventStore";
import { User, Bell, Globe, Shield, Trash2 } from "lucide-react";

const DashboardSettings = () => {
  const { event } = useEventStore();

  return (
    <div className="p-6 space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie sua conta e preferências</p>
      </div>

      {/* Profile */}
      <div className="card-premium rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-primary" />
          <h3 className="font-display text-base font-semibold text-foreground">Perfil</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-body text-sm">Nome completo</Label>
            <Input defaultValue="Ana Oliveira" />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Email</Label>
            <Input defaultValue="ana@email.com" type="email" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Telefone</Label>
          <Input defaultValue="(11) 99999-1234" />
        </div>
        <Button className="rounded-full font-body">Salvar alterações</Button>
      </div>

      {/* Site Settings */}
      <div className="card-premium rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="font-display text-base font-semibold text-foreground">Site do Evento</h3>
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">URL do site</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">eventosite.com/</span>
            <Input defaultValue={event.slug} className="flex-1" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-sm text-foreground">Site público</p>
            <p className="text-xs text-muted-foreground">Permite que qualquer pessoa veja seu site</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-sm text-foreground">Proteger com senha</p>
            <p className="text-xs text-muted-foreground">Exigir senha para acessar o site</p>
          </div>
          <Switch />
        </div>
      </div>

      {/* Notifications */}
      <div className="card-premium rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-display text-base font-semibold text-foreground">Notificações</h3>
        </div>
        {[
          { label: "Email ao receber confirmação de presença", desc: "Notifique quando um convidado confirmar" },
          { label: "Email ao receber presente via PIX", desc: "Notifique sobre novos recebimentos" },
          { label: "Lembrete de tarefas pendentes", desc: "Receba lembretes semanais" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Switch defaultChecked />
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="card-premium rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-display text-base font-semibold text-foreground">Segurança</h3>
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Alterar senha</Label>
          <Input type="password" placeholder="Nova senha" />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Confirmar nova senha</Label>
          <Input type="password" placeholder="Confirmar senha" />
        </div>
        <Button variant="outline" className="rounded-full font-body">Atualizar senha</Button>
      </div>

      {/* Danger */}
      <Separator />
      <div className="card-premium rounded-2xl p-6 border-destructive/20">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="w-5 h-5 text-destructive" />
          <h3 className="font-display text-base font-semibold text-destructive">Zona de perigo</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Ao excluir sua conta, todos os dados serão removidos permanentemente.
        </p>
        <Button variant="destructive" className="rounded-full font-body">Excluir minha conta</Button>
      </div>
    </div>
  );
};

export default DashboardSettings;
