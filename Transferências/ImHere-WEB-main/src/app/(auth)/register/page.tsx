"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="mt-6 flex flex-col min-h-screen items-center justify-center">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Escolha o tipo de conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => router.push("/register/client")}
            className="w-full h-14 flex items-center justify-center gap-2 text-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
            variant="outline"
          >
            <User size={20} />
            Cliente
          </Button>

          <Button
            onClick={() => router.push("/register/professional")}
            className="w-full h-14 flex items-center justify-center gap-2 text-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
            variant="outline"
          >
            <UserPlus size={20} />
            Profissional
          </Button>

          <Button
            onClick={() => router.push("/register/company")}
            className="w-full h-14 flex items-center justify-center gap-2 text-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
            variant="outline"
          >
            <Building2 size={20} />
            Empresa
          </Button>

          <div className="flex items-center justify-center pt-4">
            <Link href="/login">
              <p className="text-sm text-gray-500">
                Já tem uma conta? <span className="text-blue-500">Entrar</span>
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
