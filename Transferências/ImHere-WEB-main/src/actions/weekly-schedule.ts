"use server";
import { api } from "@/lib/axios";

type DAY_OF_WEEK = "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
export type WeeklySchedule = {
  id: string;
  userId: string;
  dayOfWeek: DAY_OF_WEEK,
  status: boolean;
  startTime: number;
  endTime: number;
  interval: number;
  dailyWorkingHours: number;
  createdAt: string;
  updatedAt: string;
};


export type WeeklyScheduleCreate = Omit<WeeklySchedule, "id" | "userId" | "createdAt" | "updatedAt">;


export async function createWeeklySchedule(scheduleData: WeeklyScheduleCreate[]) {
  try {
    const { data } = await api.post("/weekly-schedule", scheduleData);

    return { success: true, data: data };
  } catch (error: any) {
    console.error("[Erro ao criar horário semanal]:", error);
    return { success: false, error: error.response?.data?.message || "Erro desconhecido" };
  }
}


export async function getWeeklySchedules(userId: string): Promise<WeeklySchedule[] | null> {
  try {
    const { data } = await api.get<WeeklySchedule[]>(`/weekly-schedules/${userId}`);
    return data;
  } catch (error) {
    console.error("[Erro ao buscar horários]:", error);
    return null;
  }
}


export async function updateWeeklySchedule(id: string, scheduleData: Partial<WeeklySchedule>) {
  try {
    const { data } = await api.put(`/weekly-schedule/${id}`, scheduleData);
    return { success: true, data };
  } catch (error: any) {
    console.error("[Erro ao atualizar horário semanal]:", error);
    return { success: false, error: error.response?.data?.message || "Erro desconhecido" };
  }
}

export async function deleteWeeklySchedule(id: string): Promise<boolean> {
  try {
    await api.delete(`/weekly-schedule/${id}`);
    return true;
  } catch (error) {
    console.error("[Erro ao remover horário semanal]:", error);
    return false;
  }
}
