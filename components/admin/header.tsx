"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "./auth-provider"
import { usePathname } from "next/navigation"

export function AdminHeader() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Don't render header on login page or if not authenticated
  if (pathname === "/admin/login" || !user) {
    return null
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
