"use client";

import { updateAppointmentStatus, type Appointment } from "@/actions/appointments";
import { addRating } from "@/actions/rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { ChevronLeft, Menu as MenuIcon, Send, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ChatWindowProps = {
  appointment: Appointment;
  onBack?: () => void;
};

export function ChatWindow({ onBack, appointment }: ChatWindowProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const receiverId =
    user?.role === "CLIENT" ? appointment.client?.id : appointment.profissional?.id;

  const isProfessional = user?.role === "PROFISSIONAL" || user?.role === "COMPANY";
  useEffect(() => {
    if (!appointment) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("chatMessage")
        .select("*")
        .eq("chatId", appointment.id)
        .order("createdAt", { ascending: true });
      console.log('mensagens carregadas', data);

      if (!error) {
        console.log('mensagens carregadas(erro)', error);
        setMessages(data || []);
        if (data?.some((msg) => msg.message.includes("✅ Trabalho finalizado!"))) {
          setAwaitingConfirmation(true);
        }
      }
    };

    loadMessages();

    const subscription = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chatMessage" },
        (payload) => {
          if (payload.new.chatId === appointment.id) {
            setMessages((prev) => [...prev, payload.new]);

            if (payload.new.message.includes("✅ Trabalho finalizado!")) {
              setAwaitingConfirmation(true);
            }
            if (payload.new.message.includes("📝 Confirmação do cliente")) {
              setAwaitingConfirmation(false);
              setShowRatingModal(true);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [appointment]);


  const handleSendMessage = async () => {

    if (!message.trim()) return;
    console.log("payload de envio", {
      // id: crypto.randomUUID(),
      chatId: appointment.id,
      senderId: user?.id,
      receiverId,
      message,
    });

    await supabase.from("chatMessage").insert({
      id: crypto.randomUUID(),
      chatId: appointment.id,
      senderId: user?.id,
      receiverId,
      message,
    });
    setMessage("");
  };

  const sendAutoMessage = async (content: string) => {
    console.log('enviando mensagem automático', content);
    await supabase.from("chatMessage").insert({
      id: crypto.randomUUID(),
      chatId: appointment.id,
      senderId: user?.id,
      receiverId,
      message: content,
    });
  };

  const handleSetPrice = async () => {
    const valor = window.prompt("Digite o valor do serviço:");
    if (!valor) return;
    await sendAutoMessage(`💰 Valor definido: ${valor} Kz`);
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRating({
      clientId: appointment.userId,
      professionalId: appointment.profissionalId!,
      rating,
      comment,
    });
    toast.success("Avaliação enviada com sucesso!");
    await sendAutoMessage("⭐ Cliente avaliou o trabalho.");
    setShowRatingModal(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="md:hidden">
                <ChevronLeft />
              </Button>
            )}
            <CardTitle
              className="flex flex-col">{appointment.profissional?.name} <span
                className="bg-gray-300 text-gray-500 text-xs w-fit px-2 py-1 rounded-md">{appointment.profession}</span></CardTitle>
          </div>

          {isProfessional && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <MenuIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Menu</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 space-y-2">
                <Button variant="outline" className="w-full" onClick={() => sendAutoMessage("📍 Envie detalhes da sua localização")}>📍 Pedir localização</Button>
                <Button variant="outline" className="w-full" onClick={() => sendAutoMessage("🛠️ Envie detalhes do trabalho")}>🛠️ Pedir detalhes do trabalho</Button>
                <Button variant="outline" className="w-full" onClick={() => sendAutoMessage("🔍 Profissional está indo analisar o local")}>🔍 Ver local e analisar</Button>
                <Button variant="outline" className="w-full" onClick={handleSetPrice}>💰 Definir preço</Button>
                <Button variant="outline" className="w-full" onClick={() => sendAutoMessage("🚀 Serviço iniciado!")}>🚀 Iniciar serviço</Button>
                <Button variant="outline" className="w-full" onClick={() => sendAutoMessage("✅ Trabalho finalizado!")}>✅ Finalizar trabalho</Button>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ScrollArea className="h-64 border rounded p-2 space-y-2 bg-muted/50">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              from={msg.senderId === user?.id ? "me" : "other"}
              text={msg.message}
            />
          ))}
        </ScrollArea>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={handleSendMessage}>
            <span className="hidden sm:inline">Enviar</span> <Send className="w-4 h-4" />
          </Button>
        </div>

        {user?.role === "CLIENT" && awaitingConfirmation && (
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              await sendAutoMessage("📝 Confirmação do cliente: Trabalho finalizado com sucesso!");
              await updateAppointmentStatus(appointment.id, "FINISHED");
              setShowRatingModal(true);
            }}
          >
            Confirmar finalização do trabalho
          </Button>
        )}
      </CardContent>

      {user?.role === "CLIENT" && (
        <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
          <DialogContent className="space-y-4">
            <h3 className="text-lg font-semibold">Avalie o profissional</h3>
            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    onClick={() => setRating(n)}
                    className={cn("h-6 w-6 cursor-pointer", {
                      "fill-yellow-400 text-yellow-400": rating >= n,
                      "text-gray-400": rating < n,
                    })}
                  />
                ))}
              </div>
              <select
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Selecione sua avaliação</option>
                <option value="Satisfeito">Satisfeito</option>
                <option value="Insatisfeito">Insatisfeito</option>
              </select>
              <Button type="submit" className="w-full">Enviar avaliação</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

    </Card>
  );
}

function MessageBubble({ from, text }: Readonly<{ from: "me" | "other"; text: string }>) {
  const isMe = from === "me";
  return (
    <div className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${isMe ? "bg-primary/80 text-white" : "bg-gray-300 text-foreground"}`}>
        {text}
      </div>
    </div>
  );
}
