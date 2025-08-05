"use client";

import { createCompany } from "@/actions/companies";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createCompanySchema = z.object({
  name: z.string().min(3, "O nome da empresa deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um e-mail válido"),
  phoneNumber: z
    .string()
    .regex(/^\d{9}$/, "O número deve conter 9 dígitos (ex: 912345678)"),
  nif: z.string().regex(/^\d{9}$/, "O NIF deve conter exatamente 9 números"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  ownerName: z.string().min(3, "O nome do proprietário deve ter pelo menos 3 caracteres"),
  numberOfEmployer: z.string().regex(/^\d+$/, "Número de funcionários deve ser numérico"),
  address: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
  serviceId: z.string().optional().nullable(),
});

type CreateCompanyFormSchema = z.infer<typeof createCompanySchema>;

export function CreateCompanyForm() {
  const router = useRouter();

  const form = useForm<CreateCompanyFormSchema>({
    resolver: zodResolver(createCompanySchema),
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => createCompany(formData),
    onSuccess: () => {
      router.push("/company");
    },
    onError: (error) => {
      console.error("Erro ao criar empresa:", error);
    },
  });

  const onSubmit = async (data: CreateCompanyFormSchema) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "phoneNumber") {
          formData.append(key, `+244${value}`);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    formData.append("password", "Senha123");

    mutation.mutate(formData);
  };

  return (
    <div className="w-full h-full p-6 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {(
            [
              { name: "name", label: "Nome da Empresa", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phoneNumber", label: "Telefone", type: "tel" },
              { name: "nif", label: "NIF", type: "text" },
              { name: "description", label: "Descrição", type: "text" },
              { name: "ownerName", label: "Nome do Proprietário", type: "text" },
              { name: "numberOfEmployer", label: "Número de Funcionários", type: "text" },
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

          <div className="pt-6">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Criando..." : "Criar Empresa"}
            </Button>
          </div>

          {mutation.isError && (
            <p className="text-red-500 text-center">
              Erro ao criar empresa, tente novamente.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
