'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

const UPLOAD_TYPES = [
  { value: 'assessment_results', label: 'Assessment Results' },
  { value: 'grade_sheets', label: 'Grade Sheets' },
  { value: 'attendance_records', label: 'Attendance Records' },
  { value: 'behavioral_reports', label: 'Behavioral Reports' },
  { value: 'progress_reports', label: 'Progress Reports' },
  { value: 'assignment_submissions', label: 'Assignment Submissions' },
  { value: 'exam_papers', label: 'Exam Papers' },
  { value: 'class_records', label: 'Class Records' },
  { value: 'student_portfolios', label: 'Student Portfolios' },
  { value: 'other', label: 'Other Documents' }
];

const CATEGORIES = [
  { value: 'academic', label: 'Academic Performance' },
  { value: 'behavioral', label: 'Behavioral Assessment' },
  { value: 'administrative', label: 'Administrative Records' },
  { value: 'assessment', label: 'Assessments & Tests' },
  { value: 'other', label: 'Other' }
];

const BULK_UPLOAD_MODES = [
  { value: 'individual', label: 'Individual Student Files', icon: UsersIcon },
  { value: 'class', label: 'Class/Batch Upload', icon: AcademicCapIcon }
];

export default function TeacherUploadPage() {
  const { data: session } = useSession();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploadType, setUploadType] = useState('assessment_results');
  const [category, setCategory] = useState('academic');
  const [description, setDescription] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [uploadMode, setUploadMode] = useState('individual');
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch students and school info on component mount
  useEffect(() => {
    if (session?.user?.id) {
      // Fetch students from teacher's classes
      fetch('/api/teacher/students')
        .then(res => res.json())
        .then(data => setStudents(data.students || []))
        .catch(err => console.error('Error fetching students:', err));

      // Fetch school information
      fetch('/api/teacher/school')
        .then(res => res.json())
        .then(data => setSchoolInfo(data.school))
        .catch(err => console.error('Error fetching school info:', err));
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
    maxSize: 50 * 1024 * 1024, // 50MB for teachers
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
    
    if (uploadMode === 'individual' && selectedStudent) {
      formData.append('studentId', selectedStudent);
    }
    
    if (schoolInfo?.id) {
      formData.append('schoolId', schoolInfo.id);
    }

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

      return await response.json();
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
    if (uploadMode === 'individual' && !selectedStudent) {
      toast.error('Please select a student for individual upload');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Student Documents</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload student assessments, grades, behavioral reports, and other academic documents for processing.
        </p>
        {schoolInfo && (
          <div className="mt-2 text-sm text-gray-500">
            School: <span className="font-medium">{schoolInfo.name}</span>
          </div>
        )}
      </div>

      {/* Upload Configuration */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Configuration</h2>
        
        {/* Upload Mode Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Mode
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BULK_UPLOAD_MODES.map((mode) => (
              <div
                key={mode.value}
                className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                  uploadMode === mode.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setUploadMode(mode.value)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="uploadMode"
                    value={mode.value}
                    checked={uploadMode === mode.value}
                    onChange={() => setUploadMode(mode.value)}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <mode.icon className="ml-3 h-6 w-6 text-gray-400" />
                  <div className="ml-3">
                    <label className="text-sm font-medium text-gray-900 cursor-pointer">
                      {mode.label}
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Selection - Only for individual mode */}
          {uploadMode === 'individual' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.user.name} - {student.grade} {student.section}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Upload Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {UPLOAD_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Add details about these documents (assessment date, subject, etc.)..."
            />
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">File Upload</h2>
        
        {/* File Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary-400 bg-primary-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop files here, or click to select files'
            }
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports PDF, images, Word docs, Excel files (max 50MB each for teachers)
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Files to Upload</h3>
            <div className="space-y-2">
              {files.map((uploadFile) => (
                <div
                  key={uploadFile.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    {getStatusIcon(uploadFile.status)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {uploadFile.error && (
                        <p className="text-xs text-red-600">{uploadFile.error}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {uploadFile.status === 'uploading' && (
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadFile.progress}%` }}
                        />
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(uploadFile.id)}
                      disabled={uploadFile.status === 'uploading'}
                      className="text-gray-400 hover:text-red-500 disabled:opacity-50"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUploadAll}
                disabled={
                  isLoading || 
                  files.every(f => f.status !== 'pending') || 
                  (uploadMode === 'individual' && !selectedStudent)
                }
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Uploading...' : 'Upload All Files'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Teacher-specific Info Card */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-900">Teacher Upload Guidelines</h3>
        <ul className="mt-2 text-sm text-green-800 space-y-1">
          <li>• Maximum file size: 50MB per file (larger than parent uploads)</li>
          <li>• Use "Individual Student Files" for specific student documents</li>
          <li>• Use "Class/Batch Upload" for class-wide assessments or records</li>
          <li>• Include assessment dates and subjects in descriptions</li>
          <li>• Files are automatically associated with your school</li>
          <li>• Admin will be notified of new uploads for review</li>
        </ul>
      </div>
    </div>
  );
}
