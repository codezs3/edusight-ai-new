'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  CloudArrowUpIcon,
  CloudIcon,
  CogIcon,
  DocumentArrowDownIcon,
  FolderIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface MaintenanceLog {
  id: string;
  type: string;
  status: string;
  description: string | null;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  fileSize: string | null;
  fileName: string | null;
  googleDriveId: string | null;
  errorMessage: string | null;
  createdAt: string;
}

interface GoogleDriveFolder {
  id: string;
  name: string;
  createdTime: string;
}

interface BackupOptions {
  includePrismaDb: boolean;
  includeUploads: boolean;
  includeConfig: boolean;
  includeLogs: boolean;
  uploadToGoogleDrive: boolean;
  googleDriveFolderId?: string;
}

export default function MaintenancePage() {
  const { data: session } = useSession();
  const [googleDriveAuthenticated, setGoogleDriveAuthenticated] = useState(false);
  const [googleRefreshToken, setGoogleRefreshToken] = useState<string>('');
  const [googleDriveFolders, setGoogleDriveFolders] = useState<GoogleDriveFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState<string>('');

  const [backupOptions, setBackupOptions] = useState<BackupOptions>({
    includePrismaDb: true,
    includeUploads: true,
    includeConfig: true,
    includeLogs: false,
    uploadToGoogleDrive: false,
  });

  // Check if user is admin
  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  // Load maintenance logs
  const loadMaintenanceLogs = async (page = 1, type = '') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(type && { type }),
      });

      const response = await fetch(`/api/admin/maintenance/backup?${params}`);
      const data = await response.json();

      if (response.ok) {
        setMaintenanceLogs(data.logs);
        setTotalPages(data.pages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error loading maintenance logs:', error);
    }
  };

  // Authenticate with Google Drive
  const authenticateGoogleDrive = async () => {
    try {
      const response = await fetch('/api/admin/maintenance/google-auth');
      const data = await response.json();

      if (response.ok) {
        // Open Google Auth URL in new window
        const authWindow = window.open(data.authUrl, 'GoogleAuth', 'width=500,height=600');
        
        // Listen for the auth code (you'll need to implement a callback page)
        const pollTimer = setInterval(() => {
          try {
            if (authWindow?.closed) {
              clearInterval(pollTimer);
              // Check if authentication was successful
              // This would require implementing a callback mechanism
            }
          } catch (error) {
            // Window still open
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error initiating Google Drive authentication:', error);
    }
  };

  // Load Google Drive folders
  const loadGoogleDriveFolders = async () => {
    if (!googleRefreshToken) return;

    try {
      const response = await fetch(
        `/api/admin/maintenance/google-drive/folders?refreshToken=${encodeURIComponent(googleRefreshToken)}`
      );
      const data = await response.json();

      if (response.ok) {
        setGoogleDriveFolders(data.folders);
        setGoogleDriveAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading Google Drive folders:', error);
    }
  };

  // Create backup
  const createBackup = async () => {
    setBackupInProgress(true);

    try {
      const response = await fetch('/api/admin/maintenance/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...backupOptions,
          googleDriveFolderId: selectedFolder,
          googleDriveRefreshToken: googleRefreshToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh logs
        await loadMaintenanceLogs();
        
        // Show success message
        alert(`Backup created successfully: ${data.fileName}`);
      } else {
        alert(`Backup failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Backup failed: Network error');
    } finally {
      setBackupInProgress(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadMaintenanceLogs();
  }, []);

  // Load Google Drive folders when refresh token is available
  useEffect(() => {
    if (googleRefreshToken) {
      loadGoogleDriveFolders();
    }
  }, [googleRefreshToken]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'running':
        return <ClockIcon className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-800 bg-green-100';
      case 'failed':
        return 'text-red-800 bg-red-100';
      case 'running':
        return 'text-blue-800 bg-blue-100';
      default:
        return 'text-yellow-800 bg-yellow-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Maintenance</h1>
          <p className="mt-2 text-gray-600">
            Manage system backups, maintenance tasks, and Google Drive integration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Backup Configuration */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <CloudArrowUpIcon className="h-6 w-6 mr-2 text-blue-500" />
              Backup Configuration
            </h2>

            {/* Google Drive Authentication */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Google Drive Integration</h3>
              
              {!googleDriveAuthenticated ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Connect your Google Drive account to upload backups automatically.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={authenticateGoogleDrive}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <CloudIcon className="h-4 w-4 mr-2" />
                      Connect Google Drive
                    </button>
                    <input
                      type="text"
                      placeholder="Or paste refresh token"
                      value={googleRefreshToken}
                      onChange={(e) => setGoogleRefreshToken(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center text-green-600">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Google Drive Connected
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Backup Folder
                    </label>
                    <select
                      value={selectedFolder}
                      onChange={(e) => setSelectedFolder(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Root Directory</option>
                      {googleDriveFolders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Backup Options */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900">Backup Options</h3>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={backupOptions.includePrismaDb}
                    onChange={(e) =>
                      setBackupOptions({ ...backupOptions, includePrismaDb: e.target.checked })
                    }
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Include Database</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={backupOptions.includeUploads}
                    onChange={(e) =>
                      setBackupOptions({ ...backupOptions, includeUploads: e.target.checked })
                    }
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Include Uploaded Files</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={backupOptions.includeConfig}
                    onChange={(e) =>
                      setBackupOptions({ ...backupOptions, includeConfig: e.target.checked })
                    }
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Include Configuration Files</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={backupOptions.includeLogs}
                    onChange={(e) =>
                      setBackupOptions({ ...backupOptions, includeLogs: e.target.checked })
                    }
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Include System Logs</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={backupOptions.uploadToGoogleDrive}
                    onChange={(e) =>
                      setBackupOptions({ ...backupOptions, uploadToGoogleDrive: e.target.checked })
                    }
                    className="mr-3 h-4 w-4 text-blue-600"
                    disabled={!googleDriveAuthenticated}
                  />
                  <span className="text-sm text-gray-700">Upload to Google Drive</span>
                </label>
              </div>
            </div>

            {/* Create Backup Button */}
            <button
              onClick={createBackup}
              disabled={backupInProgress}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {backupInProgress ? (
                <>
                  <CogIcon className="h-5 w-5 mr-2 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Create Backup Now
                </>
              )}
            </button>
          </div>

          {/* Maintenance Logs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <DocumentArrowDownIcon className="h-6 w-6 mr-2 text-green-500" />
                Maintenance Logs
              </h2>
              
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  loadMaintenanceLogs(1, e.target.value);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Types</option>
                <option value="backup">Backups</option>
                <option value="restore">Restores</option>
                <option value="cleanup">Cleanup</option>
              </select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {maintenanceLogs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No maintenance logs found.</p>
              ) : (
                maintenanceLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(log.status)}
                        <span className="font-medium text-gray-900">{log.type}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            log.status
                          )}`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(log.startTime).toLocaleString()}
                      </span>
                    </div>

                    {log.description && (
                      <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="space-x-4">
                        {log.fileName && <span>File: {log.fileName}</span>}
                        {log.fileSize && <span>Size: {log.fileSize}</span>}
                        {log.duration && <span>Duration: {log.duration}s</span>}
                      </div>
                      {log.googleDriveId && (
                        <span className="text-blue-500">
                          <CloudIcon className="h-4 w-4 inline mr-1" />
                          Uploaded
                        </span>
                      )}
                    </div>

                    {log.errorMessage && (
                      <div className="mt-2 p-2 bg-red-50 rounded-md">
                        <p className="text-sm text-red-600">{log.errorMessage}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => loadMaintenanceLogs(currentPage - 1, filterType)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => loadMaintenanceLogs(currentPage + 1, filterType)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
