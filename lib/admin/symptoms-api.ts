// Firebase API functions for symptoms node management
import { ref, set, get } from "firebase/database";
import { db } from "@/lib/firebase-client";
import type { SymptomsNode, SymptomData } from "@/lib/types/firebase";

const SYMPTOMS_PATH = "symptoms";

/**
 * Sanitizes a symptom name to be used as a Firebase key
 * Replaces invalid characters: ".", "#", "$", "/", "[", "]"
 */
function sanitizeSymptomKey(symptomName: string): string {
  return symptomName
    .toLowerCase() // Normalize to lowercase to prevent case-sensitive duplicates
    .replace(/\./g, "_")
    .replace(/#/g, "_")
    .replace(/\$/g, "_")
    .replace(/\//g, "_")
    .replace(/\[/g, "_")
    .replace(/\]/g, "_")
    .trim();
}

/**
 * Updates the symptoms node in the database based on all treatments
 * This aggregates all symptoms from all treatments into a single node
 */
export async function syncSymptomsNode(): Promise<void> {
  try {
    // Get all treatments
    const treatmentsRef = ref(db, "treatments");
    const treatmentsSnapshot = await get(treatmentsRef);

    if (!treatmentsSnapshot.exists()) {
      // No treatments, clear symptoms node
      await set(ref(db, SYMPTOMS_PATH), {});
      return;
    }

    const treatments = treatmentsSnapshot.val();
    const symptomsMap: SymptomsNode = {};

    // Iterate through all treatments
    Object.entries(treatments).forEach(
      ([treatmentId, treatmentData]: [string, any]) => {
        // Get symptoms for this treatment
        const symptoms = treatmentData.symptoms || [];

        // For each symptom, add this treatment ID to the list
        symptoms.forEach((symptom: string) => {
          if (symptom && symptom.trim()) {
            const symptomName = symptom.trim();
            const sanitizedKey = sanitizeSymptomKey(symptomName);

            if (!symptomsMap[sanitizedKey]) {
              symptomsMap[sanitizedKey] = {
                name: symptomName,
                treatmentIds: [],
              } as SymptomData;
            }
            // Only add if not already in the list
            if (!symptomsMap[sanitizedKey].treatmentIds.includes(treatmentId)) {
              symptomsMap[sanitizedKey].treatmentIds.push(treatmentId);
            }
          }
        });
      }
    );

    // Save the symptoms node
    await set(ref(db, SYMPTOMS_PATH), symptomsMap);
  } catch (error) {
    console.error("Error syncing symptoms node:", error);
    throw new Error("Failed to sync symptoms node");
  }
}

/**
 * Gets the symptoms node from the database
 */
export async function getSymptomsNode(): Promise<SymptomsNode> {
  try {
    const symptomsRef = ref(db, SYMPTOMS_PATH);
    const snapshot = await get(symptomsRef);

    if (!snapshot.exists()) {
      return {};
    }

    return snapshot.val() as SymptomsNode;
  } catch (error) {
    console.error("Error fetching symptoms node:", error);
    throw new Error("Failed to fetch symptoms node");
  }
}

/**
 * Updates symptoms for a specific treatment
 * This is a helper function that updates the symptoms node when a single treatment changes
 */
export async function updateSymptomsForTreatment(
  treatmentId: string,
  symptoms: string[]
): Promise<void> {
  try {
    // Get current symptoms node
    const symptomsNode = await getSymptomsNode();

    // Remove this treatment from all symptoms first
    Object.keys(symptomsNode).forEach((sanitizedKey) => {
      const symptomData = symptomsNode[sanitizedKey];
      // Check if symptomData exists and has treatmentIds before filtering
      if (symptomData && Array.isArray(symptomData.treatmentIds)) {
        symptomData.treatmentIds = symptomData.treatmentIds.filter(
          (id) => id !== treatmentId
        );
        // Remove empty symptom entries
        if (symptomData.treatmentIds.length === 0) {
          delete symptomsNode[sanitizedKey];
        }
      } else {
        // If symptomData is invalid, remove the entry
        delete symptomsNode[sanitizedKey];
      }
    });

    // Add this treatment to its symptoms
    symptoms.forEach((symptom) => {
      if (symptom && symptom.trim()) {
        const symptomName = symptom.trim();
        const sanitizedKey = sanitizeSymptomKey(symptomName);

        if (!symptomsNode[sanitizedKey]) {
          symptomsNode[sanitizedKey] = {
            name: symptomName,
            treatmentIds: [],
          } as SymptomData;
        }
        if (!symptomsNode[sanitizedKey].treatmentIds.includes(treatmentId)) {
          symptomsNode[sanitizedKey].treatmentIds.push(treatmentId);
        }
      }
    });

    // Save updated symptoms node
    await set(ref(db, SYMPTOMS_PATH), symptomsNode);
  } catch (error) {
    console.error("Error updating symptoms for treatment:", error);
    throw new Error("Failed to update symptoms for treatment");
  }
}

/**
 * Removes a treatment from the symptoms node
 */
export async function removeTreatmentFromSymptoms(
  treatmentId: string
): Promise<void> {
  try {
    const symptomsNode = await getSymptomsNode();

    // Remove this treatment from all symptoms
    Object.keys(symptomsNode).forEach((sanitizedKey) => {
      const symptomData = symptomsNode[sanitizedKey];
      // Check if symptomData exists and has treatmentIds before filtering
      if (symptomData && Array.isArray(symptomData.treatmentIds)) {
        symptomData.treatmentIds = symptomData.treatmentIds.filter(
          (id) => id !== treatmentId
        );
        // Remove empty symptom entries
        if (symptomData.treatmentIds.length === 0) {
          delete symptomsNode[sanitizedKey];
        }
      } else {
        // If symptomData is invalid, remove the entry
        delete symptomsNode[sanitizedKey];
      }
    });

    // Save updated symptoms node
    await set(ref(db, SYMPTOMS_PATH), symptomsNode);
  } catch (error) {
    console.error("Error removing treatment from symptoms:", error);
    throw new Error("Failed to remove treatment from symptoms");
  }
}

/**
 * Renames a symptom across all treatments
 * This updates the symptom name in all treatments that use it
 */
export async function renameSymptom(
  oldName: string,
  newName: string
): Promise<void> {
  try {
    if (!oldName || !newName || oldName.trim() === newName.trim()) {
      return;
    }

    const oldNameTrimmed = oldName.trim();
    const newNameTrimmed = newName.trim();

    // Get all treatments
    const treatmentsRef = ref(db, "treatments");
    const treatmentsSnapshot = await get(treatmentsRef);

    if (!treatmentsSnapshot.exists()) {
      return;
    }

    const treatments = treatmentsSnapshot.val();
    const updates: Record<string, any> = {};

    // Update each treatment that has this symptom
    Object.entries(treatments).forEach(
      ([treatmentId, treatmentData]: [string, any]) => {
        const symptoms = treatmentData.symptoms || [];
        if (symptoms.includes(oldNameTrimmed)) {
          // Replace the old symptom name with the new one
          const updatedSymptoms = symptoms.map((symptom: string) =>
            symptom === oldNameTrimmed ? newNameTrimmed : symptom
          );
          updates[`treatments/${treatmentId}/symptoms`] = updatedSymptoms;
          updates[`treatments/${treatmentId}/updatedAt`] =
            new Date().toISOString();
        }
      }
    );

    // Apply all updates
    if (Object.keys(updates).length > 0) {
      await Promise.all(
        Object.entries(updates).map(([path, value]) => {
          const pathRef = ref(db, path);
          return set(pathRef, value);
        })
      );
    }

    // Sync the symptoms node to reflect the rename
    await syncSymptomsNode();
  } catch (error) {
    console.error("Error renaming symptom:", error);
    throw new Error("Failed to rename symptom");
  }
}
