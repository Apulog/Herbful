# Herbful Mobile App - Firebase Realtime Database Data Dictionary

## Overview
This document provides a comprehensive guide for integrating a mobile app with the Herbful Firebase Realtime Database. It includes data structures, paths, field descriptions, and best practices for offline functionality.

## Database Configuration

### Firebase Realtime Database URL
```
https://herbful-535e4-default-rtdb.asia-southeast1.firebasedatabase.app
```

### Database Rules (Recommended for Mobile)
```json
{
  "rules": {
    "treatments": {
      ".read": true,
      ".write": false
    },
    "reviews": {
      ".read": true,
      ".write": true,
      ".validate": "newData.hasChildren(['treatmentId', 'treatmentName', 'rating', 'comment', 'userName', 'userEmail', 'anonymous', 'createdAt', 'updatedAt'])"
    }
  }
}
```

## Database Structure

```
/herbful-535e4-default-rtdb/
├── treatments/
│   └── {treatmentId}/
│       ├── name
│       ├── symptoms
│       ├── imageUrl
│       ├── preparation
│       ├── usage
│       ├── dosage
│       ├── warnings
│       ├── benefits
│       ├── sourceType
│       ├── sourceInfo
│       ├── averageRating
│       ├── totalReviews
│       ├── createdAt
│       └── updatedAt
└── reviews/
    └── {reviewId}/
        ├── treatmentId
        ├── treatmentName
        ├── rating
        ├── comment
        ├── userName
        ├── userEmail
        ├── anonymous
        ├── adminNotes
        ├── createdAt
        └── updatedAt
```

## Data Models

### 1. Treatment

**Path:** `/treatments/{treatmentId}`

**Description:** Represents a herbal treatment/remedy with all its details.

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (timestamp-based, e.g., "1728123456789") |
| `name` | string | Yes | Treatment name (e.g., "Ginger Tea", "Malunggay") |
| `symptoms` | string[] | No | Array of symptoms/conditions this treatment addresses |
| `imageUrl` | string | No | URL to treatment image (stored in Firebase Storage) |
| `preparation` | string[] | Yes | Array of step-by-step preparation instructions |
| `usage` | string | Yes | How to use the treatment (e.g., "Drink warm, 2-3 times daily") |
| `dosage` | string | Yes | Dosage amount (e.g., "1 cup per serving") |
| `warnings` | string[] | Yes | Array of safety warnings and precautions |
| `benefits` | string[] | Yes | Array of health benefits |
| `sourceType` | string | Yes | Either "Local Remedy" or "Verified Source" |
| `sourceInfo` | object | No | Source information (only if sourceType is "Verified Source") |
| `sourceInfo.authority` | string | No | Authority name (e.g., "WHO", "EMA") |
| `sourceInfo.url` | string | No | Reference URL |
| `sourceInfo.description` | string | No | Verification description |
| `sourceInfo.verificationDate` | string | No | Date verified (ISO format) |
| `averageRating` | number | Yes | Average rating (0-5, rounded to 1 decimal) |
| `totalReviews` | number | Yes | Total number of reviews |
| `createdAt` | string | Yes | ISO 8601 timestamp (e.g., "2024-01-15T10:30:00.000Z") |
| `updatedAt` | string | Yes | ISO 8601 timestamp |

**Example JSON:**
```json
{
  "id": "1728123456789",
  "name": "Ginger Tea",
  "symptoms": [
    "Nausea",
    "Digestive issues",
    "Cold symptoms"
  ],
  "imageUrl": "https://firebasestorage.googleapis.com/.../ginger-tea.jpg",
  "preparation": [
    "Boil 2 cups of water",
    "Add 1 tablespoon of fresh ginger slices",
    "Simmer for 5-10 minutes",
    "Strain and serve hot"
  ],
  "usage": "Drink warm, 2-3 times daily",
  "dosage": "1 cup per serving",
  "warnings": [
    "Consult doctor if pregnant",
    "May interact with blood thinners"
  ],
  "benefits": [
    "Anti-inflammatory",
    "Digestive aid",
    "Nausea relief"
  ],
  "sourceType": "Local Remedy",
  "averageRating": 4.5,
  "totalReviews": 12,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Verified Source Example:**
```json
{
  "id": "1728123456790",
  "name": "Chamomile Tea",
  "sourceType": "Verified Source",
  "sourceInfo": {
    "authority": "WHO",
    "url": "https://www.who.int/...",
    "description": "Verified for sleep disorders",
    "verificationDate": "2023-06-15"
  },
  "averageRating": 4.8,
  "totalReviews": 25,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Review

**Path:** `/reviews/{reviewId}`

**Description:** User review/rating for a treatment.

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (timestamp-based) |
| `treatmentId` | string | Yes | Reference to treatment ID |
| `treatmentName` | string | Yes | Treatment name (denormalized for easier queries) |
| `rating` | number | Yes | Rating value (1-5) |
| `comment` | string | Yes | Review comment text |
| `userName` | string | Yes | Reviewer's name |
| `userEmail` | string | Yes | Reviewer's email |
| `anonymous` | boolean | Yes | Whether review is anonymous |
| `adminNotes` | string | No | Admin-only notes (not visible to mobile app) |
| `createdAt` | string | Yes | ISO 8601 timestamp |
| `updatedAt` | string | Yes | ISO 8601 timestamp |

**Example JSON:**
```json
{
  "id": "1728123456800",
  "treatmentId": "1728123456789",
  "treatmentName": "Ginger Tea",
  "rating": 5,
  "comment": "Very effective for nausea. Helped me during morning sickness.",
  "userName": "Jane Doe",
  "userEmail": "jane@example.com",
  "anonymous": false,
  "createdAt": "2024-01-20T14:30:00.000Z",
  "updatedAt": "2024-01-20T14:30:00.000Z"
}
```

**Anonymous Review Example:**
```json
{
  "id": "1728123456801",
  "treatmentId": "1728123456789",
  "treatmentName": "Ginger Tea",
  "rating": 4,
  "comment": "Good results, but took a few days to see improvement.",
  "userName": "Anonymous User",
  "userEmail": "user@example.com",
  "anonymous": true,
  "createdAt": "2024-01-21T09:15:00.000Z",
  "updatedAt": "2024-01-21T09:15:00.000Z"
}
```

## Database Paths Reference

### Treatments

| Operation | Path | Description |
|-----------|------|-------------|
| Read All | `/treatments` | Get all treatments |
| Read One | `/treatments/{treatmentId}` | Get specific treatment |
| Read Filtered | `/treatments` (query) | Query treatments (client-side filtering) |

### Reviews

| Operation | Path | Description |
|-----------|------|-------------|
| Read All | `/reviews` | Get all reviews |
| Read One | `/reviews/{reviewId}` | Get specific review |
| Read by Treatment | `/reviews` (query) | Query reviews by treatmentId (client-side) |
| Create | `/reviews/{reviewId}` | Create new review |
| Update | `/reviews/{reviewId}` | Update existing review |
| Delete | `/reviews/{reviewId}` | Delete review |

## Mobile App Integration Guide

### 1. Firebase Setup

#### Android (Kotlin/Java)
```kotlin
// build.gradle (app level)
implementation 'com.google.firebase:firebase-database:20.3.0'
implementation 'com.google.firebase:firebase-storage:20.3.0'

// Initialize Firebase
FirebaseDatabase.getInstance().setPersistenceEnabled(true) // Enable offline persistence
```

#### iOS (Swift)
```swift
// Podfile
pod 'Firebase/Database'
pod 'Firebase/Storage'

// AppDelegate.swift
Database.database().isPersistenceEnabled = true // Enable offline persistence
```

#### React Native
```javascript
// Install packages
npm install @react-native-firebase/app @react-native-firebase/database @react-native-firebase/storage

// Enable offline persistence
import database from '@react-native-firebase/database';
database().setPersistenceEnabled(true);
```

#### Flutter
```yaml
# pubspec.yaml
dependencies:
  firebase_database: ^10.0.0
  firebase_storage: ^11.0.0

# Enable offline persistence
FirebaseDatabase.instance.setPersistenceEnabled(true);
FirebaseDatabase.instance.setPersistenceCacheSizeBytes(10000000); // 10MB
```

### 2. Data Models (Mobile)

#### Treatment Model
```typescript
// TypeScript/JavaScript
interface Treatment {
  id: string;
  name: string;
  symptoms?: string[];
  imageUrl?: string;
  preparation: string[];
  usage: string;
  dosage: string;
  warnings: string[];
  benefits: string[];
  sourceType: "Local Remedy" | "Verified Source";
  sourceInfo?: {
    authority: string;
    url: string;
    description: string;
    verificationDate: string;
  };
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}
```

#### Review Model
```typescript
interface Review {
  id: string;
  treatmentId: string;
  treatmentName: string;
  rating: number; // 1-5
  comment: string;
  userName: string;
  userEmail: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 3. Common Operations

#### Fetch All Treatments
```javascript
// JavaScript/TypeScript
import { ref, onValue } from 'firebase/database';

const treatmentsRef = ref(database, 'treatments');
onValue(treatmentsRef, (snapshot) => {
  const treatments = [];
  snapshot.forEach((childSnapshot) => {
    treatments.push({
      id: childSnapshot.key,
      ...childSnapshot.val()
    });
  });
  // Update UI with treatments
});
```

#### Fetch Single Treatment
```javascript
const treatmentRef = ref(database, `treatments/${treatmentId}`);
onValue(treatmentRef, (snapshot) => {
  const treatment = {
    id: snapshot.key,
    ...snapshot.val()
  };
  // Update UI
});
```

#### Fetch Reviews for Treatment
```javascript
const reviewsRef = ref(database, 'reviews');
onValue(reviewsRef, (snapshot) => {
  const allReviews = [];
  snapshot.forEach((childSnapshot) => {
    allReviews.push({
      id: childSnapshot.key,
      ...childSnapshot.val()
    });
  });
  
  // Filter by treatmentId
  const treatmentReviews = allReviews.filter(
    review => review.treatmentId === treatmentId
  );
  
  // Update UI
});
```

#### Create Review
```javascript
import { ref, set, serverTimestamp } from 'firebase/database';

function createReview(reviewData) {
  const reviewId = Date.now().toString();
  const reviewRef = ref(database, `reviews/${reviewId}`);
  
  const review = {
    ...reviewData,
    id: reviewId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Remove id from data (Firebase uses key as ID)
  const { id, ...reviewWithoutId } = review;
  
  set(reviewRef, reviewWithoutId)
    .then(() => {
      console.log('Review created successfully');
    })
    .catch((error) => {
      console.error('Error creating review:', error);
    });
}
```

### 4. Offline Support

#### Enable Offline Persistence
```javascript
// Enable disk persistence (10MB cache)
import { getDatabase, enableIndexedDbPersistence } from 'firebase/database';

const db = getDatabase();
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
    } else if (err.code == 'unimplemented') {
      // Browser doesn't support persistence
    }
  });
```

#### Sync Strategy
1. **Initial Load**: Fetch all treatments and cache locally
2. **Periodic Sync**: Sync every 15-30 minutes when online
3. **Manual Refresh**: Pull-to-refresh functionality
4. **Offline Queue**: Queue review submissions when offline, sync when online

#### Offline Queue Example
```javascript
class OfflineQueue {
  constructor() {
    this.queue = [];
    this.loadQueue();
  }
  
  addReview(review) {
    this.queue.push({
      ...review,
      queuedAt: new Date().toISOString(),
      synced: false
    });
    this.saveQueue();
    this.trySync();
  }
  
  async trySync() {
    if (!navigator.onLine) return;
    
    for (const item of this.queue) {
      if (!item.synced) {
        try {
          await this.syncReview(item);
          item.synced = true;
        } catch (error) {
          console.error('Sync failed:', error);
          break;
        }
      }
    }
    
    this.queue = this.queue.filter(item => !item.synced);
    this.saveQueue();
  }
  
  async syncReview(review) {
    // Sync to Firebase
    const reviewRef = ref(database, `reviews/${review.id}`);
    await set(reviewRef, review);
  }
  
  loadQueue() {
    const stored = localStorage.getItem('offlineQueue');
    if (stored) {
      this.queue = JSON.parse(stored);
    }
  }
  
  saveQueue() {
    localStorage.setItem('offlineQueue', JSON.stringify(this.queue));
  }
}
```

### 5. Query Patterns

#### Search Treatments
```javascript
// Client-side search (recommended for offline)
function searchTreatments(treatments, searchTerm) {
  const term = searchTerm.toLowerCase();
  return treatments.filter(treatment => 
    treatment.name.toLowerCase().includes(term) ||
    treatment.benefits.some(benefit => 
      benefit.toLowerCase().includes(term)
    ) ||
    (treatment.symptoms && treatment.symptoms.some(symptom => 
      symptom.toLowerCase().includes(term)
    ))
  );
}
```

#### Filter by Symptoms
```javascript
function filterBySymptoms(treatments, selectedSymptoms) {
  return treatments.filter(treatment => 
    treatment.symptoms && 
    selectedSymptoms.some(symptom => 
      treatment.symptoms.includes(symptom)
    )
  );
}
```

#### Sort Treatments
```javascript
// Sort by rating (highest first)
function sortByRating(treatments) {
  return treatments.sort((a, b) => 
    b.averageRating - a.averageRating
  );
}

// Sort by name (alphabetical)
function sortByName(treatments) {
  return treatments.sort((a, b) => 
    a.name.localeCompare(b.name)
  );
}

// Sort by reviews (most reviewed first)
function sortByReviews(treatments) {
  return treatments.sort((a, b) => 
    b.totalReviews - a.totalReviews
  );
}
```

### 6. Image Handling

#### Download Treatment Images
```javascript
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

async function getTreatmentImage(imageUrl) {
  if (!imageUrl) return null;
  
  try {
    // If already a full URL, return it
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If Firebase Storage reference, get download URL
    const storage = getStorage();
    const imageRef = ref(storage, imageUrl);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error('Error loading image:', error);
    return null;
  }
}
```

#### Cache Images
```javascript
// Cache images for offline use
async function cacheTreatmentImage(imageUrl) {
  if (!imageUrl) return;
  
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const cache = await caches.open('treatment-images');
    await cache.put(imageUrl, new Response(blob));
  } catch (error) {
    console.error('Error caching image:', error);
  }
}
```

### 7. Data Synchronization

#### Sync Strategy
1. **Initial Sync**: Download all treatments and reviews on first launch
2. **Incremental Sync**: Only sync changes since last sync timestamp
3. **Background Sync**: Sync in background when app is in foreground
4. **Manual Sync**: Allow users to manually trigger sync

#### Sync Implementation
```javascript
class DataSync {
  constructor() {
    this.lastSyncTime = this.getLastSyncTime();
  }
  
  async syncTreatments() {
    const treatmentsRef = ref(database, 'treatments');
    const snapshot = await get(treatmentsRef);
    
    if (snapshot.exists()) {
      const treatments = [];
      snapshot.forEach((child) => {
        treatments.push({
          id: child.key,
          ...child.val()
        });
      });
      
      // Save to local storage
      await this.saveTreatments(treatments);
      this.setLastSyncTime(new Date().toISOString());
    }
  }
  
  async syncReviews() {
    const reviewsRef = ref(database, 'reviews');
    const snapshot = await get(reviewsRef);
    
    if (snapshot.exists()) {
      const reviews = [];
      snapshot.forEach((child) => {
        reviews.push({
          id: child.key,
          ...child.val()
        });
      });
      
      // Save to local storage
      await this.saveReviews(reviews);
    }
  }
  
  getLastSyncTime() {
    return localStorage.getItem('lastSyncTime') || '1970-01-01T00:00:00.000Z';
  }
  
  setLastSyncTime(timestamp) {
    localStorage.setItem('lastSyncTime', timestamp);
  }
  
  async saveTreatments(treatments) {
    // Save to IndexedDB or AsyncStorage
    localStorage.setItem('treatments', JSON.stringify(treatments));
  }
  
  async saveReviews(reviews) {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }
  
  getCachedTreatments() {
    const stored = localStorage.getItem('treatments');
    return stored ? JSON.parse(stored) : [];
  }
  
  getCachedReviews() {
    const stored = localStorage.getItem('reviews');
    return stored ? JSON.parse(stored) : [];
  }
}
```

## Best Practices

### 1. Data Caching
- Cache all treatments locally for offline access
- Cache treatment images for offline viewing
- Implement cache expiration (e.g., 24 hours)
- Clear cache on app update

### 2. Network Handling
- Detect network status
- Show offline indicator
- Queue operations when offline
- Sync when connection restored

### 3. Performance
- Lazy load treatment images
- Implement pagination for reviews
- Use virtual lists for large datasets
- Debounce search queries

### 4. Error Handling
- Handle network errors gracefully
- Show user-friendly error messages
- Retry failed operations
- Log errors for debugging

### 5. Security
- Validate review data before submission
- Sanitize user inputs
- Rate limit review submissions
- Validate rating values (1-5)

## API Endpoints Summary

| Operation | Method | Path | Description |
|-----------|--------|------|-------------|
| Get All Treatments | GET | `/treatments` | Fetch all treatments |
| Get Treatment | GET | `/treatments/{id}` | Fetch specific treatment |
| Get All Reviews | GET | `/reviews` | Fetch all reviews |
| Get Review | GET | `/reviews/{id}` | Fetch specific review |
| Create Review | POST | `/reviews/{id}` | Create new review |
| Update Review | PUT | `/reviews/{id}` | Update existing review |
| Delete Review | DELETE | `/reviews/{id}` | Delete review |

## Field Validation Rules

### Treatment Fields
- `name`: Required, string, max 200 characters
- `preparation`: Required, array of strings, min 1 item
- `usage`: Required, string, max 500 characters
- `dosage`: Required, string, max 200 characters
- `warnings`: Required, array of strings
- `benefits`: Required, array of strings, min 1 item
- `sourceType`: Required, enum: "Local Remedy" | "Verified Source"
- `rating`: Number, 0-5, 1 decimal place
- `totalReviews`: Number, >= 0

### Review Fields
- `treatmentId`: Required, string, must exist in treatments
- `treatmentName`: Required, string
- `rating`: Required, number, 1-5 (integer)
- `comment`: Required, string, max 2000 characters
- `userName`: Required, string, max 100 characters
- `userEmail`: Required, string, valid email format
- `anonymous`: Required, boolean

## Timestamp Format
All timestamps use ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`
Example: `2024-01-15T10:30:00.000Z`

## ID Generation
- Treatment IDs: `Date.now().toString()` (milliseconds since epoch)
- Review IDs: `Date.now().toString()` (milliseconds since epoch)
- Example: `1728123456789`

## Notes for Mobile Developers

1. **Read-Only Treatments**: Treatments are read-only in the mobile app. Only the admin web app can modify them.

2. **Review Creation**: Mobile apps can create reviews. The `treatmentId` must reference an existing treatment.

3. **Offline First**: Design the app to work offline. Cache all treatments and enable offline review submission.

4. **Image Caching**: Cache treatment images for offline access. Use appropriate cache sizes.

5. **Sync Strategy**: Implement a sync strategy that works well with limited bandwidth on mobile networks.

6. **Data Size**: Be mindful of data usage. Consider implementing data compression or limiting sync frequency.

7. **Error Handling**: Implement robust error handling for network issues and invalid data.

8. **User Experience**: Show loading states, offline indicators, and sync status to users.

## Support

For questions or issues, refer to:
- Firebase Realtime Database Documentation: https://firebase.google.com/docs/database
- Firebase Storage Documentation: https://firebase.google.com/docs/storage
- Project Repository: [Your repository URL]

