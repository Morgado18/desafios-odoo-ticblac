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
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createCompanySchema = z
  .object({
    name: z.string().min(3, "O nome da empresa deve ter pelo menos 3 caracteres"),
    email: z.string().email("Digite um e-mail válido"),
    phoneNumber: z
      .string()
      .regex(/^\+244\d{9}$/, "O telefone deve começar com '+244' seguido de 9 dígitos"),
    nif: z
      .string()
      .regex(/^\d{9}$/, "O NIF deve conter exatamente 9 números"),
    description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
    ownerName: z.string().min(3, "O nome do proprietário deve ter pelo menos 3 caracteres"),
    numberOfEmployer: z
      .string()
      .regex(/^\d+$/, "Número de funcionários deve ser numérico"),
    address: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
    serviceId: z.string().optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type CreateCompanyFormSchema = z.infer<typeof createCompanySchema>;

export function SignUpCompanyForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<CreateCompanyFormSchema>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "+244",
      nif: "",
      description: "",
      ownerName: "",
      numberOfEmployer: "",
      address: "",
      password: "",
      confirmPassword: "",
      serviceId: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => createCompany(formData),
    onSuccess: () => {
      toast.success("Empresa criada com sucesso! ✅");
      form.reset();
      router.refresh();
      router.push("/auth");
    },
    onError: () => {
      toast.error("Erro ao criar empresa. Tente novamente.");
    },
  });

  const onSubmit = async (data: CreateCompanyFormSchema) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "confirmPassword" && value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    formData.append("role", "COMPANY");
    formData.append("photo", "exampleurl.photo");

    toast.promise(mutation.mutateAsync(formData), {
      loading: "Criando empresa...",
      success: "Empresa criada com sucesso!",
      error: "Erro ao criar empresa",
    });
  };

  return (
    <div className="w-full max-w-md py-6 rounded-lg">
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
              // { name: "bi", label: "Número do BI", type: "text" },
              { name: "password", label: "Senha", type: "password" },
              { name: "confirmPassword", label: "Confirmar Senha", type: "password" },
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
                    <div className="relative">
                      <Input
                        {...field}
                        type={
                          name === "password"
                            ? showPassword ? "text" : "password"
                            : name === "confirmPassword"
                              ? showConfirmPassword ? "text" : "password"
                              : type
                        }
                      />
                      {(name === "password" || name === "confirmPassword") && (
                        <button
                          type="button"
                          onClick={() =>
                            name === "password"
                              ? setShowPassword((prev) => !prev)
                              : setShowConfirmPassword((prev) => !prev)
                          }
                          className="absolute right-3 top-2.5 text-muted-foreground"
                        >
                          {(name === "password" && showPassword) ||
                            (name === "confirmPassword" && showConfirmPassword) ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <div className="pt-6">
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Criando..." : "Criar Empresa"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
