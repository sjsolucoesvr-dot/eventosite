import { toast } from "sonner";

export function shareViaWhatsApp(eventTitle: string, eventUrl: string, guestName?: string) {
  const text = guestName
    ? `Olá ${guestName}! 💌 Você está convidado para ${eventTitle}. Acesse o site para confirmar sua presença: ${eventUrl}`
    : `Venha celebrar conosco! 🎉 Acesse o site de ${eventTitle}: ${eventUrl}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

export function copyLink(url: string) {
  navigator.clipboard.writeText(url);
  toast.success("Link copiado!");
}

export function shareViaEmail(eventTitle: string, eventUrl: string) {
  window.open(
    `mailto:?subject=Convite: ${eventTitle}&body=Acesse: ${eventUrl}`,
    "_blank"
  );
}
