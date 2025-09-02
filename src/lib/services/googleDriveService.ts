import { google } from 'googleapis';
import { Readable } from 'stream';

export interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  size?: string;
  createdTime: string;
  modifiedTime: string;
  mimeType: string;
  parents?: string[];
}

export interface DriveFolder {
  id: string;
  name: string;
  createdTime: string;
}

class GoogleDriveService {
  private oauth2Client: any;
  private drive: any;

  constructor(config: GoogleDriveConfig) {
    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );

    if (config.refreshToken) {
      this.oauth2Client.setCredentials({
        refresh_token: config.refreshToken,
      });
    }

    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  // Generate OAuth URL for initial authentication
  generateAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  // Exchange authorization code for tokens
  async getTokens(code: string): Promise<any> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  // Set refresh token for subsequent requests
  setRefreshToken(refreshToken: string): void {
    this.oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });
  }

  // Create a folder in Google Drive
  async createFolder(name: string, parentFolderId?: string): Promise<DriveFolder> {
    const folderMetadata = {
      name: name,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentFolderId && { parents: [parentFolderId] }),
    };

    const response = await this.drive.files.create({
      requestBody: folderMetadata,
      fields: 'id, name, createdTime',
    });

    return response.data;
  }

  // List folders in Google Drive
  async listFolders(parentFolderId?: string): Promise<DriveFolder[]> {
    const query = `mimeType='application/vnd.google-apps.folder'${
      parentFolderId ? ` and '${parentFolderId}' in parents` : ''
    } and trashed=false`;

    const response = await this.drive.files.list({
      q: query,
      fields: 'files(id, name, createdTime)',
      orderBy: 'name',
    });

    return response.data.files || [];
  }

  // Upload a file to Google Drive
  async uploadFile(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
    folderId?: string
  ): Promise<DriveFile> {
    const fileMetadata = {
      name: fileName,
      ...(folderId && { parents: [folderId] }),
    };

    const media = {
      mimeType: mimeType,
      body: Readable.from(fileBuffer),
    };

    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, size, createdTime, modifiedTime, mimeType',
    });

    return response.data;
  }

  // Download a file from Google Drive
  async downloadFile(fileId: string): Promise<Buffer> {
    const response = await this.drive.files.get({
      fileId: fileId,
      alt: 'media',
    });

    return Buffer.from(response.data);
  }

  // List files in a folder
  async listFiles(folderId?: string, pageSize = 50): Promise<DriveFile[]> {
    const query = folderId ? `'${folderId}' in parents and trashed=false` : 'trashed=false';

    const response = await this.drive.files.list({
      q: query,
      pageSize: pageSize,
      fields: 'files(id, name, size, createdTime, modifiedTime, mimeType, parents)',
      orderBy: 'modifiedTime desc',
    });

    return response.data.files || [];
  }

  // Delete a file from Google Drive
  async deleteFile(fileId: string): Promise<void> {
    await this.drive.files.delete({
      fileId: fileId,
    });
  }

  // Get file metadata
  async getFileMetadata(fileId: string): Promise<DriveFile> {
    const response = await this.drive.files.get({
      fileId: fileId,
      fields: 'id, name, size, createdTime, modifiedTime, mimeType, parents',
    });

    return response.data;
  }

  // Check if authenticated
  async checkAuth(): Promise<boolean> {
    try {
      await this.drive.files.list({ pageSize: 1 });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get storage quota information
  async getStorageInfo(): Promise<any> {
    const response = await this.drive.about.get({
      fields: 'storageQuota',
    });

    return response.data.storageQuota;
  }
}

export default GoogleDriveService;
