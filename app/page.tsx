import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/admin");

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
              Your personal herbal treatment recommendation system. Get natural
              remedies tailored to your symptoms using our intelligent decision
              tree.
            </p>
          </div>

          {/* Main Action Card */}
          <Card className="w-full max-w-md shadow-lg border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-800">
                Get Started
              </CardTitle>
              <CardDescription className="text-green-600">
                Tell us about your symptoms and receive personalized herbal
                recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/symptoms">
                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Enter Symptoms
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
