"use client";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "../ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../ui/sheet";
import { routeList } from "./routes";

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const [currentHash, setCurrentHash] = React.useState<string>("");

  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);


  return (
    <header
      className="fixed top-0 left-0 w-full h-fit z-50"
      style={{ backgroundColor: "#336BFF" }}
    >
      <div className="container mx-auto flex justify-between items-center p-2">
        <Link href="#hero" className="font-bold text-lg flex items-center">
          <Image src="/logo.png" width={90} height={80} alt=" I'm Here" /><span
            className="text-white text-2xl">{`I'm Here`}</span>
        </Link>

        {/* Mobile Menu */}
        <div className="flex items-center lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Menu onClick={() => setIsOpen(!isOpen)} className="cursor-pointer lg:hidden text-white " />
            </SheetTrigger>

            <SheetContent side="left" className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-white border-gray-200">
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <Link href="/" className="font-bold text-lg flex items-center">
                    <Image src={"/logo.png"} width={60} height={60} alt=" I'm Here" /><span
                      className="text-blue-800 text-2xl">{`I'm Here`}</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                {routeList.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base text-gray-900"
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                ))}
              </div>

              <div className="w-full">
                <Link
                  href="/login"
                  className="block w-full text-center bg-blue-900 hover:bg-blue-900/80 text-white px-4 py-2 rounded-md"
                >
                  Entrar
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:block mx-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              {routeList.map(({ href, label }) => (
                <NavigationMenuLink key={href} asChild>
                  <Link
                    href={href}
                    className={`nav-link font-medium text-lg px-4 ${(href.startsWith("/#") && currentHash === href) ||
                      (!href.includes("/#") && pathname === href)
                      ? "text-blue-900 font-bold text-xl"
                      : "text-white hover:text-blue-900 hover:font-bold hover:text-xl"
                      }`}
                  >
                    {label}
                  </Link>

                </NavigationMenuLink>
              ))}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Login & Language */}
        <div className="hidden lg:flex items-center gap-2">
          <Button className="bg-blue-900 hover:bg-blue-900/80 text-white px-4 py-2 rounded-md">
            <Link href="/login">Entrar</Link>
          </Button>

        </div>
      </div>
    </header>
  );
};
