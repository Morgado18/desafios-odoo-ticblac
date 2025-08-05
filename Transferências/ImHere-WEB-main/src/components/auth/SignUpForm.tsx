"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";


const schema = z
  .object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Digite um e-mail válido"),
    phoneNumber: z.string().regex(
      /^\+244\d{9}$/,
      "O telefone deve começar com '+244' seguido de 9 dígitos"
    ),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
    bi: z
      .string()
      .regex(/^\d{9}\w{2}\d{3}$/, "O BI deve seguir o formato correto, ex: 012345678LA410")
      .optional()
      .or(z.literal("")), // <- permite string vazia

    role: z.literal("CLIENT"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type CreateUserFormData = z.infer<typeof schema>;

export function SignUpClientForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "+244",
      password: "",
      confirmPassword: "",
      bi: "",
      role: "CLIENT",
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => createUser(formData),
    onSuccess: () => {
      toast.success("Usuário criado com sucesso! ✅");
      form.reset();
      router.refresh();
      router.push("/auth");
    },
    onError: (error: any) => {
      if (error && typeof error === 'object' && 'success' in error && !error.success) {
        toast.error(error.error || "Erro ao criar usuário. Tente novamente.");
      } else {
        toast.error("Erro ao criar usuário. Verifique a conexão com o servidor.");
      }
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "confirmPassword" && (key !== "bi" || value)) {
        formData.append(key, value);
      }
    });

    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error("Erro na submissão:", error);
    }
  };

  return (
    <div className="w-full max-w-md py-6 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {(
            [
              { name: "name", label: "Nome Completo", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phoneNumber", label: "Telefone", type: "tel" },
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
                        type={
                          name === "password"
                            ? showPassword ? "text" : "password"
                            : name === "confirmPassword"
                              ? showConfirmPassword ? "text" : "password"
                              : type
                        }
                        {...field}
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
                          {(
                            (name === "password" && showPassword) ||
                            (name === "confirmPassword" && showConfirmPassword)
                          ) ? <EyeOff size={18} /> : <Eye size={18} />}
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
              {mutation.isPending ? "Salvando..." : "Criar Conta"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
