"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { getTreatment, deleteTreatment } from "@/lib/admin/treatments-api";
import { getReviews } from "@/lib/admin/reviews-api";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { TreatmentImage } from "@/components/admin/treatment-image";
import { toast } from "@/hooks/use-toast";

interface Treatment {
  id: string;
  name: string;
  sourceType: "Local Remedy" | "Verified Source";
  sources?: Array<{
    authority: string;
    url: string;
    description: string;
    verificationDate: string;
  }>;
  preparation: string[];
  usage: string;
  dosage: string;
  warnings: string[];
  benefits: string[];
  symptoms?: string[];
  imageUrl?: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export default function TreatmentViewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [liveReviewCount, setLiveReviewCount] = useState<number | null>(null);
  const [liveAverageRating, setLiveAverageRating] = useState<number | null>(
    null
  );

  const treatmentId = searchParams.get("id");

  useEffect(() => {
    if (treatmentId) {
      loadTreatment();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treatmentId]);

  const loadTreatment = async () => {
    if (!treatmentId) return;

    setLoading(true);
    try {
      const data = await getTreatment(treatmentId);
      setTreatment(data);

      // Fetch live review count for this treatment
      try {
        const reviewsData = await getReviews({
          page: 1,
          limit: 10000,
          search: "",
          rating: undefined,
        });

        // Count reviews and calculate average rating for this treatment
        const treatmentReviews = reviewsData.reviews.filter(
          (review) =>
            review.treatmentName.toLowerCase() === data.name.toLowerCase()
        );
        setLiveReviewCount(treatmentReviews.length);

        // Calculate average rating
        if (treatmentReviews.length > 0) {
          const avgRating =
            treatmentReviews.reduce((sum, review) => sum + review.rating, 0) /
            treatmentReviews.length;
          setLiveAverageRating(avgRating);
        } else {
          setLiveAverageRating(0);
        }
      } catch (reviewError) {
        console.error("Error fetching review count:", reviewError);
        // Fall back to the count from treatment data
        setLiveReviewCount(data.totalReviews);
        setLiveAverageRating(data.averageRating);
      }
    } catch (error) {
      console.error("Error loading treatment:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load treatment details";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      // Set treatment to null so we show the "not found" message
      setTreatment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!treatmentId) return;

    try {
      await deleteTreatment(treatmentId);
      toast({
        title: "Success",
        description: "Treatment deleted successfully",
      });
      router.push("/admin/treatments");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete treatment",
        variant: "destructive",
      });
    }
  };

  if (!treatmentId) {
    return (
      <div className="text-center py-8">
        <p>No treatment ID provided</p>
        <Link href="/admin/treatments">
          <Button className="mt-4">Back to Treatments</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading treatment details...</p>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="text-center py-8 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Treatment not found
          </h2>
          <p className="text-gray-600 mb-4">
            The treatment with ID{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              {treatmentId}
            </code>{" "}
            could not be found.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            It may have been deleted or the ID is incorrect.
          </p>
        </div>
        <Link href="/admin/treatments">
          <Button>Back to Treatments</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/treatments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Treatments
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {treatment.name}
            </h1>
            <p className="text-gray-600">Treatment Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/reviews?treatment=${encodeURIComponent(
              treatment.name
            )}`}
          >
            <Button variant="secondary" className="gap-2">
              <span>⭐</span>
              View {liveReviewCount ?? treatment.totalReviews} Reviews
            </Button>
          </Link>
          <Link href={`/admin/treatments/edit?id=${treatment.id}`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    treatment.sourceType === "Verified Source"
                      ? "default"
                      : "secondary"
                  }
                >
                  {treatment.sourceType}
                </Badge>
              </div>

              {treatment.imageUrl && (
                <div>
                  <h4 className="font-semibold mb-2">Image</h4>
                  <TreatmentImage
                    src={treatment.imageUrl}
                    alt={treatment.name}
                    width={600}
                    height={400}
                    className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50 object-cover w-full h-64"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Benefits</h4>
                <div className="flex flex-wrap gap-1">
                  {(treatment.benefits || []).map((benefit, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              {treatment.symptoms && treatment.symptoms.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Symptoms</h4>
                  <div className="flex flex-wrap gap-1">
                    {(treatment.symptoms || []).map((symptom, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Usage</h4>
                  <p className="text-sm text-gray-600">{treatment.usage}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dosage</h4>
                  <p className="text-sm text-gray-600">{treatment.dosage}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preparation Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {(treatment.preparation || []).map((step, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {treatment.warnings && treatment.warnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-800">
                  Warnings & Precautions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {(treatment.warnings || []).map((warning, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-amber-700 flex items-start"
                    >
                      <span className="mr-2">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-2xl font-bold">
                  ⭐ {(liveAverageRating ?? treatment.averageRating).toFixed(1)}
                </div>
                <p className="text-sm text-gray-500">
                  {liveReviewCount ?? treatment.totalReviews} reviews
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">
                  {new Date(treatment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {new Date(treatment.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {treatment.sources && treatment.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Source Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {treatment.sources.map((source, index) => (
                  <div
                    key={index}
                    className="space-y-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{source.authority}</p>
                      <p className="text-sm text-gray-600">
                        {source.description}
                      </p>
                    </div>
                    {source.verificationDate && (
                      <div>
                        <p className="text-sm text-gray-500">Verified on</p>
                        <p className="text-sm">{source.verificationDate}</p>
                      </div>
                    )}
                    {source.url && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Official Source
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Treatment"
        description="Are you sure you want to delete this treatment? This action cannot be undone."
      />
    </div>
  );
}
