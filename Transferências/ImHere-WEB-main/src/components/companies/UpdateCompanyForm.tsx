"use client";

import { Company, updateCompany } from "@/actions/companies";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateCompanySchema = z.object({
  ownerName: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  nif: z.string().min(9, "O NIF deve ter pelo menos 9 caracteres"),
  numberOfEmployer: z.string().optional(),
});

type UpdateCompanyFormData = z.infer<typeof updateCompanySchema>;

export function UpdateCompanyForm({ company }: Readonly<{ company: Company }>) {
  const queryClient = useQueryClient();
  const form = useForm<UpdateCompanyFormData>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      ownerName: company.ownerName,
      description: company.description,
      nif: company.nif,
      numberOfEmployer: company.numberOfEmployer || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: Partial<Company>) => updateCompany(company.id, data),
    onSuccess: () => {
      toast.success("Empresa atualizada com sucesso! ✅");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: () => toast.error("Erro ao atualizar empresa ❌"),
  });

  const onSubmit = (data: UpdateCompanyFormData) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Atualizando empresa...",
      success: "Empresa atualizada com sucesso! ✅",
      error: "Erro ao atualizar empresa ❌",
    });
  };

  return (
    <Card className="max-w-md mx-auto p-6 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Editar Empresa</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="ownerName" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Proprietário</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="nif" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>NIF</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="numberOfEmployer" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Funcionários</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Atualizando..." : "Atualizar Empresa"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
