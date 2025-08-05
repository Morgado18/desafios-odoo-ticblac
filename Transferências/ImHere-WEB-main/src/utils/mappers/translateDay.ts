import { DAY_OF_WEEK } from "@/actions/appointments";

const dayTranslations: Record<DAY_OF_WEEK, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo"
};

export function translateDay(day: DAY_OF_WEEK): string {
  return dayTranslations[day];
}
