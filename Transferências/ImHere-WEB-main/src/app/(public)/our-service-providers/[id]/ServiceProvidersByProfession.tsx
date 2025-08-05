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
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";



export function ServiceProvidersByProfession({ id }: Readonly<{ id: string }>) {
  const professionId = id;
  const [professionals, setProfessionals] = useState<User[]>([]);
  const [search, setSearch] = useState("");
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

  const filteredProfessionals = professionals.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg sm:text-xl">
            Profissionais que prestam o serviço de <span className="text-blue-900">{capitalizeEachWord(professionName) ?? "..."}</span>
          </CardTitle>
          <Input
            placeholder="Pesquisar prestador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
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
                <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <DialogTrigger asChild>
                    <div className="cursor-pointer">

                      <div className="w-full h-56 bg-gray-100">
                        <Avatar className="w-full h-full">
                          <AvatarImage
                            src={user.photo}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                          <AvatarFallback className="font-bold text-3xl">{user.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>


                      <div className="bg-gray-50 p-4 text-center space-y-1">
                        <div className="font-semibold">
                          {capitalizeEachWord(user.name)}
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
          {openAppointmentId && <CreateAppointmentForm id={openAppointmentId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
