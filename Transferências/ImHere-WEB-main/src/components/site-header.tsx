"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { SidebarIcon } from "lucide-react"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="flex sticky top-0 z-50  w-full  items-center border-b bg-background">
      <div className="flex h-[--header-height] w-full items-center justify-between gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        {/* <SearchForm className="w-full sm:ml-auto sm:w-auto" /> */}
      </div>
    </header>
  )
}
