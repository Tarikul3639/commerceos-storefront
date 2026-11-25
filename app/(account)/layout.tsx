import type { ReactNode } from "react"

import { StoreBreadcrumbs } from "@/components/layout/store-breadcrumbs"

export default function AccountLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <StoreBreadcrumbs />
      {children}
    </>
  )
}
