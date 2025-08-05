"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheckBig, MessageCircle, Search, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface FeaturesProps {
  icon: JSX.Element;
  title: string;
  description: string | string[];
}

const featureList: FeaturesProps[] = [
  {
    icon: <Search size={48} className="text-primary" />,
    title: "Encontre o seu profissional",
    description:
      "Vamos conectá-lo aos melhores profissionais de variadas áreas que melhor se adequem ao que você precisa.",
  },
  {
    icon: <MessageCircle size={48} className="text-primary" />,
    title: "Comunicação",
    description:
      "Assim que um profissional é escolhido, a plataforma oferece um chat integrado, onde as partes podem discutir detalhes do projeto, tirar dúvidas e compartilhar arquivos.",
  },
  {
    icon: <ShieldCheck size={48} className="text-primary" />,
    title: "Pagamento Seguro",
    description:
      "Os pagamentos são feitos através da plataforma. Quando o projeto é aceito, o cliente faz o pagamento, que fica em custódia até a conclusão do trabalho, garantindo segurança para ambas as partes.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 10,
      ease: "easeInOut",
    }
  }
};

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.6,
      staggerChildren: 0.4
    }
  }
};

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative h-fit md:min-h-[840px] sm:h-auto py-12 sm:py-24 bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center"
      style={{ backgroundImage: "url('/background-how-it-works.png')" }}
    >
      {/* Sobreposição escura para contraste */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative container">
        <motion.h2
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 10,
            delay: 0.2
          }}
          className="text-2xl md:text-4xl text-center font-bold mb-4 text-white"
        >
          Como a {`I'm Here`} funciona?
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={"visible"}
          viewport={{ amount: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featureList.map(({ icon, title, description }) => (
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              key={title}
              className="flex justify-center"
            >
              <Card className="w-full max-w-[350px] sm:w-[350px] bg-white/90 border border-blue shadow-none hover:shadow-lg transition-all">
                <CardHeader className="flex flex-col items-center">
                  <div className="bg-primary/20 p-2 sm:p-3 rounded-full ring-6 sm:ring-8 ring-primary/10 mb-2">
                    {icon}
                  </div>

                  <CardTitle className="text-lg sm:text-xl text-center">{title}</CardTitle>
                </CardHeader>

                <CardContent className="text-muted-foreground text-center text-sm sm:text-base">
                  {Array.isArray(description) ? (
                    <ul className="list-none space-y-1 px-4">
                      {description.map((item, index) => (
                        <li key={index} className="flex items-center justify-start gap-2">
                          <CircleCheckBig size={16} className="text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    description
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Texto abaixo dos cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 10,
            delay: 0.5
          }}
          className="text-center text-white font-semibold text-lg sm:text-xl md:text-2xl mt-12 px-4"
        >
          <p>
            São <span className="text-blue font-bold">40.000 profissionais</span>, todos disponíveis para você.
            <br /> Prontos para resolver os seus problemas.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
