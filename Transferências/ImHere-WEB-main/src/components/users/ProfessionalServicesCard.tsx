"use client";

import { disassociateUserFromProfession } from "@/actions/professions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface SubService {
  id: string;
  name: string;
  description: string | null;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  subServices: SubService[];
}

interface ProfessionalService {
  service: Service;
}

interface Props {
  professionalServices: ProfessionalService[];
}

export function ProfessionalServicesCard({ professionalServices }: Readonly<Props>) {
  const { user } = useAuth()


  const queryClient = useQueryClient();

  const { mutate: removeService, isPending } = useMutation({
    mutationFn: disassociateUserFromProfession,
    onSuccess: () => {
      toast.success("Serviço removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["professional-services"] });
    },
    onError: (error) => {
      toast.error("Erro ao remover serviço.");
      console.error("Erro ao remover serviço:", error);
    },
  });

  return (
    <Card className="min-w-full max-w-4xl mx-auto shadow-lg border border-gray-200">
      <CardHeader className="flex flex-row w-full justify-between">
        <CardTitle className="text-xl font-bold">
          {["COMPANY", "PROFISSIONAL"].includes(user?.role || "")
            ? "Meus Serviços"
            : "Seus Serviços"}
        </CardTitle>


        {["COMPANY", "PROFISSIONAL"].includes(user?.role || "")
          ? (<Link href="/explore-professions">
            <Button className="bg-blue-500/70 text-white hover:bg-blue-700/90 rounded-full text-primary hover:text-white">
              <PlusIcon className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">  Adicionar Profissão</span>
            </Button>
          </Link>)
          : ""}

      </CardHeader>

      <CardContent>
        {professionalServices.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <Accordion type="multiple" className="w-full">
              {professionalServices.map(({ service }) => (
                <AccordionItem key={service.id} value={service.id} className="w-full">
                  <AccordionTrigger className="text-gray-700 w-full">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{service.name}</span>
                      <Badge variant="outline">{service.subServices.length} opções</Badge>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-2 w-full">
                    <p className="text-sm text-gray-600 mb-2">
                      {service.description || "Sem descrição disponível"}
                    </p>
                    <Separator className="my-2" />
                    <ul className="mt-2 space-y-2">
                      {service.subServices.map((sub) => (
                        <li key={sub.id} className="flex flex-col bg-gray-100 rounded-lg p-3 shadow-sm">
                          <span className="font-medium text-gray-800">{sub.name}</span>
                          <span className="text-sm text-gray-600">
                            {sub.description || "Sem descrição"}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Botão de remover após a lista */}
                    {["COMPANY", "PROFISSIONAL"].includes(user?.role ?? "") && (
                      <div className="mt-4 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isPending}
                          onClick={() =>
                            removeService(service.id)
                          }
                        >
                          Remover Serviço
                        </Button>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}

            </Accordion>
          </ScrollArea>
        ) : (
          <p className="text-gray-500 text-sm text-center">Nenhum serviço cadastrado.</p>
        )}
      </CardContent>
    </Card>
  );
}
