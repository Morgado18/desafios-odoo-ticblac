
import { Navbar } from "@/components/landing/navbar";
import { ReactNode } from "react";
type PublicLayoutProps = {
  children: ReactNode
}

export default function PublicLayout({ children }: Readonly<PublicLayoutProps>) {
  return (
    <main className="">
      <Navbar />
      <div className="pt-[90px]">
        {children}
      </div>
    </main>
  );
}
