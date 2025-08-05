'use client';

import { deleteUser, type User } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreVertical,
  SquareArrowOutUpRight,
  TrashIcon
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { RoleBadge } from "./role-badge";


const ActionsCell = ({ row }: { row: { original: User } }) => {
  const queryClient = useQueryClient();
  const [openConfirm, setOpenConfirm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(row.original.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário deletado com sucesso! ✅");
      setOpenConfirm(false);
    },
    onError: () => {
      toast.error("Erro ao deletar usuário ❌");
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-36 p-2">
        <Link href={`/users/${row.original.id}`}>
          <Button
            variant="ghost"
            className="w-full flex justify-start text-muted-foreground hover:text-blue-500"
          >
            <SquareArrowOutUpRight className="mr-2 h-4 w-4" /> Visualizar
          </Button>
        </Link>

        <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-start text-muted-foreground hover:text-red-500"
            >
              <TrashIcon className="mr-2 h-4 w-4" /> Eliminar
            </Button>
          </DialogTrigger>
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


export const userColumns: ColumnDef<User>[] = [
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Telefone",
    cell: ({ row }) => <span className="hidden sm:inline">{row.original.phoneNumber}</span>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Select onValueChange={(value) => column.setFilterValue(value)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Filtrar Função" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CLIENT">Cliente</SelectItem>
          <SelectItem value="PROFISSIONAL">Profissional</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="COMPANY">Empresa</SelectItem>
        </SelectContent>
      </Select>
    ),
    cell: ({ row }) => <RoleBadge role={row.original.role} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Select onValueChange={(value) => column.setFilterValue(value)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Filtrar Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Ativo</SelectItem>
          <SelectItem value="false">Inativo</SelectItem>
        </SelectContent>
      </Select>
    ),
    cell: ({ row }) => <span>{row.original.status ? "Ativo" : "Inativo"}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => (
      <span className="hidden md:inline">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
