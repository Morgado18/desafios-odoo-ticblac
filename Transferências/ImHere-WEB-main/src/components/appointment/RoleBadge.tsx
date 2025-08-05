import { Badge } from "@/components/ui/badge"

const roleColors = {
  ADMIN: "bg-red-500 text-white",
  PROFISSIONAL: "bg-yellow-500 text-black",
  CLIENT: "bg-green-500 text-white",
}

export const RoleBadge = ({ role }: { role: "ADMIN" | "PROFISSIONAL" | "CLIENT" }) => {
  return (
    <Badge className={`${roleColors[role]}  px-2 hover:bg-muted-foreground`}>
      {role}
    </Badge>
  )
}
