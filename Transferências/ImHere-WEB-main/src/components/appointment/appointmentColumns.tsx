// ... imports (sem alteração)
"use client";

import { type Appointment, confirmAppointment, deleteAppointment } from "@/actions/appointments";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { translateDay } from "@/utils/mappers/translateDay";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, MoreVertical, PencilIcon, SquareArrowOutUpRight, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../StatusBadge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { AppointmentDetail } from "./AppointmentDetail";
import { UpdateAppointmentForm } from "./UpdateAppointmentForm";

type CellProps = {
  row: {
    original: Appointment;
  };
};

const ActionsCell = ({ row }: CellProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [openConfirm, setOpenConfirm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteAppointment(row.original.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Agendamento eliminado com sucesso! ✅");
      setOpenConfirm(false);
    },
    onError: () => {
      toast.error("Erro ao eliminar agendamento ❌");
    },
  });


  const confirmMutation = useMutation({
    mutationFn: () => confirmAppointment(row.original.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Agendamento confirmado com sucesso! ✅");
      setOpenConfirm(false);
    },
    onError: () => {
      toast.error("Erro ao confirmar agendamento ❌");
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
            <Button variant="ghost" className="w-full flex justify-start text-muted-foreground hover:text-blue-500">
              <SquareArrowOutUpRight className="mr-2 h-4 w-4" /> Visualizar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AppointmentDetail id={row.original.id} />
          </DialogContent>
        </Dialog>
        {user?.role === 'ADMIN' || user?.role === 'CLIENT' && (

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full flex justify-start text-muted-foreground hover:text-green-500">
                <PencilIcon className="mr-2 h-4 w-4" /> Editar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <UpdateAppointmentForm appointmentId={row.original.id} />
            </DialogContent>
          </Dialog>
        )}

        {(user?.role === "COMPANY" || user?.role === "PROFISSIONAL") && (
          <Button
            variant="ghost"
            onClick={() => confirmMutation.mutate()}
            className="w-full flex justify-start text-muted-foreground hover:text-blue-500"
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Confirmar
          </Button>
        )}

        {user?.role === "ADMIN" && (
          <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full flex justify-start text-muted-foreground hover:text-red-500">
                <TrashIcon className="mr-2 h-4 w-4" /> Deletar
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
        )}
      </PopoverContent>
    </Popover>
  );
};

export const appointmentColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "dateAppointment",
    header: "Data do Agendamento",
    cell: ({ row }) => (
      <span className="py-1 px-2 rounded-full bg-gray-300">
        {translateDay(row.original.dayOfWeek)}
      </span>
    ),
  },
  {
    accessorKey: "clientName",
    header: "Cliente",
    cell: ({ row }) => <span>{row.original.client?.name ?? "Sem nome"}</span>,
  },
  {
    accessorKey: "profissionalName",
    header: "Profissional",
    cell: ({ row }) => <span>{row.original.profissional?.name ?? "Sem nome"}</span>,
  },
  {
    accessorKey: "localAppointment",
    header: "Local",
    cell: ({ row }) => <span>{row.original.localAppointment}</span>,
  },
  {
    accessorKey: "profession",
    header: "Profissão",
    cell: ({ row }) => (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left text-sm font-medium">
            {row.original.profession ?? "Não especificado"}
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc ml-5 text-muted-foreground text-sm">
              {row.original.subService?.map((service, index) => (
                <li key={index}>{service}</li>
              )) ?? <li>Nenhum serviço</li>}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
