'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import {
  ChartBarIcon,
  DocumentTextIcon,
  UserIcon,
  BellIcon,
  CogIcon,
  ArrowUpRightIcon,
  TrophyIcon,
  AcademicCapIcon,
  HeartIcon,
  LightBulbIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { WorkflowProgress } from '@/components/dashboard/WorkflowProgress';

interface StudentData {
  id: string;
  name: string;
  grade: string;
  school: string;
  profileImage?: string;
  e360Score: number;
  academicScore: number;
  physicalScore: number;
  psychologicalScore: number;
  lastAssessment: string;
  nextAssessment: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  reportsGenerated: number;
  workflowStatus: 'data_upload' | 'processing' | 'completed';
}

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const [selectedStudent, setSelectedStudent] = useState<string>('student-1');
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'reports' | 'analytics'>('workflow');

  // Mock student data
  const students: StudentData[] = [
    {
      id: 'student-1',
      name: 'Alex Johnson',
      grade: '10th Grade',
      school: 'Global International School',
      e360Score: 83,
      academicScore: 85,
      physicalScore: 78,
      psychologicalScore: 86,
      lastAssessment: '2024-01-15',
      nextAssessment: '2024-04-15',
      riskLevel: 'Low',
      reportsGenerated: 3,
      workflowStatus: 'data_upload'
    },
    {
      id: 'student-2',
      name: 'Sarah Johnson',
      grade: '8th Grade',
      school: 'Global International School',
      e360Score: 76,
      academicScore: 79,
      physicalScore: 72,
      psychologicalScore: 78,
      lastAssessment: '2024-01-10',
      nextAssessment: '2024-04-10',
      riskLevel: 'Medium',
      reportsGenerated: 2,
      workflowStatus: 'completed'
    }
  ];

  const currentStudent = students.find(s => s.id === selectedStudent) || students[0];

  const recentActivities = [
    {
      id: 1,
      type: 'upload',
      message: 'Academic data uploaded successfully',
      timestamp: '2 hours ago',
      icon: DocumentTextIcon,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'processing',
      message: 'AI analysis in progress for psychological assessment',
      timestamp: '4 hours ago',
      icon: ClockIcon,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'report',
      message: 'Monthly progress report generated',
      timestamp: '1 day ago',
      icon: CheckCircleIcon,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'alert',
      message: 'Physical assessment due in 3 days',
      timestamp: '2 days ago',
      icon: ExclamationTriangleIcon,
      color: 'text-orange-600'
    }
  ];

  const quickStats = [
    {
      title: 'E360 Score',
      value: currentStudent.e360Score,
      change: '+5',
      changeType: 'positive' as const,
      icon: TrophyIcon,
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Academic',
      value: currentStudent.academicScore,
      change: '+3',
      changeType: 'positive' as const,
      icon: AcademicCapIcon,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Physical',
      value: currentStudent.physicalScore,
      change: '-2',
      changeType: 'negative' as const,
      icon: HeartIcon,
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Psychological',
      value: currentStudent.psychologicalScore,
      change: '+7',
      changeType: 'positive' as const,
      icon: LightBulbIcon,
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900">Parent Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
                <BellIcon className="w-6 h-6" />
              </button>
              <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
                <CogIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-900">{session?.user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Student</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedStudent === student.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedStudent(student.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{student.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{student.name}</h3>
                    <p className="text-sm text-slate-600">{student.grade} • {student.school}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium text-blue-600">E360: {student.e360Score}</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        student.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                        student.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {student.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Student */}
            <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-300 flex items-center justify-center">
              <div className="text-center">
                <PlusIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-sm text-slate-600">Add New Student</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <ArrowUpRightIcon className={`w-4 h-4 mr-1 ${
                      stat.changeType === 'negative' ? 'rotate-90' : ''
                    }`} />
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.title}</div>
              </div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: ChartBarIcon },
                { id: 'workflow', label: 'Workflow Progress', icon: ClockIcon },
                { id: 'reports', label: 'Reports', icon: DocumentTextIcon },
                { id: 'analytics', label: 'Analytics', icon: TrophyIcon }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                    onClick={() => setActiveTab(tab.id as any)}
                  >
                    <IconComponent className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'workflow' && (
              <WorkflowProgress 
                studentId={selectedStudent}
                onStepClick={(stepId) => console.log('Step clicked:', stepId)}
              />
            )}
            
            {activeTab === 'overview' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Student Overview</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{currentStudent.e360Score}</div>
                      <div className="text-sm text-slate-600">Overall E360 Score</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600 mb-1">{currentStudent.reportsGenerated}</div>
                      <div className="text-sm text-slate-600">Reports Generated</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{currentStudent.riskLevel}</div>
                      <div className="text-sm text-slate-600">Risk Level</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Assessment Schedule</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-700">Last Assessment</span>
                        <span className="text-sm font-medium text-slate-900">{currentStudent.lastAssessment}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-slate-700">Next Assessment</span>
                        <span className="text-sm font-medium text-blue-600">{currentStudent.nextAssessment}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reports' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Generated Reports</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((report) => (
                    <div key={report} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-slate-900">E360 Assessment Report #{report}</h4>
                          <p className="text-sm text-slate-600">Generated on 2024-01-{15 + report}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-slate-600 hover:text-blue-600 transition-colors">
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-600 hover:text-green-600 transition-colors">
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Advanced Analytics</h3>
                <p className="text-slate-600">Detailed analytics and insights coming soon...</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <IconComponent className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900">{activity.message}</p>
                        <p className="text-xs text-slate-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="font-medium text-blue-900">Upload New Data</div>
                  <div className="text-sm text-blue-700">Add academic, physical, or psychological data</div>
                </button>
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="font-medium text-green-900">Schedule Assessment</div>
                  <div className="text-sm text-green-700">Book next evaluation session</div>
                </button>
                <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="font-medium text-purple-900">View Career Insights</div>
                  <div className="text-sm text-purple-700">Explore career recommendations</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
