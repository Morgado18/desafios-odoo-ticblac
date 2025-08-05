'use server';
import { api } from "@/lib/axios";
import { setToken } from "@/utils/token";
import type { User } from "./users";


export type UserCredential = {
  // email: string,
  phoneNumber: string
  password: string
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export async function login(formData: FormData): Promise<LoginResponse> {
  const prefix = "+244"
  try {
    const { data } = await api.post('/login', {
      phoneNumber: `${prefix}${formData.get("phoneNumber") as string}`,
      password: formData.get("password") as string,

    });
    await setToken(data.token)
    return data;

  } catch (error) {
    console.log('[erro]:', error)
    throw new Error("Erro ao criar usuário");
  }
}
