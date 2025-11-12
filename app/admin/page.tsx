"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { getTreatments } from "@/lib/admin/treatments-api";
import { getReviews } from "@/lib/admin/reviews-api";
import { formatDistanceToNow } from "date-fns";

interface RecentActivity {
  id: string;
  type: "treatment_created" | "treatment_updated" | "review_created";
  title: string;
  description: string;
  timestamp: string;
  color: string;
}

export default function AdminDashboardPage() {
  const [treatmentsCount, setTreatmentsCount] = useState<number>(0);
  const [verifiedTreatmentsCount, setVerifiedTreatmentsCount] =
    useState<number>(0);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all treatments to get count and recent activity
      // Using a very large limit - API loads all data in memory, so this will get all treatments
      const treatmentsData = await getTreatments({
        page: 1,
        limit: 100000, // Very large limit to ensure we get all treatments
        search: undefined,
      });

      // Since API loads all treatments in memory before paginating,
      // if returned length < limit, we have all items (accurate count)
      // Otherwise we have at least that many (should be rare with limit 100000)
      setTreatmentsCount(treatmentsData.treatments.length);

      // Count verified treatments
      const verifiedCount = treatmentsData.treatments.filter(
        (treatment) => treatment.sourceType === "Verified Source"
      ).length;
      setVerifiedTreatmentsCount(verifiedCount);

      // Fetch all reviews - use stats.total for accurate count (calculated before filtering)
      const reviewsData = await getReviews({
        page: 1,
        limit: 100000, // Very large limit to get all reviews for activity feed
        search: undefined,
        rating: undefined,
      });
      setReviewsCount(reviewsData.stats.total);

      // Build recent activity from treatments and reviews
      const activities: RecentActivity[] = [];

      // Add recent treatments (created)
      treatmentsData.treatments
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .forEach((treatment) => {
          activities.push({
            id: `treatment-${treatment.id}`,
            type: "treatment_created",
            title: "New treatment added",
            description: `${treatment.name} was added to the database`,
            timestamp: treatment.createdAt,
            color: "bg-blue-600",
          });
        });

      // Add recently updated treatments
      treatmentsData.treatments
        .filter((t) => t.updatedAt !== t.createdAt)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 3)
        .forEach((treatment) => {
          activities.push({
            id: `treatment-updated-${treatment.id}`,
            type: "treatment_updated",
            title: "Treatment updated",
            description: `${treatment.name} preparation updated`,
            timestamp: treatment.updatedAt,
            color: "bg-amber-600",
          });
        });

      // Add recent reviews
      reviewsData.reviews
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .forEach((review) => {
          activities.push({
            id: `review-${review.id}`,
            type: "review_created",
            title: "New review",
            description: `${review.rating}-star review for ${review.treatmentName}`,
            timestamp: review.createdAt,
            color: "bg-green-600",
          });
        });

      // Sort all activities by timestamp (most recent first) and take top 10
      activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setRecentActivity(activities.slice(0, 10));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      name: "Total Treatments",
      value: loading ? "..." : treatmentsCount.toString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/treatments",
    },
    {
      name: "Verified Treatments",
      value: loading ? "..." : verifiedTreatmentsCount.toString(),
      icon: CheckCircle2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/admin/treatments",
    },
    {
      name: "Total Reviews",
      value: loading ? "..." : reviewsCount.toString(),
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/admin/reviews",
    },
  ];

  const quickActions = [
    {
      name: "Manage Treatments",
      description: "Add, edit, or remove herbal treatments",
      icon: FileText,
      href: "/admin/treatments",
      color: "text-blue-600",
    },
    {
      name: "View Reviews",
      description: "View user reviews and ratings",
      icon: MessageSquare,
      href: "/admin/reviews",
      color: "text-green-600",
    },
    {
      name: "Account Settings",
      description: "Update your admin credentials",
      icon: Settings,
      href: "/admin/account",
      color: "text-gray-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8" />
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome to the Herbful admin panel. Manage treatments, reviews, and
          settings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.name}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.name} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className={`h-6 w-6 ${action.color}`} />
                      <CardTitle className="text-lg">{action.name}</CardTitle>
                    </div>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates and changes in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading recent activity...
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent activity
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-sm"
                >
                  <div
                    className={`w-2 h-2 ${activity.color} rounded-full mt-2`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-gray-600">{activity.description}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
