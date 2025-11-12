import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password - Herbful Admin",
  description: "Reset your Herbful admin panel password",
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
