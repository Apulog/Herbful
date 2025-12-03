/**
 * Test updating a treatment to verify symptoms2 node updates correctly
 *
 * Usage: npx tsx scripts/test-treatment-update.ts
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

async function testTreatmentUpdate() {
  console.log("🧪 Testing treatment update and symptoms2 node update...");

  try {
    // First, check current symptoms count
    const symptomsRef = db.ref("symptoms2");
    const symptomsSnapshot = await symptomsRef.get();
    const initialSymptomsCount = symptomsSnapshot.exists() ? Object.keys(symptomsSnapshot.val()).length : 0;
    console.log(`📊 Initial symptoms count: ${initialSymptomsCount}`);

    // Create a test treatment with initial symptoms
    const initialTreatment = {
      name: "Test Treatment Update",
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
      symptoms: ["headache", "fever"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const treatmentId = "test-treatment-update";
    const treatmentRef = db.ref(`treatments2/${treatmentId}`);
    await treatmentRef.set(initialTreatment);
    console.log("✅ Created initial test treatment");

    // Wait a moment for the symptoms node to update
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check symptoms for initial treatment
    const symptomsSnapshot2 = await symptomsRef.get();
    const symptomsData2 = symptomsSnapshot2.val();
    const initialHeadacheTreatmentIds = symptomsData2.headache?.treatmentIds || [];
    const initialFeverTreatmentIds = symptomsData2.fever?.treatmentIds || [];
    console.log(`📊 Initial headache treatments count: ${initialHeadacheTreatmentIds.length}`);
    console.log(`📊 Initial fever treatments count: ${initialFeverTreatmentIds.length}`);

    // Update the treatment with different symptoms
    const updatedTreatment = {
      name: "Test Treatment Update",
      sourceType: "Local Remedy",
      sources: [{
        authority: "Traditional Knowledge",
        url: "",
        description: "Traditional remedy passed down through generations",
        verificationDate: "2023-01-01"
      }],
      preparation: ["Boil water", "Add herbs", "Steep for 15 minutes"], // Changed
      usage: "Drink 1 cup twice daily for best results",
      dosage: "1 cup twice daily",
      warnings: ["Not recommended for pregnant women"],
      benefits: ["Anti-inflammatory", "Digestive aid", "Energy boost"], // Added benefit
      symptoms: ["fever", "body aches"], // Changed symptoms - removed headache, added body aches
      updatedAt: new Date().toISOString()
    };

    await treatmentRef.update(updatedTreatment);
    console.log("✅ Updated test treatment");

    // Wait a moment for the symptoms node to update
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check symptoms after update
    const symptomsSnapshot3 = await symptomsRef.get();
    const symptomsData3 = symptomsSnapshot3.val();
    const finalHeadacheTreatmentIds = symptomsData3.headache?.treatmentIds || [];
    const finalBodyAchesTreatmentIds = symptomsData3['body aches']?.treatmentIds || [];
    const finalFeverTreatmentIds = symptomsData3.fever?.treatmentIds || [];
    
    console.log(`📊 Final headache treatments count: ${finalHeadacheTreatmentIds.length}`);
    console.log(`📊 Final fever treatments count: ${finalFeverTreatmentIds.length}`);
    console.log(`📊 Final body aches treatments count: ${finalBodyAchesTreatmentIds.length}`);

    // Verify the treatment was removed from headache symptom
    const wasRemovedFromHeadache = !finalHeadacheTreatmentIds.includes(treatmentId);
    console.log(`✅ Treatment removed from headache symptom: ${wasRemovedFromHeadache}`);

    // Verify the treatment is still in fever symptom
    const stillInFever = finalFeverTreatmentIds.includes(treatmentId);
    console.log(`✅ Treatment still in fever symptom: ${stillInFever}`);

    // Verify the treatment was added to body aches symptom
    const wasAddedToBodyAches = finalBodyAchesTreatmentIds.includes(treatmentId);
    console.log(`✅ Treatment added to body aches symptom: ${wasAddedToBodyAches}`);

    // Check that existing symptoms weren't cleared
    const finalSymptomsCount = symptomsSnapshot3.exists() ? Object.keys(symptomsSnapshot3.val()).length : 0;
    console.log(`📊 Final symptoms count: ${finalSymptomsCount}`);
    
    if (finalSymptomsCount >= initialSymptomsCount) {
      console.log("✅ Existing symptoms were preserved");
    } else {
      console.log("❌ Some existing symptoms may have been lost");
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
testTreatmentUpdate()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });