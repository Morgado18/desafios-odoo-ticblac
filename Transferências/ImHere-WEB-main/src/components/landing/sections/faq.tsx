"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Preciso pagar para criar uma conta no  I'm Here?",
    answer: "Não! Criar uma conta no  I'm Here é totalmente gratuito. Você pode se cadastrar e explorar a plataforma sem nenhum custo.",
    value: "item-1",
  },
  {
    question: "Como faço para me cadastrar no  I'm Here?",
    answer: "Para se cadastrar, basta acessar a nossa plataforma e preencher o formulário de inscrição.",
    value: "item-2",
  },
  {
    question: "Sou profissional, como posso oferecer meus serviços?",
    answer: "Após criar sua conta, acesse o seu perfil e cadastre as profissões e serviços que você oferece. Você também pode definir seus horários de disponibilidade e ajustar suas preferências de atendimento.",
    value: "item-3",
  },
  {
    question: "Como encontro um profissional no  I'm Here?",
    answer: "Basta utilizar a ferramenta de busca na plataforma para procurar profissionais por categoria, nome ou serviço desejado. Você pode visualizar avaliações e escolher aquele que melhor atende às suas necessidades.",
    value: "item-4",
  },
  {
    question: "Como funciona o pagamento dos serviços?",
    answer: "Os pagamentos são feitos diretamente pela plataforma através de um gateway seguro. Após a conclusão do serviço, o cliente realiza o pagamento e o profissional recebe o valor de acordo com os termos da plataforma.",
    value: "item-5",
  },
  {
    question: "Posso cancelar um serviço depois de solicitar?",
    answer: "Sim! O cancelamento pode ser feito diretamente na plataforma antes da execução do serviço. No entanto, algumas condições podem se aplicar dependendo do prazo e do status do serviço.",
    value: "item-6",
  },
  {
    question: "Os profissionais são verificados antes de aparecer na plataforma?",
    answer: "Sim! Todos os profissionais passam por um processo de verificação antes de oferecer serviços no  I'm Here. Isso garante maior segurança e qualidade para os clientes.",
    value: "item-7",
  },
  {
    question: "Posso avaliar um profissional depois do serviço?",
    answer: "Sim! Após a conclusão do serviço, você pode deixar uma avaliação e um comentário sobre sua experiência. Isso ajuda outros usuários a escolherem os melhores profissionais.",
    value: "item-8",
  },
  {
    question: "O  I'm Here oferece suporte ao cliente?",
    answer: "Sim! Contamos com um sistema de suporte dedicado para auxiliar clientes e profissionais. Você pode entrar em contato pelo chat da plataforma ou por e-mail.",
    value: "item-9",
  },
];



export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32">
      <motion.div
        initial={{
          opacity: 0,
          y: 100
        }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10, delay: 0.6
        }}
        className="text-center mb-8">

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Tem dúvidas?
        </h2>
        <p className="text-lg text-gray-600 text-center mb-2 tracking-wider">Encontre respostas para as perguntas mais comuns sobre a {`I'm Here`}.</p>

      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10, delay: 0.5
        }}>
        <Accordion type="single" collapsible className="AccordionRoot">
          {FAQList.map(({ question, answer, value }) => (
            <AccordionItem key={value} value={value}
              className="border border-transparent hover:border-blue-500 data-[state=open]:border-blue-500 transition-all p-2 rounded-lg"
            >
              <AccordionTrigger className="text-left">
                {question}
              </AccordionTrigger>

              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
};
