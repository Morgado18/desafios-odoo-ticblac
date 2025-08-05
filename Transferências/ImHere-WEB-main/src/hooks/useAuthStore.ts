
import { User } from "@/actions/users";
import { deleteToken } from "@/utils/token";
import { redirect } from "next/navigation";
import { create } from "zustand";
import { persist } from "zustand/middleware";



interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (data: { user: User; token: string }) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: ({ user, token }) => {
        set({ user: user, token, isAuthenticated: true });
      },

      logout: async () => {
        await deleteToken()
        set({ user: null, token: null, isAuthenticated: false })
        redirect('/auth')
      },

      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        })),
    }),
    {
      name: "auth-storage",
    }
  )
);
