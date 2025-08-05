/* "use client";

import { Appointments } from "@/components/appointment/Appointments";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

import { getUser, User } from "@/actions/users";
import { AppointmentsByUser } from "@/components/appointment/AppointmentsByUser";
import { useQuery } from "@tanstack/react-query";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function fetchUser(id: string): Promise<User | null> {
  return await getUser(id);
}

export default function MyAppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const { data: fetchedUser } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => fetchUser(user!.id),
    enabled: !!user?.id && (user.role === "PROFISSIONAL" || user.role === "COMPANY"),
  });

  useEffect(() => {
    if (
      fetchedUser &&
      (user?.role === "PROFISSIONAL" || user?.role === "COMPANY") &&
      (!fetchedUser.professionalService || fetchedUser.professionalService.length === 0)
    ) {
      setShowDialog(true);
    }
  }, [fetchedUser, user]);

  const handleDialogClose = () => {
    setShowDialog(false);
    router.push("/service-providers");
  };

  return (
    <div>
      <Card className="w-full p-6 shadow-none mb-8 rounded-lg">
        <div className="flex justify-between items-center">
          <CardTitle>Meus Agendamentos</CardTitle>
          {user?.role === 'CLIENT' && (
            <Link href="/service-providers">
              <Button className="bg-green-500 text-white hover:bg-green-700">
                <CalendarPlus size={18} className="m-0 md:mr-2" />
                <span className="hidden sm:inline"> Solicitar serviços</span>
              </Button>
            </Link>
          )}
        </div>
      </Card>

      <div className="w-full p-6 shadow-none rounded-lg">
        {user?.role === "COMPANY" || user?.role === "PROFISSIONAL" ? (
          <AppointmentsByUser id={user.id} role={user.role} />
          <LocationTracker />
        ) : (
          <Appointments id={user?.id} />
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete seu perfil</DialogTitle>
            <DialogDescription>
              Você ainda não adicionou os serviços que oferece. Por favor, cadastre ao menos uma profissão para continuar usando a plataforma.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDialogClose}>Cadastrar serviços</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
 */


"use client";

import { Appointments } from "@/components/appointment/Appointments";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { getUser, User } from "@/actions/users";
import { AppointmentsByUser } from "@/components/appointment/AppointmentsByUser";
import { useQuery } from "@tanstack/react-query";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Importe o componente LocationTracker
import LocationTracker from "@/components/LocationTracker";

async function fetchUser(id: string): Promise<User | null> {
  return await getUser(id);
}

export default function MyAppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const { data: fetchedUser } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => fetchUser(user!.id),
    enabled: !!user?.id && (user.role === "PROFISSIONAL" || user.role === "COMPANY"),
  });

  useEffect(() => {
    if (
      fetchedUser &&
      (user?.role === "PROFISSIONAL" || user?.role === "COMPANY") &&
      (!fetchedUser.professionalService || fetchedUser.professionalService.length === 0)
    ) {
      setShowDialog(true);
    }
  }, [fetchedUser, user]);

  const handleDialogClose = () => {
    setShowDialog(false);
    router.push("/service-providers");
  };

  return (
    <div>
      <Card className="w-full p-6 shadow-none mb-8 rounded-lg">
        <div className="flex justify-between items-center">
          <CardTitle>Meus Agendamentos</CardTitle>
          {user?.role === "CLIENT" && (
            <Link href="/service-providers">
              <Button className="bg-green-500 text-white hover:bg-green-700">
                <CalendarPlus size={18} className="m-0 md:mr-2" />
                <span className="hidden sm:inline"> Solicitar serviços</span>
              </Button>
            </Link>
          )}
        </div>
      </Card>

      <div className="w-full p-6 shadow-none rounded-lg">
        {user?.role === "COMPANY" || user?.role === "PROFISSIONAL" ? (
          <>
            <AppointmentsByUser id={user.id} role={user.role} />
            <LocationTracker id={user.id} />
          </>
        ) : (
          <Appointments id={user?.id} />
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete seu perfil</DialogTitle>
            <DialogDescription>
              Você ainda não adicionou os serviços que oferece. Por favor, cadastre ao menos uma profissão para continuar usando a plataforma.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDialogClose}>Cadastrar serviços</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
