import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function LoginPage() {
  return (
    <div className="mt-6 flex flex-col min-h-screen items-center justify-center">
      <Card className="w-full border-none shadow-none">
        <CardHeader>
          <CardTitle className="font-bold text-start text-3xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="flex items-center justify-center pt-4">
            <Link href="/register">
              <p className="text-sm text-gray-500">
                Não tem uma conta?  <span className="text-blue-500">Cadastre-se</span>
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
