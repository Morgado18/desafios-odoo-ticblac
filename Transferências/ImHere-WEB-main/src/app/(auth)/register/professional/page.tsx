"use client";

import { SignUpProfessionalForm } from "@/components/auth/SignUpFormProfessional";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterProfessionalPage() {
  return (
    <div className="mt-6 flex flex-col min-h-screen items-center justify-center">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-start">Cadastro de Profissional</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpProfessionalForm />
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
