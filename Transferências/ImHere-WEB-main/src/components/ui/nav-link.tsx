'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

interface NavLinkProps extends ComponentProps<typeof Link> {
  shouldMatchExact?: boolean
}

export function Navlink({ shouldMatchExact = false, ...props }: NavLinkProps) {
  const pathName = usePathname()

  const isCurrent =
    props.href === '/' || shouldMatchExact
      ? pathName === props.href
      : pathName.startsWith(props.href.toString())

  return (
    <Link
      prefetch={false}
      data-current={isCurrent}
      {...props}
    />
  )
}