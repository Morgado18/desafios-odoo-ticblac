
import axios from "../../utils/axios";

import { setToken, getToken } from "./TokenService";

import axiosAuth from "../../utils/axiosAuth";

// ============= Authentication ============= //

/*
  interface LoginResponse {
    access_token: string;
    token_type: string;
    user: any;
  }
*/

// Login
export async function login(credentials: {email:String, password: string}) {
  console.log("ok")
  const { data } = await axiosAuth.post("/login", credentials);
  await setToken(data.access_token);
  return data;
  console.log(data)
} 

// Logout
export async function logout() {
  try {
      const token = await getToken();
      if (token) {
          await axios.post(
              "/logout",
              {},
              {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              }
          );
      }
      console.log("Sessão terminada com sucesso!");
      await setToken(null);
  } catch (error) {
      console.log("Erro durante logout:", error);
      throw error;
  }
}

// Register
export const register = async (data) => {
  try {
    const response = await axiosAuth.post(`/register`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


