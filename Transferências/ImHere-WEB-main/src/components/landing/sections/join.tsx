"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function JoinSection() {





  return (
    <section id="join" className="container py-24 sm:py-32 space-y-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Profissionais e Clientes em um só Lugar!
        </h2>
      </div>
      {/* Seção - Torne-se um Professor */}
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        {/* Texto à esquerda */}
        <motion.div
          initial={{
            opacity: 0,
            x: -100
          }}

          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10, delay: 0.4
          }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Encontre <span className="text-blue-600">Clientes</span> e {" "} <br />
            Expanda Seu Negócio<span
              className="text-blue-600">!</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-8">
            Cadastre-se, ofereça seus serviços e seja encontrado por clientes que precisam da sua expertise.
            <br />
            A plataforma permite que você gerencie seus horários, negocie preços e receba pagamentos com segurança.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10, delay: 0.5
            }}>
            <Button className="
                
                text-center  hover:bg-blue/80 text-white px-4 py-6 rounded-md
               w-fit text-2xl font-bold bg-blue group/arrow mb-2 md:mb-0">
              <Link
                href="/auth"

              >
                Comece agora!
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Imagem à direita */}
        <motion.div
          initial={{
            opacity: 0,
            x: 100
          }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10, delay: 0.4
          }} className="grid lg:grid-cols-2 gap-4 w-full">
          <Card className="relative overflow-hidden p-4 w-[400px] md:w-[500px] h-[400px] *:md:h-[500px] group bg-muted/50  hover:bg-background transition-all delay-75">
            <Image
              src={"/become-pro.jpg"}
              alt="Professor da  I'm Here"
              fill
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </Card>
        </motion.div>
      </div>

      {/* Seção - Torne-se um Aluno */}
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24 lg:flex-row-reverse">
        {/* Imagem à esquerda */}
        <motion.div
          initial={{
            opacity: 0,
            x: -100
          }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10, delay: 0.4
          }} className="grid lg:grid-cols-2 gap-4 w-full">
          <Card className="relative overflow-hidden w-[400px] md:w-[500px] h-[400px] group bg-muted/50  hover:bg-background transition-all delay-75 mb-2 md:mb-0">
            <Image
              src={"/become-client.jpg"}
              alt="CLiente  I'm Here"
              fill
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 "
            />
          </Card>
        </motion.div>


        <motion.div
          initial={{
            opacity: 0,
            x: 100
          }}
          whileInView={{ opacity: 1, x: 0 }}

          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10, delay: 0.4
          }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Encontre o  <span
              className="text-blue-600"> Profissional</span>  {" "} <br /> Certo para Você <span
                className="text-blue-600">!</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Busque especialistas, compare avaliações e contrate serviços com facilidade.
            <br />
            No {`I'm Here`}, você encontra
            profissionais qualificados para diversas áreas e pode gerenciar suas contratações de forma prática e segura.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10, delay: 0.5
            }}>

            <Button className="
                
                text-center  hover:bg-blue/80 text-white px-4 py-6 rounded-md
               w-fit text-2xl font-bold bg-blue group/arrow">
              <Link
                href="/auth"

              >
                Comece agora!
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
};
