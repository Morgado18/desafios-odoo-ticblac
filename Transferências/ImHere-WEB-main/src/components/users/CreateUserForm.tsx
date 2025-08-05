"use client";

import { createCompany } from "@/actions/companies";
import { createUser } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const baseSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um e-mail válido"),
  phoneNumber: z.string().regex(/^\+\d{8,15}$/, "O telefone deve começar com '+' seguido do código do país e números"),
  bi: z.string().regex(/^\d{9}\d{2}\d{3}$/, "O BI deve seguir o formato correto, ex: 012345678AB910"),
  address: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
  role: z.enum(["CLIENT", "PROFISSIONAL", "ADMIN", "COMPANY"]),
});

const companySchema = baseSchema.extend({
  nif: z.string().min(9, "O NIF deve ter pelo menos 9 caracteres"),
  description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
  ownerName: z.string().min(3, "O nome do proprietário deve ter pelo menos 3 caracteres"),
  numberOfEmployer: z.string().min(1, "Número de funcionários é obrigatório"),
});

type CreateUserFormData = z.infer<typeof companySchema>;

export function CreateUserForm() {
  const router = useRouter();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      role: "CLIENT",
    },
  });

  const role = useWatch({ control: form.control, name: "role" });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (formData.get("role") === "COMPANY") {
        return createCompany(formData);
      }
      return createUser(formData);
    },
    onSuccess: () => {
      router.push("/users");
    },
    onError: (error) => {
      console.error("Erro ao criar:", error);
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Senha fixa
    formData.append("password", "Senha123");

    mutation.mutate(formData);
  };

  return (
    <div className="w-full max-w-md p-6 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {(
            [
              { name: "name", label: "Nome Completo", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phoneNumber", label: "Telefone", type: "tel" },
              { name: "bi", label: "Número do BI", type: "text" },
              { name: "address", label: "Endereço", type: "text" },
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

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Papel</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um papel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CLIENT">Cliente</SelectItem>
                    <SelectItem value="PROFISSIONAL">Profissional</SelectItem>
                    <SelectItem value="COMPANY">Empresa</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {role === "COMPANY" && (
            <>
              {(
                [
                  { name: "nif", label: "NIF", type: "text" },
                  { name: "description", label: "Descrição da Empresa", type: "text" },
                  { name: "ownerName", label: "Nome do Proprietário", type: "text" },
                  { name: "numberOfEmployer", label: "Número de Funcionários", type: "text" },
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
            </>
          )}

          <div className="pt-6">
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Salvando..." : "Criar"}
            </Button>
          </div>

          {mutation.isError && (
            <p className="text-red-500 text-center">Erro ao salvar, tente novamente.</p>
          )}
        </form>
      </Form>
    </div>
  );
}
