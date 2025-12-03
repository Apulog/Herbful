/**
 * Extract symptoms data from Firebase Realtime Database
 *
 * Usage: npx tsx scripts/extract-symptoms.ts
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import credentials from "../lib/firebase-credentials.json";
import * as fs from "fs";

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

async function extractSymptoms() {
  console.log("🔍 Extracting symptoms from Firebase...\n");

  try {
    // Get treatments from Firebase to extract symptoms
    const treatmentsRef = db.ref("treatments2");
    const treatmentsSnapshot = await treatmentsRef.once("value");

    if (!treatmentsSnapshot.exists()) {
      console.log("⚠️  No treatments found in database");
      return;
    }

    const treatmentsData = treatmentsSnapshot.val();
    const symptomsSet = new Set<string>();

    // Extract all unique symptoms from treatments
    for (const [id, treatmentData] of Object.entries(treatmentsData)) {
      const treatment = treatmentData as any;
      if (Array.isArray(treatment.symptoms)) {
        treatment.symptoms.forEach((symptom: string) => {
          if (symptom && typeof symptom === "string" && symptom.trim()) {
            symptomsSet.add(symptom.trim());
          }
        });
      }
    }

    const symptoms = Array.from(symptomsSet).sort();
    console.log("✅ Found " + symptoms.length + " unique symptoms");

    // Create the seed file content
    const seedFileContent =
      "/**\\n" +
      " * Seed Firebase Realtime Database with symptoms data\\n" +
      " *\\n" +
      " * Usage: npx tsx scripts/seed-symptoms.ts\\n" +
      " * or: npm run seed:symptoms\\n" +
      " */\\n" +
      "\\n" +
      'import { initializeApp, cert, getApps } from "firebase-admin/app";\\n' +
      'import { getDatabase } from "firebase-admin/database";\\n' +
      'import credentials from "../lib/firebase-credentials.json";\\n' +
      "\\n" +
      "// Initialize Firebase Admin SDK\\n" +
      "if (!getApps().length) {\\n" +
      "  initializeApp({\\n" +
      "    credential: cert({\\n" +
      "      projectId: credentials.project_id,\\n" +
      "      clientEmail: credentials.client_email,\\n" +
      '      privateKey: credentials.private_key.replace(/\\\\\\\\n/g, "\\\\n"),\\n' +
      "    }),\\n" +
      "    databaseURL:\\n" +
      '      "https://herbful-535e4-default-rtdb.asia-southeast1.firebasedatabase.app",\\n' +
      "  });\\n" +
      "}\\n" +
      "\\n" +
      "const db = getDatabase();\\n" +
      "\\n" +
      "// Symptoms data\\n" +
      "const symptomsData: string[] = " +
      JSON.stringify(symptoms, null, 2) +
      ";\\n" +
      "\\n" +
      "async function seedSymptoms() {\\n" +
      '  console.log("🌱 Starting to seed Firebase database with symptoms...\\n");\\n' +
      "\\n" +
      "  try {\\n" +
      '    const symptomsRef = db.ref("symptoms");\\n' +
      "    \\n" +
      "    // Clear existing symptoms\\n" +
      "    await symptomsRef.remove();\\n" +
      '    console.log("🗑️  Cleared existing symptoms");\\n' +
      "\\n" +
      "    // Add all symptoms\\n" +
      '    console.log("📝 Creating symptoms...");\\n' +
      "    let createdCount = 0;\\n" +
      "\\n" +
      "    for (const symptom of symptomsData) {\\n" +
      "      // Generate ID for symptom\\n" +
      "      const id = symptom.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');\\n" +
      "      \\n" +
      "      const symptomData = {\\n" +
      "        name: symptom,\\n" +
      "        id: id,\\n" +
      "        createdAt: new Date().toISOString(),\\n" +
      "        updatedAt: new Date().toISOString(),\\n" +
      "      };\\n" +
      "\\n" +
      "      await symptomsRef.child(id).set(symptomData);\\n" +
      '      console.log("   ✓ Created symptom: " + symptom);\\n' +
      "      createdCount++;\\n" +
      "    }\\n" +
      "\\n" +
      '    console.log("\\n✅ Symptom operations completed:");\\n' +
      '    console.log("   - Created: " + createdCount + "\\n");\\n' +
      '    console.log("\\n🎉 Database seeding completed successfully!");\\n' +
      "  } catch (error) {\\n" +
      '    console.error("❌ Error seeding database:", error);\\n' +
      "    process.exit(1);\\n" +
      "  }\\n" +
      "}\\n" +
      "\\n" +
      "// Run the seed function\\n" +
      "seedSymptoms()\\n" +
      "  .then(() => {\\n" +
      '    console.log("\\n✨ Done!");\\n' +
      "    process.exit(0);\\n" +
      "  })\\n" +
      "  .catch((error) => {\\n" +
      '    console.error("❌ Fatal error:", error);\\n' +
      "    process.exit(1);\\n" +
      "  });\\n";

    // Write to file
    fs.writeFileSync(
      "c:/Users/Joshua/Downloads/Downloads/herbful-appadmin/scripts/seed-symptoms.ts",
      seedFileContent
    );

    console.log("✅ Created seed-symptoms.ts file with symptoms data");
    console.log("\\n📁 File saved to: scripts/seed-symptoms.ts");
  } catch (error) {
    console.error("❌ Error extracting symptoms:", error);
    process.exit(1);
  }
}

// Run the extraction function
extractSymptoms()
  .then(() => {
    console.log("\\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
