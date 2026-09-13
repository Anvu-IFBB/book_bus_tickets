import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getFirebaseAdminConfig } from './config';

let adminApp: App | null = null;

export function getFirebaseAdminApp(): App | null {
  if (typeof window !== 'undefined') {
    throw new Error('Firebase Admin SDK cannot be used on client side');
  }

  if (adminApp) return adminApp;

  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    adminApp = existingApps[0];
    return adminApp;
  }

  const config = getFirebaseAdminConfig();
  if (!config) return null;

  try {
    adminApp = initializeApp({
      credential: cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: config.privateKey,
      }),
    });
    return adminApp;
  } catch (err) {
    console.error('Failed to initialize Firebase Admin SDK:', err);
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  const app = getFirebaseAdminApp();
  if (!app) return null;
  return getAuth(app);
}

export function getAdminFirestore(): Firestore | null {
  const app = getFirebaseAdminApp();
  if (!app) return null;
  return getFirestore(app);
}
