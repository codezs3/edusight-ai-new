'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: Array<{
    [key: string]: string | number;
  }>;
  title?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  horizontal?: boolean;
  yAxisMax?: number;
  dataKey?: string;
  xAxisKey?: string;
}

export default function CustomBarChart({ 
  data, 
  title, 
  height = 300, 
  showLegend = true, 
  showGrid = true,
  horizontal = false,
  yAxisMax,
  dataKey = 'value',
  xAxisKey = 'name'
}: BarChartProps) {
  return (
    <div style={{ height: `${height}px` }} className="relative">
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout={horizontal ? 'horizontal' : 'vertical'}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xAxisKey} />
          <YAxis domain={yAxisMax ? [0, yAxisMax] : undefined} />
          <Tooltip />
          {showLegend && <Legend />}
          <Bar dataKey={dataKey} fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
