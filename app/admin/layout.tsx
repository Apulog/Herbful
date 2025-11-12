"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { AdminAuthProvider } from "@/components/admin/auth-provider"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Public routes that don't need authentication
  const publicRoutes = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  return (
    <AdminAuthProvider>
      {isPublicRoute ? (
        // Public layout (login, forgot password, reset password)
        <div className="min-h-screen bg-gray-50">{children}</div>
      ) : (
        // Authenticated layout with sidebar and header
        <div className="min-h-screen bg-gray-50">
          <AdminSidebar />
          <div className="lg:pl-64">
            <AdminHeader />
            <main className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
      )}
    </AdminAuthProvider>
  )
}
