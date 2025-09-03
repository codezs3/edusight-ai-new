'use client';

import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      fill?: boolean;
    }>;
  };
  title?: string;
  height?: number;
  showLegend?: boolean;
  maxValue?: number;
}

export default function RadarChart({ 
  data, 
  title, 
  height = 300, 
  showLegend = true,
  maxValue = 100 
}: RadarChartProps) {
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
        displayColors: true
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: maxValue,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6b7280'
        },
        ticks: {
          font: {
            size: 10,
            family: 'Inter, sans-serif'
          },
          color: '#9ca3af',
          backdropColor: 'transparent'
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2
      },
      line: {
        borderWidth: 2
      }
    }
  };

  return (
    <div style={{ height: `${height}px` }} className="relative">
      <Radar data={data} options={options} />
    </div>
  );
}
