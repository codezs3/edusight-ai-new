'use client';

import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
  type: 'line' | 'bar' | 'doughnut';
  data: Array<{
    [key: string]: string | number;
  }>;
  height?: number;
  showAxes?: boolean;
  showTooltip?: boolean;
  color?: string;
  dataKey?: string;
  xAxisKey?: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

export default function MiniChart({ 
  type, 
  data, 
  height = 120, 
  showAxes = false,
  showTooltip = true,
  color = '#3B82F6',
  dataKey = 'value',
  xAxisKey = 'name'
}: MiniChartProps) {
  const chartComponents = {
    line: (
      <LineChart data={data}>
        {showAxes && <XAxis dataKey={xAxisKey} hide />}
        {showAxes && <YAxis hide />}
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    ),
    bar: (
      <BarChart data={data}>
        {showAxes && <XAxis dataKey={xAxisKey} hide />}
        {showAxes && <YAxis hide />}
        <Bar dataKey={dataKey} fill={color} />
      </BarChart>
    ),
    doughnut: (
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={20}
          outerRadius={40}
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    )
  };

  return (
    <div style={{ height: `${height}px` }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        {chartComponents[type]}
      </ResponsiveContainer>
    </div>
  );
}
