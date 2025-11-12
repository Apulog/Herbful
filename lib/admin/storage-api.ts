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
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
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
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw an error here as we don't want to interrupt the main operation
    // The image deletion is a secondary operation
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
