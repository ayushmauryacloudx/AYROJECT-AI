import { initializeApp, applicationDefault, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const apps = getApps();

// We MUST use applicationDefault() which securely loads the Cloud Run service account credentials.
// Vercel deployment will require a service account JSON, but in AI Studio/Cloud Run, applicationDefault() is required.
export const adminApp = apps.length === 0 ? initializeApp({
  credential: applicationDefault(),
  // CRITICAL FIX: The projectId MUST match the auth domain of the token!
  // It must be the actual Firebase Project ID, NOT the Google Cloud Project ID if they differ.
  projectId: "gen-lang-client-0383638130", 
}) : apps[0];

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp, 'ai-studio-projectforgeai-9aa26ea8-f324-41f2-b554-658ffa4efcd7');
