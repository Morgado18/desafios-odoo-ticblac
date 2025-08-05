"use client";

import { associateUserToProfession, getProfessionById } from "@/actions/professions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


type AssociateUserFormProps = {
  professionId: string;
};

export function AssociateUserForm({ professionId }: Readonly<AssociateUserFormProps>) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<{ professionId: string; serviceId: string[] }>({
    defaultValues: { professionId, serviceId: [] },
  });

  const { data: profession, isLoading } = useQuery({
    queryKey: ["profession", professionId],
    queryFn: () => getProfessionById(professionId),
    enabled: !!professionId,
  });

  const mutation = useMutation({
    mutationFn: associateUserToProfession,
    onSuccess: () => {
      toast.success("Profissão associada com sucesso! ✅");
      reset();
    },
    onError: () => {
      toast.error("Erro ao associar profissão ❌");
    },
  });

  const selectedServices = watch("serviceId", []);

  const onSubmit = (data: { professionId: string; serviceId: string[] }) => {
    mutation.mutate(data);
  };

  return (
    <Card className="max-w-lg mx-auto p-6 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Associar Profissão</CardTitle>

        {profession?.name && (
          <p className="text-center text-muted-foreground">
            Profissão selecionada: <span className="font-medium">{profession.name}</span>
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-gray-500">Carregando serviços...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("professionId")} value={professionId} />

            {/* Exibição dos Subserviços da Profissão */}
            {profession?.subServices?.length ? (
              <div>
                <h3 className="text-lg font-semibold text-center">Selecione os Serviços</h3>
                <div className="mt-2 space-y-2">
                  {profession.subServices.map((service) => (
                    <div key={service.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => {
                          setValue(
                            "serviceId",
                            checked ? [...selectedServices, service.id] : selectedServices.filter((id) => id !== service.id)
                          );
                        }}
                      />
                      <label>{service.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">Nenhum serviço disponível.</p>
            )}

            {/* Botão de Envio */}
            <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-700" disabled={mutation.isPending}>
              {mutation.isPending ? "Associando..." : "Associar Profissão"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
