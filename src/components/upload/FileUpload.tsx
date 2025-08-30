'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { 
  DocumentArrowUpIcon, 
  DocumentTextIcon, 
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { FileProcessor, FileUploadResult } from '@/lib/dataProcessing';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onUploadComplete: (results: FileUploadResult[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

interface UploadedFile {
  file: File;
  result?: FileUploadResult;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
}

export function FileUpload({
  onUploadComplete,
  acceptedTypes = ['.csv', '.xlsx', '.pdf', '.jpg', '.jpeg', '.png'],
  maxFiles = 5,
  maxSizeMB = 10,
  className = '',
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    // Validate file sizes
    const oversizedFiles = acceptedFiles.filter(file => !FileProcessor.validateFileSize(file, maxSizeMB));
    if (oversizedFiles.length > 0) {
      toast.error(`Files too large: ${oversizedFiles.map(f => f.name).join(', ')}. Max size: ${maxSizeMB}MB`);
      return;
    }

    // Check total file limit
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      toast.error(`Too many files. Maximum ${maxFiles} files allowed.`);
      return;
    }

    setIsProcessing(true);

    // Initialize uploaded files
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      status: 'uploading' as const,
      progress: 0,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Process files
    const results: FileUploadResult[] = [];
    
    for (let i = 0; i < newFiles.length; i++) {
      const fileData = newFiles[i];
      
      try {
        // Update status to processing
        setUploadedFiles(prev => 
          prev.map((f, index) => 
            f.file === fileData.file 
              ? { ...f, status: 'processing', progress: 25 }
              : f
          )
        );

        // Simulate upload progress
        for (let progress = 25; progress <= 75; progress += 25) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setUploadedFiles(prev => 
            prev.map(f => 
              f.file === fileData.file 
                ? { ...f, progress }
                : f
            )
          );
        }

        // Process the file
        const result = await FileProcessor.processFile(fileData.file);
        results.push(result);

        // Update file status
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === fileData.file 
              ? { 
                  ...f, 
                  result, 
                  status: result.success ? 'completed' : 'error',
                  progress: 100 
                }
              : f
          )
        );

        if (result.success) {
          toast.success(`${fileData.file.name} processed successfully`);
        } else {
          toast.error(`Failed to process ${fileData.file.name}: ${result.error}`);
        }

      } catch (error) {
        console.error('File processing error:', error);
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === fileData.file 
              ? { 
                  ...f, 
                  status: 'error',
                  progress: 100,
                  result: {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    type: 'csv',
                  }
                }
              : f
          )
        );
        
        toast.error(`Error processing ${fileData.file.name}`);
      }
    }

    setIsProcessing(false);
    onUploadComplete(results);
  }, [uploadedFiles.length, maxFiles, maxSizeMB, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/bmp': ['.bmp'],
      'image/tiff': ['.tiff'],
    },
    maxFiles,
    maxSize: maxSizeMB * 1024 * 1024,
    disabled: isProcessing,
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase();
    if (type.includes('pdf')) return <DocumentTextIcon className="h-8 w-8" />;
    if (type.startsWith('image/')) return <PhotoIcon className="h-8 w-8" />;
    return <DocumentArrowUpIcon className="h-8 w-8" />;
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {isDragActive ? 'Drop files here' : 'Upload student data files'}
          </p>
          <p className="text-sm text-gray-600">
            Drag and drop files here, or click to select
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: {acceptedTypes.join(', ')} (max {maxSizeMB}MB each)
          </p>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Processing files...</p>
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-3"
          >
            <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
            
            {uploadedFiles.map((fileData, index) => (
              <motion.div
                key={`${fileData.file.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-400">
                      {getFileIcon(fileData.file)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileData.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(fileData.file.size)} • {fileData.result?.type || 'Processing...'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusIcon(fileData.status)}
                    
                    <button
                      onClick={() => removeFile(fileData.file)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      disabled={fileData.status === 'processing'}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {fileData.status !== 'completed' && fileData.status !== 'error' && (
                  <div className="mt-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${fileData.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Results Summary */}
                {fileData.result && fileData.status === 'completed' && (
                  <div className="mt-3 p-3 bg-green-50 rounded-md">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                      <div className="text-sm">
                        <p className="text-green-800 font-medium">
                          Successfully processed {fileData.result.metadata?.rowCount || 0} records
                        </p>
                        {fileData.result.metadata && (
                          <p className="text-green-600 text-xs mt-1">
                            {fileData.result.metadata.columnCount} columns • 
                            Processed in {fileData.result.metadata.processingTime}ms
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {fileData.result && fileData.status === 'error' && (
                  <div className="mt-3 p-3 bg-red-50 rounded-md">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-red-800 font-medium">Processing failed</p>
                        <p className="text-red-600 text-xs mt-1">
                          {fileData.result.error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      <div className="mt-6 text-xs text-gray-500 space-y-1">
        <p><strong>CSV Files:</strong> Should include columns like student_id, name, grade, subject</p>
        <p><strong>PDF Files:</strong> Student reports and assessment documents</p>
        <p><strong>Images:</strong> Scanned documents, handwritten assessments (OCR enabled)</p>
      </div>
    </div>
  );
}
