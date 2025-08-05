'use client'
import { Toaster } from "@/components/ui/sonner"
import { ReactNode } from "react"
import QueryProvider from './QueryProvider'

export default function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (

    <QueryProvider>

      <Toaster
        theme="light"
        position="top-center"
        richColors
      />
      {children}
    </QueryProvider>

  )
}
