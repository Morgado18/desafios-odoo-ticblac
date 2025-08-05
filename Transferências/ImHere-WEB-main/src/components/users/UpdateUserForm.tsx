'use client';

import { updateUser as updateUserAction, type User } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um e-mail válido"),
  phoneNumber: z.string().regex(/^\+\d{8,15}$/, "O telefone deve começar com '+' seguido do código do país e números"),
  bi: z.string().regex(/^\d{9}\w{2}\d{3}$/, "O BI deve seguir o formato correto, ex: 001234AC567"),
  // address: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
  role: z.enum(["CLIENT", "ADMIN", "PROFISSIONAL", "COMPANY"]),
  status: z.boolean(),
}).partial();

type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;

export function UpdateUserForm({ user }: Readonly<{ user: User }>) {
  const router = useRouter();
  const { user: userAuth, updateUser: updateAuthUser } = useAuth();

  const form = useForm<UpdateUserSchemaType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const isFormDirty = form.formState.isDirty;

  const mutation = useMutation({
    mutationFn: async (data: Partial<User>) => updateUserAction(user.id, data),
    onSuccess: async (_, data) => {
      toast.success("Usuário atualizado com sucesso!");

      updateAuthUser?.({ ...user, ...data });
      if (userAuth?.role === 'ADMIN') {
        router.push("/my-profile");

      }

      router.push("/you");
    },
    onError: () => {
      toast.error("Erro ao atualizar usuário. Tente novamente.");
    },
  });

  return (
    <div className="w-full h-full p-6 rounded-lg">
      <h1 className="text-xl font-bold mb-4 text-center">Atualizar Usuário</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input {...field} type="email" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="phoneNumber" render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl><Input {...field} type="tel" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="bi" render={({ field }) => (
            <FormItem>
              <FormLabel>Número do BI</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />


          {/* <FormField control={form.control} name="address" render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} /> */}


          {userAuth?.role === "ADMIN" && (
            <div>
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Papel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Selecione um papel" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENT">Cliente</SelectItem>
                      <SelectItem value="PROFISSIONAL">Profissional</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                      <SelectItem value="COMPANY">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />


              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={(field.value ?? true).toString()}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Ativo</SelectItem>
                      <SelectItem value="false">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          )}

          <Button type="submit" disabled={!isFormDirty || mutation.isPending} className="w-full">
            {mutation.isPending ? "Atualizando..." : "Atualizar Usuário"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
