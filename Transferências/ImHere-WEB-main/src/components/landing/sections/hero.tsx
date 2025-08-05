"use client"
import { Button } from "@/components/ui/button";
import { slideUp } from "@/components/utils/slide";
import { motion } from "motion/react";
import Link from "next/link";

export function HeroSection() {
  return (
    <div id="hero" className="h-screen bg-blue">
      <div className="container py-12 md:py-20">
        <div className="grid mt-6 md:mt-10 grid-cols-1 md:grid-cols-2 min-h-[500px] md:min-h-[600px]">
          {/* Text content section */}
          <div className="space-y-4 md:space-y-8 flex flex-col justify-center items-center text-center md:text-left py-10 px-4 md:py-20 md:pr-10 md:px-0 md:items-start">
            <motion.h1
              variants={slideUp(0.2)}
              initial="initial"
              whileInView="animate"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white"
            >
              <span className="text-white">
                Conectamos-te

                {" "}
                às
              </span>
              <br />
              Melhores
              {" "}
              <br />
              <span className="text-white">
                Oportunidades!
              </span>
            </motion.h1>

            <motion.p
              variants={slideUp(0.4)}
              initial="initial"
              whileInView="animate"
              className="text-gray-100 font-semibold text-base sm:text-lg md:text-xl"
            >
              No {`I'm Here`}, conectamos quem precisa de serviços a quem sabe realizá-los, com segurança e facilidade
            </motion.p>

            <motion.div
              variants={slideUp(0.6)}
              initial="initial"
              whileInView="animate"
              className="space-y-2"
            >
              <Button className="
                text-center hover:bg-gray-200 text-blue-900
                px-3 py-4 md:px-4 md:py-6 rounded-md
                w-fit text-lg sm:text-xl md:text-2xl font-bold bg-white group/arrow"
              >
                <Link href="/login">
                  Acesse a Plataforma
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Banner Image section */}
          <div className="flex justify-end items-center mt-6 md:mt-0">
            <motion.img
              initial={{
                opacity: 0,
                x: 100,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              src={"/hero.png"}
              alt="Profissionais do  I'm Here"
              className="w-full md:w-[200%] object-contain"
            />
          </div>
        </div>
      </div>
    </div >
  );
}
