'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
      borderWidth?: number;
    }>;
  };
  title?: string;
  height?: number;
  showLegend?: boolean;
  centerText?: {
    value: string | number;
    label: string;
  };
}

export default function DoughnutChart({ 
  data, 
  title, 
  height = 300, 
  showLegend = true,
  centerText 
}: DoughnutChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        display: showLegend,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
          family: 'Inter, sans-serif'
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 2
      }
    }
  };

  return (
    <div style={{ height: `${height}px` }} className="relative">
      <Doughnut data={data} options={options} />
      {centerText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{centerText.value}</div>
            <div className="text-sm text-gray-600">{centerText.label}</div>
          </div>
        </div>
      )}
    </div>
  );
}
