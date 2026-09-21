import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const adminApp = await import('firebase-admin/app');
    return NextResponse.json({ 
      status: 'ok', 
      firebaseAdminAppImported: !!adminApp 
    });
  } catch (err: any) {
    return NextResponse.json({ 
      status: 'error', 
      error: err.message,
      stack: err.stack,
      name: err.name
    }, { status: 500 });
  }
}
