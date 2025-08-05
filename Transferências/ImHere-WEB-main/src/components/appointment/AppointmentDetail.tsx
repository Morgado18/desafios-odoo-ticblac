"use client";

import { getAppointment } from "@/actions/appointments";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

type AppointmentDetailProps = {
  id: string;
};

export function AppointmentDetail({ id }: Readonly<AppointmentDetailProps>) {
  const {
    data: appointment,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["appointment", id],
    queryFn: () => getAppointment(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-lg mx-auto p-6">
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-4" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Erro ao carregar: {error.message}
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center text-muted-foreground">
        Agendamento não encontrado.
      </div>
    );
  }

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(date));

  const statusColor = {
    PENDENTE: "bg-yellow-500",
    CONFIRMADO: "bg-green-500",
    CANCELADO: "bg-red-500",
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-6 shadow-lg rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Detalhes do Agendamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">ID do Usuário</p>
          <p className="font-medium">{appointment.userId}</p>
        </div>
        <Separator />
        <div>
          <p className="text-sm text-muted-foreground">ID do Profissional</p>
          <p className="font-medium">{appointment.profissionalId}</p>
        </div>
        <Separator />
        <div>
          <p className="text-sm text-muted-foreground">Data do Agendamento</p>
          <p className="font-medium">{formatDate(appointment.createdAt)}</p>
        </div>
        <Separator />
        <div>
          <p className="text-sm text-muted-foreground">Local</p>
          <p className="font-medium">{appointment.localAppointment}</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge
            className={statusColor[appointment.status as keyof typeof statusColor]}
          >
            {appointment.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
