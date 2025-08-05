import { Badge } from "@/components/ui/badge";
import { translateStatus } from "@/utils/mappers/translateStatus";

export function StatusBadge({ status }: { status: string }) {
  const statusColorMap: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELED: "bg-red-100 text-red-800",
    FINISHED: "bg-blue-100 text-blue-800",
  };

  return (
    <Badge
      className={`
        ${statusColorMap[status] || "bg-gray-100 text-gray-800"}
        hover:bg-transparent hover:text-inherit
        pointer-events-none
      `}
    >
      {translateStatus(status as any)}
    </Badge>
  );
}
