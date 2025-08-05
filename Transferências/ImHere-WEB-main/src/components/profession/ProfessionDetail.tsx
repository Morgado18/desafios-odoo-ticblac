"use client";

import { getProfessionById } from "@/actions/professions";
import Loading from "@/app/loading";
import { useQuery } from "@tanstack/react-query";

type ProfessionDetailProps = {
  id: string;
};

export function ProfessionDetail({ id }: Readonly<ProfessionDetailProps>) {
  const { data: profession, isLoading, isError, error } = useQuery({
    queryKey: ["profession", id],
    queryFn: () => getProfessionById(id),
    enabled: !!id,
  });

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center text-red-500">Erro: {error.message}</div>;
  if (!profession) return <div className="text-center text-gray-500">Profissão não encontrada.</div>;

  return (
    <div className="space-y-4 px-1">
      <h2 className="text-xl font-semibold text-center">{profession.name}</h2>
      <p className="text-center text-gray-700">
        {profession.description || "Sem descrição disponível."}
      </p>
      <p className="text-center text-sm text-gray-500">
        Criado em: {profession.createdAt ? new Date(profession.createdAt).toLocaleDateString() : "Data desconhecida"}
      </p>

      {profession.subServices && profession.subServices.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-center">Subserviços</h3>
          <ul className="mt-2 space-y-2">
            {profession.subServices.map((service) => (
              <li key={service.id} className="bg-muted p-3 rounded-md">
                <p className="font-semibold text-center">{service.name}</p>
                <p className="text-sm text-muted-foreground text-center">{service.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
