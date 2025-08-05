"use client"
import { CreateProfessionModal } from "@/components/profession/CreateProfessionModal";

import { deleteProfession, getProfessions, Profession } from "@/actions/professions";
import Loading from "@/app/loading";
import { AssociateUserForm } from "@/components/profession/AssociateUserForm";
import { ProfessionDetail } from "@/components/profession/ProfessionDetail";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Search, SquareArrowOutUpRight, TrashIcon, UserPlus } from "lucide-react";
import { redirect } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function AllProfessionsPage() {
  const { user } = useAuth();
  if (user?.role === "CLIENT") {
    redirect("/dashboard")
  }
  return (

    <div>
      <Card className="w-full p-6  shadow-none mb-8 rounded-lg">
        <div className="flex justify-between items-center">
          <CardTitle>
            Profissões
          </CardTitle>
          {user?.role === "ADMIN" && <CreateProfessionModal />}
        </div>
      </Card>
      <div className="w-full p-6  shadow-none rounded-lg">
        <Professions />
      </div>
    </div>

  );
}



function Professions() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['professions'],
    queryFn: () => getProfessions()
  });
  const [search, setSearch] = useState("");
  const [visibleItems, setVisibleItems] = useState(8);
  const inputRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <Loading />
  if (isError) return <div>Error: {error.message}</div>;

  const filtered = data?.filter((profession: Profession) =>
    profession.name.toLowerCase().includes(search.toLowerCase())
  ) || [];
  const displayed = filtered.slice(0, visibleItems);
  const hasMore = filtered.length > visibleItems;

  return (
    <div>
      <Card className="p-4 sm:p-6 shadow-none border-primary border-2 rounded-xl w-full max-w-full sm:max-w-[70%] mx-auto mb-8">
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
              onChange={e => setSearch(e.target.value)}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayed.length > 0 ? (
          displayed.map((profession: Profession) => (
            <ProfessionCard key={profession.id} profession={profession} />
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            Nenhum resultado encontrado.
          </div>
        )}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleItems(v => v + 8)}
            className="text-primary hover:text-primary/90 font-medium"
          >
            Ver mais
          </button>
        </div>
      )}
    </div>
  )
}

function ProfessionCard({ profession }: { profession: Profession }) {
  const { user } = useAuth();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Card
            className="cursor-pointer hover:shadow-xl p-4 pb-6 flex flex-row md:flex-col gap-4 items-center text-left md:text-center rounded-2xl border border-gray-200 transition"
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
              <CardTitle className="text-base">{profession.name}</CardTitle>
              <CardContent className="text-sm text-muted-foreground mt-2 text-left md:text-center w-full p-0 md:p-4">
                <p>{profession.description}</p>
              </CardContent>

            </div>
          </Card>
        </div>
      </DialogTrigger>
      {(user?.role === "PROFISSIONAL" || user?.role === "COMPANY") && (
        <DialogContent className="p-0 shadow-none border-none bg-transparent">
          <AssociateUserForm professionId={profession.id} />
        </DialogContent>
      )}
    </Dialog>
  );
}


function ProfessionActions({ profession }: { profession: Profession }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [openConfirm, setOpenConfirm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteProfession(profession.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professions"] });
      toast.success("Profissão deletada com sucesso! ✅");
      setOpenConfirm(false);
    },
    onError: () => {
      toast.error("Erro ao deletar profissão ❌");
    },
  });

  return (
    <div className="flex flex-col gap-2 mt-2">
      {/* Visualizar */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex justify-start text-muted-foreground hover:text-blue-500"
          >
            <SquareArrowOutUpRight className="mr-2 h-4 w-4" /> Visualizar
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-xl">
          <ProfessionDetail id={profession.id} />
        </DialogContent>
      </Dialog>



      {/* Adicionar a minha profissão */}
      {(user?.role === "PROFISSIONAL" || user?.role === "COMPANY") && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-start text-white bg-primary hover:bg-primary/90 hover:text-white"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Adicionar a minha Profissão
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 shadow-none border-none bg-transparent">
            <AssociateUserForm professionId={profession.id} />
          </DialogContent>
        </Dialog>
      )}

      {/* Deletar */}
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        {user?.role === "ADMIN" && (
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-start text-muted-foreground hover:text-red-500"
            >
              <TrashIcon className="mr-2 h-4 w-4" /> Deletar
            </Button>
          </DialogTrigger>
        )}
        <DialogContent>
          <h2 className="text-lg font-semibold">Tem certeza que deseja deletar?</h2>
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
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 