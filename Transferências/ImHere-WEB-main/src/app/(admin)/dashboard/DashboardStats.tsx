"use client";

import { getMixedData } from "@/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Building2,
  CalendarCheck,
  Users
} from "lucide-react";

export default function DashboardStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["mixedData"],
    queryFn: getMixedData,
  });
  console.log("data", data)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Users className="w-6 h-6 text-primary" />}
        title="Usuários"
        value={data?.activeUsers ?? 0}
        loading={isLoading}

      />
      <StatCard
        icon={<Building2 className="w-6 h-6 text-primary" />}
        title="Empresas"
        value={data?.totalCompanies ?? 0}
        loading={isLoading}


      />
      <StatCard
        icon={<Briefcase className="w-6 h-6 text-primary" />}
        title="Profissões"
        value={data?.totalProfessions ?? 0}
        loading={isLoading}


      />
      <StatCard
        icon={<CalendarCheck className="w-6 h-6 text-primary" />}
        title="Agendamentos"
        value={data?.totalAppointments ?? 0}
        loading={isLoading}


      />
    </div>
  );
}

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  loading?: boolean;
};

function StatCard({ icon, title, value, loading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-6 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
