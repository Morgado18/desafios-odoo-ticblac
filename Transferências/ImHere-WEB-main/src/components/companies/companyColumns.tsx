"use client";

import { Company, deleteCompany } from "@/actions/companies";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical, PencilIcon, SquareArrowOutUpRight, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { UpdateCompanyForm } from "./UpdateCompanyForm";


const ActionsCell = ({ row }: { row: { original: Company } }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteCompany(row.original.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Empresa deletada com sucesso! ✅");
    },
    onError: () => {
      toast.error("Erro ao deletar empresa ❌");
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-start text-muted-foreground hover:text-blue-500"
            >
              <SquareArrowOutUpRight className="mr-2 h-4 w-4" /> Visualizar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <p className="text-center font-bold">Detalhes da Empresa</p>
            <p><strong>Nome:</strong> {row.original.ownerName}</p>
            <p><strong>NIF:</strong> {row.original.nif}</p>
            <p><strong>Funcionários:</strong> {row.original.numberOfEmployer}</p>
            <p><strong>Descrição:</strong> {row.original.description}</p>
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
            <UpdateCompanyForm company={row.original} />
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          className="w-full flex justify-start text-muted-foreground hover:text-red-500"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
        >
          <TrashIcon className="mr-2 h-4 w-4" /> Deletar
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: "ownerName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Proprietário <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "nif",
    header: "NIF",
    cell: ({ row }) => <span className="hidden md:inline">{row.original.nif}</span>,
  },
  {
    accessorKey: "numberOfEmployer",
    header: "Funcionários",
    cell: ({ row }) => <span className="hidden md:inline">{row.original.numberOfEmployer}</span>,
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => <span className="hidden lg:inline">{row.original.description}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => (
      <span className="hidden lg:inline">
        {row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
