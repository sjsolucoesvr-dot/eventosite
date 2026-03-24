import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Produto: ["Funcionalidades", "Temas", "Preços", "Exemplos"],
  Recursos: ["E-book grátis", "Planilha", "Checklist", "Blog"],
  Empresa: ["Sobre nós", "Carreiras", "Contato", "Imprensa"],
  Suporte: ["Central de ajuda", "Comunidade", "Status", "Feedback"],
};

const Footer = () => (
  <footer className="bg-dark text-card/80 py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-5 gap-8 mb-12">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-gold fill-gold" />
            <span className="text-lg font-display font-bold text-card">EventoSite</span>
          </Link>
          <p className="text-sm font-body text-card/60">
            A plataforma mais completa para criar o site do seu evento.
          </p>
        </div>
        {Object.entries(footerLinks).map(([cat, links]) => (
          <div key={cat}>
            <h4 className="font-body font-semibold text-card text-sm mb-4">{cat}</h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm font-body text-card/50 hover:text-card transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-card/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-body text-card/40">
          © 2025 EventoSite. Todos os direitos reservados.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-xs font-body text-card/40 hover:text-card transition-colors">Privacidade</a>
          <a href="#" className="text-xs font-body text-card/40 hover:text-card transition-colors">Termos</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
