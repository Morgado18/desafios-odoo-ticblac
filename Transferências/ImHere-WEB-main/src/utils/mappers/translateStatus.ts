type STATUS = "PENDING" | "CONFIRMED" | "CANCELED" | "FINISHED";

const statusTranslations: Record<STATUS, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELED: "Cancelado",
  FINISHED: "Finalizado",
};

export function translateStatus(status: STATUS): string {
  return statusTranslations[status];
}
