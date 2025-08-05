"use client";

import { getProfessions } from "@/actions/professions";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { capitalizeEachWord } from "@/utils/capitalizeEachWord";
import { useQuery } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfessionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const { data: professions, isLoading } = useQuery({
    queryKey: ["professions"],
    queryFn: getProfessions,
  });

  const filteredProfessions = professions?.filter((profession: any) =>
    profession.name.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="space-y-6 mt-8 container">

      <Card className="p-6 shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            Serviços disponíveis
          </CardTitle>
          <Input
            placeholder="Pesquisar profissão..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredProfessions && filteredProfessions.length > 0 ? (
          filteredProfessions.map((profession: any) => (
            <Card
              key={profession.id}
              className="cursor-pointer hover:shadow-xl p-4 pb-6 flex flex-col items-center text-center rounded-2xl border border-gray-200 transition"
              onClick={() =>
                router.push(`/our-service-providers/${profession.id}`)
              }
            >
              <Avatar className="w-full h-48 rounded-xl mb-4 overflow-hidden bg-muted">
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

              <CardTitle className="text-base">
                {capitalizeEachWord(profession.name)}
              </CardTitle>

              <CardContent className="text-sm text-muted-foreground mt-2">
                <p>{profession.description}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            Nenhum resultado encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
