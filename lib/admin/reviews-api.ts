// Firebase API functions for reviews CRUD operations
import { ref, set, get, remove } from "firebase/database"
import { db } from "@/lib/firebase-client"
import type { Review, ReviewStats } from "@/lib/types/firebase"
import { updateTreatmentRating } from "./treatments-api"

const REVIEWS_PATH = "reviews"

// Helper function to generate ID
function generateId(): string {
  return Date.now().toString()
}

function calculateStats(reviews: Review[]): ReviewStats {
  return {
    total: reviews.length,
  }
}

async function updateReview(id: string, updates: Partial<Review>): Promise<Review> {
  try {
    const reviewRef = ref(db, `${REVIEWS_PATH}/${id}`)
    const snapshot = await get(reviewRef)

    if (!snapshot.exists()) {
      throw new Error("Review not found")
    }

    const existingReview = snapshot.val() as Review
    const updatedReview: Review = {
      ...existingReview,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    }

    const { id: _, ...reviewData } = updatedReview
    await set(reviewRef, reviewData)

    // Update treatment rating if rating changed
    if (updates.rating !== undefined) {
      await updateTreatmentRating(existingReview.treatmentId)
    }

    return updatedReview
  } catch (error) {
    console.error("Error updating review:", error)
    if (error instanceof Error && error.message === "Review not found") {
      throw error
    }
    throw new Error("Failed to update review")
  }
}

export async function getReviews(params: {
  page: number
  limit: number
  search?: string
  rating?: number
}): Promise<{ reviews: Review[]; totalPages: number; totalCount: number; stats: ReviewStats }> {
  try {
    const reviewsRef = ref(db, REVIEWS_PATH)
    const snapshot = await get(reviewsRef)

    if (!snapshot.exists()) {
      return {
        reviews: [],
        totalPages: 0,
        totalCount: 0,
        stats: { total: 0 },
      }
    }

    let reviews = Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...(data as Omit<Review, "id">),
    })) as Review[]

    const stats = calculateStats(reviews)

    // Apply filters
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      reviews = reviews.filter(
        (review) =>
          review.treatmentName.toLowerCase().includes(searchLower) ||
          review.comment.toLowerCase().includes(searchLower) ||
          review.userName.toLowerCase().includes(searchLower) ||
          review.userEmail.toLowerCase().includes(searchLower)
      )
    }

    if (params.rating) {
      reviews = reviews.filter((review) => review.rating === params.rating)
    }

    // Sort by creation date (newest first)
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Get total count after filtering
    const totalCount = reviews.length

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / params.limit)

    // Apply pagination
    const startIndex = (params.page - 1) * params.limit
    const endIndex = startIndex + params.limit
    const paginatedReviews = reviews.slice(startIndex, endIndex)

    return {
      reviews: paginatedReviews,
      totalPages,
      totalCount,
      stats,
    }
  } catch (error) {
    console.error("Error fetching reviews:", error)
    throw new Error("Failed to fetch reviews")
  }
}

export async function getReview(id: string): Promise<Review> {
  try {
    const reviewRef = ref(db, `${REVIEWS_PATH}/${id}`)
    const snapshot = await get(reviewRef)

    if (!snapshot.exists()) {
      throw new Error("Review not found")
    }

    return {
      id,
      ...(snapshot.val() as Omit<Review, "id">),
    }
  } catch (error) {
    console.error("Error fetching review:", error)
    if (error instanceof Error && error.message === "Review not found") {
      throw error
    }
    throw new Error("Failed to fetch review")
  }
}

export async function createReview(data: Omit<Review, "id" | "createdAt" | "updatedAt">): Promise<Review> {
  try {
    const id = generateId()
    const now = new Date().toISOString()

    const newReview: Review = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    }

    const reviewRef = ref(db, `${REVIEWS_PATH}/${id}`)
    const { id: _, ...reviewData } = newReview
    await set(reviewRef, reviewData)

    // Update treatment rating
    await updateTreatmentRating(newReview.treatmentId)

    return newReview
  } catch (error) {
    console.error("Error creating review:", error)
    throw new Error("Failed to create review")
  }
}


export async function deleteReview(id: string): Promise<void> {
  try {
    const reviewRef = ref(db, `${REVIEWS_PATH}/${id}`)
    const snapshot = await get(reviewRef)

    if (!snapshot.exists()) {
      throw new Error("Review not found")
    }

    const review = snapshot.val() as Review
    const treatmentId = review.treatmentId

    // Delete the review
    await remove(reviewRef)

    // Update treatment rating
    await updateTreatmentRating(treatmentId)
  } catch (error) {
    console.error("Error deleting review:", error)
    if (error instanceof Error && error.message === "Review not found") {
      throw error
    }
    throw new Error("Failed to delete review")
  }
}

// Export updateReview for external use if needed
export { updateReview }
