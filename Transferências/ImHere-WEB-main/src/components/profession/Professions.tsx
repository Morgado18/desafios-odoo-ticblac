'use client';

import { getProfessions } from "@/actions/professions";
import Loading from "@/app/loading";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../data-table";
import { professionColumns } from "./professionColumns";


export function Professions() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['professions'],
    queryFn: () => getProfessions()
  });

  if (isLoading) return <Loading />
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <DataTable
        columns={professionColumns}
        data={data || []} />
    </div>
  )
}
