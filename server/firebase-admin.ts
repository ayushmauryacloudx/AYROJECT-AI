import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// Safely load config
const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
let config: any = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

const apps = getApps();
export const adminApp = apps.length === 0 ? initializeApp({
  credential: applicationDefault(),
  projectId: config.projectId,
}) : apps[0];

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp, config.firestoreDatabaseId || '(default)');
