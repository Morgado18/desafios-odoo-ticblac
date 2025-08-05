"use client";

import { updateAppointment } from "@/actions/appointments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateAppointmentSchema = z.object({
  userId: z.string().min(1, "O ID do usuário é obrigatório"),
  profissionalId: z.string().min(1, "O ID do profissional é obrigatório"),
  dateAppointment: z.string().min(1, "A data do agendamento é obrigatória"),
  localAppointment: z.string().min(1, "O local do agendamento é obrigatório"),
});

type UpdateAppointmentFormData = z.infer<typeof updateAppointmentSchema>;

export function UpdateAppointmentForm({ appointmentId }: Readonly<{ appointmentId: string }>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<UpdateAppointmentFormData>({
    resolver: zodResolver(updateAppointmentSchema),
    defaultValues: {
      userId: "",
      profissionalId: "",
      dateAppointment: "",
      localAppointment: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: UpdateAppointmentFormData) => {
      return updateAppointment(appointmentId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      router.push("/appointments");
    },
    onError: (error) => {
      console.error("Erro ao atualizar agendamento:", error);
    },
  });

  const onSubmit = async (data: UpdateAppointmentFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center h-fit">
      <Card className="w-full max-w-md shadow-lg">
        {/* <CardHeader>
          <CardTitle className="text-lg font-bold">Atualizar Agendamento</CardTitle>
        </CardHeader> */}
        <CardContent >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {(
                [
                  { name: "userId", label: "ID do Usuário", type: "text" },
                  { name: "profissionalId", label: "ID do Profissional", type: "text" },
                  { name: "dateAppointment", label: "Data do Agendamento", type: "datetime-local" },
                  { name: "localAppointment", label: "Local do Agendamento", type: "text" },
                ] as const
              ).map(({ name, label, type }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input type={type} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? "Atualizando..." : "Atualizar Agendamento"}
              </Button>

              {mutation.isError && (
                <p className="text-red-500 text-center mt-2">
                  Erro ao atualizar agendamento, tente novamente.
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
