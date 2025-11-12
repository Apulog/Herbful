"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Calendar, Trash2 } from "lucide-react";
import Link from "next/link";
import { getReview, deleteReview } from "@/lib/admin/reviews-api";
import { RatingDisplay } from "@/components/rating-display";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "@/hooks/use-toast";

interface Review {
  id: string;
  treatmentName: string;
  treatmentId: string;
  rating: number;
  comment: string;
  userName: string;
  userEmail: string;
  anonymous: boolean;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReviewViewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const reviewId = searchParams.get("id");

  useEffect(() => {
    if (reviewId) {
      loadReview();
    }
  }, [reviewId]);

  const loadReview = async () => {
    if (!reviewId) return;

    try {
      const data = await getReview(reviewId);
      setReview(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load review details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!reviewId) return;

    try {
      await deleteReview(reviewId);
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
      router.push("/admin/reviews");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  if (!reviewId) {
    return (
      <div className="text-center py-8">
        <p>No review ID provided</p>
        <Link href="/admin/reviews">
          <Button className="mt-4">Back to Reviews</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!review) {
    return <div className="text-center py-8">Review not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/reviews">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reviews
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Details</h1>
          <p className="text-gray-600">View user review information</p>
        </div>
        <div className="ml-auto">
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Review
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  {review.treatmentName}
                </CardTitle>
                <RatingDisplay
                  rating={review.rating}
                  totalReviews={1}
                  size="lg"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {review.comment && (
                <div>
                  <h4 className="font-semibold mb-2">Review Content</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {review.anonymous ? "Anonymous User" : review.userName}
                </p>
              </div>
              {!review.anonymous && review.userEmail && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {review.userEmail}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>
              {review.updatedAt !== review.createdAt && (
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(review.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Treatment Link</CardTitle>
            </CardHeader>
            <CardContent>
              {review.treatmentId ? (
                <Link
                  href={`/admin/treatments/view?id=${encodeURIComponent(
                    review.treatmentId
                  )}`}
                >
                  <Button variant="outline" className="w-full bg-transparent">
                    View Treatment Details
                  </Button>
                </Link>
              ) : (
                <p className="text-sm text-gray-500">
                  Treatment ID not available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
      />
    </div>
  );
}
