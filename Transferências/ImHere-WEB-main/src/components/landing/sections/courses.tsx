"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

export function CoursesSection() {
  const teamList = [
    {
      firstName: "Curso Lorem Ipsum",
    },
    {
      firstName: "Elizabeth",
    },
    {
      firstName: "David",
    },
    {
      firstName: "Sarah",
    },
    {
      firstName: "Michael",
    },
    {
      firstName: "Zoe",
    },
    {
      firstName: "Evan",
    },
    {
      firstName: "Pam",
    },
  ];


  return (
    <motion.section
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
      id="courses" className=" bg-gray-600/10 py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Nossos Cursos
        </h2>
      </div>

      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {teamList.map((item, index) => (
          <Card
            key={index}
            className="bg-white  flex flex-col h-fit overflow-hidden group/hoverimg"
          >
            <div className="p-4 rounded-md">

              <CardHeader className="p-0 gap-0">
                <div className="h-full mb-4 overflow-hidden">
                  <Image
                    src={"/video-thumb.jpg"}
                    alt=""
                    width={300}
                    height={300}
                    className=" rounded-sm w-full sm:h-[200px] md:h-[280px] lg:h-[300px] aspect-square object-cover transition-all duration-200 ease-linear group-hover/hoverimg:saturate-100 group-hover/hoverimg:scale-[1.2]"
                  />

                </div>
                <CardTitle className="mt-4  flex items-center gap-2 text-blue-900">
                  Computação Gráfica
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent className="text-muted-foreground px-4 pb-6">
              <div>

                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div>

              <div className="flex items-center justify-start gap-2">
                <div className="flex items-center">
                  <span className="font-semibold text-[#456949]">4.8</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className="text-[#E3AD23] size-4"
                      fill="#E3AD23"
                    />
                  ))}
                </div>
                <div>
                  <span className="text-sm">(38 Avaliações)</span>
                </div>
              </div>
            </CardContent>
            <Separator className="my-2" />
            <CardFooter className="mt-auto">
              <div className="flex p-0 items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm">Jane Cooper</CardTitle>
                  </div>
                </div>
                <div>
                  <span className="text-[#E3AD23] font-bold text-lg">AOA17.500</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </motion.section>
  );
};
