import { getAdminFirestore } from '@/lib/firebase/admin';

async function testConnection() {
  console.log('Project ID:', process.env.FIREBASE_ADMIN_PROJECT_ID);
  console.log('Client Email:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
  const key = process.env.FIREBASE_ADMIN_PRIVATE_KEY || '';
  console.log('Key length:', key.length, 'Includes \\n?:', key.includes('\\n'));
  
  const db = getAdminFirestore();
  if (!db) {
    console.log('Failed to get Admin Firestore');
    return;
  }
  
  console.log('Testing connection...');
  const snapshot = await db.collection('systemSequences').limit(1).get();
  console.log('Connection OK. Empty?', snapshot.empty);
  process.exit(0);
}

testConnection().catch(console.error);
