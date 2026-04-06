import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Gift, Trash2, DollarSign, QrCode, Upload, Loader2, ShoppingBag, Image } from "lucide-react";
import { useGifts, useAddGift, useDeleteGift, useGiftPayments, uploadEventPhoto, type EventRow } from "@/hooks/useEvent";
import { toast } from "sonner";
import GiftCatalog from "@/components/dashboard/GiftCatalog";

const statusMap: Record<string, { label: string; className: string }> = {
  available: { label: "Disponível", className: "text-green-700 bg-green-50 border-green-200" },
  purchased: { label: "Comprado", className: "text-blue-700 bg-blue-50 border-blue-200" },
  partial: { label: "Parcial", className: "text-yellow-700 bg-yellow-50 border-yellow-200" },
};

interface Props { event: EventRow | null | undefined; }

const DashboardGifts = ({ event }: Props) => {
  const { data: gifts = [] } = useGifts(event?.id);
  const { data: payments = [] } = useGiftPayments(event?.id);
  const addGift = useAddGift();
  const deleteGift = useDeleteGift();
  const [newGift, setNewGift] = useState({ name: "", suggested_value: "", description: "" });
  const [showCatalog, setShowCatalog] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!event) return <p className="text-muted-foreground text-center py-20">Crie um evento primeiro</p>;

  const totalReceived = payments.reduce((acc, p) => acc + Number(p.amount), 0);
  const purchasedCount = gifts.filter((g) => g.status === "purchased").length;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAdd = async () => {
    if (!newGift.name) { toast.error("Nome é obrigatório"); return; }
    setUploading(true);
    try {
      let image_url: string | null = null;
      if (imageFile) {
        const { publicUrl } = await uploadEventPhoto(imageFile, event.id, "gifts");
        image_url = publicUrl;
      }
      await addGift.mutateAsync({
        event_id: event.id,
        name: newGift.name,
        description: newGift.description,
        suggested_value: newGift.suggested_value ? Number(newGift.suggested_value) : null,
        image_url,
      });
      setNewGift({ name: "", suggested_value: "", description: "" });
      setImageFile(null);
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = "";
      toast.success("Presente adicionado!");
    } catch {
      toast.error("Erro ao adicionar presente.");
    } finally {
      setUploading(false);
    }
  };

  const handleCatalogSelect = async (items: { name: string; suggested_value: number; image_url: string; description: string }[]) => {
    for (const item of items) {
      await addGift.mutateAsync({
        event_id: event.id,
        name: item.name,
        description: item.description,
        suggested_value: item.suggested_value,
        image_url: item.image_url,
      });
    }
    toast.success(`${items.length} presente(s) adicionado(s) do catálogo!`);
    setShowCatalog(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Lista de Presentes</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie presentes e recebimentos via PIX</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-premium rounded-2xl p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Total recebido</p>
              <p className="text-3xl font-display font-semibold tracking-tight text-foreground mt-1">R$ {totalReceived.toLocaleString("pt-BR")}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center"><DollarSign className="w-6 h-6 text-green-600" /></div>
          </div>
        </div>
        <div className="card-premium rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Presentes cadastrados</p>
              <p className="text-3xl font-display font-semibold tracking-tight text-foreground mt-1">{gifts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center"><Gift className="w-6 h-6 text-primary" /></div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 font-body">{purchasedCount} já comprados</p>
        </div>
        <div className="card-premium rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Recebimentos</p>
              <p className="text-3xl font-display font-semibold tracking-tight text-foreground mt-1">{payments.length}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center"><QrCode className="w-6 h-6 text-blue-600" /></div>
          </div>
        </div>
      </div>

      {/* Toggle between manual add and catalog */}
      <div className="flex gap-2">
        <Button
          variant={showCatalog ? "outline" : "default"}
          onClick={() => setShowCatalog(false)}
          className="rounded-full gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar manualmente
        </Button>
        <Button
          variant={showCatalog ? "default" : "outline"}
          onClick={() => setShowCatalog(true)}
          className="rounded-full gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Catálogo de presentes
        </Button>
      </div>

      {showCatalog ? (
        <div className="card-premium rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-4">Escolha do catálogo</h3>
          <p className="text-sm text-muted-foreground mb-4">Selecione os presentes que deseja adicionar à sua lista. Fotos e valores já estão incluídos.</p>
          <GiftCatalog onSelect={handleCatalogSelect} existingNames={gifts.map((g) => g.name)} />
        </div>
      ) : (
        <div className="card-premium rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-4">Adicionar presente</h3>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[180px] space-y-1">
              <Label className="text-xs font-body">Nome</Label>
              <Input placeholder="Ex: Jogo de Panelas" value={newGift.name} onChange={(e) => setNewGift(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="w-[140px] space-y-1">
              <Label className="text-xs font-body">Valor (R$)</Label>
              <Input type="number" placeholder="0,00" value={newGift.suggested_value} onChange={(e) => setNewGift(p => ({ ...p, suggested_value: e.target.value }))} />
            </div>
            <div className="flex-1 min-w-[180px] space-y-1">
              <Label className="text-xs font-body">Descrição</Label>
              <Input placeholder="Breve descrição" value={newGift.description} onChange={(e) => setNewGift(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={() => fileRef.current?.click()}>
              <Image className="w-4 h-4" /> {imagePreview ? "Trocar foto" : "Adicionar foto"}
            </Button>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-border" />
            )}
            <div className="ml-auto">
              <Button className="rounded-full font-body shrink-0 gap-2" onClick={handleAdd} disabled={addGift.isPending || uploading}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-4">Presentes cadastrados</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gifts.map((gift) => (
            <div key={gift.id} className="card-premium rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-full h-28 rounded-xl bg-muted/50 flex items-center justify-center mb-4 overflow-hidden">
                {gift.image_url ? <img src={gift.image_url} alt={gift.name} className="w-full h-full object-cover rounded-xl" /> : <Gift className="w-8 h-8 text-muted-foreground/40" />}
              </div>
              <h4 className="font-body font-medium text-foreground text-sm">{gift.name}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{gift.description}</p>
              {gift.suggested_value && <p className="text-lg font-display font-semibold text-foreground mt-2">R$ {Number(gift.suggested_value).toLocaleString("pt-BR")}</p>}
              <div className="flex items-center justify-between mt-3">
                <Badge variant="outline" className={statusMap[gift.status || "available"]?.className}>{statusMap[gift.status || "available"]?.label}</Badge>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteGift.mutate({ id: gift.id, eventId: event.id })}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              {gift.purchased_by && <p className="text-xs text-muted-foreground mt-2">🎉 {gift.purchased_by}</p>}
            </div>
          ))}
          {gifts.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-10">Nenhum presente cadastrado ainda</div>
          )}
        </div>
      </div>

      {payments.length > 0 && (
        <div className="card-premium rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">Histórico de Recebimentos</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Data</TableHead>
                <TableHead className="font-body">De quem</TableHead>
                <TableHead className="font-body">Valor</TableHead>
                <TableHead className="font-body">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-body text-sm">{new Date(p.created_at!).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell className="font-body text-sm font-medium text-foreground">{p.giver_name}</TableCell>
                  <TableCell className="font-body text-sm font-medium text-foreground">R$ {Number(p.amount).toLocaleString("pt-BR")}</TableCell>
                  <TableCell><Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">{p.status === "confirmed" ? "Recebido" : "Pendente"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DashboardGifts;
