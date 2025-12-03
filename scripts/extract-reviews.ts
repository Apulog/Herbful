/**
 * Extract reviews data from Firebase Realtime Database
 *
 * Usage: npx tsx scripts/extract-reviews.ts
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

interface Review {
  treatmentName: string;
  treatmentId: string;
  rating: number;
  comment: string;
  userName: string;
  userEmail: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

async function extractReviews() {
  console.log("🔍 Extracting reviews from Firebase...\\n");

  try {
    // Get reviews from Firebase
    const reviewsRef = db.ref("reviews");
    const reviewsSnapshot = await reviewsRef.once("value");

    if (!reviewsSnapshot.exists()) {
      console.log("⚠️  No reviews found in database");
      return;
    }

    const reviewsData = reviewsSnapshot.val();
    const reviews: Review[] = [];

    // Process each review
    for (const [id, reviewData] of Object.entries(reviewsData)) {
      const review = reviewData as any;
      reviews.push({
        treatmentName: review.treatmentName,
        treatmentId: review.treatmentId,
        rating: review.rating,
        comment: review.comment,
        userName: review.userName,
        userEmail: review.userEmail,
        anonymous: review.anonymous,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      });
    }

    console.log("✅ Found " + reviews.length + " reviews");

    // Create the seed file content
    const seedFileContent =
      "/**\\n" +
      " * Seed Firebase Realtime Database with reviews data\\n" +
      " *\\n" +
      " * Usage: npx tsx scripts/seed-reviews.ts\\n" +
      " * or: npm run seed:reviews\\n" +
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
      "interface Review {\\n" +
      "  treatmentName: string;\\n" +
      "  treatmentId: string;\\n" +
      "  rating: number;\\n" +
      "  comment: string;\\n" +
      "  userName: string;\\n" +
      "  userEmail: string;\\n" +
      "  anonymous: boolean;\\n" +
      "  createdAt: string;\\n" +
      "  updatedAt: string;\\n" +
      "}\\n" +
      "\\n" +
      "// Reviews data\\n" +
      "const reviewsData: Review[] = " +
      JSON.stringify(reviews, null, 2) +
      ";\\n" +
      "\\n" +
      "async function seedReviews() {\\n" +
      '  console.log("🌱 Starting to seed Firebase database with reviews...\\n");\\n' +
      "\\n" +
      "  try {\\n" +
      '    const reviewsRef = db.ref("reviews");\\n' +
      "    \\n" +
      "    // Clear existing reviews\\n" +
      "    await reviewsRef.remove();\\n" +
      '    console.log("🗑️  Cleared existing reviews");\\n' +
      "\\n" +
      "    // Add all reviews\\n" +
      '    console.log("📝 Creating reviews...");\\n' +
      "    let createdCount = 0;\\n" +
      "\\n" +
      "    for (const review of reviewsData) {\\n" +
      "      // Generate ID for review\\n" +
      "      const id = Date.now().toString() + Math.random().toString(36).substring(2, 11);\\n" +
      "      \\n" +
      "      const reviewData = {\\n" +
      "        ...review,\\n" +
      "        createdAt: review.createdAt || new Date().toISOString(),\\n" +
      "        updatedAt: new Date().toISOString(),\\n" +
      "      };\\n" +
      "\\n" +
      "      await reviewsRef.child(id).set(reviewData);\\n" +
      '      console.log("   ✓ Created review for: " + review.treatmentName + " (" + review.rating + " stars)");\\n' +
      "      createdCount++;\\n" +
      "    }\\n" +
      "\\n" +
      '    console.log("\\n✅ Review operations completed:");\\n' +
      '    console.log("   - Created: " + createdCount + "\\n");\\n' +
      '    console.log("\\n🎉 Database seeding completed successfully!");\\n' +
      "  } catch (error) {\\n" +
      '    console.error("❌ Error seeding database:", error);\\n' +
      "    process.exit(1);\\n" +
      "  }\\n" +
      "}\\n" +
      "\\n" +
      "// Run the seed function\\n" +
      "seedReviews()\\n" +
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
      "c:/Users/Joshua/Downloads/Downloads/herbful-appadmin/scripts/seed-reviews.ts",
      seedFileContent
    );

    console.log("✅ Created seed-reviews.ts file with reviews data");
    console.log("\\n📁 File saved to: scripts/seed-reviews.ts");
  } catch (error) {
    console.error("❌ Error extracting reviews:", error);
    process.exit(1);
  }
}

// Run the extraction function
extractReviews()
  .then(() => {
    console.log("\\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
