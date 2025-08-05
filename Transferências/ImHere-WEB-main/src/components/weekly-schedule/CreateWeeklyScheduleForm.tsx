"use client";

import { getUser } from "@/actions/users";
import { createWeeklySchedule, WeeklyScheduleCreate } from "@/actions/weekly-schedule";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { translateDay } from "@/utils/mappers/translateDay";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const weeklyScheduleSchema = z.object({
  schedules: z.array(
    z.object({
      dayOfWeek: z.enum(["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]),
      startTime: z.coerce.number().min(0).max(23, "Hora inválida"),
      endTime: z.coerce.number().min(0).max(23, "Hora inválida"),
      interval: z.coerce.number().min(1, "Intervalo obrigatório"),
      dailyWorkingHours: z.coerce.number().min(1, "Horas de trabalho obrigatórias"),
      status: z.boolean(),
    })
  ),
});

type WeeklyScheduleFormData = z.infer<typeof weeklyScheduleSchema>;

export function CreateWeeklyScheduleForm() {

  const router = useRouter();

  const { user } = useAuth()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUser(user?.id!),
    enabled: !!user,
  });

  const form = useForm<WeeklyScheduleFormData>({
    resolver: zodResolver(weeklyScheduleSchema),
    defaultValues: {
      schedules: [{ dayOfWeek: "MONDAY", startTime: 9, endTime: 17, interval: 1, dailyWorkingHours: 8, status: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({ name: "schedules", control: form.control });



  const mutation = useMutation({
    mutationFn: async (data: WeeklyScheduleFormData) => createWeeklySchedule(data.schedules as WeeklyScheduleCreate[]),
    onSuccess: () => {
      toast.success("Horário criado com sucesso! ✅");
      router.push("/you");
    },
    onError: () => {
      toast.error("Erro ao criar horário ❌");
    },
  });

  const onSubmit = (data: WeeklyScheduleFormData) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Criando horários...",
      success: "Horário criado com sucesso! ✅",
      error: "Erro ao criar horário ❌",
    });
  };

  const daysOfWeek = [
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"
  ] as const;
  const savedDays = data?.weeklySchedule?.map(s => s.dayOfWeek) || [];
  const selectedDays = fields.map((field) => field.dayOfWeek);
  const usedDays = [...new Set([...savedDays, ...selectedDays])];


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto">
        {fields.map((field, index) => (
          <Card key={field.id} className="p-4 relative">
            <CardContent className="space-y-3">
              <FormField name={`schedules.${index}.dayOfWeek`} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia da Semana</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value as WeeklyScheduleCreate["dayOfWeek"])}
                    value={field.value}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione um dia" /></SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (

                        <SelectItem key={day} value={day} disabled={usedDays.includes(day)}>
                          {translateDay(day)}
                        </SelectItem>

                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-2">
                <FormField name={`schedules.${index}.startTime`} control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Início</FormLabel>
                    <Input type="number" {...field} min={0} max={23} />
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name={`schedules.${index}.endTime`} control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Término</FormLabel>
                    <Input type="number" {...field} min={0} max={23} />
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <FormField name={`schedules.${index}.interval`} control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intervalo (hora)</FormLabel>
                    <Input type="number" {...field} min={1} />
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name={`schedules.${index}.dailyWorkingHours`} control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horas de Trabalho</FormLabel>
                    <Input type="number" {...field} min={1} max={24} />
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {fields.length > 1 && (
                <Button variant="destructive" size="sm" onClick={() => remove(index)} className="absolute top-2 right-2">
                  <Trash size={16} />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          onClick={() => {
            const availableDays = daysOfWeek.filter(day => !usedDays.includes(day));

            if (availableDays.length === 0) {
              toast.warning("Todos os dias já foram adicionados.");
              return;
            }

            append({
              dayOfWeek: availableDays[0],
              startTime: 9,
              endTime: 17,
              interval: 1,
              dailyWorkingHours: 8,
              status: true,
            });
          }}
          variant="outline"
          className="w-full"
        >
          <Plus className="mr-2" size={16} /> Adicionar Novo Dia
        </Button>


        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Criando..." : "Criar Horário"}
        </Button>
      </form>
    </Form>
  );
}
