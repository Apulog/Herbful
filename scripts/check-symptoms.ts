/**
 * Check Firebase Realtime Database symptoms2 node structure
 *
 * Usage: npx tsx scripts/check-symptoms.ts
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
      privateKey: credentials.private_key.replace(/\n/g, "\n"),
    }),
    databaseURL:
      "https://herbful-535e4-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

const db = getDatabase();

async function checkSymptoms() {
  console.log("🔍 Checking symptoms2 node structure...");

  try {
    const symptomsRef = db.ref("symptoms2");
    const symptomsSnapshot = await symptomsRef.get();
    
    if (!symptomsSnapshot.exists()) {
      console.log("❌ symptoms2 node does not exist");
      return;
    }

    const symptoms = symptomsSnapshot.val();
    console.log(`✅ Found ${Object.keys(symptoms).length} symptom entries in symptoms2 node`);
    
    // Show first few entries as examples
    console.log("\n📋 Sample symptom entries:");
    let count = 0;
    for (const [key, data] of Object.entries(symptoms)) {
      if (count >= 3) break;
      console.log(`  ${key}:`, JSON.stringify(data, null, 2));
      count++;
    }
    
    // Check if the structure is correct
    let isValidStructure = true;
    for (const [key, data] of Object.entries(symptoms)) {
      if (typeof data !== 'object' || data === null) {
        console.log(`❌ Invalid structure for symptom ${key}: not an object`);
        isValidStructure = false;
        break;
      }
      
      if (!('name' in data) || !('treatmentIds' in data)) {
        console.log(`❌ Invalid structure for symptom ${key}: missing required fields`);
        isValidStructure = false;
        break;
      }
      
      if (!Array.isArray(data.treatmentIds)) {
        console.log(`❌ Invalid structure for symptom ${key}: treatmentIds is not an array`);
        isValidStructure = false;
        break;
      }
    }
    
    if (isValidStructure) {
      console.log("✅ Symptoms2 node has the correct structure!");
    } else {
      console.log("❌ Symptoms2 node has invalid structure");
    }
    
  } catch (error) {
    console.error("❌ Error checking symptoms:", error);
    process.exit(1);
  }
}

// Run the check function
checkSymptoms()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });