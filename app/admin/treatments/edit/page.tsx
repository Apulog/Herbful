"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { TreatmentForm } from "@/components/admin/treatment-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getTreatment } from "@/lib/admin/treatments-api"
import { toast } from "@/hooks/use-toast"

export default function EditTreatmentPage() {
  const searchParams = useSearchParams()
  const [treatment, setTreatment] = useState(null)
  const [loading, setLoading] = useState(true)

  const treatmentId = searchParams.get("id")

  useEffect(() => {
    if (treatmentId) {
      loadTreatment()
    }
  }, [treatmentId])

  const loadTreatment = async () => {
    if (!treatmentId) return

    try {
      const data = await getTreatment(treatmentId)
      setTreatment(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load treatment details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!treatmentId) {
    return (
      <div className="text-center py-8">
        <p>No treatment ID provided</p>
        <Link href="/admin/treatments">
          <Button className="mt-4">Back to Treatments</Button>
        </Link>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/treatments/view?id=${treatmentId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Treatment</h1>
          <p className="text-gray-600">Update treatment information</p>
        </div>
      </div>

      <TreatmentForm initialData={treatment} isEdit />
    </div>
  )
}
