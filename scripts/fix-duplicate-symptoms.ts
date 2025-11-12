/**
 * Fix duplicate symptoms in Firebase database by normalizing case and merging duplicates
 *
 * Usage: npx tsx scripts/fix-duplicate-symptoms.ts
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import credentials from "../lib/firebase-credentials.json";

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: credentials.project_id,
      clientEmail: credentials.client_email,
      privateKey: credentials.private_key.replace(/\\n/g, "\n"),
    }),
    databaseURL:
      "https://herbful-535e4-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

const db = getDatabase();

/**
 * Sanitizes a symptom name to be used as a Firebase key
 * Replaces invalid characters: ".", "#", "$", "/", "[", "]"
 * Also normalizes case to prevent duplicates
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
 * Normalizes a symptom name for display (preserving original case)
 */
function normalizeSymptomName(symptomName: string): string {
  return symptomName.trim();
}

async function fixDuplicateSymptoms() {
  console.log("🔍 Starting to fix duplicate symptoms...\n");

  try {
    // Get all treatments
    const treatmentsRef = db.ref("treatments");
    const treatmentsSnapshot = await treatmentsRef.once("value");

    if (!treatmentsSnapshot.exists()) {
      console.log("ℹ️  No treatments found in database.");
      return;
    }

    const treatments = treatmentsSnapshot.val();
    console.log(`📋 Found ${Object.keys(treatments).length} treatments.`);

    // Collect all symptoms and their associated treatments
    const symptomMap: Record<
      string,
      {
        normalizedKey: string;
        originalName: string;
        treatmentIds: string[];
      }
    > = {};

    // Process each treatment's symptoms
    for (const [treatmentId, treatmentData] of Object.entries(treatments)) {
      const treatment = treatmentData as any;
      if (Array.isArray(treatment.symptoms)) {
        for (const symptom of treatment.symptoms) {
          if (symptom && typeof symptom === "string" && symptom.trim()) {
            const originalName = symptom.trim();
            const normalizedKey = sanitizeSymptomKey(originalName);

            if (!symptomMap[normalizedKey]) {
              symptomMap[normalizedKey] = {
                normalizedKey,
                originalName,
                treatmentIds: [],
              };
            }

            // Add treatment ID if not already present
            if (!symptomMap[normalizedKey].treatmentIds.includes(treatmentId)) {
              symptomMap[normalizedKey].treatmentIds.push(treatmentId);
            }

            // Keep the original name (prefer the first one we encounter)
            // In the future, we might want to choose the most common capitalization
          }
        }
      }
    }

    console.log(
      `📊 Found ${
        Object.keys(symptomMap).length
      } unique symptoms after normalization.`
    );

    // Identify duplicates (symptoms that map to the same normalized key)
    const duplicates: Record<
      string,
      {
        normalizedKey: string;
        originalNames: string[];
        treatmentIds: string[];
      }
    > = {};

    for (const [normalizedKey, symptomData] of Object.entries(symptomMap)) {
      // Find all original names that map to this normalized key
      const originalNames = new Set<string>();
      const treatmentIds: string[] = [];

      for (const [treatmentId, treatmentData] of Object.entries(treatments)) {
        const treatment = treatmentData as any;
        if (Array.isArray(treatment.symptoms)) {
          for (const symptom of treatment.symptoms) {
            if (symptom && typeof symptom === "string" && symptom.trim()) {
              const originalName = symptom.trim();
              const key = sanitizeSymptomKey(originalName);

              if (key === normalizedKey) {
                originalNames.add(originalName);
                if (!treatmentIds.includes(treatmentId)) {
                  treatmentIds.push(treatmentId);
                }
              }
            }
          }
        }
      }

      // If there are multiple original names, we have duplicates
      if (originalNames.size > 1) {
        duplicates[normalizedKey] = {
          normalizedKey,
          originalNames: Array.from(originalNames),
          treatmentIds,
        };
      }
    }

    // Report duplicates found
    const duplicateCount = Object.keys(duplicates).length;
    if (duplicateCount > 0) {
      console.log(`\n⚠️  Found ${duplicateCount} sets of duplicate symptoms:`);
      for (const [key, dup] of Object.entries(duplicates)) {
        console.log(
          `   - "${key}" has variants: ${dup.originalNames
            .map((n) => `"${n}"`)
            .join(", ")}`
        );
      }
    } else {
      console.log("\n✅ No duplicate symptoms found!");
    }

    // Update treatments to use normalized symptom names
    console.log("\n🔄 Updating treatments with normalized symptom names...");
    let updatedTreatments = 0;

    for (const [treatmentId, treatmentData] of Object.entries(treatments)) {
      const treatment = treatmentData as any;
      if (Array.isArray(treatment.symptoms)) {
        let symptomsUpdated = false;
        const updatedSymptoms: string[] = [];

        // Normalize each symptom
        for (const symptom of treatment.symptoms) {
          if (symptom && typeof symptom === "string" && symptom.trim()) {
            const originalName = symptom.trim();
            const normalizedKey = sanitizeSymptomKey(originalName);
            const normalizedSymptom =
              symptomMap[normalizedKey]?.originalName || originalName;

            // Only add if not already in the list (prevent duplicates within the same treatment)
            if (!updatedSymptoms.includes(normalizedSymptom)) {
              updatedSymptoms.push(normalizedSymptom);
            }

            // Check if we changed anything
            if (originalName !== normalizedSymptom) {
              symptomsUpdated = true;
            }
          }
        }

        // Update treatment if symptoms changed
        if (symptomsUpdated) {
          await treatmentsRef.child(treatmentId).update({
            symptoms: updatedSymptoms,
            updatedAt: new Date().toISOString(),
          });
          updatedTreatments++;
          console.log(
            `   ✓ Updated treatment ${treatmentId}: normalized symptoms`
          );
        }
      }
    }

    console.log(
      `\n✅ Updated ${updatedTreatments} treatments with normalized symptoms.`
    );

    // Rebuild symptoms node with normalized keys
    console.log("\n🏗️  Rebuilding symptoms node with normalized keys...");

    // Get updated treatments after normalization
    const updatedTreatmentsSnapshot = await treatmentsRef.once("value");
    const updatedTreatmentsData = updatedTreatmentsSnapshot.val();

    const normalizedSymptomsMap: Record<
      string,
      {
        name: string;
        treatmentIds: string[];
      }
    > = {};

    // Process each treatment's symptoms again with normalized data
    for (const [treatmentId, treatmentData] of Object.entries(
      updatedTreatmentsData
    )) {
      const treatment = treatmentData as any;
      if (Array.isArray(treatment.symptoms)) {
        for (const symptom of treatment.symptoms) {
          if (symptom && typeof symptom === "string" && symptom.trim()) {
            const originalName = symptom.trim();
            const normalizedKey = sanitizeSymptomKey(originalName);

            if (!normalizedSymptomsMap[normalizedKey]) {
              normalizedSymptomsMap[normalizedKey] = {
                name: originalName, // Use the actual case from the normalized treatment
                treatmentIds: [],
              };
            }

            // Add treatment ID if not already present
            if (
              !normalizedSymptomsMap[normalizedKey].treatmentIds.includes(
                treatmentId
              )
            ) {
              normalizedSymptomsMap[normalizedKey].treatmentIds.push(
                treatmentId
              );
            }
          }
        }
      }
    }

    // Save the normalized symptoms node
    const symptomsRef = db.ref("symptoms");
    await symptomsRef.set(normalizedSymptomsMap);

    console.log(
      `✅ Rebuilt symptoms node with ${
        Object.keys(normalizedSymptomsMap).length
      } unique symptoms.`
    );

    console.log("\n🎉 Duplicate symptoms fix completed successfully!");
    console.log(`\n📊 Summary:`);
    console.log(
      `   - Unique symptoms after normalization: ${
        Object.keys(normalizedSymptomsMap).length
      }`
    );
    console.log(`   - Treatments updated: ${updatedTreatments}`);

    if (duplicateCount > 0) {
      console.log(`   - Duplicate sets resolved: ${duplicateCount}`);
    }
  } catch (error) {
    console.error("❌ Error fixing duplicate symptoms:", error);
    process.exit(1);
  }
}

// Run the fix function
fixDuplicateSymptoms()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
