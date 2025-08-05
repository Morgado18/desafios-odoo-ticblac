import { getToken } from "@/utils/token";
import axios from "axios";
const baseURL = process.env.API_URL
export const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

async function attachAuthToken(config: any) {
  const ignoredRoutes = ["/", "/auth"];
  const urlPath = new URL(config.baseURL + config.url).pathname;
  if (ignoredRoutes.includes(urlPath)) {
    console.log(`[Axios] Interceptor ignorado para rota: ${urlPath}`);
    return config;
  }

  try {

    const token = await getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("[Axios] Nenhum token encontrado, requisição pode falhar com 401!");
    }
  } catch (error) {
    console.error("[Axios] Erro ao recuperar o token:", error);
  }

  return config;
}

api.interceptors.request.use(
  async (config) => await attachAuthToken(config),
  (error) => Promise.reject(error instanceof Error ? error : new Error(String(error)))
);
