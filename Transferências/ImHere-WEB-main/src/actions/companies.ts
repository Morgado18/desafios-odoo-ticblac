"use server";

import { api } from "@/lib/axios";
import { redirect } from "next/navigation";
import { CreateUser } from "./users";

export type Company = {
  id: string;
  nif: string;
  userId: string;
  description: string;
  ownerName: string;
  numberOfEmployer: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreateCompany = {
  user: CreateUser
  company: Omit<Company, "id" | "userId" | "createdAt" | "updatedAt" | "deletedAt">;
};


export async function createCompany(formData: FormData) {
  console.log("data", formData)
  try {

    const companyData: CreateCompany = {
      user: {
        name: formData.get("name") as string,
        phoneNumber: formData.get("phoneNumber") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        // bi: formData.get("bi") as string,
        photo: formData.get("photo") as string | undefined,
        role: formData.get("role") as "CLIENT" | "PROFISSIONAL" | "ADMIN" | "COMPANY",
      },
      company: {
        nif: formData.get("nif") as string,
        description: formData.get("description") as string,
        ownerName: formData.get("ownerName") as string,
        numberOfEmployer: formData.get("numberOfEmployer") as string,
      },
    };


    const { data } = await api.post("/company", companyData);

    return { success: true, data };
  } catch (error) {
    console.error("[Erro ao criar empresa]:", error);
    throw new Error("Erro ao criar empresa");
  }
}


export async function getCompany(id: string): Promise<Company | null> {
  try {
    const { data } = await api.get<Company>(`/company/${id}`);

    return data;
  } catch (error) {
    console.error("[Erro ao obter empresa]:", error);
    return null;
  }
}


export async function updateCompany(id: string, data: Partial<Company>): Promise<Company | null> {
  try {
    const response = await api.put<Company>(`/company/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("[Erro ao atualizar empresa]:", error);
    return null;
  }
}


export async function deleteCompany(id: string): Promise<boolean> {
  try {
    await api.delete(`/company/${id}`);
    redirect("/companies");
    return true;
  } catch (error) {
    console.error("[Erro ao deletar empresa]:", error);
    return false;
  }
}


export async function getCompanies(): Promise<Company[]> {
  try {
    const { data } = await api.get<Company[]>("/company");
    return data;
  } catch (error) {
    console.error("[Erro ao listar empresas]:", error);
    throw new Error("Erro ao listar empresas");
  }
}
