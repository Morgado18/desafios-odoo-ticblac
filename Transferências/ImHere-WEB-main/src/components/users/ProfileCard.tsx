"use client";

import { deleteUser, getUser } from "@/actions/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UpdateUserForm } from "@/components/users/UpdateUserForm";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarPlus, UserPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AccessRole } from "../access-role";
import { CreateWeeklyScheduleForm } from "../weekly-schedule/CreateWeeklyScheduleForm";
import { WeeklyScheduleTable } from "../weekly-schedule/WeeklyScheduleTable";
import { ProfessionalServicesCard } from "./ProfessionalServicesCard";
import { UploadImageForm } from "./UploadImageForm";

export function ProfileCard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUser(user?.id!),
    enabled: !!user,
  });
  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Usuário não definido");
      return deleteUser(user.id);
    },
    onSuccess: () => {
      toast.success("Usuário eliminado com sucesso! ✅");
      router.push("/auth");
    },
    onError: () => {
      toast.error("Erro ao eliminar usuário ❌");
    },
  });
  //FUNCÇÃO

  const handleDelete = async () => {
    toast.promise(deleteMutation.mutateAsync(), {
      loading: "Excluindo usuário...",
      success: "Usuário eliminado com sucesso! ✅",
      error: "Erro ao excluir usuário ❌",
    });
    setIsDialogOpen(false);
  };

  if (!user) return <div className="text-center text-gray-500">Usuário não encontrado.</div>;

  return (
    <div>
      <Card className="w-full p-6 shadow-none rounded-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">Perfil</CardTitle>
            <div className="flex gap-2">
              {/* Modal de Edição */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500/70 text-white hover:bg-blue-700/90 rounded-full text-primary hover:text-white">
                    <UserPen size={18} className="m-0 md:mr-2" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-screen overflow-y-auto sm:max-w-lg w-[90vw]">
                  <UpdateUserForm user={user} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center text-center md:flex-row md:items-center md:justify-start md:text-left gap-4 w-full">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative size-24">
                  <Avatar className="size-24">
                    <AvatarImage src={user.photo || "default-avatar.png"} alt="Foto de perfil" />
                    <AvatarFallback className="text-4xl font-bold text-gray-700">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {/* Ícone de lápis sobreposto */}
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer">
                    <UserPen className="w-4 h-4" />
                  </div>
                </div>
              </DialogTrigger>

              <DialogContent>
                <UploadImageForm onClose={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <p className="text-2xl font-semibold">{user.name}</p>
              <p className="text-gray-600 break-words">{user.email}</p>
            </div>
          </div>
        </CardContent>


      </Card>

      <AccessRole allowedRoles={['PROFISSIONAL', 'COMPANY']}>
        <Card className="w-full p-6 shadow-none rounded-lg mt-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              {["COMPANY", "PROFISSIONAL"].includes(user.role) && (
                <CardTitle className="text-xl font-bold">Meus horários</CardTitle>
              )}

              {["CLIENT", "ADMIN"].includes(user.role) && (
                <CardTitle className="text-xl font-bold">Seus horários</CardTitle>
              )}


              <div className="flex gap-2">
                {/* Modal de Edição */}

                {["COMPANY", "PROFISSIONAL"].includes(user.role) && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-green-500/70 text-green-700 hover:bg-green-700/90 rounded-full  hover:text-white">
                        <CalendarPlus size={18} className="m-0 md:mr-2" />
                        <span className="hidden sm:inline">Adicionar Horário</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <CreateWeeklyScheduleForm />
                    </DialogContent>
                  </Dialog>
                )}

              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <WeeklyScheduleTable id={user.id} />
          </CardContent>
        </Card>
        <div className="mt-8">
          <ProfessionalServicesCard professionalServices={data?.professionalService ?? []} />
        </div>
      </AccessRole>
      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-red-500 text-white hover:bg-red-700 mt-6">
            <Trash2 size={18} className="m-0 md:mr-2" />
            <span className="hidden sm:inline">
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar conta"}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <h2 className="text-lg font-bold text-gray-900">Tem certeza?</h2>
          <p className="text-gray-600">
            Essa ação não pode ser desfeita. Você perderá todos os dados deste usuário.
          </p>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Eliminando..." : "Confirmar Exclusão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

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
