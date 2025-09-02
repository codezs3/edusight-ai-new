import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';

import GoogleDriveService from '@/lib/services/googleDriveService';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const refreshToken = searchParams.get('refreshToken');
    const parentFolderId = searchParams.get('parentId') || undefined;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }

    const googleDriveService = new GoogleDriveService({
      clientId: process.env.GOOGLE_DRIVE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI!,
      refreshToken: refreshToken,
    });

    // Check authentication
    const isAuthenticated = await googleDriveService.checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Google Drive authentication failed' }, { status: 401 });
    }

    const folders = await googleDriveService.listFolders(parentFolderId);

    return NextResponse.json({ folders });
  } catch (error) {
    console.error('Error fetching Google Drive folders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
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

    const { name, parentFolderId, refreshToken } = await request.json();

    if (!name || !refreshToken) {
      return NextResponse.json(
        { error: 'Folder name and refresh token required' },
        { status: 400 }
      );
    }

    const googleDriveService = new GoogleDriveService({
      clientId: process.env.GOOGLE_DRIVE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI!,
      refreshToken: refreshToken,
    });

    const folder = await googleDriveService.createFolder(name, parentFolderId);

    return NextResponse.json({
      success: true,
      folder,
    });
  } catch (error) {
    console.error('Error creating Google Drive folder:', error);
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    );
  }
}
