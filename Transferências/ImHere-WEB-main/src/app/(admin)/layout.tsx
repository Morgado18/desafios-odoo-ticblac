import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { ReactNode } from "react";

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (

    <div className="[--header-height:calc(theme(spacing.14))]">
      <NotificationProvider>

        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <div
                className="flex-1 p-4 bg-gray-100">
                {children}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </NotificationProvider>
    </div>


  )
}
