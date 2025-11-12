# Mobile App API Quick Reference

## Firebase Configuration

```javascript
// Database URL
const DATABASE_URL = "https://herbful-535e4-default-rtdb.asia-southeast1.firebasedatabase.app";

// Enable offline persistence
FirebaseDatabase.getInstance().setPersistenceEnabled(true);
```

## Quick Code Examples

### 1. Initialize Firebase (React Native)
```javascript
import database from '@react-native-firebase/database';

// Enable offline persistence
database().setPersistenceEnabled(true);
```

### 2. Fetch All Treatments
```javascript
const treatmentsRef = database().ref('treatments');
treatmentsRef.once('value')
  .then(snapshot => {
    const treatments = [];
    snapshot.forEach(child => {
      treatments.push({
        id: child.key,
        ...child.val()
      });
    });
    return treatments;
  });
```

### 3. Fetch Single Treatment
```javascript
const treatmentRef = database().ref(`treatments/${treatmentId}`);
treatmentRef.once('value')
  .then(snapshot => ({
    id: snapshot.key,
    ...snapshot.val()
  }));
```

### 4. Fetch Reviews for Treatment
```javascript
const reviewsRef = database().ref('reviews');
reviewsRef.once('value')
  .then(snapshot => {
    const allReviews = [];
    snapshot.forEach(child => {
      allReviews.push({
        id: child.key,
        ...child.val()
      });
    });
    // Filter by treatmentId
    return allReviews.filter(r => r.treatmentId === treatmentId);
  });
```

### 5. Create Review
```javascript
function createReview(reviewData) {
  const reviewId = Date.now().toString();
  const reviewRef = database().ref(`reviews/${reviewId}`);
  
  const review = {
    treatmentId: reviewData.treatmentId,
    treatmentName: reviewData.treatmentName,
    rating: reviewData.rating, // 1-5
    comment: reviewData.comment,
    userName: reviewData.userName,
    userEmail: reviewData.userEmail,
    anonymous: reviewData.anonymous || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return reviewRef.set(review);
}
```

### 6. Real-time Updates (Listen for Changes)
```javascript
// Listen for treatment updates
const treatmentsRef = database().ref('treatments');
treatmentsRef.on('value', snapshot => {
  // Handle updates
  const treatments = [];
  snapshot.forEach(child => {
    treatments.push({
      id: child.key,
      ...child.val()
    });
  });
  // Update UI
});

// Don't forget to unsubscribe
treatmentsRef.off('value');
```

### 7. Search Treatments (Client-side)
```javascript
function searchTreatments(treatments, searchTerm) {
  const term = searchTerm.toLowerCase();
  return treatments.filter(treatment => 
    treatment.name.toLowerCase().includes(term) ||
    treatment.benefits?.some(b => b.toLowerCase().includes(term)) ||
    treatment.symptoms?.some(s => s.toLowerCase().includes(term))
  );
}
```

### 8. Filter by Symptoms
```javascript
function filterBySymptoms(treatments, symptoms) {
  return treatments.filter(treatment => 
    treatment.symptoms?.some(symptom => 
      symptoms.includes(symptom)
    )
  );
}
```

### 9. Cache Data Locally
```javascript
// Using AsyncStorage (React Native)
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save treatments
await AsyncStorage.setItem('treatments', JSON.stringify(treatments));

// Load treatments
const stored = await AsyncStorage.getItem('treatments');
const treatments = stored ? JSON.parse(stored) : [];
```

### 10. Offline Queue for Reviews
```javascript
class ReviewQueue {
  constructor() {
    this.queue = [];
  }
  
  async addReview(review) {
    // Add to queue
    this.queue.push({
      ...review,
      queuedAt: new Date().toISOString(),
      synced: false
    });
    
    // Save queue
    await AsyncStorage.setItem('reviewQueue', JSON.stringify(this.queue));
    
    // Try to sync
    this.syncQueue();
  }
  
  async syncQueue() {
    if (!this.isOnline()) return;
    
    for (const review of this.queue) {
      if (!review.synced) {
        try {
          await this.syncReview(review);
          review.synced = true;
        } catch (error) {
          console.error('Sync failed:', error);
        }
      }
    }
    
    // Remove synced reviews
    this.queue = this.queue.filter(r => !r.synced);
    await AsyncStorage.setItem('reviewQueue', JSON.stringify(this.queue));
  }
  
  async syncReview(review) {
    const reviewId = Date.now().toString();
    const reviewRef = database().ref(`reviews/${reviewId}`);
    await reviewRef.set(review);
  }
  
  isOnline() {
    // Check network status
    return /* your network check */;
  }
}
```

## Data Structures

### Treatment
```typescript
{
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

### Review
```typescript
{
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

## Common Patterns

### Pattern 1: Load and Cache Treatments
```javascript
async function loadTreatments() {
  try {
    // Try to load from cache first
    const cached = await getCachedTreatments();
    if (cached.length > 0) {
      // Show cached data immediately
      updateUI(cached);
    }
    
    // Then sync from server
    const treatmentsRef = database().ref('treatments');
    const snapshot = await treatmentsRef.once('value');
    
    const treatments = [];
    snapshot.forEach(child => {
      treatments.push({
        id: child.key,
        ...child.val()
      });
    });
    
    // Cache for offline use
    await cacheTreatments(treatments);
    
    // Update UI
    updateUI(treatments);
  } catch (error) {
    console.error('Error loading treatments:', error);
    // Fall back to cached data
    const cached = await getCachedTreatments();
    updateUI(cached);
  }
}
```

### Pattern 2: Submit Review with Offline Support
```javascript
async function submitReview(reviewData) {
  const review = {
    ...reviewData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (isOnline()) {
    try {
      // Submit directly
      const reviewRef = database().ref(`reviews/${review.id}`);
      await reviewRef.set(review);
      return { success: true };
    } catch (error) {
      // If fails, add to queue
      await addToQueue(review);
      return { success: false, queued: true };
    }
  } else {
    // Add to queue for later sync
    await addToQueue(review);
    return { success: false, queued: true };
  }
}
```

### Pattern 3: Sync Strategy
```javascript
class SyncManager {
  async sync() {
    if (!isOnline()) return;
    
    try {
      // Sync treatments
      await this.syncTreatments();
      
      // Sync reviews
      await this.syncReviews();
      
      // Process offline queue
      await this.processQueue();
      
      // Update last sync time
      await this.updateLastSyncTime();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
  
  async syncTreatments() {
    const treatmentsRef = database().ref('treatments');
    const snapshot = await treatmentsRef.once('value');
    
    const treatments = [];
    snapshot.forEach(child => {
      treatments.push({
        id: child.key,
        ...child.val()
      });
    });
    
    await cacheTreatments(treatments);
  }
  
  async processQueue() {
    const queue = await getQueue();
    for (const item of queue) {
      if (!item.synced) {
        try {
          await syncItem(item);
          item.synced = true;
        } catch (error) {
          console.error('Failed to sync item:', error);
        }
      }
    }
    
    await saveQueue(queue.filter(item => !item.synced));
  }
}
```

## Error Handling

```javascript
async function safeDatabaseOperation(operation) {
  try {
    return await operation();
  } catch (error) {
    if (error.code === 'network-error') {
      // Handle network error
      showOfflineMessage();
    } else if (error.code === 'permission-denied') {
      // Handle permission error
      showPermissionError();
    } else {
      // Handle other errors
      console.error('Database error:', error);
      showErrorMessage();
    }
    throw error;
  }
}
```

## Performance Tips

1. **Lazy Load Images**: Load treatment images only when needed
2. **Pagination**: Implement pagination for reviews
3. **Debounce Search**: Debounce search queries to reduce database reads
4. **Cache Aggressively**: Cache all treatments and recent reviews
5. **Batch Operations**: Batch multiple operations when possible
6. **Use Indexes**: Index frequently queried fields

## Testing Checklist

- [ ] App works offline
- [ ] Treatments load from cache when offline
- [ ] Reviews queue when offline
- [ ] Reviews sync when online
- [ ] Images cache properly
- [ ] Search works offline
- [ ] Filtering works offline
- [ ] Error handling works correctly
- [ ] Network status detection works
- [ ] Data syncs correctly on app launch

