"use client";

import { getCompany } from "@/actions/companies";
import Loading from "@/app/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export function CompanyCard({ id }: Readonly<{ id: string }>) {

  const { data: company, isLoading, isError, error } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompany(id),
    enabled: !!id,
  });

  if (isLoading) return <Loading />
  if (isError) return <div className="text-center text-red-500">Erro: {error.message}</div>;
  if (!company) return <div className="text-center text-gray-500">Empresa não encontrada.</div>;

  return (
    <Card className="max-w-lg mx-auto p-6 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{company.ownerName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p><strong>NIF:</strong> {company.nif}</p>
        <p><strong>ID do Usuário:</strong> {company.userId}</p>
        <p><strong>Número de Funcionários:</strong> {company.numberOfEmployer}</p>
        <p><strong>Descrição:</strong> {company.description}</p>
        <p><strong>Criado em:</strong> {new Date(company.createdAt).toLocaleDateString()}</p>
        <p><strong>Atualizado em:</strong> {new Date(company.updatedAt).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
}
