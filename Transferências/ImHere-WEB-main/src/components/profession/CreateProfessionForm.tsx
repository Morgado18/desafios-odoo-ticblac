"use client";

import { createProfession } from "@/actions/professions";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createProfessionSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres").nullable().optional(),
  services: z
    .array(
      z.object({
        name: z.string().min(3, "O nome do serviço deve ter pelo menos 3 caracteres"),
        description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
      })
    )
    .optional(),
});

export type CreateProfessionFixed = {
  name: string;
  description?: string | null;
  services?: { name: string; description: string }[];
};
type CreateProfessionFormProps = {
  onSuccess?: () => void;
};

export function CreateProfessionForm({ onSuccess }: Readonly<CreateProfessionFormProps>) {
  const router = useRouter();

  const form = useForm<CreateProfessionFixed>({
    resolver: zodResolver(createProfessionSchema),
    defaultValues: {
      name: "",
      description: "",
      services: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateProfessionFixed) => createProfession({ ...data }),
    onSuccess: () => {
      toast.success("Profissão criada com sucesso! ✅");
      router.push("/professions");
    },
    onError: (error) => {
      toast.error("Erro ao criar profissão ❌");
      console.error("Erro ao criar profissão:", error);
    },
  });

  const onSubmit = async (data: CreateProfessionFixed) => {
    toast.promise(
      mutation.mutateAsync({ ...data }).then(() => {
        onSuccess?.();
      }),
      {
        loading: "Criando profissão...",
        success: "Profissão criada com sucesso! ✅",
        error: "Erro ao criar profissão ❌",
      }
    );
  };

  return (
    <ScrollArea className="h-[80vh] w-full max-w-md p-6 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Campos principais */}
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
                    <Input type={type} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {/* Campos dinâmicos para adicionar serviços */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Serviços (opcional)</h3>
              <Button type="button" onClick={() => append({ name: "", description: "" })}>
                + Adicionar Serviço
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg mt-2 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => remove(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <FormField
                  control={form.control}
                  name={`services.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Serviço</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`services.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Serviço</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <div className="pt-6">
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Criando..." : "Criar Profissão"}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
