"use client"

import {
  Building2,
  Calendar,
  GraduationCap,
  MessagesSquare,
  PieChart,
  UserRound
} from "lucide-react"
import * as React from "react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const logoRef =
    user?.role === "ADMIN"
      ? "/dashboard"
      : user?.role === "CLIENT"
        ? "/service-providers"
        : "/my-appointments";


  const data = {
    user: {
      name: `${user?.name}`,
      email: `${user?.email}`,
      avatar: `${user?.photo}`,
    },
    projects: [
      {
        name: "Dashboard",
        url: "/dashboard",
        icon: PieChart,
        allowedRoles: ["ADMIN"],
      },
      {
        name: "Utilizadores",
        url: "users",
        icon: UserRound,
        allowedRoles: ["ADMIN"],
      },
      {
        name: "Empresas",
        url: "/companies",
        icon: Building2,
        allowedRoles: ["ADMIN",],
      },

      {
        name: "Agendamentos",
        url: "/appointments",
        icon: Calendar,
        allowedRoles: ["ADMIN"],
      },
      {
        name: "Meus Agendamentos",
        url: "/my-appointments",
        icon: Calendar,
        allowedRoles: ["CLIENT", "PROFISSIONAL", "COMPANY"],
      },
      {
        name: "Minhas Mensagens",
        url: "/chat",
        icon: MessagesSquare,
        allowedRoles: ["CLIENT", "PROFISSIONAL", "COMPANY"],
      },
      {
        name: "Profissões",
        url: "/professions",
        icon: GraduationCap,
        allowedRoles: ["ADMIN",],
      },
      {
        name: "Profissões",
        url: "/explore-professions",
        icon: GraduationCap,
        allowedRoles: ["PROFISSIONAL", "COMPANY"],
      },
      {
        name: "Serviços",
        url: "/service-providers",
        icon: GraduationCap,
        allowedRoles: ["CLIENT"],
      },

    ],
  }
  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))] bg-bl"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="bg'">
              <a href={logoRef}>
                <div className="flex aspect-square items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image
                    src={'/logo.png'}
                    width={42}
                    height={42}
                    alt="I'M Here logo" />

                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{`I'm Here`}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>

        <NavProjects projects={data.projects} />

      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user}

        />
      </SidebarFooter>
    </Sidebar>
  )
}
