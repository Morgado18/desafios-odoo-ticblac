'use server'
import { api } from "@/lib/axios";
export type MixedData = {
  totalUsers: number;
  totalProfessional: number;
  totalClients: number;
  totalProfessions: number;
  activeUsers: number;
  inactiveUsers: number;
  totalAppointments: number;
  totalCompanies: number;
};


export async function getMixedData() {
  try {
    const { data } = await api.get<MixedData>('user/admin/mixed-data')
    return data
  } catch (error) {
    console.log('Erro ao carregar mixed data!')

  }
}
