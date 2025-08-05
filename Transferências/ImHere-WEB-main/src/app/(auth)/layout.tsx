import { CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
  return (
    <main className="h-screen relative">
      <div className="hidden md:block absolute top-4 left-4 z-10">
        <Link href="/">
          <div className="flex items-center">
            <Image
              width={80}
              height={50}
              src="/logo.png"
              alt="I'm Here"
            />
            <CardTitle className="text-white text-2xl font-bold">{`I'm Here`}</CardTitle>
          </div>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row h-full">

        <div className="hidden md:flex md:w-1/2 relative">
          <Image
            src="/login-side-img.png"
            alt="Authentication background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="w-full md:w-1/2 p-4 md:p-8 relative">

          <div className="md:hidden mb-4 flex justify-center">
            <Link href="/">
              <Image
                width={80}
                height={50}
                src="/logo.png"
                alt="I'm Here"
              />
            </Link>
          </div>

          <div className="w-full max-w-md h-full max-h-screen overflow-y-auto scrollbar-hidden mx-auto">
            {children}
          </div>

        </div>

      </div>
    </main>
  );
}
