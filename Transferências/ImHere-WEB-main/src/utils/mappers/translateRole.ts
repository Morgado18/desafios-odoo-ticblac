import { ROLE } from "@/actions/users";

export function translateRole(role: ROLE): string {
  const roles: Record<ROLE, string> = {
    CLIENT: "Cliente",
    ADMIN: "Administrador",
    PROFISSIONAL: "Profissional",
    COMPANY: "Empresa",
  };

  return roles[role];
}
