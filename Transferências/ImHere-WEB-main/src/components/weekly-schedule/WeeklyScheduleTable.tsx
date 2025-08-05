"use client"
import { getUser } from "@/actions/users";
import Loading from "@/app/loading";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../data-table";
import { weeklyScheduleColumns } from "./weeklyScheduleColumns";
type WeeklyScheduleTableProps = {
  id: string
}

export function WeeklyScheduleTable({ id }: Readonly<WeeklyScheduleTableProps>) {

  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });


  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center text-red-500">Erro: {error.message}</div>;
  if (!user) return <div className="text-center text-gray-500">Usuário não encontrado.</div>;

  return (
    <div>
      <DataTable
        columns={weeklyScheduleColumns}
        data={user?.weeklySchedule ?? []} />
    </div>
  )

}
