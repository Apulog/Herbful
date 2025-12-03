// Firebase API functions for treatments CRUD operations
import { ref, set, get, remove } from "firebase/database";
import { db } from "@/lib/firebase-client";
import type { Treatment } from "@/lib/types/firebase";
import {
  updateSymptomsForTreatment,
  removeTreatmentFromSymptoms,
} from "./symptoms-api";

const TREATMENTS_PATH = "treatments2";
const REVIEWS_PATH = "reviews2";

// Helper function to generate ID
function generateId(): string {
  return Date.now().toString();
}

// Helper function to remove undefined values (Firebase doesn't allow undefined)
function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
}

// Helper function to calculate average rating from reviews
async function updateTreatmentRating(treatmentId: string): Promise<void> {
  try {
    const reviewsRef = ref(db, `${REVIEWS_PATH}`);
    const snapshot = await get(reviewsRef);

    if (!snapshot.exists()) {
      // No reviews, set rating to 0
      const treatmentRef = ref(db, `${TREATMENTS_PATH}/${treatmentId}`);
      const treatmentSnap = await get(treatmentRef);
      if (treatmentSnap.exists()) {
        const treatment = treatmentSnap.val() as Omit<Treatment, "id">;
        const { imageUrl, ...treatmentWithoutImage } = treatment;
        const updateData = {
          ...treatmentWithoutImage,
          averageRating: 0,
          totalReviews: 0,
          updatedAt: new Date().toISOString(),
        };
        await set(ref(db, `${TREATMENTS_PATH}/${treatmentId}`), updateData);
      }
      return;
    }

    const reviews = snapshot.val();
    const treatmentReviews = Object.values(reviews).filter((review: any) => {
      // Include review if it matches treatmentId
      return review.treatmentId === treatmentId;
    }) as Array<{ rating: number }>;

    if (treatmentReviews.length === 0) {
      // No active reviews
      const treatmentRef = ref(db, `${TREATMENTS_PATH}/${treatmentId}`);
      const treatmentSnap = await get(treatmentRef);
      if (treatmentSnap.exists()) {
        const treatment = treatmentSnap.val() as Omit<Treatment, "id">;
        const { imageUrl, ...treatmentWithoutImage } = treatment;
        const updateData = {
          ...treatmentWithoutImage,
          averageRating: 0,
          totalReviews: 0,
          updatedAt: new Date().toISOString(),
        };
        await set(ref(db, `${TREATMENTS_PATH}/${treatmentId}`), updateData);
      }
      return;
    }

    const totalRating = treatmentReviews.reduce(
      (sum, review) => sum + (review as any).rating,
      0
    );
    const averageRating = totalRating / treatmentReviews.length;
    const totalReviews = treatmentReviews.length;

    // Update treatment with new rating
    const treatmentRef = ref(db, `${TREATMENTS_PATH}/${treatmentId}`);
    const treatmentSnap = await get(treatmentRef);
    if (treatmentSnap.exists()) {
      const treatment = treatmentSnap.val() as Omit<Treatment, "id">;
      const { imageUrl, ...treatmentWithoutImage } = treatment;
      const updateData = {
        ...treatmentWithoutImage,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews,
        updatedAt: new Date().toISOString(),
      };
      await set(ref(db, `${TREATMENTS_PATH}/${treatmentId}`), updateData);
    }
  } catch (error) {
    console.error("Error updating treatment rating:", error);
    throw error;
  }
}

export async function getTreatments(params: {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<{
  treatments: Treatment[];
  totalPages: number;
  totalCount: number;
}> {
  try {
    const treatmentsRef = ref(db, TREATMENTS_PATH);
    const snapshot = await get(treatmentsRef);

    if (!snapshot.exists()) {
      return { treatments: [], totalPages: 0, totalCount: 0 };
    }

    let treatments = Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...(data as Omit<Treatment, "id">),
    })) as Treatment[];

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      treatments = treatments.filter(
        (treatment) =>
          treatment.name.toLowerCase().includes(searchLower) ||
          (treatment.benefits &&
            treatment.benefits.some((benefit) =>
              benefit.toLowerCase().includes(searchLower)
            )) ||
          (treatment.symptoms &&
            treatment.symptoms.some((symptom) =>
              symptom.toLowerCase().includes(searchLower)
            ))
      );
    }

    // Apply sorting
    if (params.sortBy) {
      treatments.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (params.sortBy) {
          case "name":
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case "createdAt":
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case "averageRating":
            aValue = a.averageRating;
            bValue = b.averageRating;
            break;
          case "totalReviews":
            aValue = a.totalReviews;
            bValue = b.totalReviews;
            break;
          case "sourceType":
            aValue = a.sourceType;
            bValue = b.sourceType;
            break;
          default:
            // Default to createdAt sorting
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
        }

        if (aValue < bValue) return params.sortOrder === "desc" ? 1 : -1;
        if (aValue > bValue) return params.sortOrder === "desc" ? -1 : 1;
        return 0;
      });
    } else {
      // Default sorting by createdAt (newest first)
      treatments.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // Get total count after filtering
    const totalCount = treatments.length;

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / params.limit);

    // Apply pagination
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedTreatments = treatments.slice(startIndex, endIndex);

    return {
      treatments: paginatedTreatments,
      totalPages,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching treatments:", error);
    throw new Error("Failed to fetch treatments");
  }
}

export async function getTreatment(id: string): Promise<Treatment> {
  try {
    if (!id || id.trim() === "") {
      throw new Error("Treatment ID is required");
    }

    const treatmentRef = ref(db, `${TREATMENTS_PATH}/${id}`);
    const snapshot = await get(treatmentRef);

    if (!snapshot.exists()) {
      console.error(
        `Treatment with ID "${id}" not found in Firebase at path: ${TREATMENTS_PATH}/${id}`
      );
      throw new Error(`Treatment not found`);
    }

    const treatmentData = snapshot.val();

    // Validate that treatmentData is not null or undefined
    if (!treatmentData) {
      throw new Error("Treatment data is empty");
    }

    return {
      id,
      ...(treatmentData as Omit<Treatment, "id">),
    };
  } catch (error) {
    console.error("Error fetching treatment:", error);
    // Re-throw the error if it's already a known error
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch treatment");
  }
}

export async function createTreatment(
  data: Omit<
    Treatment,
    "id" | "averageRating" | "totalReviews" | "createdAt" | "updatedAt"
  >
): Promise<Treatment> {
  try {
    // Use treatment name as ID (lowercase with spaces replaced by hyphens)
    const id = data.name.toLowerCase().replace(/\s+/g, "-");
    const now = new Date().toISOString();

    const newTreatment: Treatment = {
      ...data,
      id,
      averageRating: 0,
      totalReviews: 0,
      createdAt: now,
      updatedAt: now,
      symptoms: data.symptoms || [],
    };

    // Remove id before saving (keep imageUrl if it has a value)
    const { id: _, ...treatmentData } = newTreatment;
    // Remove any undefined values before saving (but keep imageUrl if it exists)
    const cleanData = removeUndefined(treatmentData);
    await set(ref(db, `${TREATMENTS_PATH}/${id}`), cleanData);

    // Update symptoms node
    await updateSymptomsForTreatment(id, newTreatment.symptoms || []);

    return newTreatment;
  } catch (error) {
    console.error("Error creating treatment:", error);
    throw new Error("Failed to create treatment");
  }
}

export async function updateTreatment(
  id: string,
  data: Partial<Treatment>
): Promise<Treatment> {
  try {
    const treatmentRef = ref(db, `${TREATMENTS_PATH}/${id}`);
    const snapshot = await get(treatmentRef);

    if (!snapshot.exists()) {
      throw new Error("Treatment not found");
    }

    const existingTreatment = snapshot.val() as Omit<Treatment, "id">;
    const updatedTreatment: Treatment = {
      ...existingTreatment,
      ...data,
      id, // Ensure ID remains unchanged
      updatedAt: new Date().toISOString(),
    };

    // Remove id before saving (keep imageUrl if it has a value)
    const { id: _, ...treatmentData } = updatedTreatment;
    // Remove any undefined values before saving (but keep imageUrl if it exists)
    const cleanData = removeUndefined(treatmentData);
    await set(treatmentRef, cleanData);

    // Update symptoms node with new symptoms
    await updateSymptomsForTreatment(id, updatedTreatment.symptoms || []);

    return updatedTreatment;
  } catch (error) {
    console.error("Error updating treatment:", error);
    if (error instanceof Error && error.message === "Treatment not found") {
      throw error;
    }
    throw new Error("Failed to update treatment");
  }
}

export async function deleteTreatment(id: string): Promise<void> {
  try {
    const treatmentRef = ref(db, `${TREATMENTS_PATH}/${id}`);
    const snapshot = await get(treatmentRef);

    if (!snapshot.exists()) {
      throw new Error("Treatment not found");
    }

    // Delete the treatment
    await remove(treatmentRef);

    // Remove treatment from symptoms node
    await removeTreatmentFromSymptoms(id);

    // Optionally: Also delete associated reviews
    // For now, we'll keep reviews but they'll reference a non-existent treatment
  } catch (error) {
    console.error("Error deleting treatment:", error);
    if (error instanceof Error && error.message === "Treatment not found") {
      throw error;
    }
    throw new Error("Failed to delete treatment");
  }
}

// Export the update rating function for use in reviews API
export { updateTreatmentRating };
