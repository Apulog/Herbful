/**
 * Seed Firebase Realtime Database with symptoms data
 *
 * Usage: npx tsx scripts/seed-symptoms.ts
 * or: npm run seed:symptoms
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

// Helper function to sanitize symptom names for Firebase keys
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

// Symptoms data
const symptomsData: string[] = [
  "Bleeding",
  "Bloating",
  "Cancer-related symptoms",
  "Chest heaviness",
  "Cough",
  "Coughing",
  "Elevated blood pressure",
  "Frequent urination",
  "Headache",
  "High blood pressure (dizziness/throbbing)",
  "High blood sugar symptoms",
  "High blood sugar symptoms (fatigue, thirst)",
  "Infected or slow-healing wounds",
  "Irregular menstrual flow or delay",
  "Itchy, scaly skin patches",
  "Joint pain and swelling",
  "Loose or painful bowel movements",
  "Low platelet count",
  "Painful urination",
  "Persistent coughing",
  "Persistent fever",
  "Poor digestion",
  "Skin redness",
  "Stomach pain",
  "Stomach spasms",
  "Upset stomach",
  "Worm infestation (abdominal discomfort, itching)",
  "abdominal bloating or gas-related discomfort",
  "abdominal discomfort",
  "abdominal pain",
  "abdominal pain or cramps",
  "abdominal pain with diarrhea",
  "acne",
  "allergic rhinitis",
  "anxiety or tension",
  "bloating",
  "body aches",
  "body heat or fever",
  "body pain",
  "boils",
  "chest congestion",
  "congestion",
  "cough",
  "cough and congestion",
  "cough and throat irritation",
  "craving for sweets",
  "dandruff",
  "diarrhea",
  "difficulty breathing/wheezing",
  "digestive discomfort",
  "digestive issues",
  "digestive upset",
  "dizziness",
  "dizziness from high blood pressure",
  "elevated blood pressure",
  "elevated blood pressure symptoms",
  "elevated blood sugar symptoms",
  "elevated cholesterol",
  "excessive thirst",
  "eye irritation",
  "fatigue",
  "fever",
  "fever and body heat",
  "fever heat",
  "fever or chills",
  "frequent urination",
  "fungal skin irritation",
  "gastric pain",
  "gum bleeding",
  "gum swelling",
  "headache",
  "headaches",
  "high blood pressure symptoms",
  "high blood sugar symptoms",
  "high cholesterol",
  "indigestion",
  "indigestion cramps",
  "indigestion/gas",
  "inflammation",
  "inflammation in affected areas",
  "inflammation or swelling",
  "inflammation-related pain",
  "intestinal discomfort",
  "irritation from fungal infections",
  "joint or body aches",
  "joint or menstrual pain",
  "joint pain",
  "joint pain and swelling",
  "joint pain or stiffness",
  "joint stiffness",
  "joint stiffness or pain",
  "loose bowel movement",
  "loose stools",
  "loss of appetite",
  "low breastmilk flow",
  "low platelet-related bleeding",
  "menstrual cramps",
  "menstrual pain",
  "mental restlessness",
  "mild fever",
  "mild infections",
  "minor cuts and wounds",
  "mouth or gum discomfort",
  "muscle or joint aches",
  "nasal congestion",
  "oral cavities/decay",
  "pain from boils",
  "pain from wounds or burns",
  "painful urination",
  "poor digestion",
  "poor wound healing",
  "rash",
  "redness and itching from insect bites",
  "respiratory congestion",
  "respiratory discomfort",
  "scurvy symptoms",
  "shortness of breath",
  "sinus congestion",
  "skin inflammation or infection",
  "skin irritation",
  "skin itching or irritation",
  "skin problems",
  "skin rashes or itching",
  "skin redness and swelling",
  "skin swelling or redness",
  "sleep disturbances",
  "sleep problems",
  "slow healing wounds",
  "slow wound healing",
  "slow-healing wounds",
  "sneezing or irritation",
  "sore or bleeding gums",
  "sore throat",
  "stomach discomfort",
  "stomach pain",
  "stomach upset",
  "stress and anxiety",
  "swelling",
  "tiredness",
  "tooth pain",
  "toothache",
  "unpleasant mouth odor",
  "urinary discomfort or blockage",
  "urinary or kidney-related pain",
  "weak immune system",
  "weight gain",
  "wheezing or shortness of breath",
  "wound or burn soreness",
  "wound soreness",
];

async function seedSymptoms() {
  console.log("🌱 Starting to seed Firebase database with symptoms2...");

  try {
    // First, get all treatments to build the symptoms node correctly
    console.log("🔍 Fetching treatments to build symptoms node...");
    const treatmentsRef = db.ref("treatments2");
    const treatmentsSnapshot = await treatmentsRef.get();

    if (!treatmentsSnapshot.exists()) {
      console.log("⚠️  No treatments found. Creating empty symptoms node.");
      const symptomsRef = db.ref("symptoms2");
      await symptomsRef.set({});
      console.log("✅ Created empty symptoms2 node");
      return;
    }

    const treatments = treatmentsSnapshot.val();
    const symptomsMap: Record<
      string,
      { name: string; treatmentIds: string[] }
    > = {};

    // Build symptoms map from all treatments
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
              };
            }
            // Only add if not already in the list
            if (!symptomsMap[sanitizedKey].treatmentIds.includes(treatmentId)) {
              symptomsMap[sanitizedKey].treatmentIds.push(treatmentId);
            }
          }
        });
      }
    );

    // Seed the symptoms2 node
    console.log("📝 Creating symptoms2 node with treatment associations...");
    const symptomsRef = db.ref("symptoms2");
    await symptomsRef.set(symptomsMap);

    console.log(
      `\n✅ Symptoms node seeded successfully with ${
        Object.keys(symptomsMap).length
      } unique symptoms!`
    );
    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedSymptoms()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
