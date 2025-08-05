'use client'
import { getUsers } from "@/actions/users";
import Loading from "@/app/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

interface Service {
  id: string;
  name: string;
}

interface ProfessionalService {
  service: Service;
}

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  photo?: string;
  professionalService?: ProfessionalService[];
}


const ITEMS_PER_PAGE = 4 * 3;

export default function ServiceProviders() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers()
  });



  const filteredUsers = data?.filter((user) =>
    user.role === "COMPANY" || user.role === "PROFISSIONAL"
  ) ?? [];



  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedProfessionals = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );


  if (isLoading) return <Loading />;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <div className=" mx-auto ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {paginatedProfessionals.map((user) => (
          <Card key={user.id} className="shadow-lg rounded-2xl hover:border-blue-500">
            <Link href={`users/${user.id}`}>
              <CardHeader className="flex flex-col items-center">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.photo || "https://via.placeholder.com/150"} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-center mt-2">{user.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  {user.professionalService?.map((ps) => ps.service.name).join(", ") || "Sem serviços cadastrados"}
                </p>
                <p className="text-sm font-semibold mt-2">Contato: {user.phoneNumber}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                <PaginationPrevious />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <span className="px-4">Página {page} de {totalPages}</span>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                <PaginationNext />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
