import React, { createContext, useContext, useState, useEffect } from "react";
import { login, logout } from "../services/auth/authentication";
import { getToken, setToken } from "../services/auth/TokenService";

interface User {
  id: string;
  name: string;
  email: string;
  access_level_id: number;
  [key: string]: any;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          const response = await fetchUserData(token);
          setUser(response.profile_data);
        }
      } catch (error) {
        console.log("Erro ao inicializar autenticação:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Função para buscar os dados do usuário (usando o endpoint /profile)
  const fetchUserData = async (token: string) => {
    const axios = require("../utils/axios").default;
    const response = await axios.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

   /*  const getHomeData = async (token: string) => {
        try {
            const axios = require("../utils/axios").default;
            const response = await axios.get("/home", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.log('Error loading home data:', error);
            throw error;
        }
    }; */
  

  // Função de login
  /* const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    try {
      // Faz a requisição de login
     //await login({ email, password });
     const response = await login({ email, password });

      // Obtém o token recém-salvo
      //const token = await getToken();
      //console.log("Resposta do login:", response);

        // Obtém o token recém-salvo
        const token = await getToken();
        //console.log("Token após login:", token);
      //console.log('AuthContext:'+token);
      if (!token) {
        throw new Error("Token não foi salvo corretamente");
      }
 
      // Busca os dados do usuário
      const userData = await fetchUserData(token);
      //console.log(userData);
      setUser(userData.profile_data);

      // Se "Lembrar-me" não estiver marcado, limpar o token ao fechar o app
      if (!rememberMe) {
      //  console.log("Não existe remember token")
        // Implementar uma lógica para limpar o token ao fechar o app
        // Por enquanto, o token já está salvo no SecureStore
      }
    } catch (error: any) {
      console.log("Erro durante o login:", error);
      throw new Error(error);
    }
  }; */

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    try {
      // Faz a requisição de login
      const response = await login({ email, password });

      // Obtém o token recém-salvo
      const token = await getToken();
      if (!token) {
        throw new Error("Token não foi salvo corretamente");
      }

      // Busca os dados do usuário
      const userData = await fetchUserData(token);
      setUser(userData.profile_data);

      // Se "Lembrar-me" não estiver marcado, limpar o token ao fechar o app
      if (!rememberMe) {
        // Implementar uma lógica para limpar o token ao fechar o app
        // Por enquanto, o token já está salvo no SecureStore
      }
    } catch (error: any) {
      console.log("Erro durante o login:", error.response?.data || error.message);
      
      // Extrair a mensagem de erro do backend, se disponível
      const errorMessage = error.response?.data?.message || error.message || "Erro ao fazer login. Tente novamente.";
      throw new Error(errorMessage);
    }
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      await setToken(null);
    } catch (error) {
      console.error("Erro durante o logout:", error);
      throw error;
    }
  };

  console.log('I m here')

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login: handleLogin,
        logout: handleLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);