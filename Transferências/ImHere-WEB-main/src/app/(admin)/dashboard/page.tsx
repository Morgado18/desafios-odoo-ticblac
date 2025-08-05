"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardStats from "./DashboardStats";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace("/service-providers");
    }
  }, [user, router]);

  if (user?.role !== "ADMIN") return null;


  return (
    <div className="p-6">

      <Card className="w-full p-6  shadow-none mb-8 rounded-lg">
        <div className="flex justify-between items-center">
          <CardTitle>
            Dashboard
          </CardTitle>

        </div>
      </Card>

      <DashboardStats />
    </div>
  );
}
