import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';

import BackupService from '@/lib/services/backupService';
import GoogleDriveService from '@/lib/services/googleDriveService';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      includePrismaDb = true,
      includeUploads = true,
      includeConfig = true,
      includeLogs = false,
      uploadToGoogleDrive = false,
      googleDriveFolderId,
      googleDriveRefreshToken,
    } = body;

    let googleDriveService: GoogleDriveService | undefined;

    if (uploadToGoogleDrive && googleDriveRefreshToken) {
      googleDriveService = new GoogleDriveService({
        clientId: process.env.GOOGLE_DRIVE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
        redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI!,
        refreshToken: googleDriveRefreshToken,
      });
    }

    const backupService = new BackupService(googleDriveService);

    const result = await backupService.createBackup(
      session.user.id,
      {
        includePrismaDb,
        includeUploads,
        includeConfig,
        includeLogs,
      },
      uploadToGoogleDrive,
      googleDriveFolderId
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Backup created successfully',
        fileName: result.fileName,
        fileSize: result.fileSize,
        googleDriveId: result.googleDriveId,
        duration: result.duration,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') || undefined;

    const backupService = new BackupService();
    const result = await backupService.getMaintenanceLogs(page, limit, type);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching maintenance logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance logs' },
      { status: 500 }
    );
  }
}
