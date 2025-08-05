"use client";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  reciverId: string;
  destinationId: string;
  createdAt: string;
};

type NotificationContextType = {
  notifications: Notification[];
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
});

export function NotificationProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    console.log("👤 Iniciando escuta de notificações para:", user.id);

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "pushNotification",
          filter: `reciverId=eq.${user.id}`,
        },
        async (payload) => {
          const notification = payload.new as Notification;

          console.log("🔔 Notificação recebida:", notification);

          if (!notification.read) {
            toast(notification.title, {
              description: notification.message,
            });

            console.log("✅ Toast disparado");

            // Marca como lida no Supabase
            const { error } = await supabase
              .from("pushNotification")
              .update({ read: true })
              .eq("id", notification.id);

            if (error) {
              console.error("❌ Erro ao marcar como lida:", error.message);
            } else {
              console.log("📦 Notificação marcada como lida.");
            }

            setNotifications((prev) => [notification, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      console.log("🔌 Cancelando escuta de notificações.");
      channel.unsubscribe();
    };
  }, [user?.id]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
