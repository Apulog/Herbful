/**
 * Import treatments data from JSON to Firebase Realtime Database
 *
 * Usage: npx tsx scripts/import-treatments.ts
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import * as fs from "fs";
import * as path from "path";
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

async function importTreatments() {
  console.log("📥 Importing treatments from JSON file...\n");

  try {
    // Read the JSON file
    const jsonPath = path.join(__dirname, "..", "data", "treatments.json");
    const jsonData = fs.readFileSync(jsonPath, "utf-8");
    const treatments = JSON.parse(jsonData);

    console.log(`📊 Found ${treatments.length} treatments to import`);

    // Clear existing treatments
    console.log("\n🗑️  Clearing existing treatments...");
    const treatmentsRef = db.ref("treatments");
    await treatmentsRef.remove();
    console.log("✓ Cleared existing treatments");

    // Import new treatments
    console.log("\n📝 Importing new treatments...\n");
    let importedCount = 0;

    for (const treatment of treatments) {
      const id = treatment.id;
      const { id: _, ...treatmentData } = treatment; // Remove id field from data

      await treatmentsRef.child(id).set(treatmentData);
      console.log(`   ✓ Imported: ${treatment.name}`);
      importedCount++;
    }

    console.log(`\n✅ Import completed successfully!`);
    console.log(`📊 Total treatments imported: ${importedCount}`);
  } catch (error) {
    console.error("❌ Error importing treatments:", error);
    process.exit(1);
  }
}

// Run the import function
importTreatments()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
