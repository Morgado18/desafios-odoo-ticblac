import { Footer } from "@/components/footer";
import { HeaderNavbar } from "@/components/header-nav-bar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { WhatsappSupportButton } from "@/components/Whatsapp-support-button";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { ReactNode } from "react";

export default function PrivateLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <NotificationProvider>
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <HeaderNavbar />
            <SidebarInset>
              <div className="flex-1 p-8 mt-14">
                {children}
              </div>
            </SidebarInset>
          </div>
          <WhatsappSupportButton />
          <Footer />
        </SidebarProvider>
      </NotificationProvider>
    </div>
  )
}
