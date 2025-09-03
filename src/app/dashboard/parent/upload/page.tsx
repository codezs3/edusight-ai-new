'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  EyeIcon,
  UserCircleIcon,
  ChartBarIcon,
  PlusIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import UploadWorkflow from '@/components/dashboard/parent/UploadWorkflow';
import AddChildModal from '@/components/dashboard/parent/AddChildModal';
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout';
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
  { value: 'certificates', label: 'Certificates & Awards', description: 'Academic achievements and certificates' },
  { value: 'medical_records', label: 'Medical Records', description: 'Health and medical documents' },
  { value: 'behavioral_reports', label: 'Behavioral Reports', description: 'Behavioral assessments and reports' },
  { value: 'permission_forms', label: 'Permission Forms', description: 'School permission and consent forms' },
  { value: 'other', label: 'Other Documents', description: 'Additional educational documents' }
];

const CATEGORIES = [
  { value: 'academic', label: 'Academic' },
  { value: 'health', label: 'Health & Medical' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'administrative', label: 'Administrative' },
  { value: 'other', label: 'Other' }
];

export default function ParentUploadPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploadType, setUploadType] = useState('report_cards');
  const [category, setCategory] = useState('academic');
  const [description, setDescription] = useState('');
  const [studentId, setStudentId] = useState('');
  const [children, setChildren] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [workflowResults, setWorkflowResults] = useState<any>(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false);

  // Menu items for parent dashboard
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/parent',
      icon: HomeIcon
    },
    {
      title: 'My Children',
      href: '/dashboard/parent/children',
      icon: UserCircleIcon
    },
    {
      title: 'Upload Documents',
      href: '/dashboard/parent/upload',
      icon: CloudArrowUpIcon
    },
    {
      title: 'Analytics',
      href: '/dashboard/parent/analytics',
      icon: ChartBarIcon
    }
  ];

  // Fetch children on component mount
  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/parent/children')
        .then(res => res.json())
        .then(data => setChildren(data.children || []))
        .catch(err => console.error('Error fetching children:', err));
    }
  }, [session]);

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
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
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
    formData.append('category', category);
    formData.append('description', description);
    if (studentId) formData.append('studentId', studentId);

    try {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ));

      const response = await fetch('/api/uploads', {
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
      
      // If upload is successful and it's an academic document, trigger workflow
      if (result.success && (category === 'academic' || uploadType === 'report_cards' || uploadType === 'transcripts')) {
        setCurrentDocumentId(result.document.id);
        setShowWorkflow(true);
      }

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
    if (!studentId) {
      toast.error('Please select a child');
      return;
    }

    setIsLoading(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    try {
      await Promise.all(pendingFiles.map(uploadFile));
      toast.success(`${pendingFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error('Some files failed to upload');
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
    setWorkflowResults(results);
    toast.success('Document processing completed successfully!');
    console.log('Workflow results:', results);
    
    // Navigate to the comprehensive report
    if (results.reportUrl) {
      setTimeout(() => {
        router.push(results.reportUrl);
      }, 2000); // Small delay to show success message
    }
  };

  const handleWorkflowError = (error: string) => {
    toast.error(`Processing failed: ${error}`);
    setShowWorkflow(false);
  };

  const handleWorkflowClose = () => {
    setShowWorkflow(false);
    setCurrentDocumentId(null);
  };

  const handleChildAdded = (newChild: any) => {
    setChildren(prev => [newChild, ...prev]);
    setStudentId(newChild.id);
    setShowAddChildModal(false);
    toast.success('Child added successfully!');
  };

  return (
    <VerticalDashboardLayout
      title="Document Upload"
      subtitle="Upload and process your child's academic documents"
      menuItems={menuItems}
      activeItem="/dashboard/parent/upload"
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Document Upload Center</h1>
                <p className="text-sm text-gray-600">Upload and process your child's academic documents</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>Secure Upload</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>AI Processing</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>Instant Analysis</span>
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
                Upload Your Child's Academic Documents
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Securely upload academic documents for comprehensive AI-powered analysis. 
                Get detailed insights, progress tracking, and personalized recommendations.
              </p>

              {/* Process Roadmap */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Document Processing - 3-Step Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">1</div>
                    <h4 className="font-semibold text-blue-900 mb-2">Upload Documents</h4>
                    <p className="text-sm text-blue-700">Select child and upload academic documents securely</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">2</div>
                    <h4 className="font-semibold text-blue-900 mb-2">AI Analysis</h4>
                    <p className="text-sm text-blue-700">Advanced AI processes and analyzes the academic data</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">3</div>
                    <h4 className="font-semibold text-blue-900 mb-2">View Reports</h4>
                    <p className="text-sm text-blue-700">Access comprehensive reports and insights</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 text-green-800">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="font-medium">Secure Storage • AI-Powered Analysis • Instant Processing</span>
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
                    <ChartBarIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                  <p className="text-sm text-gray-600">Track your child's academic progress over time with detailed analytics</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ArrowRightIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personalized Insights</h3>
                  <p className="text-sm text-gray-600">Receive customized recommendations for academic improvement</p>
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
                    Select Child *
                  </label>
                  <div className="flex space-x-3">
                    <select
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choose a child...</option>
                      {children.map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.user.name} - Grade {child.grade}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddChildModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
                      title="Add new child"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Add Child</span>
                    </button>
                  </div>
                  {children.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      No children found. <button 
                        type="button"
                        onClick={() => setShowAddChildModal(true)}
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        Add your first child
                      </button> to continue.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
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
                    <label
                      key={type.value}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        uploadType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="uploadType"
                        value={type.value}
                        checked={uploadType === type.value}
                        onChange={(e) => setUploadType(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            uploadType === type.value ? 'border-blue-500' : 'border-gray-300'
                          }`}>
                            {uploadType === type.value && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{type.label}</h4>
                          <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any additional details about these documents..."
                />
              </div>

              {/* File Drop Zone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive 
                    ? 'border-blue-400 bg-blue-50 scale-105' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    isDragActive ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <CloudArrowUpIcon className={`h-8 w-8 ${
                      isDragActive ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? 'Drop files here' : 'Upload Documents'}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {isDragActive
                      ? 'Release to upload your files'
                      : 'Drag & drop files here, or click to browse'
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports PDF, images, Word docs, Excel files (max 10MB each)
                  </p>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Files</h3>
                  <div className="space-y-3">
                    {files.map((uploadFile) => (
                      <div
                        key={uploadFile.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center">
                          {getStatusIcon(uploadFile.status)}
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {uploadFile.file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            {uploadFile.error && (
                              <p className="text-xs text-red-600 mt-1">{uploadFile.error}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {uploadFile.status === 'uploading' && (
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadFile.progress}%` }}
                              />
                            </div>
                          )}
                          <button
                            onClick={() => removeFile(uploadFile.id)}
                            disabled={uploadFile.status === 'uploading'}
                            className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleUploadAll}
                      disabled={isLoading || files.every(f => f.status !== 'pending') || !studentId}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                          Upload All Files
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <EyeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 text-blue-600 mr-2" />
                        Maximum file size: 10MB per file
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 text-blue-600 mr-2" />
                        Supported formats: PDF, Images, Word, Excel, CSV, Text
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 text-blue-600 mr-2" />
                        Documents are processed instantly with AI analysis
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 text-blue-600 mr-2" />
                        You'll receive notifications once processing is complete
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 text-blue-600 mr-2" />
                        All documents are stored securely with encryption
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Your Documents</h2>
              <p className="text-gray-600">Our AI is analyzing your child's academic documents to provide comprehensive insights.</p>
            </div>
          </div>
        )}
      </div>

      {/* Workflow Modal */}
      {showWorkflow && currentDocumentId && studentId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">AI Document Processing</h2>
                  <p className="text-sm text-gray-600">Analyzing your child's academic documents</p>
                </div>
              </div>
              <button
                onClick={handleWorkflowClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <UploadWorkflow
                documentId={currentDocumentId!}
                studentId={studentId!}
                onComplete={handleWorkflowComplete}
                onError={handleWorkflowError}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Child Modal */}
      <AddChildModal
        isOpen={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        onChildAdded={handleChildAdded}
        schoolId={(session?.user as any)?.schoolId || null}
      />
      </div>
    </VerticalDashboardLayout>
  );
}