"use client";

import { deleteWeeklySchedule, WeeklySchedule } from "@/actions/weekly-schedule";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { translateDay } from "@/utils/mappers/translateDay";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, PencilIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

const ActionsCell = ({ row }: { row: { original: WeeklySchedule } }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteWeeklySchedule(row.original.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly-schedules"] });
      toast.success("Horário eliminado com sucesso! ✅");
    },
    onError: () => {
      toast.error("Erro ao eliminar horário ❌");
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
              className="w-full flex justify-start text-muted-foreground hover:text-green-500"
            >
              <PencilIcon className="mr-2 h-4 w-4" /> Editar
            </Button>
          </DialogTrigger>
          {/* <DialogContent>
            <UpdateWeeklyScheduleForm scheduleId={row.original.id} />
          </DialogContent> */}
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


export const weeklyScheduleColumns: ColumnDef<WeeklySchedule>[] = [
  {
    accessorKey: "dayOfWeek",
    header: "Dia da Semana",
    cell: ({ row }) => translateDay(row.original.dayOfWeek),
  },
  {
    accessorKey: "startTime",
    header: "Hora de Início",
    cell: ({ row }) => `${row.original.startTime}:00`,
  },
  {
    accessorKey: "endTime",
    header: "Hora de Término",
    cell: ({ row }) => `${row.original.endTime}:00`,
  },
  {
    accessorKey: "interval",
    header: "Intervalo (horas)",
    cell: ({ row }) => `${row.original.interval} h`,
  },
  {
    accessorKey: "dailyWorkingHours",
    header: "Horas Trabalhadas",
    cell: ({ row }) => `${row.original.dailyWorkingHours}h`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={row.original.status ? "text-green-500" : "text-red-500"}>
        {row.original.status ? "Ativo" : "Inativo"}
      </span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
