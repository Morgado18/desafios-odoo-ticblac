import type { Appointment } from "@/actions/appointments";
import { APPOINTMENT_STATUS, getAppointmentsByRole, updateAppointmentStatus } from "@/actions/appointments";
import { ROLE } from "@/actions/users";
import Loading from "@/app/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { capitalizeEachWord } from "@/utils/capitalizeEachWord";
import { translateDay } from "@/utils/mappers/translateDay";
import { translateStatus } from "@/utils/mappers/translateStatus";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Calendar, Info, ListChecks, MapPin, MessageCircle, User, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AppointmentsByUserProps = {
  id: string;
  role: ROLE;
};

export function AppointmentsByUser({ id, role }: Readonly<AppointmentsByUserProps>) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['my-appointments', role, id],
    queryFn: () => getAppointmentsByRole(role, id),
  });

  if (isLoading) return <Loading />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* <DataTable
          columns={appointmentColumns}
          data={data ?? []}
        /> */}
      <AppointmentsByUserCards data={data ?? []} />
    </div>
  );
}

const STATUS_LABELS: Record<APPOINTMENT_STATUS | "ALL", string> = {
  ALL: "Todos",
  PENDING: "Pendentes",
  CONFIRMED: "Confirmados",
  CANCELED: "Cancelados",
  FINISHED: "Concluídos",
};

export function AppointmentsByUserCards({ data }: { data: Appointment[] }) {

  const [tab, setTab] = useState<APPOINTMENT_STATUS | "ALL">("ALL");
  const router = useRouter();

  const filtered = tab === "ALL" ? data : data.filter(a => a.status === tab);

  const queryClient = useQueryClient();

  const { mutate: cancelAppointment } = useMutation({
    mutationFn: (id: string) => updateAppointmentStatus(id, "CANCELED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
    },
    onError: () => {
      toast.error("Erro ao cancelar agendamento.");
    },
  });


  return (
    <div>
      <Tabs value={tab} onValueChange={value => setTab(value as APPOINTMENT_STATUS | "ALL")}
        className="">
        <TabsList
          className="
    mb-6 flex gap-2 justify-start
    overflow-x-auto whitespace-nowrap
    scrollbar-hide 
    scrollbar-hide
    px-4 -mx-4
    sm:justify-center sm:overflow-visible sm:whitespace-normal
    bg-transparent shadow-none border-none
  "
        >

          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <TabsTrigger
              key={key}
              value={key}
              className={`
                px-4 py-2 rounded-full transition
                bg-transparent
                data-[state=active]:bg-primary data-[state=active]:text-white
                data-[state=inactive]:bg-transparent data-[state=inactive]:text-primary
                shadow-none
              `}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.keys(STATUS_LABELS).map((key) => (
          <TabsContent key={key} value={key}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(key === "ALL" ? data : data.filter(a => a.status === key)).map((row) => (
                <Card key={row.id} className="shadow rounded-xl">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold"> {row.profession ?? "Sem profissão"}</CardTitle>
                    <Badge variant={row.status === 'PENDING' ? 'outline' : 'default'} className="bg-primary/80 text-white">
                      {translateStatus(row.status)}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-2 border-t pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={18} />
                      <span>{row.localAppointment}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={18} />
                      <span>
                        {translateDay(row.dayOfWeek)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User size={18} />
                      <span>Cliente: {row.client?.name ?? "Sem nome"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User size={18} />
                      <span>Profissional: {row.profissional?.name ?? "Sem nome"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase size={18} />
                      <span>Profissão: {row.profession ?? "Não especificado"}</span>
                    </div>
                    {row.subService && row.subService.length > 0 && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ListChecks size={18} />
                        <span>
                          Serviços: {capitalizeEachWord(row.subService.join(", "))}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Info size={18} />
                      <span>Status: {translateStatus(row.status)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="destructive"

                      className="w-fit flex gap-2 bg-red-500/70  hover:bg-red-700/90 rounded-full text-red-500 hover:text-white"


                      onClick={() => {
                        toast.promise(
                          new Promise((resolve, reject) => {
                            cancelAppointment(row.id, {
                              onSuccess: resolve,
                              onError: reject,
                            });
                          }),
                          {
                            loading: "Cancelando agendamento...",
                            success: "Agendamento cancelado com sucesso!",
                            error: "Erro ao cancelar agendamento.",
                          }
                        );
                      }}
                    >
                      <XCircle size={18} /> Cancelar
                    </Button>

                    <Button
                      variant="outline"

                      className="w-fit flex gap-2 bg-blue-500/70  hover:bg-blue-700/90 rounded-full text-blue-500 hover:text-white"


                      onClick={() => router.push(`/chat?id=${row.id}`)}
                      title="Abrir chat"
                      disabled={row.status === "PENDING"}
                    >
                      <MessageCircle size={18} /> Chat
                    </Button>

                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
