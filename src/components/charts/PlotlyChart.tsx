'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui/Spinner';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => <Spinner />,
});

export interface PlotlyChartProps {
  data: any[];
  layout?: any;
  config?: any;
  className?: string;
  onUpdate?: (figure: any) => void;
  onHover?: (data: any) => void;
  onClick?: (data: any) => void;
}

export function PlotlyChart({
  data,
  layout = {},
  config = {},
  className = '',
  onUpdate,
  onHover,
  onClick,
}: PlotlyChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const defaultLayout = {
    autosize: true,
    responsive: true,
    font: {
      family: 'Inter, system-ui, sans-serif',
      size: 12,
      color: '#374151',
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: {
      l: 50,
      r: 50,
      t: 50,
      b: 50,
    },
    ...layout,
  };

  const defaultConfig = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    displaylogo: false,
    responsive: true,
    ...config,
  };

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Plot
        data={data}
        layout={defaultLayout}
        config={defaultConfig}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        onUpdate={onUpdate}
        onHover={onHover}
        onClick={onClick}
      />
    </div>
  );
}

// Specialized chart components
export function AcademicPerformanceChart({ studentData }: { studentData: any[] }) {
  const data = [
    {
      x: studentData.map(d => d.subject),
      y: studentData.map(d => d.score),
      type: 'bar',
      marker: {
        color: studentData.map(d => 
          d.score >= 80 ? '#10b981' : 
          d.score >= 60 ? '#f59e0b' : '#ef4444'
        ),
        line: {
          color: '#374151',
          width: 1,
        },
      },
      name: 'Academic Scores',
    },
  ];

  const layout = {
    title: {
      text: 'Academic Performance by Subject',
      font: { size: 16, color: '#1f2937' },
    },
    xaxis: {
      title: 'Subjects',
      tickangle: -45,
    },
    yaxis: {
      title: 'Score (%)',
      range: [0, 100],
    },
    showlegend: false,
  };

  return <PlotlyChart data={data} layout={layout} />;
}

export function PsychologicalWellbeingRadar({ wellbeingData }: { wellbeingData: any }) {
  const categories = [
    'Mood', 'Stress Management', 'Self Confidence', 
    'Social Interaction', 'Motivation', 'Sleep Quality'
  ];
  
  const values = [
    wellbeingData.moodRating || 5,
    10 - (wellbeingData.stressLevel || 5), // Invert stress
    wellbeingData.selfConfidence || 3,
    wellbeingData.socialInteraction || 3,
    wellbeingData.motivationLevel || 3,
    wellbeingData.sleepQuality || 3,
  ];

  const data = [
    {
      type: 'scatterpolar',
      r: values,
      theta: categories,
      fill: 'toself',
      fillcolor: 'rgba(99, 102, 241, 0.2)',
      line: {
        color: '#6366f1',
        width: 2,
      },
      marker: {
        color: '#6366f1',
        size: 8,
      },
      name: 'Psychological Wellbeing',
    },
  ];

  const layout = {
    title: {
      text: 'Psychological Wellbeing Profile',
      font: { size: 16, color: '#1f2937' },
    },
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 10],
        tickfont: { size: 10 },
      },
      angularaxis: {
        tickfont: { size: 12 },
      },
    },
    showlegend: false,
  };

  return <PlotlyChart data={data} layout={layout} />;
}

export function ProgressTimelineChart({ progressData }: { progressData: any[] }) {
  const data = [
    {
      x: progressData.map(d => d.date),
      y: progressData.map(d => d.academicScore),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Academic',
      line: { color: '#3b82f6', width: 3 },
      marker: { size: 8, color: '#3b82f6' },
    },
    {
      x: progressData.map(d => d.date),
      y: progressData.map(d => d.psychologicalScore),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Psychological',
      line: { color: '#8b5cf6', width: 3 },
      marker: { size: 8, color: '#8b5cf6' },
    },
    {
      x: progressData.map(d => d.date),
      y: progressData.map(d => d.physicalScore),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Physical',
      line: { color: '#10b981', width: 3 },
      marker: { size: 8, color: '#10b981' },
    },
  ];

  const layout = {
    title: {
      text: 'Progress Over Time',
      font: { size: 16, color: '#1f2937' },
    },
    xaxis: {
      title: 'Date',
      type: 'date',
    },
    yaxis: {
      title: 'Score',
      range: [0, 100],
    },
    hovermode: 'x unified',
    legend: {
      orientation: 'h',
      y: -0.2,
    },
  };

  return <PlotlyChart data={data} layout={layout} />;
}

export function CareerInterestsPieChart({ careerData }: { careerData: any[] }) {
  const data = [
    {
      values: careerData.map(d => d.interest),
      labels: careerData.map(d => d.field),
      type: 'pie',
      marker: {
        colors: [
          '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', 
          '#ef4444', '#06b6d4', '#84cc16', '#f97316'
        ],
      },
      textinfo: 'label+percent',
      textposition: 'outside',
      hovertemplate: '<b>%{label}</b><br>Interest Level: %{value}%<extra></extra>',
    },
  ];

  const layout = {
    title: {
      text: 'Career Interest Distribution',
      font: { size: 16, color: '#1f2937' },
    },
    showlegend: true,
    legend: {
      orientation: 'v',
      x: 1.02,
      y: 0.5,
    },
  };

  return <PlotlyChart data={data} layout={layout} />;
}

export function ComparisonChart({ 
  studentData, 
  peerAverages 
}: { 
  studentData: any; 
  peerAverages: any; 
}) {
  const categories = ['Academic', 'Psychological', 'Physical', 'Overall'];
  
  const data = [
    {
      x: categories,
      y: [
        studentData.academicScore,
        studentData.psychologicalScore,
        studentData.physicalScore,
        studentData.overallScore,
      ],
      type: 'bar',
      name: 'Student',
      marker: { color: '#6366f1' },
    },
    {
      x: categories,
      y: [
        peerAverages.academicScore,
        peerAverages.psychologicalScore,
        peerAverages.physicalScore,
        peerAverages.overallScore,
      ],
      type: 'bar',
      name: 'Peer Average',
      marker: { color: '#94a3b8' },
    },
  ];

  const layout = {
    title: {
      text: 'Performance Comparison with Peers',
      font: { size: 16, color: '#1f2937' },
    },
    xaxis: {
      title: 'Assessment Categories',
    },
    yaxis: {
      title: 'Score',
      range: [0, 100],
    },
    barmode: 'group',
    legend: {
      orientation: 'h',
      y: -0.2,
    },
  };

  return <PlotlyChart data={data} layout={layout} />;
}
