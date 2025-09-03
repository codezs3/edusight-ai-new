'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  DocumentIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PencilSquareIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

interface Document {
  id: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  uploadType: string;
  category: string;
  description?: string;
  status: string;
  uploaderType: string;
  confidentiality: string;
  isValidated: boolean;
  createdAt: string;
  uploader: {
    name: string;
    email: string;
  };
  student?: {
    id: string;
    user: {
      name: string;
    };
  };
  school?: {
    id: string;
    name: string;
  };
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'archived', label: 'Archived' }
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'academic', label: 'Academic' },
  { value: 'health', label: 'Health & Medical' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'administrative', label: 'Administrative' },
  { value: 'other', label: 'Other' }
];

const UPLOADER_TYPE_OPTIONS = [
  { value: '', label: 'All Uploaders' },
  { value: 'parent', label: 'Parents' },
  { value: 'teacher', label: 'Teachers' },
  { value: 'admin', label: 'Administrators' },
  { value: 'student', label: 'Students' }
];

export default function AdminDocumentsPage() {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [uploaderTypeFilter, setUploaderTypeFilter] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchDocuments();
  }, [pagination.page, statusFilter, categoryFilter, uploaderTypeFilter]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter && { status: statusFilter }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(uploaderTypeFilter && { uploaderType: uploaderTypeFilter })
      });

      const response = await fetch(`/api/uploads?${params}`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      
      const data = await response.json();
      setDocuments(data.documents);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (error) {
      toast.error('Failed to load documents');
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentAction = async (documentId: string, action: string, data?: any) => {
    try {
      let response;
      
      switch (action) {
        case 'update':
          response = await fetch(`/api/uploads/${documentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          break;
        case 'delete':
          response = await fetch(`/api/uploads/${documentId}`, {
            method: 'DELETE'
          });
          break;
        default:
          return;
      }

      if (!response.ok) throw new Error(`Failed to ${action} document`);
      
      toast.success(`Document ${action}d successfully`);
      fetchDocuments();
      setShowDetails(false);
      setEditMode(false);
    } catch (error) {
      toast.error(`Failed to ${action} document`);
      console.error(`Error ${action}ing document:`, error);
    }
  };

  const downloadDocument = async (documentId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/uploads/${documentId}/download`);
      if (!response.ok) throw new Error('Failed to download file');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download file');
      console.error('Download error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'archived':
        return <ArchiveBoxIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'processing':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'archived':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-800`;
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.uploader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Review and manage all uploaded documents from parents, teachers, and students.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <DocumentTextIcon className="h-5 w-5" />
          <span>{pagination.total} total documents</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Filters & Search</h2>
          <FunnelIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {CATEGORY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Uploader Type
            </label>
            <select
              value={uploaderTypeFilter}
              onChange={(e) => setUploaderTypeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {UPLOADER_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents..."
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploader
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading documents...
                  </td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No documents found
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DocumentIcon className="h-8 w-8 text-gray-400" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {doc.originalName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.uploader.name}</div>
                      <div className="text-sm text-gray-500 capitalize">
                        {doc.uploaderType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(doc.status)}
                        <span className={`ml-2 ${getStatusBadge(doc.status)} capitalize`}>
                          {doc.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowDetails(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => downloadDocument(doc.id, doc.originalName)}
                          className="text-green-600 hover:text-green-900"
                          title="Download"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDocument(doc);
                            setEditMode(true);
                            setShowDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this document?')) {
                              handleDocumentAction(doc.id, 'delete');
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document Details Modal */}
      {showDetails && selectedDocument && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editMode ? 'Edit Document' : 'Document Details'}
                </h3>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setEditMode(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      File Name
                    </label>
                    <p className="text-sm text-gray-900">{selectedDocument.originalName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      File Size
                    </label>
                    <p className="text-sm text-gray-900">
                      {(selectedDocument.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Uploader
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedDocument.uploader.name} ({selectedDocument.uploaderType})
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Date
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedDocument.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {editMode ? (
                  <EditDocumentForm 
                    document={selectedDocument}
                    onSave={(data) => {
                      handleDocumentAction(selectedDocument.id, 'update', data);
                    }}
                    onCancel={() => setEditMode(false)}
                  />
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedDocument.description || 'No description provided'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <p className="text-sm text-gray-900 capitalize">
                          {selectedDocument.category}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <div className="flex items-center">
                          {getStatusIcon(selectedDocument.status)}
                          <span className="ml-2 text-sm capitalize">
                            {selectedDocument.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => downloadDocument(selectedDocument.id, selectedDocument.originalName)}
                    className="btn-secondary"
                  >
                    Download
                  </button>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="btn-primary"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Edit Document Form Component
function EditDocumentForm({ 
  document, 
  onSave, 
  onCancel 
}: { 
  document: Document; 
  onSave: (data: any) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    status: document.status,
    category: document.category,
    description: document.description || '',
    processingNotes: '',
    confidentiality: document.confidentiality,
    isValidated: document.isValidated,
    validationNotes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="academic">Academic</option>
            <option value="health">Health & Medical</option>
            <option value="behavioral">Behavioral</option>
            <option value="administrative">Administrative</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Processing Notes
        </label>
        <textarea
          value={formData.processingNotes}
          onChange={(e) => setFormData(prev => ({ ...prev, processingNotes: e.target.value }))}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Add notes about processing or review..."
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isValidated"
          checked={formData.isValidated}
          onChange={(e) => setFormData(prev => ({ ...prev, isValidated: e.target.checked }))}
          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="isValidated" className="ml-2 text-sm text-gray-700">
          Mark as validated
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
