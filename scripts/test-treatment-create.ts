/**
 * Test creating a new treatment to verify symptoms2 node updates correctly
 *
 * Usage: npx tsx scripts/test-treatment-create.ts
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

async function testTreatmentCreate() {
  console.log("🧪 Testing treatment creation and symptoms2 node update...");

  try {
    // First, check current symptoms count
    const symptomsRef = db.ref("symptoms2");
    const symptomsSnapshot = await symptomsRef.get();
    const initialSymptomsCount = symptomsSnapshot.exists() ? Object.keys(symptomsSnapshot.val()).length : 0;
    console.log(`📊 Initial symptoms count: ${initialSymptomsCount}`);

    // Create a new test treatment with some symptoms
    const testTreatment = {
      name: "Test Treatment",
      sourceType: "Local Remedy",
      sources: [{
        authority: "Traditional Knowledge",
        url: "",
        description: "Traditional remedy passed down through generations",
        verificationDate: "2023-01-01"
      }],
      preparation: ["Boil water", "Add herbs", "Steep for 10 minutes"],
      usage: "Drink 1 cup twice daily for best results",
      dosage: "1 cup twice daily",
      warnings: ["Not recommended for pregnant women"],
      benefits: ["Anti-inflammatory", "Digestive aid"],
      symptoms: ["headache", "fever", "body aches"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const treatmentId = "test-treatment";
    const treatmentRef = db.ref(`treatments2/${treatmentId}`);
    await treatmentRef.set(testTreatment);
    console.log("✅ Created test treatment");

    // Wait a moment for the symptoms node to update
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check symptoms count again
    const symptomsSnapshot2 = await symptomsRef.get();
    const finalSymptomsCount = symptomsSnapshot2.exists() ? Object.keys(symptomsSnapshot2.val()).length : 0;
    console.log(`📊 Final symptoms count: ${finalSymptomsCount}`);

    // Check if the specific symptoms were added
    const symptomsData = symptomsSnapshot2.val();
    const headacheExists = symptomsData && 'headache' in symptomsData;
    const feverExists = symptomsData && 'fever' in symptomsData;
    const bodyAchesExists = symptomsData && 'body aches' in symptomsData;

    console.log(`✅ Headache symptom exists: ${headacheExists}`);
    console.log(`✅ Fever symptom exists: ${feverExists}`);
    console.log(`✅ Body aches symptom exists: ${bodyAchesExists}`);

    // Check that existing symptoms weren't cleared
    if (finalSymptomsCount >= initialSymptomsCount) {
      console.log("✅ Existing symptoms were preserved");
    } else {
      console.log("❌ Some existing symptoms may have been lost");
    }

    // Verify the treatment was added to the symptoms
    if (headacheExists && symptomsData.headache.treatmentIds.includes(treatmentId)) {
      console.log("✅ Test treatment correctly added to headache symptom");
    }
    if (feverExists && symptomsData.fever.treatmentIds.includes(treatmentId)) {
      console.log("✅ Test treatment correctly added to fever symptom");
    }
    if (bodyAchesExists && symptomsData['body aches'].treatmentIds.includes(treatmentId)) {
      console.log("✅ Test treatment correctly added to body aches symptom");
    }

    // Clean up - remove the test treatment
    await treatmentRef.remove();
    console.log("🧹 Cleaned up test treatment");

    console.log("\n🎉 Test completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during test:", error);
    process.exit(1);
  }
}

// Run the test function
testTreatmentCreate()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });