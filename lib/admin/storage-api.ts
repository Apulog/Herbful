// Firebase Storage API for image uploads
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase-client";

const IMAGES_PATH = "treatments/images";

/**
 * Upload an image file to Firebase Storage
 * @param file - The image file to upload
 * @param treatmentId - The treatment ID to associate with the image
 * @returns The download URL of the uploaded image
 */
export async function uploadTreatmentImage(
  file: File,
  treatmentId: string
): Promise<string> {
  try {
    // Create a reference to the storage location
    const imageRef = ref(
      storage,
      `${IMAGES_PATH}/${treatmentId}/${Date.now()}_${file.name}`
    );

    // Upload the file
    await uploadBytes(imageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(imageRef);

    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading image:", error);

    // Handle Firebase Storage permission errors specifically
    if (error?.code === "storage/unauthorized") {
      throw new Error(
        "Insufficient permissions to upload image to Firebase Storage"
      );
    }

    throw new Error(
      "Failed to upload image: " + (error?.message || "Unknown error")
    );
  }
}

/**
 * Delete an image from Firebase Storage
 * @param imageUrl - The download URL of the image to delete
 */
export async function deleteTreatmentImage(imageUrl: string): Promise<void> {
  // Check if imageUrl is valid
  if (!imageUrl || typeof imageUrl !== "string") {
    console.warn("Invalid image URL provided for deletion:", imageUrl);
    return;
  }

  // Check if it's a Firebase Storage URL
  if (!imageUrl.includes("firebasestorage.googleapis.com")) {
    console.warn("URL is not a Firebase Storage URL:", imageUrl);
    return;
  }

  try {
    // Extract the path from the URL
    // Firebase Storage URLs format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media
    const url = new URL(imageUrl);

    // More robust path extraction
    const pathMatch = url.pathname.match(/\/o\/(.+?)(?:\?|$)/);

    if (!pathMatch || !pathMatch[1]) {
      console.warn("Could not extract path from image URL:", imageUrl);
      console.warn("Pathname was:", url.pathname);
      return;
    }

    // Decode the path (Firebase Storage URLs are encoded)
    const encodedPath = pathMatch[1];
    const decodedPath = decodeURIComponent(encodedPath);

    // Create a reference to the file
    const imageRef = ref(storage, decodedPath);

    // Delete the file
    await deleteObject(imageRef);
  } catch (error: any) {
    console.error("Error deleting image:", error);

    // Don't throw permission errors as they shouldn't break the main operation
    // The image deletion is a secondary operation
    if (error?.code === "storage/unauthorized") {
      console.warn(
        "Insufficient permissions to delete image from Firebase Storage:",
        imageUrl
      );
      return;
    }

    // For other errors, still don't throw but log them
    console.warn(
      "Non-permission error deleting image:",
      error?.message || "Unknown error"
    );
  }
}

/**
 * Get a reference to an image in Firebase Storage
 * @param treatmentId - The treatment ID
 * @param fileName - The file name
 * @returns Storage reference
 */
export function getTreatmentImageRef(treatmentId: string, fileName: string) {
  return ref(storage, `${IMAGES_PATH}/${treatmentId}/${fileName}`);
}

/**
 * Check if an image URL is accessible
 * @param imageUrl - The image URL to check
 * @returns True if accessible, false otherwise
 */
export async function isImageAccessible(imageUrl: string): Promise<boolean> {
  try {
    // For Firebase Storage URLs, we need to handle them specially
    if (imageUrl.includes("firebasestorage.googleapis.com")) {
      // For Firebase Storage, we can't reliably check accessibility due to CORS
      // Instead, we'll assume it's accessible and let the Image component handle errors
      // This is a common approach for Firebase Storage URLs in web apps
      return true;
    }

    // For non-Firebase URLs, use a simple HEAD request
    const response = await fetch(imageUrl, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    // Handle CORS errors specifically - if we can't check due to CORS, assume accessible
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.warn(
        "Cannot check image accessibility due to CORS policy:",
        imageUrl
      );
      // In case of CORS errors, we assume the image might be accessible
      // The actual image loading will determine if it's really accessible
      return true;
    }

    console.warn("Image accessibility check failed for", imageUrl, ":", error);
    return false;
  }
}
