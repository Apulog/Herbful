// Firebase data type definitions

export interface Treatment {
  id: string; // Unique identifier (timestamp-based)
  name: string; // Treatment name (e.g., "Ginger Tea")
  symptoms?: string[]; // Conditions it treats (optional)
  imageUrl?: string; // Optional image URL (NOT stored in Realtime Database - use Firebase Storage instead)
  preparation: string[]; // Step-by-step preparation instructions
  usage: string; // How to use (e.g., "Drink warm, 2-3 times daily")
  dosage: string; // Dosage amount (e.g., "1 cup per serving")
  warnings: string[]; // Safety warnings
  benefits: string[]; // Health benefits
  sourceType: "Local Remedy" | "Verified Source";
  sourceInfo?: {
    authority: string; // Source authority (WHO, EMA, etc.)
    url: string; // Reference URL
    description: string; // Verification description
    verificationDate: string; // Date verified
  };
  averageRating: number; // Avg rating (0-5)
  totalReviews: number; // Number of reviews
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface Rating {
  id: string; // Unique ID (timestamp-based)
  treatmentName: string; // Name of treatment rated
  rating: number; // Rating (1-5)
  comment: string; // User comment/review text
  date: string; // ISO timestamp
  name?: string; // Optional reviewer name
  anonymous: boolean; // Whether posted anonymously
}

export interface TreatmentRating {
  averageRating: number; // Calculated average rating
  totalReviews: number; // Total number of reviews
  feedbacks: Rating[]; // Array of individual ratings, sorted newest first
}

export interface Review {
  id: string; // Unique ID
  treatmentName: string; // Treatment name
  treatmentId: string; // Treatment ID reference
  rating: number; // Rating (1-5)
  comment: string; // Review comment
  userName: string; // Reviewer name
  userEmail: string; // Reviewer email
  anonymous: boolean; // Anonymous flag
  adminNotes?: string; // Admin notes
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface SourceInfo {
  authority: string; // Organization (WHO, EMA, etc.)
  url: string; // Reference URL
  description: string; // Description of source
  verificationDate: string; // Date verified
}

export interface TreatmentSource {
  name: string; // Treatment name
  sourceType: "Local Remedy" | "Verified Source";
  sourceInfo?: SourceInfo; // Optional source details
}

export interface ReviewStats {
  total: number;
}

// Symptom data for individual treatments
export interface TreatmentSymptomData {
  symptoms: string[]; // Array of selected symptoms
}

// Symptoms node structure: maps sanitized symptom key to symptom data
export interface SymptomData {
  name: string; // Original symptom name
  treatmentIds: string[]; // Array of treatment IDs that treat this symptom
}

// Symptoms node structure: maps sanitized symptom key to symptom data
export interface SymptomsNode {
  [sanitizedKey: string]: SymptomData;
}
