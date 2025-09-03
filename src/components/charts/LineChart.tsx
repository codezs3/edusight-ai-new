'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      fill?: boolean;
      tension?: number;
    }>;
  };
  title?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  yAxisMax?: number;
  yAxisMin?: number;
}

export default function LineChart({ 
  data, 
  title, 
  height = 300, 
  showLegend = true, 
  showGrid = true,
  yAxisMax,
  yAxisMin 
}: LineChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        displayColors: true,
        mode: 'index' as const,
        intersect: false
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
        min: yAxisMin
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2
      },
      line: {
        borderWidth: 3
      }
    }
  };

  return (
    <div style={{ height: `${height}px` }} className="relative">
      <Line data={data} options={options} />
    </div>
  );
}
