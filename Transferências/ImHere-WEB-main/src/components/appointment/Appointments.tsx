'use client';

import { getAppointments } from "@/actions/appointments";
import Loading from "@/app/loading";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../data-table";
import { appointmentColumns } from "./appointmentColumns";
import { AppointmentsByUser } from "./AppointmentsByUser";


type AppointmentsProps = {
  id?: string;
};

export function Appointments({ id }: Readonly<AppointmentsProps>) {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => getAppointments()
  });
  if (isLoading) return <Loading />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {user?.role === "ADMIN" ? (
        <DataTable
          columns={appointmentColumns}
          data={data ?? []}
        />

      ) : (

        <AppointmentsByUser id={user?.id!} role={user?.role!} />
      )}
    </div>
  );
}
