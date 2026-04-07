import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Globe, Shield, Trash2, Save, Loader2, Rocket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useUserEvent, useUpdateEvent } from "@/hooks/useEvent";
import { toast } from "sonner";

const DashboardSettings = () => {
  const { user, profile } = useAuth();
  const { data: event } = useUserEvent();
  const updateEvent = useUpdateEvent();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [sitePublic, setSitePublic] = useState(true);
  const [sitePassword, setSitePassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [savingSite, setSavingSite] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setEmail(profile.email || user?.email || "");
    }
  }, [profile, user]);

  // Load event site settings
  useEffect(() => {
    if (event) {
      setSitePublic(!event.is_private);
      setSitePassword(!!event.site_password);
      setPasswordValue(event.site_password || "");
    }
  }, [event]);

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, email })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Perfil salvo com sucesso!");
    } catch {
      toast.error("Erro ao salvar perfil.");
    } finally {
      setSavingProfile(false);
    }
  };

  const saveSiteSettings = async () => {
    if (!event) return;
    setSavingSite(true);
    try {
      await updateEvent.mutateAsync({
        id: event.id,
        is_private: !sitePublic,
        site_password: sitePassword ? passwordValue : null,
      });
      toast.success("Configurações do site salvas!");
    } catch {
      toast.error("Erro ao salvar configurações.");
    } finally {
      setSavingSite(false);
    }
  };

  const handlePublishSite = async () => {
    if (!event) return;
    setSavingSite(true);
    try {
      await updateEvent.mutateAsync({ id: event.id, is_published: true });
      toast.success("Site publicado com sucesso! Agora está acessível ao público.");
    } catch {
      toast.error("Erro ao publicar site.");
    } finally {
      setSavingSite(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Senha atualizada com sucesso!");
    } catch {
      toast.error("Erro ao atualizar senha.");
    } finally {
      setSavingPassword(false);
    }
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-body text-sm">Nome completo</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Telefone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-1234" />
        </div>
        <Button className="rounded-full font-body gap-2" onClick={saveProfile} disabled={savingProfile}>
          {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar alterações
        </Button>
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
            <span className="text-sm text-muted-foreground whitespace-nowrap">eventosite.com/</span>
            <Input value={event?.slug || ""} disabled className="flex-1" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-sm text-foreground">Site público</p>
            <p className="text-xs text-muted-foreground">Permite que qualquer pessoa veja seu site</p>
          </div>
          <Switch checked={sitePublic} onCheckedChange={setSitePublic} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-sm text-foreground">Proteger com senha</p>
            <p className="text-xs text-muted-foreground">Exigir senha para acessar o site</p>
          </div>
          <Switch checked={sitePassword} onCheckedChange={setSitePassword} />
        </div>
        {sitePassword && (
          <div className="space-y-2">
            <Label className="font-body text-sm">Senha do site</Label>
            <Input type="password" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)} placeholder="Digite a senha" />
          </div>
        )}
        <div className="flex gap-2">
          <Button className="rounded-full font-body gap-2" onClick={saveSiteSettings} disabled={savingSite}>
            {savingSite ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar configurações
          </Button>
          {event && !event.is_published && (
            <Button className="rounded-full font-body gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={handlePublishSite} disabled={savingSite}>
              <Rocket className="w-4 h-4" />
              Publicar site
            </Button>
          )}
        </div>
        {event?.is_published && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Globe className="w-3 h-3" /> Seu site está publicado e acessível ao público
          </p>
        )}
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
          <Label className="font-body text-sm">Nova senha</Label>
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova senha" />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">Confirmar nova senha</Label>
          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmar senha" />
        </div>
        <Button variant="outline" className="rounded-full font-body gap-2" onClick={handleUpdatePassword} disabled={savingPassword}>
          {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
          Atualizar senha
        </Button>
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
