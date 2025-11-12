# JSON Schemas for Data Validation

Use these schemas to validate data in your mobile app before sending to Firebase.

## Treatment Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "Treatment",
  "required": [
    "name",
    "preparation",
    "usage",
    "dosage",
    "warnings",
    "benefits",
    "sourceType",
    "averageRating",
    "totalReviews",
    "createdAt",
    "updatedAt"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier (timestamp-based)"
    },
    "name": {
      "type": "string",
      "maxLength": 200,
      "description": "Treatment name"
    },
    "symptoms": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of symptoms this treatment addresses"
    },
    "imageUrl": {
      "type": "string",
      "format": "uri",
      "description": "URL to treatment image"
    },
    "preparation": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "description": "Step-by-step preparation instructions"
    },
    "usage": {
      "type": "string",
      "maxLength": 500,
      "description": "How to use the treatment"
    },
    "dosage": {
      "type": "string",
      "maxLength": 200,
      "description": "Dosage amount"
    },
    "warnings": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Safety warnings and precautions"
    },
    "benefits": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "description": "Health benefits"
    },
    "sourceType": {
      "type": "string",
      "enum": ["Local Remedy", "Verified Source"],
      "description": "Source type"
    },
    "sourceInfo": {
      "type": "object",
      "properties": {
        "authority": {
          "type": "string",
          "description": "Authority name (e.g., WHO, EMA)"
        },
        "url": {
          "type": "string",
          "format": "uri",
          "description": "Reference URL"
        },
        "description": {
          "type": "string",
          "description": "Verification description"
        },
        "verificationDate": {
          "type": "string",
          "format": "date",
          "description": "Date verified"
        }
      },
      "required": ["authority", "url", "description", "verificationDate"]
    },
    "averageRating": {
      "type": "number",
      "minimum": 0,
      "maximum": 5,
      "description": "Average rating (0-5)"
    },
    "totalReviews": {
      "type": "number",
      "minimum": 0,
      "description": "Total number of reviews"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp"
    }
  }
}
```

## Review Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "Review",
  "required": [
    "treatmentId",
    "treatmentName",
    "rating",
    "comment",
    "userName",
    "userEmail",
    "anonymous",
    "createdAt",
    "updatedAt"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier (timestamp-based)"
    },
    "treatmentId": {
      "type": "string",
      "description": "Reference to treatment ID"
    },
    "treatmentName": {
      "type": "string",
      "maxLength": 200,
      "description": "Treatment name"
    },
    "rating": {
      "type": "integer",
      "minimum": 1,
      "maximum": 5,
      "description": "Rating value (1-5)"
    },
    "comment": {
      "type": "string",
      "maxLength": 2000,
      "description": "Review comment text"
    },
    "userName": {
      "type": "string",
      "maxLength": 100,
      "description": "Reviewer's name"
    },
    "userEmail": {
      "type": "string",
      "format": "email",
      "description": "Reviewer's email"
    },
    "anonymous": {
      "type": "boolean",
      "description": "Whether review is anonymous"
    },
    "adminNotes": {
      "type": "string",
      "description": "Admin-only notes (not used in mobile app)"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp"
    }
  }
}
```

## Validation Functions (JavaScript)

```javascript
// Treatment Validation
function validateTreatment(treatment) {
  const errors = [];
  
  if (!treatment.name || treatment.name.length > 200) {
    errors.push('Name is required and must be less than 200 characters');
  }
  
  if (!treatment.preparation || !Array.isArray(treatment.preparation) || treatment.preparation.length === 0) {
    errors.push('Preparation is required and must be a non-empty array');
  }
  
  if (!treatment.usage || treatment.usage.length > 500) {
    errors.push('Usage is required and must be less than 500 characters');
  }
  
  if (!treatment.dosage || treatment.dosage.length > 200) {
    errors.push('Dosage is required and must be less than 200 characters');
  }
  
  if (!treatment.warnings || !Array.isArray(treatment.warnings)) {
    errors.push('Warnings is required and must be an array');
  }
  
  if (!treatment.benefits || !Array.isArray(treatment.benefits) || treatment.benefits.length === 0) {
    errors.push('Benefits is required and must be a non-empty array');
  }
  
  if (!treatment.sourceType || !['Local Remedy', 'Verified Source'].includes(treatment.sourceType)) {
    errors.push('SourceType must be "Local Remedy" or "Verified Source"');
  }
  
  if (treatment.sourceType === 'Verified Source' && !treatment.sourceInfo) {
    errors.push('SourceInfo is required when sourceType is "Verified Source"');
  }
  
  if (typeof treatment.averageRating !== 'number' || treatment.averageRating < 0 || treatment.averageRating > 5) {
    errors.push('AverageRating must be a number between 0 and 5');
  }
  
  if (typeof treatment.totalReviews !== 'number' || treatment.totalReviews < 0) {
    errors.push('TotalReviews must be a non-negative number');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Review Validation
function validateReview(review) {
  const errors = [];
  
  if (!review.treatmentId) {
    errors.push('TreatmentId is required');
  }
  
  if (!review.treatmentName || review.treatmentName.length > 200) {
    errors.push('TreatmentName is required and must be less than 200 characters');
  }
  
  if (typeof review.rating !== 'number' || review.rating < 1 || review.rating > 5 || !Number.isInteger(review.rating)) {
    errors.push('Rating must be an integer between 1 and 5');
  }
  
  if (!review.comment || review.comment.length > 2000) {
    errors.push('Comment is required and must be less than 2000 characters');
  }
  
  if (!review.userName || review.userName.length > 100) {
    errors.push('UserName is required and must be less than 100 characters');
  }
  
  if (!review.userEmail || !isValidEmail(review.userEmail)) {
    errors.push('UserEmail is required and must be a valid email address');
  }
  
  if (typeof review.anonymous !== 'boolean') {
    errors.push('Anonymous must be a boolean');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Email Validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Usage Example
const review = {
  treatmentId: '1234567890',
  treatmentName: 'Ginger Tea',
  rating: 5,
  comment: 'Great treatment!',
  userName: 'John Doe',
  userEmail: 'john@example.com',
  anonymous: false
};

const validation = validateReview(review);
if (validation.valid) {
  // Proceed with submission
  submitReview(review);
} else {
  // Show errors to user
  console.error('Validation errors:', validation.errors);
}
```

## TypeScript Types

```typescript
// Treatment Type
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

// Review Type
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

// Review Input (for creating reviews)
interface ReviewInput {
  treatmentId: string;
  treatmentName: string;
  rating: number;
  comment: string;
  userName: string;
  userEmail: string;
  anonymous: boolean;
}
```

## Example Data

### Treatment Example
```json
{
  "id": "1728123456789",
  "name": "Ginger Tea",
  "symptoms": ["Nausea", "Digestive issues"],
  "imageUrl": "https://firebasestorage.googleapis.com/.../ginger.jpg",
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

### Review Example
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

### Anonymous Review Example
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

## Field Constraints Summary

### Treatment
- `name`: Required, max 200 chars
- `preparation`: Required, array, min 1 item
- `usage`: Required, max 500 chars
- `dosage`: Required, max 200 chars
- `warnings`: Required, array
- `benefits`: Required, array, min 1 item
- `sourceType`: Required, enum: "Local Remedy" | "Verified Source"
- `averageRating`: 0-5, 1 decimal place
- `totalReviews`: >= 0

### Review
- `treatmentId`: Required, must reference existing treatment
- `treatmentName`: Required, max 200 chars
- `rating`: Required, integer 1-5
- `comment`: Required, max 2000 chars
- `userName`: Required, max 100 chars
- `userEmail`: Required, valid email format
- `anonymous`: Required, boolean

