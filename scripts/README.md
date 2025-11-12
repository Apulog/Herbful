# Firebase Database Scripts

Scripts for managing test data in Firebase Realtime Database.

## Available Scripts

### Seed Database

Populates your Firebase Realtime Database with dummy data for testing.

```bash
npm run seed
```

Or directly with tsx:

```bash
npx tsx scripts/seed-firebase.ts
```

### Clear Database

Deletes all treatments and reviews from Firebase (requires confirmation).

```bash
npm run clear:firebase
```

Or directly with tsx:

```bash
npx tsx scripts/clear-firebase.ts
```

### Reseed Database

Clears and reseeds the database (clears first, then seeds).

```bash
npm run reseed
```

### Fix Duplicate Symptoms

Identifies and fixes duplicate symptoms in the database by normalizing case and merging duplicates.

```bash
npm run fix:symptoms
```

Or directly with tsx:

```bash
npx tsx scripts/fix-duplicate-symptoms.ts
```

## What the seed script does

1. Creates 8 sample treatments with complete data:

   - Ginger Tea
   - Chamomile Tea
   - Lavender Tea
   - Turmeric Golden Milk
   - Echinacea Tea
   - Peppermint Tea
   - Aloe Vera Gel
   - Elderberry Syrup

2. Creates 13 sample reviews linked to the treatments

3. Automatically calculates and updates average ratings for each treatment

## Requirements

- Firebase Admin SDK must be configured
- `lib/firebase-credentials.json` must exist with valid credentials
- Firebase Realtime Database must be enabled
- `tsx` package installed (installed as dev dependency)

## Notes

- The seed script will warn if data already exists but will still proceed
- To reseed fresh data, use `npm run reseed` or clear first with `npm run clear:firebase`
- All timestamps are set to the current time when the script runs
- Unique IDs are generated using timestamps and random strings

## Data Structure

The script creates data in the following Firebase structure:

```
/treatments/{treatmentId}
  - All treatment fields (name, category, preparation, etc.)
  - averageRating (calculated from reviews)
  - totalReviews (calculated from reviews)

/reviews/{reviewId}
  - All review fields (rating, comment, user info, etc.)
  - treatmentId (links to treatment)
  - status (active/deleted)
```

## Example Output

```
🌱 Starting to seed Firebase database...

📝 Creating treatments...
   ✓ Created: Ginger Tea
   ✓ Created: Chamomile Tea
   ✓ Created: Lavender Tea
   ...

✅ Created 8 treatments

💬 Creating reviews...
   ✓ Created review for: Ginger Tea (5 stars)
   ✓ Created review for: Ginger Tea (4 stars)
   ...

✅ Created 13 reviews

⭐ Updating treatment ratings...
   ✓ Updated Ginger Tea: 4.7 stars (3 reviews)
   ✓ Updated Chamomile Tea: 4.5 stars (2 reviews)
   ...

🎉 Database seeding completed successfully!
```
