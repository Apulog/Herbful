"use client"

import { TreatmentForm } from "@/components/admin/treatment-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewTreatmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/treatments">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Treatments
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Treatment</h1>
          <p className="text-gray-600">Create a new herbal treatment or remedy</p>
        </div>
      </div>

      <TreatmentForm />
    </div>
  )
}
