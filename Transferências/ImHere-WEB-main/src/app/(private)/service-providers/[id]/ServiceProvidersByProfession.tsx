"use client";

import { getProfessions } from "@/actions/professions";
import { filterByProfessionId, User } from "@/actions/users";
import Loading from "@/app/loading";
import { CreateAppointmentForm } from "@/components/appointment/CreateAppointmentForm";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { capitalizeEachWord } from "@/utils/capitalizeEachWord";
import { useQuery } from "@tanstack/react-query";
import { CalendarPlus, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";



export function ServiceProvidersByProfession({ id }: Readonly<{ id: string }>) {
  const professionId = id;
  const [professionals, setProfessionals] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<"ALL" | "PROFISSIONAL" | "COMPANY">("ALL");
  const [openUserDialog, setOpenUserDialog] = useState<string | null>(null);
  const [openAppointmentId, setOpenAppointmentId] = useState<string | null>(null);


  const { data: professions, isLoading } = useQuery({
    queryKey: ["professions"],
    queryFn: getProfessions,
  });

  const professionName = professions?.find((p: any) => p.id === professionId)?.name;

  useEffect(() => {
    if (!professionId) return;
    (async () => {
      try {
        const response = await filterByProfessionId(professionId);
        const users = response.professionalService.map((item: { user: User }) => item.user);
        setProfessionals(users);
      } catch (error) {
        console.error("Erro ao buscar profissionais:", error);
      }
    })();
  }, [professionId]);

  if (isLoading) {
    return <Loading />;
  }


  const handleAgendar = (userId: string) => {
    setOpenUserDialog(null);
    setTimeout(() => {
      setOpenAppointmentId(userId);
    }, 300);
  };

  const filteredProfessionals = professionals.filter((user) => {
    const nameMatch = user.name.toLowerCase().includes(search.toLowerCase());
    const roleMatch = selectedRole === "ALL" ? true : user.role === selectedRole;
    return nameMatch && roleMatch;
  });


  return (
    <div className="space-y-6 ">
      <Card className="p-6 shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg sm:text-xl">
            Profissionais que prestam o serviço de <span className="text-blue-900">{capitalizeEachWord(professionName) ?? "..."}</span>
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 justify-end">
              <Button
                variant={selectedRole === "ALL" ? "default" : "outline"}
                onClick={() => setSelectedRole("ALL")}
                className="text-sm"
              >
                Todos
              </Button>
              <Button
                variant={selectedRole === "PROFISSIONAL" ? "default" : "outline"}
                onClick={() => setSelectedRole("PROFISSIONAL")}
                className="text-sm whitespace-nowrap"
              >
                Profissionais
              </Button>
              <Button
                variant={selectedRole === "COMPANY" ? "default" : "outline"}
                onClick={() => setSelectedRole("COMPANY")}
                className="text-sm"
              >
                Empresas
              </Button>
            </div>
            <Input
              placeholder="Pesquisar prestador..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
      </Card>

      {filteredProfessionals.length === 0 ? (
        <p className="text-center text-muted-foreground mt-8">
          Nenhum prestador encontrado para essa profissão.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProfessionals.map((user) => (
            <Dialog
              key={user.id}
              open={openUserDialog === user.id}
              onOpenChange={(open) => setOpenUserDialog(open ? user.id : null)}
            >
              <DialogTrigger asChild>
                <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all p-2 sm:p-4 ">
                  <DialogTrigger asChild>
                    <div
                      className="cursor-pointer flex flex-row sm:flex-col items-stretch sm:items-center h-28 sm:h-auto w-full"
                    >
                      {/* Imagem quadrada à direita no mobile, em cima no desktop */}
                      <div className="flex-shrink-0 w-24 h-24 sm:w-full sm:h-56 bg-gray-100 rounded-xl overflow-hidden">
                        <Avatar className="w-full h-full rounded-none" >
                          <AvatarImage
                            src={user.photo}
                            alt={user.name}
                            className="w-full h-full rounded-none object-cover"
                          />
                          <AvatarFallback className="font-bold text-3xl">{user.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      {/* Dados à esquerda no mobile, centralizado no desktop */}
                      <div className="flex flex-col justify-center sm:items-center flex-1 px-2 sm:px-4 py-2 sm:py-4 text-left sm:text-center space-y-1">
                        <div className="font-semibold text-base sm:text-lg">
                          {capitalizeEachWord(user.name)}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {capitalizeEachWord(professionName ?? "")}
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:justify-center text-gray-500">
                          <MapPin size={14} className="inline-block mr-1" />
                          <span>Angola</span>
                        </div>
                        <div className="flex items-center gap-1 justify-start sm:justify-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} className="text-yellow-500" fill="none" strokeWidth={2} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                </Card>


              </DialogTrigger>

              <DialogContent className="max-w-sm space-y-4 text-center">
                <h3 className="text-lg font-medium">O que deseja fazer?</h3>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleAgendar(user.id)}
                    className="bg-green-500 text-white hover:bg-green-700"
                  >
                    <CalendarPlus size={18} className="m-0 md:mr-2" />
                    <span className="hidden sm:inline"> Solicitar seus serviços</span>
                  </Button>

                  <Link href={`/users/${user.id}`} passHref>
                    <Button variant="outline" className="w-full">
                      Ver detalhes
                    </Button>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}

      {/* Segunda modal: formulário de agendamento */}
      <Dialog
        open={!!openAppointmentId}
        onOpenChange={(open) => !open && setOpenAppointmentId(null)}
      >
        <DialogContent className="max-w-lg">
          {openAppointmentId && <CreateAppointmentForm id={openAppointmentId} professionId={professionId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
