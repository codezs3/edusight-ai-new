import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';

import GoogleDriveService from '@/lib/services/googleDriveService';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const googleDriveService = new GoogleDriveService({
      clientId: process.env.GOOGLE_DRIVE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI!,
    });

    const authUrl = googleDriveService.generateAuthUrl();

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating Google Drive auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Authorization code required' }, { status: 400 });
    }

    const googleDriveService = new GoogleDriveService({
      clientId: process.env.GOOGLE_DRIVE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI!,
    });

    const tokens = await googleDriveService.getTokens(code);

    // Store the refresh token securely (you might want to encrypt this)
    // For now, we'll return it to be stored in the frontend
    // In production, store this in your database or secure storage

    return NextResponse.json({
      success: true,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
    });
  } catch (error) {
    console.error('Error exchanging Google Drive auth code:', error);
    return NextResponse.json(
      { error: 'Failed to exchange authorization code' },
      { status: 500 }
    );
  }
}
