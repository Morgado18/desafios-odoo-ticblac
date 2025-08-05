"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { AccessRole } from "./access-role";

export function NavProjects({
  projects,
}: Readonly<{
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    allowedRoles: string[];
  }[];
}>) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden ">
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = pathname.includes(item.url);
          return (
            <AccessRole key={item.name} allowedRoles={item.allowedRoles}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href={item.url}
                    className={`flex items-center gap-2 rounded-sm p-3 transition-colors ${isActive
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-400 hover:text-blue-800"
                      }`}
                  >
                    <item.icon className="font-bold" />
                    <span className="font-bold text-base">{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </AccessRole>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
