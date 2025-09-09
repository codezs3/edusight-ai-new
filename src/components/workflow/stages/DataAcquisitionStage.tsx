'use client';

import React, { useState, useCallback } from 'react';
import { 
  DocumentArrowUpIcon, 
  PhotoIcon, 
  DocumentTextIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { UploadedFile, ParsedData } from '@/types/assessment';
import { toast } from 'react-hot-toast';

interface DataAcquisitionStageProps {
  workflowConfig?: any;
  onComplete: (data: any) => void;
  onError: (error: string) => void;
}

export function DataAcquisitionStage({ workflowConfig, onComplete, onError }: DataAcquisitionStageProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  }, []);

  const handleFiles = useCallback(async (files: File[]) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/csv'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File type ${file.type} is not supported`);
        continue;
      }

      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB`);
        continue;
      }

      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        status: 'UPLOADING'
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);
      await processFile(uploadedFile, file);
    }
  }, []);

  const processFile = useCallback(async (uploadedFile: UploadedFile, file: File) => {
    try {
      setUploadedFiles(prev => 
        prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'PROCESSING' } : f)
      );

      // Simulate OCR and data extraction
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'assessment_data');

      const response = await fetch('/api/upload/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process file');
      }

      const result: ParsedData = await response.json();

      setUploadedFiles(prev => 
        prev.map(f => f.id === uploadedFile.id 
          ? { ...f, status: 'COMPLETED', extractedData: result } 
          : f
        )
      );

      toast.success(`Successfully processed ${uploadedFile.name}`);
    } catch (error) {
      setUploadedFiles(prev => 
        prev.map(f => f.id === uploadedFile.id 
          ? { ...f, status: 'ERROR' } 
          : f
        )
      );
      toast.error(`Failed to process ${uploadedFile.name}`);
    }
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const handleContinue = useCallback(() => {
    const completedFiles = uploadedFiles.filter(f => f.status === 'COMPLETED');
    
    if (completedFiles.length === 0) {
      toast.error('Please upload and process at least one file');
      return;
    }

    const extractedData = completedFiles.map(f => f.extractedData).filter(Boolean);
    onComplete({ files: completedFiles, extractedData });
  }, [uploadedFiles, onComplete]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <PhotoIcon className="h-8 w-8 text-blue-500" />;
    } else if (type === 'application/pdf') {
      return <DocumentTextIcon className="h-8 w-8 text-red-500" />;
    } else {
      return <DocumentArrowUpIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'PROCESSING':
        return <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'ERROR':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload Assessment Documents
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop files here, or click to select files
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supported formats: PDF, JPG, PNG, CSV (Max 10MB each)
        </p>
        
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.csv"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Select Files
        </label>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Uploaded Files</h4>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {getStatusIcon(file.status)}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Preview */}
      {uploadedFiles.some(f => f.status === 'COMPLETED') && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Extracted Data Preview</h4>
          <div className="space-y-4">
            {uploadedFiles
              .filter(f => f.status === 'COMPLETED' && f.extractedData)
              .map((file) => (
                <div key={file.id} className="bg-white rounded-lg p-4 border">
                  <h5 className="font-medium text-gray-900 mb-2">{file.name}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Academic Scores</p>
                      <p className="text-gray-600">
                        {file.extractedData?.academicScores?.length || 0} subjects
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Psychometric Data</p>
                      <p className="text-gray-600">
                        {file.extractedData?.psychometricScores?.length || 0} traits
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Confidence</p>
                      <p className="text-gray-600">
                        {Math.round((file.extractedData?.confidence || 0) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!uploadedFiles.some(f => f.status === 'COMPLETED')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Validation
        </button>
      </div>
    </div>
  );
}
