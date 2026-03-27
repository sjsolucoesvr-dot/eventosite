import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useEventStore, eventThemes } from "@/stores/eventStore";
import { Heart, Calendar, MapPin, Users, ChevronDown, Send, Gift, Clock, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

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

const EventSite = () => {
  const { slug } = useParams();
  const { event, guests, gifts } = useEventStore();
  const [now, setNow] = useState(new Date());
  const [navVisible, setNavVisible] = useState(true);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const theme = eventThemes.find((t) => t.id === event.themeId) || eventThemes[0];

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

  const days = Math.max(0, differenceInDays(event.date, now));
  const hours = Math.max(0, differenceInHours(event.date, now) % 24);
  const minutes = Math.max(0, differenceInMinutes(event.date, now) % 60);
  const seconds = Math.max(0, differenceInSeconds(event.date, now) % 60);

  const availableGifts = gifts.filter((g) => g.status === "available");

  const navLinks = [
    event.enabledSections.story && { label: "Nossa História", href: "#historia" },
    event.enabledSections.gallery && { label: "Galeria", href: "#galeria" },
    event.enabledSections.info && { label: "Informações", href: "#informacoes" },
    event.enabledSections.rsvp && { label: "Confirmar Presença", href: "#rsvp" },
  ].filter(Boolean) as { label: string; href: string }[];

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen" style={{ fontFamily: event.fontFamily, background: theme.primaryLight }}>
      {/* Navbar */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: navVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: `${theme.primaryDark}CC`,
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${theme.primary}20`,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-sm" style={{ color: theme.primary }}>{event.name}</span>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-medium transition-colors duration-200 hover:opacity-100 opacity-70"
                style={{ color: theme.primaryLight }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* HERO — Fullscreen */}
      {event.enabledSections.hero && (
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80')`,
              y: heroY,
            }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${theme.primaryDark}99, ${theme.primaryDark}DD)` }} />
          <motion.div className="relative z-10 text-center space-y-6 px-6" style={{ opacity: heroOpacity }}>
            {/* Decorative hearts */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <svg className="w-14 h-14 mx-auto" viewBox="0 0 56 56" fill="none">
                <path d="M28 48s-18-12-18-24a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 12-18 24-18 24z" fill={theme.primary} opacity="0.3" />
                <path d="M28 44s-14-10-14-20a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 10-14 20-14 20z" fill={theme.primary} opacity="0.7" />
              </svg>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xs uppercase tracking-[0.3em] font-medium"
              style={{ color: `${theme.primary}CC` }}
            >
              Convidam para o {event.type}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-5xl md:text-7xl font-bold leading-tight"
              style={{ color: theme.primaryLight }}
            >
              {event.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-lg italic"
              style={{ color: `${theme.primaryLight}AA` }}
            >
              "{event.welcomeMessage.slice(0, 60)}..."
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex items-center justify-center gap-6 text-sm"
              style={{ color: `${theme.primaryLight}BB` }}
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: theme.primary }} />
                {format(event.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: theme.primary }} />
                {event.location}
              </span>
            </motion.div>

            {/* Countdown */}
            {event.enabledSections.countdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 }}
                className="flex justify-center gap-4 pt-4"
              >
                {[
                  { value: days, label: "Dias" },
                  { value: hours, label: "Horas" },
                  { value: minutes, label: "Min" },
                  { value: seconds, label: "Seg" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div
                      className="text-3xl font-bold rounded-xl w-18 h-18 flex items-center justify-center px-4 py-3"
                      style={{ background: `${theme.primary}20`, color: theme.primaryLight }}
                    >
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <span className="text-xs mt-1 block" style={{ color: `${theme.primaryLight}88` }}>{item.label}</span>
                  </div>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <a href="#rsvp">
                <button
                  className="mt-4 px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: theme.primary, color: theme.primaryDark }}
                >
                  Confirmar Presença
                </button>
              </a>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className="w-6 h-6" style={{ color: `${theme.primaryLight}66` }} />
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* OUR STORY */}
      {event.enabledSections.story && (
        <section id="historia" className="py-24 px-6" style={{ background: theme.primaryLight }}>
          <div className="max-w-3xl mx-auto text-center">
            <ScrollSection>
              <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: theme.primary }}>Nossa História</p>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-12" style={{ background: `${theme.primary}40` }} />
                <Heart className="w-5 h-5" style={{ color: theme.primary }} />
                <div className="h-px w-12" style={{ background: `${theme.primary}40` }} />
              </div>
              <p className="text-base leading-loose" style={{ color: `${theme.primaryDark}CC` }}>
                {event.story}
              </p>
            </ScrollSection>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {event.enabledSections.gallery && (
        <section id="galeria" className="py-24 px-6" style={{ background: theme.primaryDark }}>
          <div className="max-w-5xl mx-auto">
            <ScrollSection>
              <p className="text-xs uppercase tracking-[0.25em] text-center mb-4" style={{ color: theme.primary }}>Galeria</p>
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="h-px w-12" style={{ background: `${theme.primary}40` }} />
                <Heart className="w-5 h-5" style={{ color: theme.primary }} />
                <div className="h-px w-12" style={{ background: `${theme.primary}40` }} />
              </div>
            </ScrollSection>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=75",
                "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=75",
                "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=75",
                "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&q=75",
                "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=75",
                "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=75",
              ].map((url, i) => (
                <ScrollSection key={i} delay={i * 0.1}>
                  <div className="aspect-square rounded-xl overflow-hidden cursor-pointer group">
                    <img
                      src={url}
                      alt={`Foto ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </ScrollSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EVENT INFO */}
      {event.enabledSections.info && (
        <section id="informacoes" className="py-24 px-6" style={{ background: theme.primaryLight }}>
          <div className="max-w-4xl mx-auto">
            <ScrollSection>
              <p className="text-xs uppercase tracking-[0.25em] text-center mb-4" style={{ color: theme.primary }}>Informações</p>
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="h-px w-12" style={{ background: `${theme.primary}40` }} />
                <Heart className="w-5 h-5" style={{ color: theme.primary }} />
                <div className="h-px w-12" style={{ background: `${theme.primary}40` }} />
              </div>
            </ScrollSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Calendar, title: "Data e Hora", info: format(event.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) },
                { icon: MapPin, title: "Local", info: event.location },
                { icon: Users, title: "Traje", info: "Traje Social" },
                { icon: Clock, title: "Horário", info: "Cerimônia às 16h\nRecepção às 18h" },
              ].map((card, i) => (
                <ScrollSection key={i} delay={i * 0.1}>
                  <div
                    className="text-center p-6 rounded-2xl"
                    style={{ background: `${theme.primaryDark}08`, border: `1px solid ${theme.primary}15` }}
                  >
                    <card.icon className="w-6 h-6 mx-auto mb-3" style={{ color: theme.primary }} />
                    <h4 className="text-sm font-semibold mb-2" style={{ color: theme.primaryDark }}>{card.title}</h4>
                    <p className="text-xs whitespace-pre-line" style={{ color: `${theme.primaryDark}99` }}>{card.info}</p>
                  </div>
                </ScrollSection>
              ))}
            </div>

            {/* Map placeholder */}
            {event.enabledSections.location && (
              <ScrollSection delay={0.3}>
                <div className="mt-8 rounded-2xl overflow-hidden h-64 flex items-center justify-center"
                  style={{ background: `${theme.primaryDark}08`, border: `1px solid ${theme.primary}15` }}>
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: `${theme.primary}60` }} />
                    <p className="text-sm" style={{ color: `${theme.primaryDark}99` }}>{event.location}</p>
                  </div>
                </div>
              </ScrollSection>
            )}
          </div>
        </section>
      )}

      {/* RSVP */}
      {event.enabledSections.rsvp && (
        <section id="rsvp" className="py-24 px-6" style={{ background: theme.primaryDark }}>
          <div className="max-w-lg mx-auto">
            <ScrollSection>
              <p className="text-xs uppercase tracking-[0.25em] text-center mb-4" style={{ color: theme.primary }}>Confirmar Presença</p>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-12" style={{ background: `${theme.primary}40` }} />
                <Heart className="w-5 h-5" style={{ color: theme.primary }} />
                <div className="h-px w-12" style={{ background: `${theme.primary}40` }} />
              </div>
              <h2 className="text-2xl font-bold text-center mb-8" style={{ color: theme.primaryLight }}>
                Será uma honra ter você conosco
              </h2>
            </ScrollSection>

            {rsvpSent ? (
              <ScrollSection>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="text-center p-8 rounded-2xl"
                  style={{ background: `${theme.primary}15` }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: theme.primary }} />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: theme.primaryLight }}>Obrigado!</h3>
                  <p className="text-sm" style={{ color: `${theme.primaryLight}BB` }}>Sua confirmação foi recebida com sucesso.</p>
                </motion.div>
              </ScrollSection>
            ) : (
              <ScrollSection delay={0.2}>
                <div className="space-y-4 p-6 rounded-2xl" style={{ background: `${theme.primaryLight}10`, border: `1px solid ${theme.primary}20` }}>
                  <div className="space-y-2">
                    <Label className="text-sm" style={{ color: `${theme.primaryLight}CC` }}>Nome completo</Label>
                    <Input placeholder="Seu nome" className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm" style={{ color: `${theme.primaryLight}CC` }}>Email</Label>
                    <Input type="email" placeholder="seu@email.com" className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm" style={{ color: `${theme.primaryLight}CC` }}>Confirmação</Label>
                    <Select defaultValue="sim">
                      <SelectTrigger className="h-11 border-white/10 bg-white/5 text-white">
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
                      <Label className="text-sm" style={{ color: `${theme.primaryLight}CC` }}>Nº acompanhantes</Label>
                      <Input type="number" defaultValue="0" min="0" max="5" className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm" style={{ color: `${theme.primaryLight}CC` }}>Restrição alimentar</Label>
                      <Input placeholder="Ex: Vegetariano" className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm" style={{ color: `${theme.primaryLight}CC` }}>Mensagem (opcional)</Label>
                    <Textarea placeholder="Deixe uma mensagem para os noivos..." rows={3} className="border-white/10 bg-white/5 text-white placeholder:text-white/30" />
                  </div>
                  <button
                    onClick={() => setRsvpSent(true)}
                    className="w-full py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                    style={{ background: theme.primary, color: theme.primaryDark }}
                  >
                    <Send className="w-4 h-4" /> Confirmar Presença
                  </button>
                </div>
              </ScrollSection>
            )}
          </div>
        </section>
      )}

      {/* GIFTS */}
      {event.enabledSections.gifts && availableGifts.length > 0 && (
        <section className="py-24 px-6" style={{ background: theme.primaryLight }}>
          <div className="max-w-5xl mx-auto">
            <ScrollSection>
              <p className="text-xs uppercase tracking-[0.25em] text-center mb-4" style={{ color: theme.primary }}>Lista de Presentes</p>
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="h-px w-12" style={{ background: `${theme.primary}40` }} />
                <Gift className="w-5 h-5" style={{ color: theme.primary }} />
                <div className="h-px w-12" style={{ background: `${theme.primary}40` }} />
              </div>
            </ScrollSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableGifts.map((gift, i) => (
                <ScrollSection key={gift.id} delay={i * 0.08}>
                  <div
                    className="p-6 rounded-2xl text-center group cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    style={{ background: `${theme.primaryDark}06`, border: `1px solid ${theme.primary}15` }}
                  >
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${theme.primary}15` }}>
                      <Gift className="w-7 h-7" style={{ color: theme.primary }} />
                    </div>
                    <h4 className="font-semibold text-sm mb-1" style={{ color: theme.primaryDark }}>{gift.name}</h4>
                    <p className="text-xs mb-3" style={{ color: `${theme.primaryDark}88` }}>{gift.description}</p>
                    <p className="text-xl font-bold mb-4" style={{ color: theme.primary }}>R$ {gift.value}</p>
                    <button
                      className="px-6 py-2 rounded-full text-xs font-medium transition-all hover:opacity-90"
                      style={{ background: theme.primary, color: theme.primaryDark }}
                    >
                      Presentear
                    </button>
                  </div>
                </ScrollSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hosts message */}
      {event.enabledSections.message && (
        <section className="py-20 px-6" style={{ background: theme.primaryDark }}>
          <ScrollSection>
            <div className="max-w-2xl mx-auto text-center">
              <Heart className="w-6 h-6 mx-auto mb-4" style={{ color: theme.primary }} />
              <p className="text-lg italic leading-relaxed" style={{ color: `${theme.primaryLight}CC` }}>
                "{event.welcomeMessage}"
              </p>
              <p className="text-sm mt-4" style={{ color: theme.primary }}>— {event.name}</p>
            </div>
          </ScrollSection>
        </section>
      )}

      {/* FOOTER */}
      {event.enabledSections.footer && (
        <footer className="py-8 px-6 text-center" style={{ background: theme.primaryDark, borderTop: `1px solid ${theme.primary}15` }}>
          <p className="text-sm mb-2" style={{ color: theme.primary }}>{event.name}</p>
          <p className="text-xs" style={{ color: `${theme.primaryLight}44` }}>
            Site criado no{" "}
            <Link to="/" className="hover:underline" style={{ color: `${theme.primaryLight}66` }}>
              EventoSite
            </Link>
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
