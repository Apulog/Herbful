# Herbful Mobile App - Documentation Index

Welcome to the Herbful mobile app integration documentation. This guide will help you integrate your mobile app with the Herbful Firebase Realtime Database.

## Documentation Files

### 1. [Data Dictionary](./DATA_DICTIONARY.md)
**Complete reference for database structure and data models**
- Database structure and paths
- Detailed field descriptions
- Data types and constraints
- Example JSON structures
- Best practices
- Offline support strategies

### 2. [Mobile API Quick Reference](./MOBILE_API_QUICK_REFERENCE.md)
**Quick reference guide with code examples**
- Firebase setup for different platforms
- Common operations (CRUD)
- Real-time updates
- Offline queue implementation
- Sync strategies
- Error handling

### 3. [JSON Schemas](./JSON_SCHEMAS.md)
**Data validation schemas and types**
- JSON schemas for validation
- TypeScript types
- Validation functions
- Field constraints
- Example data

## Quick Start

### 1. Firebase Configuration

```javascript
// Database URL
const DATABASE_URL = "https://herbful-535e4-default-rtdb.asia-southeast1.firebasedatabase.app";

// Enable offline persistence
FirebaseDatabase.getInstance().setPersistenceEnabled(true);
```

### 2. Fetch Treatments

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

### 3. Create Review

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

## Platform-Specific Setup

### React Native
```bash
npm install @react-native-firebase/app @react-native-firebase/database
```

### Flutter
```yaml
dependencies:
  firebase_database: ^10.0.0
```

### Android (Kotlin)
```gradle
implementation 'com.google.firebase:firebase-database:20.3.0'
```

### iOS (Swift)
```ruby
pod 'Firebase/Database'
```

## Key Features

### ✅ Offline Support
- Cache treatments locally
- Queue reviews when offline
- Auto-sync when online

### ✅ Real-time Updates
- Listen for treatment changes
- Listen for new reviews
- Update UI automatically

### ✅ Data Validation
- Validate review data before submission
- Type checking with TypeScript
- JSON schema validation

### ✅ Performance
- Lazy load images
- Pagination for reviews
- Efficient caching

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
        ├── createdAt
        └── updatedAt
```

## Data Models

### Treatment
- **Read-only** in mobile app (admin web app manages)
- Contains all treatment details
- Includes ratings and review counts
- May have images (stored in Firebase Storage)

### Review
- **Read/Write** in mobile app
- Users can create reviews
- Linked to treatments via `treatmentId`
- Supports anonymous reviews

## Common Operations

| Operation | Path | Description |
|-----------|------|-------------|
| Get All Treatments | `/treatments` | Fetch all treatments |
| Get Treatment | `/treatments/{id}` | Fetch specific treatment |
| Get All Reviews | `/reviews` | Fetch all reviews |
| Get Reviews for Treatment | `/reviews` (filter) | Filter reviews by treatmentId |
| Create Review | `/reviews/{id}` | Create new review |
| Update Review | `/reviews/{id}` | Update existing review |
| Delete Review | `/reviews/{id}` | Delete review |

## Offline Strategy

1. **Cache All Treatments**: Download and cache all treatments on first launch
2. **Cache Images**: Download and cache treatment images
3. **Queue Reviews**: Queue review submissions when offline
4. **Auto-sync**: Automatically sync when connection is restored
5. **Manual Refresh**: Allow users to manually refresh data

## Best Practices

1. **Enable Offline Persistence**: Always enable Firebase offline persistence
2. **Cache Aggressively**: Cache all treatments for offline access
3. **Validate Data**: Always validate data before submission
4. **Handle Errors**: Implement robust error handling
5. **Show Status**: Show offline/online status to users
6. **Optimize Images**: Compress and cache images efficiently
7. **Rate Limit**: Implement rate limiting for review submissions

## Support

For questions or issues:
1. Check the [Data Dictionary](./DATA_DICTIONARY.md) for detailed information
2. Refer to [Quick Reference](./MOBILE_API_QUICK_REFERENCE.md) for code examples
3. Use [JSON Schemas](./JSON_SCHEMAS.md) for validation
4. Contact the development team

## Version History

- **v1.0.0** (2024-01-15): Initial documentation
  - Complete data dictionary
  - Quick reference guide
  - JSON schemas
  - Offline support strategies

## License

[Your License Here]

