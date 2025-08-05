'use client';

import { getCompanies } from "@/actions/companies";
import Loading from "@/app/loading";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../data-table";
import { companyColumns } from "./companyColumns";


export function Companies() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  });

  if (isLoading) return <Loading />
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <DataTable
        columns={companyColumns}
        data={data ?? []} />
    </div>
  );
}
