'use server';

import { supabase } from "@/lib/supabase";

type CreateNotificationParams = {
  destinationId: string;
  reciverId: string;
  message: string;
};

export async function createNotification({
  destinationId,
  reciverId,
  message,
}: CreateNotificationParams) {
  const { data, error } = await supabase
    .from("pushNotification")
    .insert([
      {
        id: crypto.randomUUID(),
        destinationId,
        reciverId,
        title: "Agendamento",
        message,
        read: false,
      },
    ])
    .select();

  if (error) {
    throw new Error("Erro ao criar notificação: " + error.message);
  }

  return data;
}
