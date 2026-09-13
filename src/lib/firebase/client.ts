import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFirebaseClientConfig } from './config';

let clientApp: FirebaseApp | null = null;
let clientAuth: Auth | null = null;
let clientDb: Firestore | null = null;

export function getFirebaseClientApp(): FirebaseApp | null {
  if (clientApp) return clientApp;

  const config = getFirebaseClientConfig();
  if (!config) return null;

  if (getApps().length > 0) {
    clientApp = getApp();
  } else {
    clientApp = initializeApp(config);
  }
  return clientApp;
}

export function getFirebaseAuth(): Auth | null {
  if (clientAuth) return clientAuth;
  const app = getFirebaseClientApp();
  if (!app) return null;
  clientAuth = getAuth(app);
  return clientAuth;
}

export function getFirebaseFirestore(): Firestore | null {
  if (clientDb) return clientDb;
  const app = getFirebaseClientApp();
  if (!app) return null;
  clientDb = getFirestore(app);
  return clientDb;
}
