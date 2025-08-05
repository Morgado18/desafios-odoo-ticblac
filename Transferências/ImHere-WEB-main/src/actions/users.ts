"use server"
import { api } from "@/lib/axios";
import { redirect } from "next/navigation";
import { WeeklySchedule } from "./weekly-schedule";

interface SubService {
  id: string;
  name: string;
  description: string | null;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  subServices: SubService[];
}

interface ProfessionalService {
  service: Service;
}


export type ROLE = "CLIENT" | "PROFISSIONAL" | "ADMIN" | "COMPANY";

export type User = {
  id: string;
  name: string;
  phoneNumber: string;
  bi?: string;
  email: string;
  password: string;
  photo?: string;
  status: boolean;
  role: ROLE;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  weeklySchedule?: WeeklySchedule[],
  professionalService?: ProfessionalService[]

};

export type CreateUser = Omit<User, "id" | "status" | "createdAt" | "updatedAt" | "deletedAt">

export async function createUser(formData: FormData) {
  try {
    const role = formData.get("role") as ROLE;

    const userData: Record<string, any> = {
      name: formData.get("name") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      photo: "imagem.png",
      role,
    };

    const bi = formData.get("bi") as string;
    if (role === "PROFISSIONAL" && bi) {
      userData.bi = bi.toUpperCase();
    }

    const { data } = await api.post("/user", userData);
    return data;
  } catch (error: any) {
    console.error("[Erro ao criar usuário]:", error);
    throw error.response?.data?.message || error.message || "Erro desconhecido ao criar usuário";
  }
}


export async function getUser(id: string): Promise<User | null> {
  try {
    const { data } = await api.get<User>(`/user/${id}`);
    console.log('[getUsers]:', JSON.stringify(data, null, 2))
    return data;

  } catch (error) {
    console.error("[erro]:", error);
    throw new Error("Erro ao listar usuário");
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const { data } = await api.delete(`/user/${id}`);
    console.log('[getUsers]:', JSON.stringify(data, null, 2));
    redirect("/users")
  } catch (error) {
    console.error("[erro]:", error);
    return false;
  }
}



export async function getUsers(): Promise<User[]> {
  try {
    const { data } = await api.get<User[]>('/user');
    console.log('[getUsers]:', data);
    return data;

  } catch (error) {
    console.log('[erro]:', error);
    throw new Error("Erro ao listar usuário");
  }
}


export async function getBestRated() {
  try {
    const { data } = await api.get('/best-rated')
    console.log('[getBestRated]:', data);
    return data

  } catch (error) {
    console.log('[erro]:', error)
    throw new Error("Erro ao listar usuário");

  }
}


export async function filterByProfessionId(id: string) {
  console.log("id", id)
  try {
    const { data } = await api.get(`filter/${id}`)
    console.log("filtros", data.professionalService)

    return data

  } catch (error) {

  }
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  console.log("dada", id)
  console.log("dada", data)

  try {
    const response = await api.put<User>(`/user/${id}`, data);
    console.log('[createUser]:', response.data)
    redirect(`users${id}`)
    // return response.data;
  } catch (error) {
    console.error("[Erro ao atualizar usuário]:", error);
    return null;
  }
}
