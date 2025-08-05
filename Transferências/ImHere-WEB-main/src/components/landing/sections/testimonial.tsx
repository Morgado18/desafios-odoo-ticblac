"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

interface ReviewProps {
  image: string;
  name: string;
  userType: string;
  comment: string;
  rating: number;
}

const reviewList: ReviewProps[] = [
  {
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Carlos Mendes",
    userType: "Eletricista Profissional",
    comment:
      "O  I'm Here revolucionou minha forma de conseguir clientes. Antes, dependia apenas de indicações, agora recebo solicitações diárias pela plataforma!",
    rating: 5.0,
  },
  {
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    name: "Mariana Rocha",
    userType: "Cliente",
    comment:
      "Foi muito fácil encontrar um profissional para reparar minha rede elétrica. Em poucos minutos já tinha um orçamento e agendei o serviço!",
    rating: 4.8,
  },
  {
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    name: "João Ferreira",
    userType: "Técnico de Informática",
    comment:
      "Nunca foi tão simples divulgar meus serviços. O  I'm Here me trouxe muitos novos clientes e agora posso gerenciar meus horários com facilidade.",
    rating: 4.9,
  },
  {
    image: "https://randomuser.me/api/portraits/women/23.jpg",
    name: "Beatriz Lima",
    userType: "Cliente",
    comment:
      "A plataforma me permitiu comparar avaliações e preços antes de escolher um profissional. O serviço foi excelente e voltarei a usar com certeza!",
    rating: 5.0,
  },
  {
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    name: "Ricardo Souza",
    userType: "Marceneiro",
    comment:
      "O  I'm Here é uma excelente ferramenta para nós profissionais. Agora consigo organizar melhor meu trabalho e oferecer um atendimento mais rápido.",
    rating: 4.7,
  },
  {
    image: "https://randomuser.me/api/portraits/women/19.jpg",
    name: "Laura Martins",
    userType: "Cliente",
    comment:
      "Gostei da facilidade de pagamento e da segurança da plataforma. Recomendo para quem precisa de serviços rápidos e confiáveis!",
    rating: 4.9,
  },
];

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="bg-gray-600/5 py-24 sm:py-32">

      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
            Testemunhos
          </h2>
          <p className="text-lg  text-center mb-2 tracking-wider">
            O que os clientes e profissionais dizem sobre o  {`I'm Here`}
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
          }}
          className="relative w-[80%] sm:w-[90%] lg:max-w-screen-xl mx-auto"
        >
          <CarouselContent>
            {reviewList.map((review, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <Card className="">
                  <CardContent className="pt-6 pb-0">
                    <div className="flex gap-1 pb-6">
                      {[...Array(Math.round(review.rating))].map((_, i) => (
                        <Star key={i} className="size-4 fill-primary text-primary" />
                      ))}
                    </div>
                    {`"${review.comment}"`}
                  </CardContent>

                  <CardHeader>
                    <div className="flex flex-row items-center gap-4">
                      <Avatar>
                        <AvatarImage src={review.image} alt={review.name} />
                        <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <CardTitle className="text-lg">{review.name}</CardTitle>
                        <CardDescription>{review.userType}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

      </div>

    </section>
  );
};
