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

  const links = ["Funcionalidades", "Preços", "Marketplace", "Blog"];

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
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary fill-primary" />
          <span className="text-xl font-display font-semibold text-foreground">EventoSite</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {l}
            </a>
          ))}
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
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="block text-sm py-2 text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {l}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 rounded-full" asChild>
              <Link to="/dashboard">Entrar</Link>
            </Button>
            <Button size="sm" className="flex-1 rounded-full" asChild>
              <Link to="/dashboard">Criar meu site grátis</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
