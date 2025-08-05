"use client";

import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const loginSchema = z.object({
  phoneNumber: z.string().min(9, "O número de telefone deve ter pelo menos 9 dígitos"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login: setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: LoginFormValues) => {
      const form = new FormData();
      form.append("phoneNumber", formData.phoneNumber);
      form.append("password", formData.password);
      return login(form);
    },
    onSuccess: (data) => {
      setAuth({ user: data.user, token: data.token });
      toast.success("Login realizado com sucesso!", {
        description: "Você será redirecionado para o dashboard.",
      });
      const role = data.user.role;

      if (role === "ADMIN") {
        router.push("/dashboard");
      } else if (role === "CLIENT") {
        router.push("/service-providers");
      } else {
        router.push("/my-appointments");
      }
    },
    onError: () => {
      toast.error("Erro ao fazer login", {
        description: "Verifique suas credenciais e tente novamente.",
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md py-6 rounded-lg">

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Telefone</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Digite seu número" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? "Entrando..." : "Entrar"}
          </Button>

          {mutation.isError && (
            <p className="text-red-500 text-center mt-2">
              Erro ao realizar login. Verifique suas credenciais.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
