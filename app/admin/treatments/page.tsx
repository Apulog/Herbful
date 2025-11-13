"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getTreatments, deleteTreatment } from "@/lib/admin/treatments-api";
import { AdminPagination } from "@/components/admin/pagination";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "@/hooks/use-toast";

interface Treatment {
  id: string;
  name: string;
  sourceType: "Local Remedy" | "Verified Source";
  benefits: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  imageUrl?: string;
}

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    loadTreatments();
  }, [currentPage, searchTerm]);

  const loadTreatments = async () => {
    setLoading(true);
    try {
      const data = await getTreatments({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });
      setTreatments(data.treatments);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load treatments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTreatment(id);
      toast({
        title: "Success",
        description: "Treatment deleted successfully",
      });
      loadTreatments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete treatment",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadTreatments();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Treatments</h1>
          <p className="text-gray-600">Manage herbal treatments and remedies</p>
        </div>
        <Link href="/admin/treatments/new">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Treatment
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search treatments..."
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
          </form>
        </CardContent>
      </Card>

      {/* Treatments List */}
      <Card>
        <CardHeader>
          <CardTitle>All Treatments ({totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : treatments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No treatments found
            </div>
          ) : (
            <div className="space-y-4">
              {treatments.map((treatment) => (
                <div
                  key={treatment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      {treatment.imageUrl ? (
                        <div className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                          <Image
                            src={treatment.imageUrl}
                            alt={treatment.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-lg">
                            {treatment.name}
                          </h3>
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

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            href={`/admin/treatments/view?id=${treatment.id}`}
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link
                            href={`/admin/treatments/edit?id=${treatment.id}`}
                          >
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(treatment.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {(treatment.benefits || [])
                          .slice(0, 3)
                          .map((benefit, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {benefit}
                            </Badge>
                          ))}
                        {(treatment.benefits || []).length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{(treatment.benefits || []).length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                        <span>
                          ⭐ {treatment.averageRating.toFixed(1)} (
                          {treatment.totalReviews} reviews)
                        </span>
                        <span>
                          Created:{" "}
                          {new Date(treatment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && totalCount > itemsPerPage && (
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

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Treatment"
        description="Are you sure you want to delete this treatment? This action cannot be undone."
      />
    </div>
  );
}
