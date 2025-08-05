"use server"
import { api } from "@/lib/axios";
import { redirect } from "next/navigation";

export type Profession = {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  avatar?: string
  subServices?: Service[];
};

export type Service = {
  id: string;
  name: string;
  description: string;
  serviceId?: string;
};

export type CreateService = Omit<Service, "id">;

export type CreateProfession = {
  name: string;
  description?: string | null;
  services?: CreateService[];
};

export async function createProfession(professionData: CreateProfession) {
  const transformedData = {
    profession: {
      name: professionData.name,
      description: professionData.description,
    },
    services: professionData.services?.map((service) => ({
      name: service.name,
      description: service.description,
    })),
  };

  try {
    const { data } = await api.post("/profession", transformedData);

    return { success: true, data };
  } catch (error: any) {
    console.error("[Erro ao criar profissão]:", error);
    return { success: false, error: error.response?.data?.message ?? "Erro desconhecido" };
  }
}
export async function getProfessions() {
  try {
    const { data } = await api.get("/profession");
    console.log("profs", data)
    return data;
  } catch (error) {
    console.error("[Erro ao listar profissões]:", error);
    throw new Error("Erro ao listar profissões");
  }
}

export async function getProfessionById(id: string): Promise<Profession | null> {
  try {
    const { data } = await api.get<Profession>(`/profession/${id}`);

    return data;
  } catch (error) {
    console.error("[Erro ao buscar profissão]:", error);
    return null;
  }
}

export async function updateProfession(id: string, professionData: Partial<Profession>): Promise<Profession | null> {
  try {
    const { data } = await api.put<Profession>(`/profession/${id}`, professionData);

    return data;
  } catch (error) {
    console.error("[Erro ao atualizar profissão]:", error);
    return null;
  }
}

export async function deleteProfession(id: string): Promise<boolean> {
  try {
    await api.delete(`/profession/${id}`);
    redirect("/professions");
    return true;
  } catch (error) {
    console.error("[Erro ao deletar profissão]:", error);
    return false;
  }
}


export async function createService(serviceData: CreateService) {
  try {
    const { data } = await api.post("/profession/service", serviceData);
    return { success: true, data };
  } catch (error: any) {
    console.error("[Erro ao criar serviço]:", error);
    return { success: false, error: error.response?.data?.message ?? "Erro desconhecido" };
  }
}

export async function associateUserToProfession(data: { professionId: string; serviceId?: string[] }) {
  console.log("data", data)

  try {
    const response = await api.post("/profession/associate", data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("[Erro ao associar usuário à profissão]:", error);
    return { success: false, error: error.response?.data?.message ?? "Erro desconhecido" };
  }
}

export async function disassociateUserFromProfession(professionId: string) {
  console.log("desassociete", professionId)

  try {


    const response = await api.post("/profession/desassociate", {
      professionId: professionId
    });
    console.log("response", response.data)
    console.log("response full", response)
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("[Erro ao associar usuário à profissão]:", error);
    return { success: false, error: error.response?.data?.message ?? "Erro desconhecido" };
  }
}
