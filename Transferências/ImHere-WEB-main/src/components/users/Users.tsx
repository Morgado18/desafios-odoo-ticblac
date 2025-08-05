'use client';

import { getUsers } from "@/actions/users";
import Loading from "@/app/loading";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../data-table";
import { userColumns } from "./userColumns";

export function Users() {

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers()
  });


  if (isLoading) return <Loading />
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <DataTable
        columns={userColumns}
        data={data!} />
    </div>
  );
}
