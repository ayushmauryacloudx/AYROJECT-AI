const fs = require('fs');

const envContent = `
VITE_FIREBASE_API_KEY=AIzaSyD7YFRMkyLA_UGZI25bK1KqNfSN_1uNe4M
VITE_FIREBASE_AUTH_DOMAIN=gen-lang-client-0383638130.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gen-lang-client-0383638130
VITE_FIREBASE_STORAGE_BUCKET=gen-lang-client-0383638130.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=18478938993
VITE_FIREBASE_APP_ID=1:18478938993:web:16c89f5c8dbc6be1a654d0
VITE_FIREBASE_DATABASE_ID=ai-studio-projectforgeai-9aa26ea8-f324-41f2-b554-658ffa4efcd7
`;

fs.appendFileSync('.env', envContent);

const firebaseTs = `import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || "(default)";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, databaseId);
`;

fs.writeFileSync('src/lib/firebase.ts', firebaseTs);
