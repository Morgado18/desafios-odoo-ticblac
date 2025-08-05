"use client";

import { Appointment, getAppointmentsByRole } from "@/actions/appointments";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatWindow } from "./chat-box";


export default function AgendamentoChatPage() {
  const { user } = useAuth();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const searchParams = useSearchParams();

  const chatId = searchParams.get("id");

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments"],
    enabled: !!user && !!user.role && !!user.id,
    queryFn: () => {
      if (!user?.role || !user?.id) throw new Error("Usuário inválido");
      return getAppointmentsByRole(user.role, user.id);
    },

  });


  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // const filteredAppointments = appointments?.filter(
  //   (appointment) => appointment.status !== "PENDING"
  // );
  const filteredAppointments = appointments?.filter(
    (appointment) =>
      appointment.status !== "PENDING" &&
      (user?.role === "CLIENT"
        ? appointment.client?.id === user.id
        : appointment.profissional?.id === user?.id)
  );

  useEffect(() => {
    if (typeof window !== "undefined" && user?.role === "ADMIN") {
      redirect("/dashboard");
    }
  }, [user]);


  useEffect(() => {
    if (chatId && appointments) {
      const found = appointments.find(a => a.id === chatId);
      if (found) setSelectedAppointment(found);
    }
  }, [chatId, appointments]);

  if (isLoading) return <Loading />



  return (
    <div className="flex flex-col md:flex-row gap-4 w-full p-4">
      {/* Lista de Agendamentos */}
      <Card
        className={cn(
          "w-full md:w-1/5 transition-all border-t-0 border-b-0 border-l-0 rounded-none shadow-none border-r-2 border-gray-200",
          selectedAppointment && isMobile ? "hidden" : "block"
        )}
      >
        <CardHeader className="border-b-2 border-gray-200 mb-2">
          <CardTitle>Seus Agendamentos</CardTitle>
        </CardHeader>
        <CardContent className="items-start space-y-2">
          {filteredAppointments?.length ? (
            filteredAppointments.map((appointment) => (
              <Button
                key={appointment.id}
                variant={appointment.id === selectedAppointment?.id ? "default" : "outline"}
                className="w-full justify-start text-start truncate"
                onClick={() => setSelectedAppointment(appointment)}
              >
                {/* {translateDay(appointment.dayOfWeek)} - {appointment.startTime}h às {appointment.endTime}h */}
                {appointment.profession} - {user?.role === "CLIENT"
                  ? appointment.profissional?.name
                  : appointment.client?.name}
              </Button>
            ))
          ) : (
            <p className="text-muted-foreground">Nenhum agendamento disponível.</p>
          )}
        </CardContent>
      </Card>

      {/* Área de Chat */}
      {selectedAppointment ? (
        <div className={cn("w-full md:w-2/3", isMobile ? "block" : "")}>
          <ChatWindow
            appointment={selectedAppointment}

            onBack={() => setSelectedAppointment(null)}
          />
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
          <p>Selecione um agendamento para iniciar o chat.</p>
        </div>
      )}
    </div>
  );
}
