/**
 * Clear all data from Firebase Realtime Database
 * 
 * Usage: npx tsx scripts/clear-firebase.ts
 * or: npm run clear:firebase
 * 
 * WARNING: This will delete ALL treatments and reviews!
 */

import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getDatabase } from "firebase-admin/database"
import credentials from "../lib/firebase-credentials.json"
import * as readline from "readline"

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: credentials.project_id,
      clientEmail: credentials.client_email,
      privateKey: credentials.private_key.replace(/\\n/g, "\n"),
    }),
    databaseURL: "https://herbful-535e4-default-rtdb.asia-southeast1.firebasedatabase.app",
  })
}

const db = getDatabase()

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close()
      resolve(ans)
    })
  )
}

async function clearDatabase() {
  const skipConfirmation = process.argv.includes("--yes") || process.argv.includes("-y")

  if (!skipConfirmation) {
    console.log("⚠️  WARNING: This will delete ALL treatments and reviews from Firebase!")
    console.log("")

    const answer = await askQuestion("Are you sure you want to continue? (yes/no): ")

    if (answer.toLowerCase() !== "yes") {
      console.log("❌ Operation cancelled.")
      process.exit(0)
    }
  } else {
    console.log("⚠️  WARNING: Deleting ALL treatments and reviews from Firebase (--yes flag used)")
    console.log("")
  }

  try {
    console.log("\n🗑️  Clearing database...")

    const treatmentsRef = db.ref("treatments")
    const reviewsRef = db.ref("reviews")

    // Check if data exists
    const treatmentsSnapshot = await treatmentsRef.once("value")
    const reviewsSnapshot = await reviewsRef.once("value")

    if (!treatmentsSnapshot.exists() && !reviewsSnapshot.exists()) {
      console.log("ℹ️  Database is already empty.")
      process.exit(0)
    }

    // Delete all treatments
    if (treatmentsSnapshot.exists()) {
      await treatmentsRef.remove()
      console.log("   ✓ Deleted all treatments")
    }

    // Delete all reviews
    if (reviewsSnapshot.exists()) {
      await reviewsRef.remove()
      console.log("   ✓ Deleted all reviews")
    }

    console.log("\n✅ Database cleared successfully!")
  } catch (error) {
    console.error("❌ Error clearing database:", error)
    process.exit(1)
  }
}

// Run the clear function
clearDatabase()
  .then(() => {
    console.log("\n✨ Done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error)
    process.exit(1)
  })

