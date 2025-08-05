import type { ROLE } from "@/actions/users";
import { Badge } from "@/components/ui/badge";
import { translateRole } from "@/utils/mappers/translateRole";

const roleColorMap: Record<ROLE, string> = {
  ADMIN: "bg-red-100 text-red-800",
  PROFISSIONAL: "bg-yellow-100 text-yellow-800",
  CLIENT: "bg-green-100 text-green-800",
  COMPANY: "bg-gray-100 text-gray-800",
};

export function RoleBadge({ role }: { role: ROLE }) {
  return (
    <Badge
      className={`
        ${roleColorMap[role] || "bg-gray-100 text-gray-800"}
        hover:bg-transparent hover:text-inherit
        pointer-events-none
      `}
    >
      {translateRole(role)}
    </Badge>
  );
}
