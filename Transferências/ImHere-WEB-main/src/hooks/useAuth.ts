"use client"
import { useAuthStore } from "./useAuthStore";

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore();
  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };
};
