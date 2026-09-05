import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const apps = getApps();

export const adminApp = apps.length === 0 ? initializeApp({
  credential: applicationDefault(),
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
}) : apps[0];

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp, process.env.VITE_FIREBASE_DATABASE_ID || '(default)');
