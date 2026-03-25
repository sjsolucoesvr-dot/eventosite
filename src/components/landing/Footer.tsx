import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Produto: ["Funcionalidades", "Temas", "Preços", "Exemplos"],
  Recursos: ["E-book grátis", "Planilha", "Checklist", "Blog"],
  Empresa: ["Sobre nós", "Carreiras", "Contato", "Imprensa"],
  Suporte: ["Central de ajuda", "Comunidade", "Status", "Feedback"],
};

const Footer = () => (
  <footer className="bg-dark text-white/80 py-20">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-5 gap-8 mb-12">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Heart className="h-4 w-4 text-gold fill-gold" />
            <span className="text-lg font-display font-semibold text-white">EventoSite</span>
          </Link>
          <p className="text-sm font-body text-white/50">
            A plataforma mais completa para criar o site do seu evento.
          </p>
        </div>
        {Object.entries(footerLinks).map(([cat, links]) => (
          <div key={cat}>
            <h4 className="font-body font-semibold text-white text-sm mb-4">{cat}</h4>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm font-body text-white/40 hover:text-white transition-colors duration-200">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-body text-white/30">
          © 2025 EventoSite. Todos os direitos reservados.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-xs font-body text-white/30 hover:text-white transition-colors duration-200">Privacidade</a>
          <a href="#" className="text-xs font-body text-white/30 hover:text-white transition-colors duration-200">Termos</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
