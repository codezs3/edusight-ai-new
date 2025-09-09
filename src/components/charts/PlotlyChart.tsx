'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui/Spinner';

// Dynamically import Recharts to avoid SSR issues
const { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = dynamic(() => import('recharts'), {
  ssr: false,
  loading: () => <Spinner />,
});

export interface RechartsChartProps {
  data: any[];
  type?: 'bar' | 'line' | 'pie';
  className?: string;
  height?: number;
  dataKey?: string;
  xAxisKey?: string;
}

export function RechartsChart({
  data,
  type = 'bar',
  className = '',
  height = 300,
  dataKey = 'value',
  xAxisKey = 'name',
}: RechartsChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <Spinner />
      </div>
    );
  }

  const chartComponents = {
    bar: (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill="#3B82F6" />
      </BarChart>
    ),
    line: (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke="#3B82F6" strokeWidth={2} />
      </LineChart>
    ),
    pie: (
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    )
  };

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        {chartComponents[type]}
      </ResponsiveContainer>
    </div>
  );
}

// Specialized chart components
export function AcademicPerformanceChart({ studentData }: { studentData: any[] }) {
  const data = studentData.map(d => ({
    subject: d.subject,
    score: d.score,
    color: d.score >= 80 ? '#10b981' : d.score >= 60 ? '#f59e0b' : '#ef4444'
  }));

  return (
    <div className="w-full h-64">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Performance by Subject</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="score" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PsychologicalWellbeingRadar({ wellbeingData }: { wellbeingData: any }) {
  const data = [
    { category: 'Mood', value: wellbeingData.moodRating || 5 },
    { category: 'Stress Management', value: 10 - (wellbeingData.stressLevel || 5) },
    { category: 'Self Confidence', value: wellbeingData.selfConfidence || 3 },
    { category: 'Social Interaction', value: wellbeingData.socialInteraction || 3 },
    { category: 'Motivation', value: wellbeingData.motivationLevel || 3 },
    { category: 'Sleep Quality', value: wellbeingData.sleepQuality || 3 },
  ];

  return (
    <div className="w-full h-64">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Psychological Wellbeing Profile</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 10]} />
          <YAxis dataKey="category" type="category" width={120} />
          <Tooltip />
          <Bar dataKey="value" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProgressTimelineChart({ progressData }: { progressData: any[] }) {
  return (
    <div className="w-full h-64">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={progressData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="academicScore" stroke="#3b82f6" strokeWidth={2} name="Academic" />
          <Line type="monotone" dataKey="psychologicalScore" stroke="#8b5cf6" strokeWidth={2} name="Psychological" />
          <Line type="monotone" dataKey="physicalScore" stroke="#10b981" strokeWidth={2} name="Physical" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CareerInterestsPieChart({ careerData }: { careerData: any[] }) {
  const data = careerData.map(d => ({
    field: d.field,
    interest: d.interest
  }));

  return (
    <div className="w-full h-64">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Career Interest Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ field, percent }) => `${field} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="interest"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316'][index % 8]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ComparisonChart({ 
  studentData, 
  peerAverages 
}: { 
  studentData: any; 
  peerAverages: any; 
}) {
  const data = [
    { category: 'Academic', student: studentData.academicScore, peer: peerAverages.academicScore },
    { category: 'Psychological', student: studentData.psychologicalScore, peer: peerAverages.psychologicalScore },
    { category: 'Physical', student: studentData.physicalScore, peer: peerAverages.physicalScore },
    { category: 'Overall', student: studentData.overallScore, peer: peerAverages.overallScore },
  ];

  return (
    <div className="w-full h-64">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Comparison with Peers</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="student" fill="#6366f1" name="Student" />
          <Bar dataKey="peer" fill="#94a3b8" name="Peer Average" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
