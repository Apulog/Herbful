import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, ArrowRight } from "lucide-react"
import { redirect } from "next/navigation"

export default function HomePage() {
  redirect("/admin")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          {/* App Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-12 w-12 text-green-600 mr-3" />
              <h1 className="text-5xl font-bold text-green-800">Herbful</h1>
            </div>
            <p className="text-xl text-green-700 max-w-2xl">
              Your personal herbal treatment recommendation system. Get natural remedies tailored to your symptoms using
              our intelligent decision tree.
            </p>
          </div>

          {/* Main Action Card */}
          <Card className="w-full max-w-md shadow-lg border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-800">Get Started</CardTitle>
              <CardDescription className="text-green-600">
                Tell us about your symptoms and receive personalized herbal recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/symptoms">
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Enter Symptoms
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Temporary Admin Access - Remove in production */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-yellow-700 mb-2">Development Access</p>
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="border-yellow-400 text-yellow-700 hover:bg-yellow-100 bg-transparent"
                >
                  🔧 Admin Panel
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800 mb-2">Natural Remedies</h3>
              <p className="text-green-600 text-sm">Discover time-tested herbal treatments for common ailments</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-green-800 mb-2">Personalized</h3>
              <p className="text-green-600 text-sm">Recommendations tailored to your specific symptoms and profile</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-green-800 mb-2">Instant Results</h3>
              <p className="text-green-600 text-sm">Get immediate recommendations using our offline decision engine</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
