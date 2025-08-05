'use client';

import { deleteProfession, Profession } from "@/actions/professions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ImageIcon,
  MoreVertical,
  PencilIcon,
  SquareArrowOutUpRight,
  TrashIcon,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AssociateUserForm } from "./AssociateUserForm";
import { ProfessionDetail } from "./ProfessionDetail";
import { UpdateProfessionForm } from "./UpdateProfessionForm";
import { UploadProfessionImageForm } from "./UploadProfessionImageForm";


export const ActionsCell = ({ row }: { row: { original: Profession } }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [openConfirm, setOpenConfirm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteProfession(row.original.id),
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2">
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
            <ProfessionDetail id={row.original.id} />
          </DialogContent>
        </Dialog>

        {user?.role === "ADMIN" && (
          <div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex justify-start text-muted-foreground hover:text-cyan-600"
                >
                  <ImageIcon className="mr-2 h-4 w-4" /> Carregar Imagem
                </Button>
              </DialogTrigger>
              <DialogContent>
                <UploadProfessionImageForm id={row.original.id} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex justify-start text-muted-foreground hover:text-green-500"
                >
                  <PencilIcon className="mr-2 h-4 w-4" /> Editar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <UpdateProfessionForm profession={row.original} />
              </DialogContent>
            </Dialog>
          </div>
        )}
        {(user?.role === "PROFISSIONAL" || user?.role === "COMPANY") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex justify-start text-muted-foreground hover:text-purple-500"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Adicionar a minha Profissão
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 shadow-none border-none bg-transparent">
              <AssociateUserForm professionId={row.original.id} />
            </DialogContent>

          </Dialog>
        )}
        <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
          {user?.role === "ADMIN" && (<DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-start text-muted-foreground hover:text-red-500"
            >
              <TrashIcon className="mr-2 h-4 w-4" /> Deletar
            </Button>
          </DialogTrigger>)}
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
      </PopoverContent>
    </Popover>
  );
};

export const professionColumns: ColumnDef<Profession>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nome <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => <span className="hidden md:inline">{row.original.description}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => (
      <span className="hidden md:inline">
        {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Atualizado em",
    cell: ({ row }) => (
      <span className="hidden lg:inline">
        {row.original.updatedAt ? new Date(row.original.updatedAt).toLocaleDateString() : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
