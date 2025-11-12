/**
 * Firebase Configuration
 * 
 * This file exports both Admin SDK (server-side) and Client SDK (client-side) instances.
 * 
 * For server-side operations (API routes, server components):
 * - Use: import { adminDb, adminStorage } from '@/lib/firebase-admin'
 * 
 * For client-side operations (React components in browser):
 * - Use: import { db, storage, analytics } from '@/lib/firebase-client'
 * 
 * Firebase is configured with:
 * - Realtime Database (Asia-Southeast1 region)
 * - Cloud Storage
 * - Analytics (client-side only)
 */

// Re-export Admin SDK (server-side only)
export { adminDb, adminStorage } from './firebase-admin'

// Re-export Client SDK (client-side)
export { db, storage, analytics } from './firebase-client'

