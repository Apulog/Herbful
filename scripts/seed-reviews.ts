/**
 * Seed Firebase Realtime Database with reviews data
 *
 * Usage: npx tsx scripts/seed-reviews.ts
 * or: npm run seed:reviews
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

interface Review {
  treatmentName: string;
  treatmentId: string;
  rating: number;
  comment: string;
  userName?: string;
  userEmail?: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

// Reviews data
const reviewsData: Review[] = [
  {
    treatmentName: "Gawed",
    treatmentId: "gawed",
    rating: 4,
    comment: "momma ",
    anonymous: true,
    createdAt: "2025-11-13T00:42:38.757Z",
    updatedAt: "2025-11-13T00:42:38.757Z",
  },
  {
    treatmentName: "Pansit-Pansitan",
    treatmentId: "pansit-pansitan",
    rating: 5,
    comment: "AMA-ZING NANG SINTOMAS",
    anonymous: true,
    createdAt: "2025-11-13T00:43:20.144Z",
    updatedAt: "2025-11-13T00:43:20.144Z",
  },
  {
    treatmentName: "Tanglad",
    treatmentId: "tanglad",
    rating: 4,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:10:29.449Z",
    updatedAt: "2025-11-13T01:10:29.449Z",
  },
  {
    treatmentName: "Tanglad",
    treatmentId: "tanglad",
    rating: 5,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:12:12.693Z",
    updatedAt: "2025-11-13T01:12:12.693Z",
  },
  {
    treatmentName: "Bayabas (Guava)",
    treatmentId: "bayabas-(guava)",
    rating: 4,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:50:33.990Z",
    updatedAt: "2025-11-13T01:50:33.990Z",
  },
  {
    treatmentName: "Tawa-Tawa",
    treatmentId: "tawa-tawa",
    rating: 5,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:50:47.040Z",
    updatedAt: "2025-11-13T01:50:47.040Z",
  },
  {
    treatmentName: "Tawa-Tawa",
    treatmentId: "tawa-tawa",
    rating: 5,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:50:48.276Z",
    updatedAt: "2025-11-13T01:50:48.276Z",
  },
  {
    treatmentName: "Tawa-Tawa",
    treatmentId: "tawa-tawa",
    rating: 5,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:50:48.874Z",
    updatedAt: "2025-11-13T01:50:48.874Z",
  },
  {
    treatmentName: "Sambong",
    treatmentId: "sambong",
    rating: 3,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:51:01.748Z",
    updatedAt: "2025-11-13T01:51:01.748Z",
  },
  {
    treatmentName: "Anunas",
    treatmentId: "anunas",
    rating: 5,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:51:36.592Z",
    updatedAt: "2025-11-13T01:51:36.592Z",
  },
  {
    treatmentName: "Herbaka",
    treatmentId: "herbaka",
    rating: 4,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:52:22.873Z",
    updatedAt: "2025-11-13T01:52:22.873Z",
  },
  {
    treatmentName: "Herbaka",
    treatmentId: "herbaka",
    rating: 4,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:52:23.619Z",
    updatedAt: "2025-11-13T01:52:23.619Z",
  },
  {
    treatmentName: "Lomboy (Duhat)",
    treatmentId: "lomboy-(duhat)",
    rating: 4,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:59:13.945Z",
    updatedAt: "2025-11-13T01:59:13.945Z",
  },
  {
    treatmentName: "Lomboy (Duhat)",
    treatmentId: "lomboy-(duhat)",
    rating: 4,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:59:18.891Z",
    updatedAt: "2025-11-13T01:59:18.891Z",
  },
  {
    treatmentName: "Oregano",
    treatmentId: "oregano",
    rating: 5,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:59:35.221Z",
    updatedAt: "2025-11-13T01:59:35.221Z",
  },
  {
    treatmentName: "Oregano",
    treatmentId: "oregano",
    rating: 5,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:59:35.598Z",
    updatedAt: "2025-11-13T01:59:35.598Z",
  },
  {
    treatmentName: "Oregano",
    treatmentId: "oregano",
    rating: 5,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T01:59:36.244Z",
    updatedAt: "2025-11-13T01:59:36.244Z",
  },
  {
    treatmentName: "Tawa-Tawa",
    treatmentId: "tawa-tawa",
    rating: 4,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T02:19:59.134Z",
    updatedAt: "2025-11-13T02:19:59.134Z",
  },
  {
    treatmentName: "Avocado Leaves",
    treatmentId: "avocado-leaves",
    rating: 4,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-13T07:47:26.661Z",
    updatedAt: "2025-11-13T07:47:26.661Z",
  },
  {
    treatmentName: "Malunggay",
    treatmentId: "malunggay",
    rating: 4,
    comment: "Good",
    userName: "Jayser",
    anonymous: false,
    createdAt: "2025-11-13T12:43:19.547Z",
    updatedAt: "2025-11-13T12:43:19.547Z",
  },
  {
    treatmentName: "Tanglad",
    treatmentId: "tanglad",
    rating: 5,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-14T11:26:19.805Z",
    updatedAt: "2025-11-14T11:26:19.805Z",
  },
  {
    treatmentName: "Herbaka",
    treatmentId: "herbaka",
    rating: 5,
    comment: "",
    anonymous: true,
    createdAt: "2025-11-20T10:00:14.994Z",
    updatedAt: "2025-11-20T10:00:14.994Z",
  },
];

async function seedReviews() {
  console.log("🌱 Starting to seed Firebase database with reviews...");

  try {
    const reviewsRef = db.ref("reviews2");

    // Clear existing reviews
    await reviewsRef.remove();
    console.log("🗑️  Cleared existing reviews2");

    // Add all reviews
    console.log("📝 Creating reviews2...");
    let createdCount = 0;

    for (const review of reviewsData) {
      // Generate ID for review
      const id =
        Date.now().toString() + Math.random().toString(36).substring(2, 11);

      const reviewData = {
        ...review,
        createdAt: review.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await reviewsRef.child(id).set(reviewData);
      console.log(
        "   ✓ Created review for: " +
          review.treatmentName +
          " (" +
          review.rating +
          " stars)"
      );
      createdCount++;
    }

    console.log("\n✅ Review operations completed:");
    console.log("   - Created: " + createdCount + "\n");
    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedReviews()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
