"use client";

import { Companies } from "@/components/companies";
import { CreateCompanyForm } from "@/components/companies/CreateCompanyForm";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CompaniesPage() {
  return (
    <div>
      <Card className="w-full p-6 shadow-none mb-8 rounded-lg">
        <div className="flex justify-between items-center">
          <CardTitle>Empresas</CardTitle>


          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Criar Empresa</Button>
            </DialogTrigger>

            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nova Empresa</DialogTitle>
              </DialogHeader>

              <CreateCompanyForm />
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <Card className="w-full p-6 shadow-none rounded-lg">
        <Companies />
      </Card>
    </div>
  );
}
