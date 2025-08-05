"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { getInitials } from "@/utils/get-initials"
import {
  Briefcase,
  Calendar,
  LogOut,
  MessageCircle,
  UserRound,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { CardTitle } from "./ui/card"

const routeList = [
  { label: "Serviços", href: "/service-providers", allowedRoles: ["CLIENT"] },
  { label: "Meus Agendamentos", href: "/my-appointments", allowedRoles: ["CLIENT", "PROFISSIONAL", "COMPANY"] },
  { label: "Minhas Mensagens", href: "/chat", allowedRoles: ["CLIENT", "PROFISSIONAL", "COMPANY"] },
  { label: "Profissões", href: "/explore-professions", allowedRoles: ["PROFISSIONAL", "COMPANY"] },
]

const routeIcons: Record<string, JSX.Element> = {
  "/service-providers": <Briefcase className="mr-2 h-4 w-4" />,
  "/my-appointments": <Calendar className="mr-2 h-4 w-4" />,
  "/chat": <MessageCircle className="mr-2 h-4 w-4" />,
  "/explore-professions": <Briefcase className="mr-2 h-4 w-4" />,
}



export function HeaderNavbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const [currentHash, setCurrentHash] = useState("")

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    }

    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  const filteredRoutes = routeList.filter(
    (route) =>
      !route.allowedRoles ||
      route.allowedRoles.length === 0 ||
      route.allowedRoles.includes(user?.role!)
  )

  return (
    <header className="w-full z-50 bg-[#336BFF] py-4 px-2 shadow-sm fixed top-0 left-0 border-b">
      <div className="mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="I'm Here" width={60} height={60} />
          <CardTitle className="text-white font-bold ml-2">{`I'm Here`}</CardTitle>
        </Link>

        {/* Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-4">
          {filteredRoutes.map(({ href, label }, index) => (
            <div key={href} className="flex items-center gap-2">
              {index !== 0 && <span className="text-white">|</span>}
              <Link
                href={href}
                className={`font-medium text-lg px-4 ${pathname === href || (href.startsWith("/#") && currentHash === href)
                  ? "text-blue-900 font-bold text-xl"
                  : "text-white hover:text-blue-900 hover:font-bold hover:text-xl"
                  }`}
              >
                {label}
              </Link>
            </div>
          ))}
        </nav>

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.photo} alt={user?.name} />
                <AvatarFallback className="rounded-lg bg-blue-400 text-white">
                  {getInitials(user?.name!)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-lg">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.photo} alt={user?.name} />
                  <AvatarFallback>{getInitials(user?.name || "")}</AvatarFallback>

                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="font-semibold truncate">{user?.name}</span>
                  <span className="text-xs truncate">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            {/* Menu Items (Mobile only) */}
            {filteredRoutes.length > 0 && (
              <div className="block md:hidden">
                <DropdownMenuSeparator />
                {filteredRoutes.map(({ href, label }) => (
                  <DropdownMenuGroup key={href}>
                    <Link href={href}>
                      <DropdownMenuItem
                        className={
                          pathname === href
                            ? "bg-blue-100 font-semibold text-blue-800"
                            : ""
                        }
                      >
                        {routeIcons[href]} {label}
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                ))}
              </div>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link href="/you">
                <DropdownMenuItem>
                  <UserRound className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <button onClick={logout} className="w-full text-left">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Terminar Sessão
              </DropdownMenuItem>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
