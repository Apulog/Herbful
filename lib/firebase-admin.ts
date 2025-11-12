import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import { getStorage } from 'firebase-admin/storage'
import credentials from './firebase-credentials.json'

// Initialize Firebase Admin SDK
let adminApp: App | undefined

if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert({
      projectId: credentials.project_id,
      clientEmail: credentials.client_email,
      privateKey: credentials.private_key.replace(/\\n/g, '\n'),
    }),
    databaseURL: 'https://herbful-535e4-default-rtdb.asia-southeast1.firebasedatabase.app',
    storageBucket: 'herbful-535e4.firebasestorage.app',
  })
} else {
  adminApp = getApps()[0]
}

// Export database and storage instances
export const adminDb = getDatabase(adminApp)
export const adminStorage = getStorage(adminApp)
export default adminApp

