import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ScrollReveal from "@/components/ScrollReveal";

const faqs = [
  { q: "Como funciona o recebimento via PIX?", a: "Seus convidados podem enviar presentes em dinheiro via PIX diretamente para sua conta. Basta cadastrar sua chave PIX no painel e os valores são transferidos instantaneamente, sem taxas." },
  { q: "Meus dados estão seguros?", a: "Sim! Utilizamos criptografia de ponta a ponta e servidores seguros para proteger todas as informações dos seus convidados e dados financeiros." },
  { q: "Posso personalizar tudo no site?", a: "Absolutamente! Você pode alterar temas, cores, fontes, fotos, textos e a disposição dos elementos. Nos planos Pro e Premium, as opções são ainda maiores." },
  { q: "Em quanto tempo meu site fica pronto?", a: "Seu site pode ficar pronto em menos de 10 minutos! Basta escolher um tema, preencher as informações e personalizar do seu jeito." },
  { q: "Existe limite de convidados?", a: "No plano Free, o limite é de 50 convidados. Nos planos Pro e Premium, o número de convidados é ilimitado." },
  { q: "Posso cancelar a qualquer momento?", a: "Sim, você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais. Seu site continuará ativo até o final do período pago." },
];

const FAQ = () => (
  <section id="faq" className="py-28">
    <div className="max-w-3xl mx-auto px-6">
      <ScrollReveal>
        <p className="text-xs font-body uppercase tracking-widest text-primary text-center mb-3">FAQ</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-16">Perguntas frequentes</h2>
      </ScrollReveal>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <ScrollReveal key={i} delay={i * 0.08}>
            <AccordionItem value={`faq-${i}`} className="card-premium px-6 border-none">
              <AccordionTrigger className="font-body font-medium text-left hover:no-underline text-foreground">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          </ScrollReveal>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQ;
