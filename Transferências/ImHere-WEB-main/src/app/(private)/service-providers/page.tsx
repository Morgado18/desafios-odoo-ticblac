"use client";

import { getProfessions } from "@/actions/professions";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { capitalizeEachWord } from "@/utils/capitalizeEachWord";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { Briefcase, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const professionImages = [
  {
    src: "/prof-1.jpeg",
    alt: "Imagem de profissão",
  },
  {
    src: "/prof-2.jpg",
    alt: "Imagem de profissão",
  },
  {
    src: "/prof-3.jpg",
    alt: "Imagem de profissão",
  },
  {
    src: "/prof-4.jpg",
    alt: "Imagem de profissão",
  },
  {
    src: "/prof-5.webp",
    alt: "Imagem de profissão",
  },

];

const pubBanners = [
  {
    src: "/pub-1.jpg",
    alt: "Imagem de banner",
  },
  {
    src: "/pub-2.jpg",
    alt: "Imagem de banner",
  },
  {
    src: "/pub-3.jpg",
    alt: "Imagem de banner",
  },
];
export default function ProfessionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [visibleItems, setVisibleItems] = useState(8);
  const [professionCarouselIndex, setProfessionCarouselIndex] = useState(0);

  const { data: professions, isLoading } = useQuery({
    queryKey: ["professions"],
    queryFn: getProfessions,
  });

  const filteredProfessions = professions?.filter((profession: any) =>
    profession.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayedProfessions = filteredProfessions?.slice(0, visibleItems);
  const hasMore = filteredProfessions && visibleItems < filteredProfessions.length;

  const loadMore = () => {
    setVisibleItems(prev => prev + 8);
  };

  const carouselApi = useRef<any>(null);


  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [bannerIndex, setBannerIndex] = useState(0);

  // Autoplay banners
  React.useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);


  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setBannerIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      if (emblaApi) emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col gap-16">
      <div className="space-y-1 w-full text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Bem-vindo, {user?.name} 👋
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Selecione um serviço para continuar
        </p>
      </div>


      <div>
        {/* Banner Carrossel */}
        <div className="w-full  mx-auto mb-8">
          <div ref={emblaRef} className="overflow-hidden rounded-xl">
            <div className="flex">
              {pubBanners.map((banner, idx) => (
                <div
                  key={idx}
                  className="min-w-0 shrink-0 grow-0 basis-full flex justify-center items-center"
                  aria-roledescription="slide"
                >
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    width={800}
                    height={256}
                    className="w-full h-48 sm:h-64 object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Dots do banner */}
          <div className="flex justify-center gap-2 mt-3">
            {pubBanners.map((_, idx) => (
              <button
                key={idx}
                className={`h-3 w-3 rounded-full transition-all duration-300 border-none outline-none ${bannerIndex === idx ? "bg-primary" : "bg-gray-300"}`}
                onClick={() => emblaApi && emblaApi.scrollTo(idx)}
                aria-label={`Ir para o banner ${idx + 1}`}
              />
            ))}
          </div>
        </div></div>
      <div className="container mx-auto px-2">
        <Card className="p-4 sm:p-6 shadow-none border-primary border-2 rounded-xl w-full max-w-full sm:max-w-[70%] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">

            <CardTitle className="whitespace-nowrap text-xl sm:text-3xl font-bold hidden sm:block">
              {`I'm Here`}
            </CardTitle>


            <Separator orientation="vertical" className="h-6 sm:h-8 w-[2px] bg-gray-700 hidden sm:block" />


            <div className="flex-1 flex flex-row sm:items-center gap-2 w-full">
              <Input
                ref={inputRef}
                placeholder="Pesquisar profissão..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base sm:text-lg"
              />
              <Button
                className="flex items-center justify-center gap-1 bg-primary text-white hover:bg-primary hover:text-white px-4 py-2 sm:px-6 sm:py-2"
                onClick={() => inputRef.current?.focus()}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Procurar</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>



      {!search && (
        <div className="container mx-auto mt-16 mb-8 space-y-10">
          <CardTitle className="flex items-center mt-8 text-3xl font-bold mb-2  justify-center gap-2">
            Os melhores profissionais
          </CardTitle>

          <div className="mt-6 mb-8">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
              setApi={(api) => {
                carouselApi.current = api;
                if (api) {
                  api.on("select", () => {
                    setProfessionCarouselIndex(api.selectedScrollSnap());
                  });
                }
              }}
            >
              <div className="px-4">
                <CarouselContent>
                  {professionImages.map((img, idx) => (
                    <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3 flex justify-center">
                      <Card className="rounded-2xl border border-gray-200 shadow cursor-pointer hover:shadow-xl flex items-center justify-center">
                        <Avatar className="w-full h-64 rounded-xl overflow-hidden bg-muted">
                          <AvatarImage
                            src={img.src}
                            alt={img.alt}
                            className="object-cover w-full h-full"
                          />
                          <AvatarFallback className="flex items-center justify-center w-full h-full">
                            ?
                          </AvatarFallback>
                        </Avatar>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </div>
              <CarouselPrevious className="bg-primary text-white" />
              <CarouselNext className="bg-primary text-white" />
            </Carousel>
            <CarouselDots
              images={professionImages}
              carouselApi={carouselApi}
              selectedIndex={professionCarouselIndex}
            />
          </div>
        </div>
      )}




      <div className="mt-16 space-y-10">
        <CardTitle className="flex items-center mt-8 text-3xl font-bold mb-2  justify-center gap-2">
          Serviços disponíveis
        </CardTitle>


        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {displayedProfessions && displayedProfessions.length > 0 ? (
            displayedProfessions.map((profession: any) => (
              <Card
                key={profession.id}
                className="cursor-pointer hover:shadow-xl p-4 pb-6 flex flex-row md:flex-col gap-4 items-center text-left md:text-center rounded-2xl border border-gray-200 transition"
                onClick={() => router.push(`/service-providers/${profession.id}`)}
              >
                <Avatar className="w-20 h-20 md:w-full md:h-52 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  {profession.avatar ? (
                    <AvatarImage
                      src={profession.avatar}
                      alt={profession.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <AvatarFallback className="flex items-center justify-center w-full h-full">
                      <Briefcase size={32} className="text-primary" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 flex flex-col justify-center text-left md:text-center">
                  <CardTitle className="text-base">{capitalizeEachWord(profession.name)}</CardTitle>
                  <CardContent className="text-sm text-muted-foreground mt-2 text-left md:text-center w-full p-0 md:p-4">
                    <p>{profession.description}</p>
                  </CardContent>
                </div>

              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              Nenhum resultado encontrado.
            </div>
          )}
        </div>
      </div>
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="text-primary hover:text-primary/90 font-medium"
          >
            Ver mais
          </button>
        </div>
      )}
    </div>
  );
}


function CarouselDots({ images, carouselApi, selectedIndex }: { images: any[]; carouselApi: React.RefObject<any>; selectedIndex: number }) {
  const goTo = (idx: number) => {
    if (carouselApi.current) carouselApi.current.scrollTo(idx);
  };

  return (
    <div className="flex justify-center gap-2 mt-4">
      {images.map((_, idx) => (
        <button
          key={idx}
          className={`h-3 w-3 rounded-full transition-all duration-300 border-none outline-none ${selectedIndex === idx ? "bg-primary" : "bg-gray-300"}`}
          onClick={() => goTo(idx)}
          aria-label={`Ir para o slide ${idx + 1}`}
        />
      ))}
    </div>
  );
}
