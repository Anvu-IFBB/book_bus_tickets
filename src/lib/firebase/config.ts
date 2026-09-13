import { z } from 'zod';

export const firebaseClientConfigSchema = z.object({
  apiKey: z.string().min(1, 'Firebase API Key is required'),
  authDomain: z.string().min(1, 'Firebase Auth Domain is required'),
  projectId: z.string().min(1, 'Firebase Project ID is required'),
  storageBucket: z.string().optional(),
  messagingSenderId: z.string().optional(),
  appId: z.string().min(1, 'Firebase App ID is required'),
});

export type FirebaseClientConfig = z.infer<typeof firebaseClientConfigSchema>;

export const firebaseAdminConfigSchema = z.object({
  projectId: z.string().min(1, 'Firebase Admin Project ID is required'),
  clientEmail: z.string().email('Firebase Admin Client Email is required'),
  privateKey: z.string().min(1, 'Firebase Admin Private Key is required'),
});

export type FirebaseAdminConfig = z.infer<typeof firebaseAdminConfigSchema>;

/**
 * Kiểm tra xem Firebase Client SDK đã được cấu hình đủ các biến môi trường hay chưa
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  );
}

/**
 * Kiểm tra xem Firebase Admin SDK đã được cấu hình đủ các biến môi trường hay chưa
 */
export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    (process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}

/**
 * Lấy cấu hình Client SDK từ biến môi trường
 */
export function getFirebaseClientConfig(): FirebaseClientConfig | null {
  if (!isFirebaseConfigured()) return null;

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };
}

/**
 * Lấy cấu hình Admin SDK từ biến môi trường (Server-Side only)
 */
export function getFirebaseAdminConfig(): FirebaseAdminConfig | null {
  if (!isFirebaseAdminConfigured()) return null;

  const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || '';
  // Xử lý escape newline ký tự \n nếu private key được truyền trong env string
  const privateKey = rawKey.replace(/\\n/g, '\n');

  return {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || '',
    privateKey,
  };
}
