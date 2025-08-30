'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/upload/FileUpload';
import { FileUploadResult } from '@/lib/dataProcessing';

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [uploadResults, setUploadResults] = useState<FileUploadResult[]>([]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const handleUploadComplete = (results: FileUploadResult[]) => {
    setUploadResults(results);
    console.log('Upload results:', results);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Upload</h1>
              <p className="mt-1 text-sm text-gray-500">
                Upload student data files for processing and analysis
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* File Upload Component */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Files</h2>
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>

        {/* Upload Results */}
        {uploadResults.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Processing Results</h2>
            <div className="space-y-4">
              {uploadResults.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      File {index + 1} - {result.type.toUpperCase()}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  
                  {result.success ? (
                    <div className="text-sm text-gray-600">
                      <p>Processed {result.metadata?.rowCount || 0} records</p>
                      <p>Processing time: {result.metadata?.processingTime || 0}ms</p>
                    </div>
                  ) : (
                    <div className="text-sm text-red-600">
                      <p>Error: {result.error}</p>
                    </div>
                  )}

                  {result.success && result.data && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Sample Data:</h4>
                      <div className="bg-gray-50 rounded p-3 text-xs">
                        <pre>{JSON.stringify(result.data.slice(0, 3), null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
