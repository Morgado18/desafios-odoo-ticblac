"use client";

import { Profession, updateProfession } from "@/actions/professions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateProfessionSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
});

type UpdateProfessionFormData = z.infer<typeof updateProfessionSchema>;

export function UpdateProfessionForm({ profession }: Readonly<{ profession: Profession }>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<UpdateProfessionFormData>({
    resolver: zodResolver(updateProfessionSchema),
    defaultValues: {
      name: profession.name,
      description: profession.description ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: UpdateProfessionFormData) =>
      updateProfession(profession.id, formData),
    onSuccess: () => {
      toast.success("Profissão atualizada com sucesso! ✅");
      queryClient.invalidateQueries({ queryKey: ["professions"] });
      router.push("/professions");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar profissão ❌");
      console.error("Erro ao atualizar profissão:", error);
    },
  });

  const onSubmit: SubmitHandler<UpdateProfessionFormData> = async (data) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Atualizando profissão...",
      success: "Profissão atualizada com sucesso! ✅",
      error: "Erro ao atualizar profissão ❌",
    });
  };

  return (
    <Card className="max-w-md mx-auto p-6 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Editar Profissão</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {(
              [
                { name: "name", label: "Nome", type: "text" },
                { name: "description", label: "Descrição", type: "text" },
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
            <div className="pt-6">
              <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? "Atualizando..." : "Atualizar Profissão"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
