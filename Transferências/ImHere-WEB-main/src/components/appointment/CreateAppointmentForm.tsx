"use client";

import {
  createAppointment,
  CreateAppointment,
  DAY_OF_WEEK,
} from "@/actions/appointments";
import { getUser } from "@/actions/users";
import { capitalizeEachWord } from "@/utils/capitalizeEachWord";
import { translateDay } from "@/utils/mappers/translateDay";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";

type Service = {
  id: string;
  name: string;
  subServices: { id: string; name: string }[];
};

export function CreateAppointmentForm({
  id,
  professionId,
}: Readonly<{ id: string; professionId?: string }>) {
  const [selectedDay, setSelectedDay] = useState<DAY_OF_WEEK | "">("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedSubServices, setSelectedSubServices] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });

  const services = useMemo(() => {
    if (data?.professionalService) {
      return data.professionalService.map((ps) => ps.service);
    }
    return [];
  }, [data]);

  const filteredServices = professionId
    ? services.filter((s) => s.id === professionId)
    : services;

  useEffect(() => {
    if (professionId && services.length > 0) {
      setSelectedService(professionId);
    }
  }, [professionId, services]);

  const daysOfWeek: DAY_OF_WEEK[] = data?.weeklySchedule
    ? [...new Set(data.weeklySchedule.map((schedule) => schedule.dayOfWeek as DAY_OF_WEEK))]
    : [];

  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    setSelectedSubServices([]);
  };

  const handleSubServiceChange = (subServiceId: string) => {
    setSelectedSubServices((prev) =>
      prev.includes(subServiceId)
        ? prev.filter((id) => id !== subServiceId)
        : [...prev, subServiceId]
    );
  };

  const selectedServiceData = filteredServices.find((s) => s.id === selectedService);
  const subServices = selectedServiceData ? selectedServiceData.subServices : [];

  const mutation = useMutation({
    mutationFn: async (appointmentData: CreateAppointment) => {
      const formData = new FormData();
      formData.append("professionalId", appointmentData.profissionalId);
      formData.append("dayOfWeek", appointmentData.dayOfWeek);
      formData.append("localAppointment", appointmentData.localAppointment);
      formData.append("professionId", appointmentData.professionId);

      if (appointmentData.subServiceId) {
        appointmentData.subServiceId.forEach((subServiceId) =>
          formData.append("subServiceId", subServiceId)
        );
      }

      return await createAppointment(formData);
    },
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso!");
      setSelectedDay("");
      setSelectedService(professionId ?? "");
      setSelectedSubServices([]);
      setLocation("");
    },
    onError: () => {
      toast.error("Erro ao criar agendamento.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDay || !selectedService || !location) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const appointmentData: CreateAppointment = {
      profissionalId: data?.id!,
      dayOfWeek: selectedDay,
      localAppointment: location,
      professionId: selectedService,
      subServiceId: selectedSubServices.length ? selectedSubServices : undefined,
    };

    mutation.mutate(appointmentData);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-1/2" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">


      <Select
        value={selectedService}
        onValueChange={handleServiceChange}
        disabled={!!professionId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma profissão" />
        </SelectTrigger>
        <SelectContent>
          {filteredServices.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              <span className="text-black">
                {capitalizeEachWord(service.name)}

              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {subServices.map((subService) => (
        <div key={subService.id} className="flex items-center space-x-2">
          <Checkbox
            id={subService.id}
            checked={selectedSubServices.includes(subService.id)}
            onCheckedChange={() => handleSubServiceChange(subService.id)}
          />
          <label
            htmlFor={subService.id}
            className="text-sm font-medium leading-none"
          >
            {subService.name}
          </label>
        </div>
      ))}


      <Select
        value={selectedDay}
        onValueChange={(value) => setSelectedDay(value as DAY_OF_WEEK)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um dia da semana" />
        </SelectTrigger>
        <SelectContent>
          {daysOfWeek.map((day) => (
            <SelectItem key={day} value={day}>
              {translateDay(day)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>


      <Input
        type="text"
        placeholder="Digite o local do agendamento"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Agendando..." : "Criar Agendamento"}
      </Button>
    </form>
  );
}
