'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import EnhancedUnifiedWorkflow from '@/components/workflow/EnhancedUnifiedWorkflow';
import { GRADE_OPTIONS } from '@/constants/grades';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

const UPLOAD_TYPES = [
  { value: 'report_cards', label: 'Report Cards', description: 'School report cards and grade sheets' },
  { value: 'transcripts', label: 'Academic Transcripts', description: 'Official academic transcripts' },
  { value: 'assessment_results', label: 'Assessment Results', description: 'Test results and evaluations' },
  { value: 'certificates', label: 'Certificates & Awards', description: 'Academic achievements and certificates' }
];

export default function GuestAssessmentPage() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploadType, setUploadType] = useState('report_cards');
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(2),
      progress: 0,
      status: 'pending' as const
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFile = async (uploadFile: UploadFile) => {
    const formData = new FormData();
    formData.append('file', uploadFile.file);
    formData.append('uploadType', uploadType);
    formData.append('category', 'academic');
    formData.append('studentName', studentName);
    formData.append('studentGrade', studentGrade);

    try {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ));

      const response = await fetch('/api/guest/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'completed', progress: 100 }
          : f
      ));

      const result = await response.json();
      
      // Store guest session and document info
      setGuestSessionId(result.guestSessionId);
      setCurrentDocumentId(result.document.id);
      
      return result;
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { 
              ...f, 
              status: 'error', 
              error: error instanceof Error ? error.message : 'Upload failed' 
            }
          : f
      ));
      throw error;
    }
  };

  const handleUploadAll = async () => {
    if (!studentName.trim()) {
      toast.error('Please enter student name');
      return;
    }

    if (!studentGrade.trim()) {
      toast.error('Please select student grade');
      return;
    }

    setIsLoading(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    try {
      // Upload first file (for demo, we'll process one file)
      if (pendingFiles.length > 0) {
        await uploadFile(pendingFiles[0]);
        toast.success('Document uploaded successfully!');
        setShowWorkflow(true);
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DocumentIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const handleWorkflowComplete = (results: any) => {
    // Workflow completed - show detailed report in development mode
    toast.success('Analysis completed! View your detailed report below.');
  };

  const handleWorkflowError = (error: string) => {
    toast.error(`Analysis failed: ${error}`);
    setShowWorkflow(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduSight Free Assessment</h1>
                <p className="text-sm text-gray-600">Get instant AI-powered academic insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>Free Trial</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>No Signup Required</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showWorkflow ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Discover Your Child's Academic Potential
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Upload your child's academic documents and get a comprehensive AI-powered analysis 
                including performance insights, career recommendations, and personalized improvement suggestions.
              </p>

              {/* Assessment Roadmap */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">How It Works - Simple 3-Step Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">1</div>
                    <h4 className="font-semibold text-blue-900 mb-2">Upload Documents</h4>
                    <p className="text-sm text-blue-700">Submit your child's report cards, transcripts, or assessment results</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">2</div>
                    <h4 className="font-semibold text-blue-900 mb-2">AI Analysis</h4>
                    <p className="text-sm text-blue-700">Our advanced AI processes the data and generates comprehensive insights</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">3</div>
                    <h4 className="font-semibold text-blue-900 mb-2">Get Your Report</h4>
                    <p className="text-sm text-blue-700">Receive detailed insights, career recommendations, and improvement plans</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 text-green-800">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="font-medium">Completely Free • No Credit Card Required • Instant Results</span>
                  </div>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <SparklesIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
                  <p className="text-sm text-gray-600">Advanced machine learning algorithms analyze academic performance patterns</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <EyeIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Instant Insights</h3>
                  <p className="text-sm text-gray-600">Get detailed performance insights and career recommendations in minutes</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ArrowRightIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Actionable Recommendations</h3>
                  <p className="text-sm text-gray-600">Receive personalized suggestions for academic improvement</p>
                </div>
              </div>
            </div>

            {/* Upload Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Upload Academic Documents</h3>
              
              {/* Student Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter student's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Grade *
                  </label>
                  <select
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select grade</option>
                    {GRADE_OPTIONS.map((grade) => (
                      <option key={grade.value} value={grade.value}>
                        {grade.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Document Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Document Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {UPLOAD_TYPES.map((type) => (
                    <div
                      key={type.value}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        uploadType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setUploadType(type.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="uploadType"
                          value={type.value}
                          checked={uploadType === type.value}
                          onChange={() => setUploadType(type.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-600">{type.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Documents
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? 'Drop files here' : 'Upload your documents'}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports PDF, Images, Word, Excel files (Max 10MB each)
                  </p>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files</h4>
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(file.status)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        {file.status === 'pending' && (
                          <button
                            onClick={() => removeFile(file.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        )}
                        {file.error && (
                          <p className="text-xs text-red-600">{file.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleUploadAll}
                disabled={isLoading || files.length === 0 || !studentName.trim() || !studentGrade}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Start Free Analysis</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                No signup required. Your documents are processed securely and deleted after analysis.
              </p>
            </div>
          </div>
        ) : (
          /* Workflow Processing */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Analyzing Your Documents...
              </h2>
              <p className="text-gray-600">
                Our AI is processing {studentName}'s academic data. This usually takes 3-5 minutes.
              </p>
            </div>

            <EnhancedUnifiedWorkflow
              userRole="PARENT"
              studentName={studentName}
              studentAge={parseInt(studentGrade) || 15}
              onComplete={handleWorkflowComplete}
              onError={handleWorkflowError}
              showUpload={true}
              initialFiles={files.map(f => f.file)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
