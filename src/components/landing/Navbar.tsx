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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card shadow-md" : "bg-transparent"}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-gold fill-gold" />
          <span className="text-xl font-display font-bold text-primary">EventoSite</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-body text-foreground/70 hover:text-primary transition-colors">
              {l}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">Entrar</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/dashboard">Criar meu site grátis</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-t p-4 space-y-3">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="block text-sm py-2 text-foreground/70" onClick={() => setMobileOpen(false)}>
              {l}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to="/dashboard">Entrar</Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link to="/dashboard">Criar meu site grátis</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
