/**
 * Export treatments data from Firebase Realtime Database to JSON
 *
 * Usage: npx tsx scripts/export-treatments.ts
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

async function exportTreatments() {
  console.log("📥 Fetching treatments from Firebase database...\n");

  try {
    const treatmentsRef = db.ref("treatments");
    const snapshot = await treatmentsRef.once("value");

    if (!snapshot.exists()) {
      console.log("⚠️  No treatments found in database");
      return;
    }

    const treatments = snapshot.val();

    // Convert Firebase object to array format
    const treatmentsArray = Object.entries(treatments).map(([id, data]) => ({
      id,
      ...(data as object),
    }));

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, "..", "data");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to JSON file
    const outputPath = path.join(outputDir, "treatments.json");
    fs.writeFileSync(outputPath, JSON.stringify(treatmentsArray, null, 2));

    console.log(`✅ Treatments exported successfully!`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`📊 Total treatments: ${treatmentsArray.length}`);
  } catch (error) {
    console.error("❌ Error exporting treatments:", error);
    process.exit(1);
  }
}

// Run the export function
exportTreatments()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
