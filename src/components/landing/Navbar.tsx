import { useState, useEffect } from "react";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Preços", href: "#preços" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(250, 250, 248, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0, 0, 0, 0.06)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <Heart className="h-4 w-4 text-primary fill-primary group-hover:scale-110 transition-transform duration-200" />
          <span className="font-script text-2xl text-foreground" style={{ lineHeight: 1.2 }}>EventoSite</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.label}
                to={l.href}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {l.label}
              </a>
            )
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-border hover:bg-muted"
            asChild
          >
            <Link to="/login">Entrar</Link>
          </Button>
          <Button
            size="sm"
            className="rounded-full px-6 py-2.5 hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5"
            asChild
          >
            <Link to="/cadastro">Criar meu site grátis</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden p-4 space-y-3"
          style={{ background: "rgba(250, 250, 248, 0.95)", backdropFilter: "blur(20px)" }}
        >
          {links.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.label}
                to={l.href}
                className="block text-sm py-2 text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="block text-sm py-2 text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            )
          )}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 rounded-full" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button size="sm" className="flex-1 rounded-full" asChild>
              <Link to="/cadastro">Criar meu site grátis</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
