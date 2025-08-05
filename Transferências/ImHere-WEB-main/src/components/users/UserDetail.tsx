'use client';

import { deleteUser, getUser } from "@/actions/users";
import Loading from "@/app/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UpdateUserForm } from "@/components/users/UpdateUserForm";
import { useAuth } from "@/hooks/useAuth";
import { translateRole } from "@/utils/mappers/translateRole";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarPlus, PencilIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { CreateAppointmentForm } from "../appointment/CreateAppointmentForm";
import { WeeklyScheduleTable } from "../weekly-schedule/WeeklyScheduleTable";
import { ProfessionalServicesCard } from "./ProfessionalServicesCard";



type UserDetailProps = {
  id: string
}

export function UserDetail({ id }: Readonly<UserDetailProps>) {

  const router = useRouter();
  const { user: authUser } = useAuth();
  const [openConfirm, setOpenConfirm] = useState(false);

  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: () => {
      toast.success("Usuário eliminado com sucesso! ✅");
      setOpenConfirm(false);
      router.push("/users");
    },
    onError: () => {
      toast.error("Erro ao eliminar usuário ❌");
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center text-red-500">Erro: {error.message}</div>;
  if (!user) return <div className="text-center text-gray-500">Usuário não encontrado.</div>;

  return (
    <div>
      <Card className="w-full p-6 shadow-none rounded-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">Detalhes do Usuário</CardTitle>
            {authUser?.role !== "CLIENT" ? (
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-500 text-white hover:bg-blue-700">
                      <PencilIcon size={18} className="m-0 md:mr-2" />
                      <span className="hidden sm:inline">Editar</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <UpdateUserForm user={user} />
                  </DialogContent>
                </Dialog>

                {/* Botão para abrir a modal de confirmação antes de excluir */}
                <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-500 text-white hover:bg-red-700">
                      <Trash2 size={18} className="m-0 md:mr-2" />
                      <span className="hidden sm:inline">Excluir</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <h2 className="text-lg font-semibold">Tem certeza que deseja excluir?</h2>
                    <p>Esta ação não pode ser desfeita.</p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setOpenConfirm(false)}>
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteMutation.mutate()}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? "Excluindo..." : "Confirmar"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 text-white hover:bg-green-700">
                    <CalendarPlus size={18} className="m-0 md:mr-2" />
                    <span className="hidden sm:inline"> Solicitar seus serviços</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CreateAppointmentForm id={user.id} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-24">
              <AvatarImage src={user.photo ?? "default-avatar.png"} alt="Foto de perfil" />
              <AvatarFallback className="text-4xl font-bold text-gray-700">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold">{user.name}</p>
                <Badge className="bg-yellow-400 text-yellow-800 rounded-sm px-2">
                  {translateRole(user.role)}
                </Badge>
              </div>
              <p className="text-start text-gray-500">{user.status ? "Ativo" : "Inativo"}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {authUser?.role === "ADMIN" && (
              <div>

                <DataUser title="Email" content={user.email} />
                <DataUser title="Telefone" content={user.phoneNumber} />
                {user.bi && (<DataUser title="BI" content={user.bi} />)}
                <DataUser title="Criado em" content={new Date(user.createdAt).toLocaleDateString()} />
                <DataUser title="ID" content={user.id} />
              </div>
            )}


          </div>
        </CardContent>
      </Card>
      <Card className="w-full p-6 shadow-none rounded-lg mt-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">Seus Horários</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <WeeklyScheduleTable id={id} />
        </CardContent>
      </Card>
      <div className="mt-8">
        <ProfessionalServicesCard professionalServices={user.professionalService ?? []} />
      </div>
    </div>
  );
}

function DataUser({ title, content }: Readonly<{ title: string; content: string }>) {
  return (
    <div className="p-2 text-left">
      <span className="font-bold text-gray-700">{title}</span>
      <p className="text-gray-600 break-words">{content}</p>
    </div>
  );
}
