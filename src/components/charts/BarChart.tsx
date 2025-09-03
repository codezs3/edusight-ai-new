'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }>;
  };
  title?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  horizontal?: boolean;
  yAxisMax?: number;
}

export default function BarChart({ 
  data, 
  title, 
  height = 300, 
  showLegend = true, 
  showGrid = true,
  horizontal = false,
  yAxisMax 
}: BarChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' as const : 'x' as const,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
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
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6b7280'
        }
      },
      y: {
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6b7280'
        },
        max: yAxisMax,
        beginAtZero: true
      }
    },
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false
      }
    }
  };

  return (
    <div style={{ height: `${height}px` }} className="relative">
      <Bar data={data} options={options} />
    </div>
  );
}
