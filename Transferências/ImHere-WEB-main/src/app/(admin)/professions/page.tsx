"use client"
import { CreateProfessionModal } from "@/components/profession/CreateProfessionModal";
import { Professions } from "@/components/profession/Professions";

import { Card, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default function ProfessionsPage() {
  const { user } = useAuth();
  if (user?.role === "CLIENT") {
    redirect("/dashboard")
  }
  return (

    <div>
      <Card className="w-full p-6  shadow-none mb-8 rounded-lg">
        <div className="flex justify-between items-center">
          <CardTitle>
            Profissões
          </CardTitle>
          {user?.role === "ADMIN" && <CreateProfessionModal />}
        </div>
      </Card>
      <Card className="w-full p-6  shadow-none rounded-lg">
        <Professions />
      </Card>
    </div>

  );
}
