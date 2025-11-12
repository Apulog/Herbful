import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account Settings - Herbful Admin",
  description: "Manage your admin account credentials",
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
