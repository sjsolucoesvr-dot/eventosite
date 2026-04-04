import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { usePublicEvent, useGifts, useWallMessages, useAddWallMessage, useGalleryPhotos, useAddGuest } from "@/hooks/useEvent";
import { resolveSiteTheme, resolveSiteSections, getReadableTextColor } from "@/lib/site-customization";
import { Heart, Calendar, MapPin, Users, ChevronDown, Send, Gift, Clock, ArrowUp, Music, MessageCircle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { toast } from "sonner";

const ScrollSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const SectionDivider = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-4 mb-8">
    <div className="h-px w-12" style={{ background: `${color}60` }} />
    <Heart className="w-5 h-5" style={{ color }} />
    <div className="h-px w-12" style={{ background: `${color}60` }} />
  </div>
);

const EventSite = () => {
  const { slug } = useParams();
  const { data: event, isLoading, error } = usePublicEvent(slug || "");
  const { data: gifts } = useGifts(event?.id);
  const { data: wallMessages } = useWallMessages(event?.id);
  const { data: galleryPhotos } = useGalleryPhotos(event?.id);
  const addWallMessage = useAddWallMessage();
  const addGuest = useAddGuest();

  const [now, setNow] = useState(new Date());
  const [navVisible, setNavVisible] = useState(true);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [wallName, setWallName] = useState("");
  const [wallMsg, setWallMsg] = useState("");
  const [showQR, setShowQR] = useState(false);

  // RSVP form state
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpEmail, setRsvpEmail] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("sim");
  const [rsvpCompanions, setRsvpCompanions] = useState("0");
  const [rsvpDietary, setRsvpDietary] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      setNavVisible(window.scrollY < lastY || window.scrollY < 100);
      setShowBackToTop(window.scrollY > 600);
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Heart className="w-12 h-12 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-display font-bold">Evento não encontrado</h1>
          <p className="text-muted-foreground">O evento que você procura não existe ou não está publicado.</p>
          <Link to="/" className="inline-block text-primary hover:underline">← Voltar ao início</Link>
        </div>
      </div>
    );
  }

  // Resolve theme from DB using shared logic
  const resolvedTheme = resolveSiteTheme(event);
  const theme = {
    primary: resolvedTheme.primary,
    primaryDark: resolvedTheme.secondary,
    primaryLight: resolvedTheme.background,
  };

  const sections = resolveSiteSections(event.sections);

  const eventDate = event.date ? parseISO(event.date) : new Date();
  const days = Math.max(0, differenceInDays(eventDate, now));
  const hours = Math.max(0, differenceInHours(eventDate, now) % 24);
  const minutes = Math.max(0, differenceInMinutes(eventDate, now) % 60);
  const seconds = Math.max(0, differenceInSeconds(eventDate, now) % 60);

  const availableGifts = (gifts || []).filter((g) => g.status === "available" || !g.status);

  const navLinks = [
    sections.story && { label: "Nossa História", href: "#historia" },
    sections.gallery && { label: "Galeria", href: "#galeria" },
    sections.info && { label: "Informações", href: "#informacoes" },
    sections.rsvp && { label: "Confirmar Presença", href: "#rsvp" },
    sections.wall && { label: "Recados", href: "#recados" },
  ].filter(Boolean) as { label: string; href: string }[];

  const siteUrl = `${window.location.origin}/evento/${event.slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(siteUrl)}&color=${theme.primary.replace("#", "")}&bgcolor=${theme.primaryLight.replace("#", "")}`;

  const titleFont = event.font_title || "Boston Angel";
  const bodyFont = event.font_body || "Glacial Indifference";

  const handleWallSubmit = () => {
    if (wallName.trim() && wallMsg.trim() && event.id) {
      addWallMessage.mutate({
        event_id: event.id,
        name: wallName.trim(),
        message: wallMsg.trim(),
      });
      setWallName("");
      setWallMsg("");
      toast.success("Recado enviado!");
    }
  };

  const handleRsvpSubmit = () => {
    if (!rsvpName.trim() || !event.id) return;
    const statusMap: Record<string, string> = { sim: "confirmed", talvez: "pending", nao: "declined" };
    addGuest.mutate({
      event_id: event.id,
      full_name: rsvpName.trim(),
      email: rsvpEmail.trim() || null,
      status: statusMap[rsvpStatus] || "pending",
      companions: parseInt(rsvpCompanions) || 0,
      dietary: rsvpDietary.trim() || null,
      message: rsvpMessage.trim() || null,
      confirmed_at: new Date().toISOString(),
    }, {
      onSuccess: () => setRsvpSent(true),
      onError: () => toast.error("Erro ao confirmar presença"),
    });
  };

  const defaultGalleryPhotos = [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=75",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=75",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=75",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&q=75",
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=75",
    "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=75",
  ];

  const photos = galleryPhotos?.length ? galleryPhotos.map(p => p.url) : defaultGalleryPhotos;

  return (
    <div className="min-h-screen" style={{ fontFamily: bodyFont, background: theme.primaryLight }}>
      {/* Navbar */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: navVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: `${theme.primaryDark}CC`,
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${theme.primary}20`,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-sm" style={{ color: theme.primary, fontFamily: titleFont }}>{event.title}</span>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-xs font-medium transition-colors duration-200 hover:opacity-100 opacity-70" style={{ color: theme.primaryLight }}>
                {link.label}
              </a>
            ))}
            <button onClick={() => setShowQR(!showQR)} className="opacity-70 hover:opacity-100 transition-opacity" title="QR Code">
              <QrCode className="w-4 h-4" style={{ color: theme.primaryLight }} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* QR Code Modal */}
      {showQR && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowQR(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-3xl p-8 text-center max-w-sm mx-4"
            style={{ background: theme.primaryLight }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: theme.primaryDark }}>Compartilhe o site</h3>
            <p className="text-sm mb-6" style={{ color: `${theme.primaryDark}99` }}>
              Escaneie o QR Code para acessar o site do evento
            </p>
            <img src={qrUrl} alt="QR Code do evento" className="mx-auto rounded-2xl mb-4" width={200} height={200} />
            <p className="text-xs font-mono px-4 py-2 rounded-xl mb-4" style={{ background: `${theme.primaryDark}08`, color: theme.primaryDark }}>
              {siteUrl}
            </p>
            <button
              onClick={() => { navigator.clipboard.writeText(siteUrl); toast.success("Link copiado!"); }}
              className="px-6 py-2 rounded-full text-sm font-medium"
              style={{ background: theme.primary, color: theme.primaryLight }}
            >
              Copiar link
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* HERO */}
      {sections.hero && (
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${event.hero_image_url || "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80"}')`,
            }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${theme.primaryDark}99, ${theme.primaryDark}DD)` }} />
          <motion.div className="relative z-10 text-center space-y-6 px-6">
            <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <svg className="w-14 h-14 mx-auto" viewBox="0 0 56 56" fill="none">
                <path d="M28 48s-18-12-18-24a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 12-18 24-18 24z" fill={theme.primary} opacity="0.3" />
                <path d="M28 44s-14-10-14-20a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 10-14 20-14 20z" fill={theme.primary} opacity="0.7" />
              </svg>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: `${theme.primary}CC` }}>
              Convidam para o {event.type || "casamento"}
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="text-5xl md:text-7xl font-bold leading-tight" style={{ color: theme.primaryLight, fontFamily: titleFont }}>
              {event.title}
            </motion.h1>

            {event.subtitle && (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                className="text-lg italic" style={{ color: `${theme.primaryLight}BB` }}>
                "{event.subtitle}"
              </motion.p>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
              className="flex items-center justify-center gap-6 text-sm" style={{ color: `${theme.primaryLight}CC` }}>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: theme.primary }} />
                {format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
              {event.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: theme.primary }} />
                  {event.location}
                </span>
              )}
            </motion.div>

            {/* Countdown */}
            {sections.countdown && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3 }}
                className="flex justify-center gap-4 pt-4">
                {[
                  { value: days, label: "Dias" },
                  { value: hours, label: "Horas" },
                  { value: minutes, label: "Min" },
                  { value: seconds, label: "Seg" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-3xl font-bold rounded-xl w-18 h-18 flex items-center justify-center px-4 py-3"
                      style={{ background: `${theme.primary}20`, color: theme.primaryLight }}>
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <span className="text-xs mt-1 block" style={{ color: `${theme.primaryLight}88` }}>{item.label}</span>
                  </div>
                ))}
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              <a href="#rsvp">
                <button className="mt-4 px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: theme.primary, color: theme.primaryDark }}>
                  Confirmar Presença
                </button>
              </a>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ChevronDown className="w-6 h-6" style={{ color: `${theme.primaryLight}66` }} />
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* OUR STORY */}
      {sections.story && event.story && (
        <section id="historia" className="py-24 px-6" style={{ background: theme.primaryLight }}>
          <div className="max-w-3xl mx-auto text-center">
            <ScrollSection>
              <p className="text-xs uppercase tracking-[0.25em] mb-4 font-semibold" style={{ color: theme.primary }}>Nossa História</p>
              <SectionDivider color={theme.primary} />
              <p className="text-base leading-loose" style={{ color: theme.primaryDark }}>
                {event.story}
              </p>
            </ScrollSection>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {sections.gallery && (
        <section id="galeria" className="py-24 px-6" style={{ background: theme.primaryDark }}>
          <div className="max-w-5xl mx-auto">
            <ScrollSection>
              <p className="text-xs uppercase tracking-[0.25em] text-center mb-4 font-semibold" style={{ color: theme.primary }}>Galeria</p>
              <SectionDivider color={theme.primary} />
            </ScrollSection>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.map((url, i) => (
                <ScrollSection key={i} delay={i * 0.1}>
                  <div className="aspect-square rounded-xl overflow-hidden cursor-pointer group">
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  </div>
                </ScrollSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EVENT INFO */}
      {sections.info && (
        <section id="informacoes" className="py-24 px-6" style={{ background: theme.primaryLight }}>
          <div className="max-w-4xl mx-auto">
            <ScrollSection>
              <p className="text-xs uppercase tracking-[0.25em] text-center mb-4 font-semibold" style={{ color: theme.primary }}>Informações</p>
              <SectionDivider color={theme.primary} />
            </ScrollSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Calendar, title: "Data", info: format(eventDate, "dd/MM/yyyy", { locale: ptBR }) },
                { icon: MapPin, title: "Local", info: event.location || "A definir" },
                { icon: Users, title: "Traje", info: "Traje Social" },
                { icon: Clock, title: "Horário", info: event.time ? `${event.time}h` : "A definir" },
              ].map((card, i) => (
                <ScrollSection key={i} delay={i * 0.1}>
                  <div className="text-center p-6 rounded-2xl" style={{ background: `${theme.primaryDark}08`, border: `1px solid ${theme.primary}20` }}>
                    <card.icon className="w-6 h-6 mx-auto mb-3" style={{ color: theme.primary }} />
                    <h4 className="text-sm font-semibold mb-2" style={{ color: theme.primaryDark }}>{card.title}</h4>
                    <p className="text-xs whitespace-pre-line" style={{ color: `${theme.primaryDark}BB` }}>{card.info}</p>
                  </div>
                </ScrollSection>
              ))}
            </div>

            {sections.location && event.location && (
              <ScrollSection delay={0.3}>
                <div className="mt-8 rounded-2xl overflow-hidden h-64 flex items-center justify-center"
                  style={{ background: `${theme.primaryDark}08`, border: `1px solid ${theme.primary}20` }}>
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: `${theme.primary}80` }} />
                    <p className="text-sm" style={{ color: theme.primaryDark }}>{event.location}</p>
                    {event.location_address && (
                      <p className="text-xs mt-1" style={{ color: `${theme.primaryDark}99` }}>{event.location_address}</p>
                    )}
                  </div>
                </div>
              </ScrollSection>
            )}
          </div>
        </section>
      )}

      {/* PLAYLIST */}
      {sections.playlist && event.spotify_playlist_url && (
        <section className="py-24 px-6" style={{ background: theme.primaryDark }}>
          <div className="max-w-3xl mx-auto">
            <ScrollSection>
              <p className="text-xs uppercase tracking-[0.25em] text-center mb-4 font-semibold" style={{ color: theme.primary }}>Nossa Playlist</p>
              <SectionDivider color={theme.primary} />
              <p className="text-center text-sm mb-8" style={{ color: `${theme.primaryLight}BB` }}>
                As músicas que marcam nossa história e que vão embalar nossa festa 🎶
              </p>
            </ScrollSection>
            <ScrollSection delay={0.2}>
              <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${theme.primary}20` }}>
                <iframe
                  src={event.spotify_playlist_url}
                  width="100%"
                  height="380"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-2xl"
                  style={{ background: theme.primaryDark }}
                />
              </div>
            </ScrollSection>
          </div>
        </section>
      )}

      {/* RSVP */}
      {sections.rsvp && (
        <section id="rsvp" className="py-24 px-6" style={{ background: theme.primaryLight }}>
          <div className="max-w-lg mx-auto">
            <ScrollSection>
              <p className="text-xs uppercase tracking-[0.25em] text-center mb-4 font-semibold" style={{ color: theme.primary }}>Confirmar Presença</p>
              <SectionDivider color={theme.primary} />
              <h2 className="text-2xl font-bold text-center mb-8" style={{ color: theme.primaryDark, fontFamily: titleFont }}>
                Será uma honra ter você conosco
              </h2>
            </ScrollSection>

            {rsvpSent ? (
              <ScrollSection>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="text-center p-8 rounded-2xl" style={{ background: `${theme.primary}15` }}
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                    <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: theme.primary }} />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: theme.primaryDark }}>Obrigado!</h3>
                  <p className="text-sm" style={{ color: `${theme.primaryDark}BB` }}>Sua confirmação foi recebida com sucesso.</p>
                </motion.div>
              </ScrollSection>
            ) : (
              <ScrollSection delay={0.2}>
                <div className="space-y-4 p-6 rounded-2xl" style={{ background: `${theme.primaryDark}06`, border: `1px solid ${theme.primary}20` }}>
                  <div className="space-y-2">
                    <Label className="text-sm" style={{ color: theme.primaryDark }}>Nome completo</Label>
                    <Input placeholder="Seu nome" className="h-11" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)}
                      style={{ borderColor: `${theme.primary}30`, background: theme.primaryLight }} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm" style={{ color: theme.primaryDark }}>Email</Label>
                    <Input type="email" placeholder="seu@email.com" className="h-11" value={rsvpEmail} onChange={(e) => setRsvpEmail(e.target.value)}
                      style={{ borderColor: `${theme.primary}30`, background: theme.primaryLight }} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm" style={{ color: theme.primaryDark }}>Confirmação</Label>
                    <Select value={rsvpStatus} onValueChange={setRsvpStatus}>
                      <SelectTrigger className="h-11" style={{ borderColor: `${theme.primary}30`, background: theme.primaryLight }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim, estarei presente!</SelectItem>
                        <SelectItem value="talvez">Talvez</SelectItem>
                        <SelectItem value="nao">Não poderei ir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm" style={{ color: theme.primaryDark }}>Nº acompanhantes</Label>
                      <Input type="number" value={rsvpCompanions} onChange={(e) => setRsvpCompanions(e.target.value)} min="0" max="5" className="h-11"
                        style={{ borderColor: `${theme.primary}30`, background: theme.primaryLight }} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm" style={{ color: theme.primaryDark }}>Restrição alimentar</Label>
                      <Input placeholder="Ex: Vegetariano" className="h-11" value={rsvpDietary} onChange={(e) => setRsvpDietary(e.target.value)}
                        style={{ borderColor: `${theme.primary}30`, background: theme.primaryLight }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm" style={{ color: theme.primaryDark }}>Mensagem (opcional)</Label>
                    <Textarea placeholder="Deixe uma mensagem para os noivos..." rows={3} value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)}
                      style={{ borderColor: `${theme.primary}30`, background: theme.primaryLight }} />
                  </div>
                  <button
                    onClick={handleRsvpSubmit}
                    disabled={!rsvpName.trim() || addGuest.isPending}
                    className="w-full py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    style={{ background: theme.primary, color: theme.primaryLight }}
                  >
                    <Send className="w-4 h-4" /> {addGuest.isPending ? "Enviando..." : "Confirmar Presença"}
                  </button>
                </div>
              </ScrollSection>
            )}
          </div>
        </section>
      )}

      {/* GIFTS */}
      {sections.gifts && availableGifts.length > 0 && (
        <section className="py-24 px-6" style={{ background: theme.primaryDark }}>
          <div className="max-w-5xl mx-auto">
            <ScrollSection>
              <p className="text-xs uppercase tracking-[0.25em] text-center mb-4 font-semibold" style={{ color: theme.primary }}>Lista de Presentes</p>
              <SectionDivider color={theme.primary} />
            </ScrollSection>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {availableGifts.map((gift, i) => (
                <ScrollSection key={gift.id} delay={i * 0.08}>
                  <div className="p-6 rounded-2xl text-center group cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    style={{ background: `${theme.primaryLight}10`, border: `1px solid ${theme.primary}20` }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${theme.primary}20` }}>
                      {gift.image_url ? (
                        <img src={gift.image_url} alt={gift.name} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <Gift className="w-7 h-7" style={{ color: theme.primary }} />
                      )}
                    </div>
                    <h4 className="font-semibold text-sm mb-1" style={{ color: theme.primaryLight }}>{gift.name}</h4>
                    {gift.description && <p className="text-xs mb-3" style={{ color: `${theme.primaryLight}BB` }}>{gift.description}</p>}
                    {gift.suggested_value && (
                      <p className="text-xl font-bold mb-4" style={{ color: theme.primary }}>
                        R$ {gift.suggested_value.toLocaleString("pt-BR")}
                      </p>
                    )}
                    <button className="px-6 py-2 rounded-full text-xs font-medium transition-all hover:opacity-90"
                      style={{ background: theme.primary, color: theme.primaryDark }}>
                      Presentear
                    </button>
                  </div>
                </ScrollSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MURAL DE RECADOS */}
      {sections.wall && (
        <section id="recados" className="py-24 px-6" style={{ background: theme.primaryLight }}>
          <div className="max-w-3xl mx-auto">
            <ScrollSection>
              <p className="text-xs uppercase tracking-[0.25em] text-center mb-4 font-semibold" style={{ color: theme.primary }}>Mural de Recados</p>
              <SectionDivider color={theme.primary} />
              <p className="text-center text-sm mb-8" style={{ color: `${theme.primaryDark}BB` }}>
                Deixe uma mensagem carinhosa para os noivos 💌
              </p>
            </ScrollSection>

            <ScrollSection delay={0.1}>
              <div className="p-6 rounded-2xl mb-8" style={{ background: `${theme.primaryDark}06`, border: `1px solid ${theme.primary}20` }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <Input
                    placeholder="Seu nome"
                    value={wallName}
                    onChange={(e) => setWallName(e.target.value)}
                    className="h-11"
                    style={{ borderColor: `${theme.primary}30`, background: theme.primaryLight }}
                  />
                  <div />
                </div>
                <Textarea
                  placeholder="Escreva sua mensagem..."
                  value={wallMsg}
                  onChange={(e) => setWallMsg(e.target.value)}
                  rows={3}
                  className="mb-3"
                  style={{ borderColor: `${theme.primary}30`, background: theme.primaryLight }}
                />
                <button
                  onClick={handleWallSubmit}
                  disabled={!wallName.trim() || !wallMsg.trim() || addWallMessage.isPending}
                  className="px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none"
                  style={{ background: theme.primary, color: theme.primaryLight }}
                >
                  <MessageCircle className="w-4 h-4" /> Enviar Recado
                </button>
              </div>
            </ScrollSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(wallMessages || []).map((msg, i) => (
                <ScrollSection key={msg.id} delay={i * 0.08}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-2xl"
                    style={{ background: `${theme.primaryDark}06`, border: `1px solid ${theme.primary}15` }}
                  >
                    <p className="text-sm leading-relaxed mb-3" style={{ color: theme.primaryDark }}>"{msg.message}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold" style={{ color: theme.primary }}>— {msg.name}</span>
                      <span className="text-xs" style={{ color: `${theme.primaryDark}66` }}>
                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString("pt-BR") : ""}
                      </span>
                    </div>
                  </motion.div>
                </ScrollSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hosts message */}
      {sections.message && event.welcome_message && (
        <section className="py-20 px-6" style={{ background: theme.primaryDark }}>
          <ScrollSection>
            <div className="max-w-2xl mx-auto text-center">
              <Heart className="w-6 h-6 mx-auto mb-4" style={{ color: theme.primary }} />
              <p className="text-lg italic leading-relaxed" style={{ color: `${theme.primaryLight}CC` }}>
                "{event.welcome_message}"
              </p>
              <p className="text-sm mt-4" style={{ color: theme.primary, fontFamily: titleFont }}>— {event.title}</p>
            </div>
          </ScrollSection>
        </section>
      )}

      {/* FOOTER */}
      {sections.footer && (
        <footer className="py-8 px-6 text-center" style={{ background: theme.primaryDark, borderTop: `1px solid ${theme.primary}15` }}>
          <div className="max-w-md mx-auto mb-4">
            <button
              onClick={() => setShowQR(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all hover:opacity-80"
              style={{ background: `${theme.primary}15`, color: theme.primary }}
            >
              <QrCode className="w-3.5 h-3.5" />
              Compartilhar QR Code
            </button>
          </div>
          <p className="text-sm mb-2" style={{ color: theme.primary, fontFamily: titleFont }}>{event.title}</p>
          <p className="text-xs" style={{ color: `${theme.primaryLight}44` }}>
            Site criado no{" "}
            <Link to="/" className="hover:underline" style={{ color: `${theme.primaryLight}66` }}>EventoSite</Link>
          </p>
        </footer>
      )}

      {/* Back to top */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: theme.primary, color: theme.primaryDark }}
      >
        <ArrowUp className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

export default EventSite;
