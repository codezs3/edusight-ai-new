'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: Array<{
    [key: string]: string | number;
  }>;
  title?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  yAxisMax?: number;
  yAxisMin?: number;
  dataKeys?: string[];
  xAxisKey?: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

export default function CustomLineChart({ 
  data, 
  title, 
  height = 300, 
  showLegend = true, 
  showGrid = true,
  yAxisMax,
  yAxisMin,
  dataKeys = ['value'],
  xAxisKey = 'name'
}: LineChartProps) {
  return (
    <div style={{ height: `${height}px` }} className="relative">
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xAxisKey} />
          <YAxis domain={yAxisMin !== undefined || yAxisMax !== undefined ? [yAxisMin || 0, yAxisMax || 100] : undefined} />
          <Tooltip />
          {showLegend && <Legend />}
          {dataKeys.map((key, index) => (
            <Line 
              key={key}
              type="monotone" 
              dataKey={key} 
              stroke={COLORS[index % COLORS.length]} 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
