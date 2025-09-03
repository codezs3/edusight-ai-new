'use client';

import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MiniChartProps {
  type: 'line' | 'bar' | 'doughnut';
  data: any;
  height?: number;
  showAxes?: boolean;
  showTooltip?: boolean;
  color?: string;
}

export default function MiniChart({ 
  type, 
  data, 
  height = 120, 
  showAxes = false,
  showTooltip = true,
  color = '#3B82F6'
}: MiniChartProps) {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { 
        enabled: showTooltip,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 6
      }
    },
    scales: showAxes ? {
      x: {
        grid: { display: false },
        ticks: { 
          display: false,
          font: { size: 8 }
        }
      },
      y: {
        grid: { display: false },
        ticks: { 
          display: false,
          font: { size: 8 }
        }
      }
    } : { x: { display: false }, y: { display: false } },
    elements: {
      point: { radius: 2, hoverRadius: 4 },
      line: { borderWidth: 2 },
      bar: { borderRadius: 2 }
    }
  };

  // Ensure data has proper styling
  const styledData = {
    ...data,
    datasets: data.datasets.map((dataset: any, index: number) => ({
      ...dataset,
      borderColor: dataset.borderColor || color,
      backgroundColor: dataset.backgroundColor || 
        (type === 'doughnut' 
          ? [`${color}`, `${color}80`, `${color}60`, `${color}40`]
          : type === 'line' 
          ? `${color}20`
          : color
        ),
      fill: type === 'line' ? true : undefined
    }))
  };

  const chartComponents = {
    line: <Line data={styledData} options={baseOptions} />,
    bar: <Bar data={styledData} options={baseOptions} />,
    doughnut: <Doughnut data={styledData} options={{
      ...baseOptions,
      cutout: '60%',
      elements: { arc: { borderWidth: 1 } }
    }} />
  };

  return (
    <div style={{ height: `${height}px` }} className="relative">
      {chartComponents[type]}
    </div>
  );
}
