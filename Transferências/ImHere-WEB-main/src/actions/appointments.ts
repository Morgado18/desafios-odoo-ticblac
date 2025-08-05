"use server";

import { api } from "@/lib/axios";
import { supabase } from '@/lib/supabase';
import { createNotification } from "./notifications";
import { ROLE } from "./users";



export type DAY_OF_WEEK = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export type APPOINTMENT_STATUS = "PENDING" | "CONFIRMED" | "CANCELED" | "FINISHED"

export type Appointment = {
  id: string;
  userId: string;
  profissionalId: string;
  professionId: string;
  dayOfWeek: DAY_OF_WEEK;
  startTime: number;
  endTime: number;
  localAppointment: string;
  status: APPOINTMENT_STATUS;
  subServiceId?: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  profissional?: {
    id: string;
    name: string;
  };
  client?: {
    id: string;
    name: string;
  };
  subService?: string[];
  profession?: string;
};


export type CreateAppointment = Omit<
  Appointment,
  "id" | "createdAt" | "userId" | "updatedAt" | "deletedAt" | "status" | "startTime" | "endTime"
>;


export async function createAppointment(formData: FormData) {

  const formDataObj: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    if (key === "subServiceId") {
      if (!formDataObj[key]) {
        formDataObj[key] = [];
      }
      formDataObj[key].push(value);
    } else {
      formDataObj[key] = value;
    }
  }

  if (!formDataObj.subServiceId) {
    formDataObj.subServiceId = [];
  }

  console.log("payload enviado:", formDataObj);

  try {
    const { data } = await api.post("/appointment", formDataObj);

    const datano = await createNotification({
      destinationId: data.userId,
      reciverId: data.profissionalId,
      message: "Tem uma nova solicitação de serviço!",
    });

    return { success: true, data };
  } catch (error) {
    console.error("[Erro ao criar agendamento]:", error);
    throw new Error("Erro ao criar agendamentos");
  }
}


export async function getAppointments(): Promise<Appointment[]> {
  try {
    const { data } = await api.get<Appointment[]>("/appointment");
    return data;
  } catch (error) {
    console.error("[Erro ao listar agendamentos]", error);
    throw new Error("Erro ao listar agendamentos");
  }
}



export async function getAppointment(id: string): Promise<Appointment | null> {
  try {
    const { data } = await api.get<Appointment>(`/appointment/${id}`);
    return data;
  } catch (error) {
    console.error("[Erro ao obter agendamento]", error);
    throw new Error("Erro ao obter agendamento");
  }
}



export async function updateAppointment(id: string, data: Partial<CreateAppointment>): Promise<Appointment | null> {
  try {
    const response = await api.put<Appointment>(`/appointment/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("[Erro ao atualizar agendamento]", error);
    return null;
  }
}

export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    await api.delete(`/appointment/${id}`);
    return true;
  } catch (error) {
    console.error("[Erro ao deletar agendamento]", error);
    return false;
  }
}




export async function updateAppointmentStatus(id: string, status: APPOINTMENT_STATUS) {
  try {
    if (status !== "CANCELED" && status !== "FINISHED") {
      throw new Error("Status inválido. Apenas 'CANCELED' ou 'FINISHED' são permitidos.");
    }

    const { data: appointment } = await api.put(`/appointment/${id}`, {
      status,
    });
    return appointment;
  } catch (error) {
    console.error("[Erro ao atualizar status do agendamento]", error);
    throw new Error("Erro ao atualizar status do agendamento.");
  }
}



export async function confirmAppointment(id: string) {
  try {

    const { data: appointment } = await api.put(`/appointment/${id}`, {
      status: 'CONFIRMED',
    });

    console.log('[updateAppointment]: ', appointment);

    const { data: chat, error } = await supabase
      .from('chats')
      .insert([
        {
          id: appointment.id,
          appointmentId: appointment.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[Erro ao criar chat no Supabase]:', error);
    } else {
      console.log('[Chat criado]:', chat);
    }

    return appointment;
  } catch (error) {
    console.error('[Erro ao confirmar agendamento]', error);
    ;
  }
}
;

export async function getAppointmentsByRole(role: ROLE, id: string): Promise<Appointment[]> {
  try {
    const roleKeyMap: Record<ROLE, string> = {
      CLIENT: "clientId",
      PROFISSIONAL: "professionalId",
      COMPANY: "companyId",
      ADMIN: "adminId"
    };

    const body = {
      [roleKeyMap[role]]: id,
    };

    const { data } = await api.post<Appointment[]>(`/appointment/user/`, body);

    console.log("logs: ", data)
    return data;
  } catch (error) {
    console.error("[Erro ao obter agendamentos]", error);
    throw new Error("Erro ao obter agendamentos");
  }
}
