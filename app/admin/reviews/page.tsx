"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Filter, Calendar } from "lucide-react";
import Link from "next/link";
import { getReviews } from "@/lib/admin/reviews-api";
import { AdminPagination } from "@/components/admin/pagination";
import { RatingDisplay } from "@/components/rating-display";
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
  createdAt: string;
  updatedAt: string;
}

export default function ReviewsPage() {
  const searchParams = useSearchParams();

  // Initialize treatment filter from URL immediately (before any effects run)
  const initialTreatmentFilter = searchParams.get("treatment") || "all";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [treatmentFilter, setTreatmentFilter] = useState<string>(
    initialTreatmentFilter
  );
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountBeforeTreatmentFilter, setTotalCountBeforeTreatmentFilter] =
    useState(0);

  const itemsPerPage = 10;

  // Extract unique treatment names with review counts for filter
  const [treatments, setTreatments] = useState<
    Array<{ name: string; count: number }>
  >([]);
  const [ratingCounts, setRatingCounts] = useState<Record<number, number>>({});

  // Initialize filters from URL parameters - must run before loadReviews
  useEffect(() => {
    const treatment = searchParams.get("treatment");
    console.log("=== URL PARAMETER EFFECT ===");
    console.log("URL treatment parameter:", treatment);
    console.log("Current treatmentFilter state:", treatmentFilter);
    // Only set the treatment filter from URL if a treatment parameter exists
    if (treatment) {
      console.log("Setting treatment filter to:", treatment);
      setTreatmentFilter(treatment);
    } else {
      console.log("No treatment parameter in URL, keeping current filter");
    }
  }, [searchParams]);

  // Load reviews when filters change
  const loadReviews = useCallback(async () => {
    console.log("=== loadReviews STARTED ===");
    setLoading(true);
    try {
      console.log("=== loadReviews called ===");
      console.log("Current filters:", {
        treatmentFilter,
        ratingFilter,
        searchTerm,
      });

      // Always fetch all reviews to handle filtering and counts properly
      const data = await getReviews({
        page: 1,
        limit: 10000,
        search: searchTerm,
        rating: undefined, // Don't filter by rating in API call
      });

      console.log("Total reviews fetched:", data.reviews.length);
      console.log(
        "Sample treatments:",
        [...new Set(data.reviews.map((r) => r.treatmentName))].slice(0, 5)
      );

      // Start with all reviews after search
      let filteredReviews = data.reviews;

      // Calculate rating counts before any filters
      const counts: Record<number, number> = {};
      filteredReviews.forEach((review) => {
        counts[review.rating] = (counts[review.rating] || 0) + 1;
      });
      setRatingCounts(counts);

      // Update total count for display before any filters
      setTotalCountBeforeTreatmentFilter(filteredReviews.length);

      // Apply rating filter first (before treatment filter)
      if (ratingFilter !== "all") {
        console.log("Applying rating filter:", ratingFilter);
        filteredReviews = filteredReviews.filter(
          (review) => review.rating === Number.parseInt(ratingFilter)
        );
        console.log("After rating filter:", filteredReviews.length);
      }

      // Apply treatment filter if selected
      if (treatmentFilter !== "all") {
        console.log("Applying treatment filter:", treatmentFilter);
        console.log("Available treatments in filtered reviews:", [
          ...new Set(filteredReviews.map((r) => r.treatmentName)),
        ]);
        const beforeCount = filteredReviews.length;
        filteredReviews = filteredReviews.filter((review) => {
          const matches =
            review.treatmentName.toLowerCase() ===
            treatmentFilter.toLowerCase();
          if (!matches) {
            console.log(
              `Review "${review.treatmentName}" does not match filter "${treatmentFilter}"`
            );
          }
          return matches;
        });
        console.log(
          `Treatment filter applied: ${beforeCount} -> ${filteredReviews.length}`
        );
      }

      // Apply sorting - make sure to handle equal cases for stable sorting
      if (sortBy === "newest") {
        filteredReviews.sort((a, b) => {
          const dateCompare =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          return dateCompare !== 0 ? dateCompare : a.id.localeCompare(b.id);
        });
      } else if (sortBy === "oldest") {
        filteredReviews.sort((a, b) => {
          const dateCompare =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          return dateCompare !== 0 ? dateCompare : a.id.localeCompare(b.id);
        });
      } else if (sortBy === "highest") {
        filteredReviews.sort((a, b) => {
          const ratingCompare = b.rating - a.rating;
          return ratingCompare !== 0
            ? ratingCompare
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      } else if (sortBy === "lowest") {
        filteredReviews.sort((a, b) => {
          const ratingCompare = a.rating - b.rating;
          return ratingCompare !== 0
            ? ratingCompare
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      }

      // Calculate total count after all filters
      const actualTotalCount = filteredReviews.length;

      // Always apply client-side pagination since we're handling all filtering client-side
      const actualTotalPages = Math.ceil(actualTotalCount / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

      console.log(
        "About to setReviews with:",
        paginatedReviews.length,
        "reviews"
      );
      console.log(
        "Paginated reviews:",
        paginatedReviews.map((r) => r.treatmentName)
      );
      setReviews(paginatedReviews);
      setTotalPages(actualTotalPages);
      setTotalCount(actualTotalCount);
      console.log(
        "After setReviews - state should now have",
        paginatedReviews.length,
        "reviews"
      );

      // Count reviews per treatment from the original data before filtering
      const treatmentCounts: Record<string, number> = {};
      data.reviews.forEach((review) => {
        treatmentCounts[review.treatmentName] =
          (treatmentCounts[review.treatmentName] || 0) + 1;
      });

      // Create array of treatments with counts, sorted by name
      const treatmentsWithCounts = Object.entries(treatmentCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));

      console.log(
        "Setting treatments:",
        treatmentsWithCounts.map((t) => `${t.name}(${t.count})`)
      );
      setTreatments(treatmentsWithCounts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log("=== loadReviews FINISHED ===");
    }
  }, [currentPage, searchTerm, ratingFilter, treatmentFilter, sortBy]);

  useEffect(() => {
    console.log("Filter changed, calling loadReviews");
    console.log("Filters:", {
      treatmentFilter,
      ratingFilter,
      searchTerm,
      sortBy,
      currentPage,
    });
    loadReviews();
  }, [loadReviews]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadReviews();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
        <p className="text-gray-600">View and monitor user reviews</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search reviews by treatment, user, or content..."
                  value={searchTerm}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
              <Button type="submit" variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters:</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Select
                value={treatmentFilter}
                onValueChange={(value) => {
                  setCurrentPage(1);
                  setTreatmentFilter(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Treatments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Treatments{" "}
                    {totalCountBeforeTreatmentFilter > 0 &&
                      `(${totalCountBeforeTreatmentFilter})`}
                  </SelectItem>
                  {treatments.map((treatment) => (
                    <SelectItem key={treatment.name} value={treatment.name}>
                      {treatment.name} ({treatment.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={ratingFilter}
                onValueChange={(value) => {
                  setCurrentPage(1);
                  setRatingFilter(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">
                    5 Stars ({ratingCounts[5] || 0})
                  </SelectItem>
                  <SelectItem value="4">
                    4 Stars ({ratingCounts[4] || 0})
                  </SelectItem>
                  <SelectItem value="3">
                    3 Stars ({ratingCounts[3] || 0})
                  </SelectItem>
                  <SelectItem value="2">
                    2 Stars ({ratingCounts[2] || 0})
                  </SelectItem>
                  <SelectItem value="1">
                    1 Star ({ratingCounts[1] || 0})
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value) => {
                  setCurrentPage(1);
                  setSortBy(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Newest First
                    </div>
                  </SelectItem>
                  <SelectItem value="oldest">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Oldest First
                    </div>
                  </SelectItem>
                  <SelectItem value="highest">Highest Rating</SelectItem>
                  <SelectItem value="lowest">Lowest Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {treatmentFilter === "all" ? "All Reviews" : treatmentFilter} (
            {totalCount})
            {treatmentFilter !== "all" && (
              <span className="text-sm text-gray-500 ml-2">
                of {totalCountBeforeTreatmentFilter} total reviews
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews found
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {review.treatmentName}
                        </h3>
                        <RatingDisplay
                          rating={review.rating}
                          totalReviews={1}
                          size="sm"
                        />
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>
                          By:{" "}
                          {review.anonymous
                            ? "Anonymous User"
                            : review.userName}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {review.comment && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/admin/reviews/view?id=${review.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6">
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
