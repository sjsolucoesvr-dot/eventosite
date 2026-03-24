

# EventoSite — Plataforma SaaS de Sites para Eventos

## Visão Geral
Plataforma brasileira para criação de sites de casamentos e eventos, com landing page completa e dashboard do usuário.

## Design System
- **Cores**: Rosa (#E8547A), Dourado (#C9A96E), Dark (#1A1A2E), Fundo (#FFF8F9), Texto (#2D2D2D), Cinza (#F5F3F0), Sucesso (#3D8C40)
- **Fontes**: Playfair Display (títulos) + DM Sans (corpo) via Google Fonts
- **Ícones**: Lucide React

## Página 1: Landing Page (rota "/")

### Navbar fixa
- Logo "EventoSite" com ícone de coração, links de navegação, botões "Entrar" e "Criar meu site grátis"
- Efeito scroll: fundo branco + sombra

### Seções (em ordem)
1. **Hero** — Badge social proof, título H1, subtítulo, 2 CTAs, mockup animado de site de casamento com contagem regressiva, 3 miniaturas de temas, fundo gradiente rosa/creme
2. **Como Funciona** — 3 passos com ícones ilustrativos
3. **Funcionalidades** — Grid de 9 cards (site personalizado, RSVP, lista PIX, planilha, checklist, e-book, marketplace, responsivo, privacidade)
4. **Preview do Site** — Mockup browser/celular com seletor de 5 temas (troca animada de cores/fonte)
5. **RSVP Destaque** — Dashboard de convidados, features, CTA
6. **Lista de Presentes** — PIX integrado, features, badge
7. **Ferramentas Gratuitas** — 3 cards (E-book, Planilha, Checklist) com botões de download
8. **Marketplace Teaser** — Grid de 8 categorias de fornecedores com contadores
9. **Depoimentos** — 3 cards com foto, nome, cidade, 5 estrelas, fundo rosa
10. **Planos e Preços** — FREE (R$0), PRO (R$29,90), PREMIUM (R$59,90) com features listadas
11. **FAQ** — 6 perguntas em accordion
12. **Footer** — Logo, links por categoria, redes sociais, copyright

## Página 2: Dashboard (rota "/dashboard")

### Sidebar
- Logo, avatar do usuário, nome do evento
- Menu: Visão Geral, Meu Site, Convidados, Lista de Presentes, Financeiro, Checklist, Fornecedores, Configurações
- Colapsável com trigger sempre visível

### Visão Geral (conteúdo principal)
- 4 cards de métricas: convidados confirmados, presentes recebidos (R$), dias para o evento, tarefas concluídas
- Gráfico de rosca (Recharts): confirmados vs pendentes vs recusados
- Feed de últimas atividades
- Barra de progresso geral do planejamento

## Implementação Técnica
- React + TypeScript + Tailwind CSS + React Router
- Zustand para estado global
- Recharts para gráficos do dashboard
- date-fns para contagem regressiva e datas
- Dados mock para demonstração (sem backend por enquanto)
- CSS variables globais para toda a paleta
- Componentes shadcn/ui existentes reutilizados (accordion, cards, sidebar, etc.)

